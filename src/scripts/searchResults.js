import { TMDbAPI } from "./api.js";

const api = new TMDbAPI();

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function renderSearchResults(searchQuery) {
  const container = document.getElementById("search-results-container");
  const noResultsMessage = document.getElementById("no-results-message");

  container.innerHTML = "<p>Loading...</p>";
  noResultsMessage.style.display = "none";

  const results = await api.searchMovies(searchQuery);

  if (!results || results.length === 0) {
    container.innerHTML = "";
    noResultsMessage.style.display = "block";
    return;
  }

  container.innerHTML = results
    .map(
      (movie) => `
      <div class="movie-card" data-movie-id="${movie.id}">
        <img class="movie-poster" src="${
          movie.poster_path
            ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
            : "https://via.placeholder.com/500x750?text=No+Image"
        }" alt="${movie.title} poster" />
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-release-date">${movie.release_date || "N/A"}</p>
        </div>
      </div>
    `,
    )
    .join("");

  // Add click event listeners to movie cards for details
  container.querySelectorAll(".movie-card").forEach((card) => {
    card.addEventListener("click", async () => {
      const movieTitle = card.querySelector(".movie-title").textContent;
      if (!movieTitle) return;

      // Fetch movie details using TMDbAPI
      const movies = await api.searchMovies(movieTitle);
      if (!movies || movies.length === 0) {
        alert("Movie details not found");
        return;
      }
      const movieId = movies[0].id;
      const details = await api.getMovieDetails(movieId);
      if (!details) {
        alert("Movie details not found");
        return;
      }

      // Clear current content and render movie details
      const main = document.querySelector("main");
      main.innerHTML = `
        <section id="movie-detail" class="movie-detail">
          <button id="back-button" aria-label="Back to search results">← Back</button>
          <div class="movie-detail-content">
            <img id="detail-poster" class="detail-poster" src="${
              details.poster_path
                ? "https://image.tmdb.org/t/p/w500" + details.poster_path
                : "https://via.placeholder.com/500x750?text=No+Image"
            }" alt="${details.title} poster" />
            <div class="detail-info">
              <h2 id="detail-title">${details.title}</h2>
              <p id="detail-genres">${details.genres.map((g) => g.name).join(", ")}</p>
              <p id="detail-release-date">Release Date: ${details.release_date || "N/A"}</p>
              <p id="detail-overview">${details.overview}</p>
              <p id="detail-rating">Rating: ${details.vote_average || "N/A"}</p>
              <div id="streaming-availability"><p>Streaming availability coming soon.</p></div>
              <div id="trailer-container"></div>
              <div id="cast-container"></div>
              <button id="favorite-button" aria-label="Add to favorites">Add to Favorites</button>
            </div>
          </div>
        </section>
      `;

      // Render trailer
      const trailerContainer = document.getElementById("trailer-container");
      trailerContainer.innerHTML = "";
      if (details.videos && details.videos.results) {
        const trailer = details.videos.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube",
        );
        if (trailer) {
          const iframe = document.createElement("iframe");
          iframe.width = "560";
          iframe.height = "315";
          iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
          iframe.title = "YouTube video player";
          iframe.frameBorder = "0";
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          trailerContainer.appendChild(iframe);
        } else {
          trailerContainer.innerHTML = "<p>No trailer available.</p>";
        }
      } else {
        trailerContainer.innerHTML = "<p>No trailer available.</p>";
      }

      // Render cast
      const castContainer = document.getElementById("cast-container");
      castContainer.innerHTML = "<h3>Cast</h3>";
      if (
        details.credits &&
        details.credits.cast &&
        details.credits.cast.length > 0
      ) {
        const castHtml = details.credits.cast
          .slice(0, 10)
          .map(
            (member) => `
            <div class="cast-member">
              <img src="${
                member.profile_path
                  ? "https://image.tmdb.org/t/p/w185" + member.profile_path
                  : "https://via.placeholder.com/185x278?text=No+Image"
              }" alt="${member.name}" />
              <p class="cast-name">${member.name}</p>
              <p class="cast-character">as ${member.character}</p>
            </div>
          `,
          )
          .join("");
        castContainer.innerHTML += `<div class="cast-list">${castHtml}</div>`;
      } else {
        castContainer.innerHTML += "<p>No cast information available.</p>";
      }

      // TODO: Implement streaming availability rendering

      // Setup back button
      document.getElementById("back-button").addEventListener("click", () => {
        window.location.reload();
      });

      // TODO: Implement favorite button functionality
    });
  });
}

const query = getQueryParam("q");
if (query) {
  renderSearchResults(query);
} else {
  document.getElementById("search-results-container").innerHTML =
    "<p>No search query provided.</p>";
}

import { TMDbAPI } from "./api.js";
import {
  movieDetailComponent,
  castMemberComponent,
  streamingPlatformComponent,
} from "./components.js";

class App {
  constructor() {
    this.api = new TMDbAPI();
    this.searchForm = document.getElementById("search-form");
    this.searchInput = document.getElementById("search-input");
    this.resultsContainer = document.getElementById("results");
    this.featuredMoviesContainer = document.getElementById(
      "featured-movies-container",
    );
    this.genresList = document.getElementById("genres-list");
    this.topRatedMoviesContainer = document.getElementById(
      "top-rated-movies-container",
    );
    this.main = document.querySelector("main");

    this.favorites = this.loadFavorites();

    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    this.resultsContainer.addEventListener("click", (e) => {
      const movieCard = e.target.closest(".movie-card");
      if (movieCard) {
        const movieTitle = movieCard.querySelector(".movie-title").textContent;
        this.handleMovieClick(movieTitle);
      }
    });

    this.featuredMoviesContainer.addEventListener("click", (e) => {
      const movieCard = e.target.closest(".movie-card");
      if (movieCard) {
        const movieTitle = movieCard.querySelector(".movie-title").textContent;
        this.handleMovieClick(movieTitle);
      }
    });

    this.topRatedMoviesContainer.addEventListener("click", (e) => {
      const movieCard = e.target.closest(".movie-card");
      if (movieCard) {
        const movieTitle = movieCard.querySelector(".movie-title").textContent;
        this.handleMovieClick(movieTitle);
      }
    });

    const header = document.querySelector("header");
    header.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        e.preventDefault();
        const linkText = e.target.textContent.toLowerCase();
        if (linkText === "home") {
          this.handleBack();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (linkText === "movies") {
          const featuredSection = document.getElementById("featured-movies-section");
          if (featuredSection) {
            featuredSection.scrollIntoView({ behavior: "smooth" });
          }
        } else if (linkText === "tv shows") {
          alert("TV Shows section is not implemented yet.");
        } else if (linkText === "about") {
          alert("About section is not implemented yet.");
        }
      }
    });

    this.main.addEventListener("click", (e) => {
      if (e.target.id === "back-button") {
        this.handleBack();
      } else if (e.target.id === "favorite-button") {
        this.toggleFavorite();
      }
    });
  }

  loadFavorites() {
    const favs = localStorage.getItem("favorites");
    return favs ? JSON.parse(favs) : [];
  }

  saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  toggleFavorite() {
    if (!this.currentMovie) return;
    const index = this.favorites.findIndex(
      (m) => m.id === this.currentMovie.id,
    );
    if (index === -1) {
      this.favorites.push(this.currentMovie);
      alert("Added to favorites");
    } else {
      this.favorites.splice(index, 1);
      alert("Removed from favorites");
    }
    this.saveFavorites();
    this.renderFavoriteButton();
  }

  renderFavoriteButton() {
    const favButton = document.getElementById("favorite-button");
    if (!favButton || !this.currentMovie) return;
    const isFav = this.favorites.some((m) => m.id === this.currentMovie.id);
    favButton.textContent = isFav ? "Remove from Favorites" : "Add to Favorites";
  }

  async handleMovieClick(title) {
    this.resultsContainer.style.display = "none";
    this.featuredMoviesContainer.style.display = "none";
    this.genresList.style.display = "none";
    this.topRatedMoviesContainer.style.display = "none";

    this.main.insertAdjacentHTML("beforeend", movieDetailComponent);

    const movie = await this.api.searchMovies(title);
    if (!movie || movie.length === 0) {
      alert("Movie details not found");
      this.handleBack();
      return;
    }
    const movieId = movie[0].id;
    const details = await this.api.getMovieDetails(movieId);
    if (!details) {
      alert("Movie details not found");
      this.handleBack();
      return;
    }
    this.currentMovie = details;
    this.renderMovieDetails(details);
  }

  renderMovieDetails(details) {
    document.getElementById("detail-poster").src = details.poster_path
      ? "https://image.tmdb.org/t/p/w500" + details.poster_path
      : "https://via.placeholder.com/500x750?text=No+Image";
    document.getElementById("detail-poster").alt = details.title + " poster";
    document.getElementById("detail-title").textContent = details.title;
    document.getElementById("detail-genres").textContent = details.genres
      .map((g) => g.name)
      .join(", ");
    document.getElementById("detail-release-date").textContent =
      "Release Date: " + (details.release_date || "N/A");
    document.getElementById("detail-overview").textContent = details.overview;
    document.getElementById("detail-rating").textContent =
      "Rating: " + (details.vote_average || "N/A");

    this.renderStreamingAvailability(details.id);
    this.renderTrailer(details.videos);
    this.renderCast(details.credits.cast);

    this.renderFavoriteButton();
  }

  async renderStreamingAvailability(movieId) {
    const container = document.getElementById("streaming-availability");
    container.innerHTML = "<p>Loading streaming availability...</p>";

    // Placeholder: Implement Watchmode API call here
    // For now, show a placeholder message
    container.innerHTML = "<p>Streaming availability coming soon.</p>";
  }

  renderTrailer(videos) {
    const container = document.getElementById("trailer-container");
    container.innerHTML = "";

    if (!videos || !videos.results) {
      container.innerHTML = "<p>No trailer available.</p>";
      return;
    }

    const trailer = videos.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube",
    );

    if (!trailer) {
      container.innerHTML = "<p>No trailer available.</p>";
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.width = "560";
    iframe.height = "315";
    iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
    iframe.title = "YouTube video player";
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    container.appendChild(iframe);
  }

  renderCast(cast) {
    const container = document.getElementById("cast-container");
    container.innerHTML = "<h3>Cast</h3>";

    if (!cast || cast.length === 0) {
      container.innerHTML += "<p>No cast information available.</p>";
      return;
    }

    const castHtml = cast
      .slice(0, 10)
      .map((member) => castMemberComponent(member))
      .join("");
    container.innerHTML += `<div class="cast-list">${castHtml}</div>`;
  }

  handleBack() {
    const detailSection = document.getElementById("movie-detail");
    if (detailSection) {
      detailSection.remove();
    }
    this.resultsContainer.style.display = "";
    this.featuredMoviesContainer.style.display = "";
    this.genresList.style.display = "";
    this.topRatedMoviesContainer.style.display = "";
  }

  async handleSearch() {
    const query = this.searchInput.value.trim();
    if (!query) return;

    this.resultsContainer.innerHTML = "<p>Loading...</p>";
    const movies = await this.api.searchMovies(query);
    this.renderResults(movies);
  }

  renderResults(movies) {
    if (movies.length === 0) {
      this.resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    this.resultsContainer.innerHTML = movies
      .map(
        (movie) => `
      <div class="movie-card">
        <img class="movie-poster" src="${movie.poster_path ? "https://image.tmdb.org/t/p/w500" + movie.poster_path : "https://via.placeholder.com/500x750?text=No+Image"}" alt="${movie.title} poster" />
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-release-date">${movie.release_date || "N/A"}</p>
        </div>
      </div>
    `,
      )
      .join("");
  }

  renderMovies(movies, container) {
    if (!movies || movies.length === 0) {
      container.innerHTML = "<p>No movies found.</p>";
      return;
    }

    container.innerHTML = movies
      .map(
        (movie) => `
      <div class="movie-card">
        <img class="movie-poster" src="${movie.poster_path ? "https://image.tmdb.org/t/p/w500" + movie.poster_path : "https://via.placeholder.com/500x750?text=No+Image"}" alt="${movie.title} poster" />
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-release-date">${movie.release_date || "N/A"}</p>
        </div>
      </div>
    `,
      )
      .join("");
  }

  renderGenres(genres) {
    if (!genres || genres.length === 0) {
      this.genresList.innerHTML = "<li>No genres found.</li>";
      return;
    }

    this.genresList.innerHTML = genres
      .map(
        (genre) => `
      <li class="genre-item">
        <img src="https://via.placeholder.com/100x150?text=${encodeURIComponent(genre.name)}" alt="${genre.name}" />
        <span>${genre.name}</span>
      </li>
    `,
      )
      .join("");
  }

  async loadHomePageSections() {
    const [featuredMovies, genres, topRatedMovies] = await Promise.all([
      this.api.getPopularMovies(),
      this.api.getGenres(),
      this.api.getTopRatedMovies(),
    ]);

    this.renderMovies(featuredMovies, this.featuredMoviesContainer);
    this.renderGenres(genres);
    this.renderMovies(topRatedMovies, this.topRatedMoviesContainer);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.loadHomePageSections();
});

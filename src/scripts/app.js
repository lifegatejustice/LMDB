import { TMDbAPI } from "./api.js";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

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

    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    this.searchInput.addEventListener(
      "input",
      debounce(() => {
        this.handleSearch();
      }, 300),
    );
  }



  async handleSearch() {
    const query = this.searchInput.value.trim();
    if (!query) {
      this.resultsContainer.innerHTML = "";
      this.showMainSections(true);
      return;
    }

    this.resultsContainer.innerHTML = "<p>Loading...</p>";
    let movies;
    try {
      movies = await this.api.searchMovies(query);
    } catch (error) {
      this.resultsContainer.innerHTML = "<p>Error loading search results. Please try again later.</p>";
      console.error("Search error:", error);
      return;
    }
    this.renderResults(movies);

    // Show search results on top and hide other sections
    this.showMainSections(false);

    // Add click event listeners to movie cards for details
    this.addMovieCardClickListeners();
  }

  showMainSections(show) {
    const mainSections = [
      this.featuredMoviesContainer.parentElement,
      this.genresList.parentElement,
      this.topRatedMoviesContainer.parentElement,
      document.getElementById("favorites-section"),
    ];
    mainSections.forEach(section => {
      section.style.display = show ? "block" : "none";
    });
    this.resultsContainer.style.display = show ? "none" : "block";
  }

  addMovieCardClickListeners() {
    const containers = [
      this.resultsContainer,
      this.featuredMoviesContainer,
      this.topRatedMoviesContainer,
      document.getElementById("favorites-container"),
    ];
    containers.forEach(container => {
      if (!container) return;
      const movieCards = container.querySelectorAll(".movie-card");
      movieCards.forEach((card) => {
        card.addEventListener("click", () => {
          const movieId = parseInt(card.getAttribute("data-id"));
          if (movieId) {
            this.showMovieDetails(movieId);
          }
        });
      });
    });
  }

  setupCarouselNavigation() {
    const sections = [
      { sectionId: "featured-movies", container: this.featuredMoviesContainer },
      { sectionId: "top-rated-movies", container: this.topRatedMoviesContainer },
      { sectionId: "favorites", container: document.getElementById("favorites-container") },
    ];

    sections.forEach(({ sectionId, container }) => {
      if (!container) return;
      const section = document.getElementById(sectionId);
      if (!section) return;

      const prevBtn = section.querySelector(".carousel-button.prev");
      const nextBtn = section.querySelector(".carousel-button.next");

      if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
          container.scrollBy({ left: -300, behavior: "smooth" });
        });
        nextBtn.addEventListener("click", () => {
          container.scrollBy({ left: 300, behavior: "smooth" });
        });
      }
    });
  }

  async showMovieDetailsByIndex(index) {
    const query = this.searchInput.value.trim();
    if (!query) return;

    const movies = await this.api.searchMovies(query);
    const movie = movies[index];
    if (!movie) return;

    this.showMovieDetails(movie.id);
  }

  async showMovieDetails(movieId) {
    let movieDetails, trailerKey, streamingProviders;
    try {
      // Fetch movie details from TMDb API
      movieDetails = await this.api.getMovieDetails(movieId);
      if (!movieDetails) throw new Error("No movie details found");

      // Fetch trailer video key
      trailerKey = await this.api.getMovieTrailerKey(movieId);

      // Fetch streaming providers from Watchmode API
      streamingProviders = await this.api.getStreamingProviders(movieId);
    } catch (error) {
      const movieDetailsSection = document.getElementById("movie-details-section");
      movieDetailsSection.innerHTML = "<p>Error loading movie details. Please try again later.</p>";
      movieDetailsSection.style.display = "block";
      console.error("Movie details error:", error);
      return;
    }

    // Render movie details
    this.renderMovieDetails(movieDetails, trailerKey, streamingProviders);

    // Hide other sections and show movie details section
    this.toggleSections(false);
  }

  renderMovieDetails(details, trailerKey, streamingProviders) {
    const movieDetailsSection = document.getElementById("movie-details-section");
    const poster = movieDetailsSection.querySelector("#details-poster");
    const title = movieDetailsSection.querySelector("#details-title");
    const yearRuntimeGenres = movieDetailsSection.querySelector("#details-year-runtime-genres");
    const description = movieDetailsSection.querySelector("#details-description");
    const rating = movieDetailsSection.querySelector("#details-rating");
    const cast = movieDetailsSection.querySelector("#details-cast");
    const trailer = movieDetailsSection.querySelector("#details-trailer");
    const providers = movieDetailsSection.querySelector("#details-streaming-providers");

    poster.src = details.poster_path ? "https://image.tmdb.org/t/p/w500" + details.poster_path : "https://via.placeholder.com/500x750?text=No+Image";
    poster.alt = details.title + " poster";
    title.textContent = details.title;
    yearRuntimeGenres.textContent = `${details.release_date ? details.release_date.split("-")[0] : "N/A"} | ${details.runtime ? details.runtime + " min" : "N/A"} | ${details.genres ? details.genres.map(g => g.name).join(", ") : "N/A"}`;
    description.textContent = details.overview || "No description available.";
    rating.textContent = `Rating: ${details.vote_average || "N/A"}`;
    cast.textContent = `Cast: ${details.cast ? details.cast.slice(0, 5).map(c => c.name).join(", ") : "N/A"}`;

    // Render trailer iframe if trailerKey exists
    if (trailerKey) {
      trailer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen title="Trailer"></iframe>`;
    } else {
      trailer.innerHTML = "<p>No trailer available.</p>";
    }

    // Render streaming providers logos or names
    if (streamingProviders && streamingProviders.length > 0) {
      providers.innerHTML = streamingProviders.map(p => `<img src="${p.logo_url}" alt="${p.name}" title="${p.name}" class="provider-logo" />`).join(" ");
    } else {
      providers.innerHTML = "<p>No streaming providers available.</p>";
    }

    movieDetailsSection.style.display = "block";
  }

  toggleSections(showMain = true) {
    const sectionsToToggle = [
      this.searchForm.parentElement,
      this.resultsContainer,
      this.featuredMoviesContainer.parentElement,
      this.genresList.parentElement,
      this.topRatedMoviesContainer.parentElement,
    ];
    sectionsToToggle.forEach(section => {
      section.style.display = showMain ? "block" : "none";
    });

    const movieDetailsSection = document.getElementById("movie-details-section");
    movieDetailsSection.style.display = showMain ? "none" : "block";
  }

  setupBackToSearch() {
    const backButton = document.getElementById("back-to-search");
    backButton.addEventListener("click", () => {
      this.toggleSections(true);
    });
  }

  loadFavorites() {
    const favorites = this.getFavorites();
    this.renderFavorites(favorites);
    this.toggleSections(false);
  }

  getFavorites() {
    const favoritesJSON = localStorage.getItem("favorites");
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
  }

  saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  addFavorite(movie) {
    const favorites = this.getFavorites();
    if (!favorites.find((fav) => fav.id === movie.id)) {
      favorites.push(movie);
      this.saveFavorites(favorites);
    }
  }

  removeFavorite(movieId) {
    let favorites = this.getFavorites();
    favorites = favorites.filter((fav) => fav.id !== movieId);
    this.saveFavorites(favorites);
  }

  isFavorite(movieId) {
    const favorites = this.getFavorites();
    return favorites.some((fav) => fav.id === movieId);
  }

  renderFavorites(favorites) {
    const favoritesContainer = document.getElementById("favorites-container");
    if (!favorites || favorites.length === 0) {
      favoritesContainer.innerHTML = "<p>No favorites added yet.</p>";
      return;
    }

    favoritesContainer.innerHTML = favorites
      .map(
        (movie) => `
      <div class="movie-card favorite" data-id="${movie.id}">
        <img class="movie-poster" src="${
          movie.poster_path
            ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
            : "https://via.placeholder.com/500x750?text=No+Image"
        }" alt="${movie.title} poster" />
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-release-date">${movie.release_date || "N/A"}</p>
          <button class="remove-favorite-button" aria-label="Remove from favorites">Remove</button>
        </div>
      </div>
    `
      )
      .join("");

    // Add event listeners for remove favorite buttons
    favoritesContainer.querySelectorAll(".remove-favorite-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const movieCard = e.target.closest(".movie-card");
        const movieId = parseInt(movieCard.getAttribute("data-id"));
        this.removeFavorite(movieId);
        this.loadFavorites();
      });
    });
  }

  renderResults(movies) {
    if (movies.length === 0) {
      this.resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    this.resultsContainer.setAttribute("aria-live", "polite");
    this.resultsContainer.setAttribute("aria-atomic", "true");

    this.resultsContainer.innerHTML = movies
      .map(
        (movie) => `
      <div class="movie-card" data-id="${movie.id}" role="button" tabindex="0" aria-pressed="${this.isFavorite(movie.id) ? "true" : "false"}">
        <img class="movie-poster" src="${
          movie.poster_path
            ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
            : "https://via.placeholder.com/500x750?text=No+Image"
        }" alt="${movie.title} poster" />
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-release-date">${movie.release_date || "N/A"}</p>
          <button class="favorite-button" aria-label="Toggle favorite">${
            this.isFavorite(movie.id) ? "★" : "☆"
          }</button>
        </div>
      </div>
    `,
      )
      .join("");

    this.addFavoriteButtonListeners();
  }

  renderMovies(movies, container) {
    if (!movies || movies.length === 0) {
      container.innerHTML = "<p>No movies found.</p>";
      return;
    }

    container.innerHTML = movies
      .map(
        (movie) => `
      <div class="movie-card" data-id="${movie.id}">
        <img class="movie-poster" src="${
          movie.poster_path
            ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
            : "https://via.placeholder.com/500x750?text=No+Image"
        }" alt="${movie.title} poster" />
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-release-date">${movie.release_date || "N/A"}</p>
          <button class="favorite-button" aria-label="Toggle favorite">${
            this.isFavorite(movie.id) ? "★" : "☆"
          }</button>
        </div>
      </div>
    `,
      )
      .join("");

    this.addFavoriteButtonListeners(container);
  }

  addFavoriteButtonListeners(container = this.resultsContainer) {
    const favoriteButtons = container.querySelectorAll(".favorite-button");
    favoriteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const movieCard = e.target.closest(".movie-card");
        const movieId = parseInt(movieCard.getAttribute("data-id"));
        const movie = {
          id: movieId,
          title: movieCard.querySelector(".movie-title").textContent,
          release_date: movieCard.querySelector(".movie-release-date").textContent,
          poster_path: movieCard.querySelector(".movie-poster").src.includes("placeholder")
            ? null
            : movieCard.querySelector(".movie-poster").src.replace("https://image.tmdb.org/t/p/w500", ""),
        };
        if (this.isFavorite(movieId)) {
          this.removeFavorite(movieId);
          e.target.textContent = "☆";
        } else {
          this.addFavorite(movie);
          e.target.textContent = "★";
        }
      });
    });
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

    this.setupCarouselNavigation();
  }

}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.loadHomePageSections();
  app.setupBackToSearch();
});

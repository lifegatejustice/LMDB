import { TMDbAPI } from "./api.js";

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

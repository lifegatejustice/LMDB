import { TMDbAPI } from "./api.js";
import {
  headerComponent,
  footerComponent,
  movieDetailComponent,
} from "./components.js";

class FavoritesApp {
  constructor() {
    this.api = new TMDbAPI();
    this.headerContainer = document.getElementById("header-container");
    this.footerContainer = document.getElementById("footer-container");
    this.favoritesList = document.getElementById("favorites-list");
    this.main = document.querySelector("main");

    this.headerContainer.innerHTML = headerComponent;
    this.footerContainer.innerHTML = footerComponent;

    this.loadFavorites();

    this.favoritesList.addEventListener("click", (e) => {
      const movieCard = e.target.closest(".movie-card");
      if (movieCard) {
        const movieTitle = movieCard.querySelector(".movie-title").textContent;
        this.handleMovieClick(movieTitle);
      }
    });
  }

  loadFavorites() {
    const favs = localStorage.getItem("favorites");
    const favorites = favs ? JSON.parse(favs) : [];
    if (favorites.length === 0) {
      this.favoritesList.innerHTML = "<p>You have no favorite movies yet.</p>";
      return;
    }

    this.favoritesList.innerHTML = favorites
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
          <button class="remove-favorite-button">Remove</button>
        </div>
      </div>
    `,
      )
      .join("");

    this.favoritesList
      .querySelectorAll(".remove-favorite-button")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const movieCard = e.target.closest(".movie-card");
          const movieId = parseInt(movieCard.getAttribute("data-id"));
          this.removeFavorite(movieId);
        });
      });
  }

  async handleMovieClick(title) {
    this.favoritesList.style.display = "none";

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
  }

  handleBack() {
    const detailSection = document.getElementById("movie-detail");
    if (detailSection) {
      detailSection.remove();
    }
    this.favoritesList.style.display = "";
  }

  removeFavorite(movieId) {
    const favs = localStorage.getItem("favorites");
    let favorites = favs ? JSON.parse(favs) : [];
    favorites = favorites.filter((movie) => movie.id !== movieId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    this.loadFavorites();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new FavoritesApp();
});

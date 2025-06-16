import {
  headerComponent,
  footerComponent,
} from "./components.js";

class FavoritesApp {
  constructor() {
    this.headerContainer = document.getElementById("header-container");
    this.footerContainer = document.getElementById("footer-container");
    this.favoritesList = document.getElementById("favorites-list");

    this.headerContainer.innerHTML = headerComponent;
    this.footerContainer.innerHTML = footerComponent;

    this.loadFavorites();
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
    `
      )
      .join("");

    this.favoritesList.querySelectorAll(".remove-favorite-button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const movieCard = e.target.closest(".movie-card");
        const movieId = parseInt(movieCard.getAttribute("data-id"));
        this.removeFavorite(movieId);
      });
    });
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

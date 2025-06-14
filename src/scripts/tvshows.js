import { TMDbAPI } from "./api.js";
import {
  headerComponent,
  footerComponent,
  searchBarComponent,
} from "./components.js";

class TVShowsApp {
  constructor() {
    this.api = new TMDbAPI();
    this.headerContainer = document.getElementById("header-container");
    this.footerContainer = document.getElementById("footer-container");
    this.searchForm = document.getElementById("search-form");
    this.searchInput = document.getElementById("search-input");
    this.resultsContainer = document.getElementById("results");

    this.headerContainer.innerHTML = headerComponent;
    this.footerContainer.innerHTML = footerComponent;

    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSearch();
    });
  }

  async handleSearch() {
    const query = this.searchInput.value.trim();
    if (!query) return;

    this.resultsContainer.innerHTML = "<p>Loading...</p>";
    const shows = await this.api.searchTVShows(query);
    this.renderResults(shows);
  }

  renderResults(shows) {
    if (!shows || shows.length === 0) {
      this.resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    this.resultsContainer.innerHTML = shows
      .map(
        (show) => `
      <div class="tvshow-card">
        <img class="tvshow-poster" src="${
          show.poster_path
            ? "https://image.tmdb.org/t/p/w500" + show.poster_path
            : "https://via.placeholder.com/500x750?text=No+Image"
        }" alt="${show.name} poster" />
        <div class="tvshow-info">
          <h3 class="tvshow-title">${show.name}</h3>
          <p class="tvshow-first-air-date">${show.first_air_date || "N/A"}</p>
        </div>
      </div>
    `
      )
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new TVShowsApp();
});

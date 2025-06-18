import { TMDbAPI } from "./api.js";
import {
  headerComponent,
  footerComponent,
  castMemberComponent,
  streamingPlatformComponent,
  movieDetailComponent,
} from "./components.js";

class TVShowsApp {
  constructor() {
    this.api = new TMDbAPI();
    this.headerContainer = document.getElementById("header-container");
    this.footerContainer = document.getElementById("footer-container");
    this.searchForm = document.getElementById("search-form");
    this.searchInput = document.getElementById("search-input");
    this.resultsContainer = document.getElementById("results");
    this.main = document.querySelector("main");

    this.favorites = this.loadFavorites();

    this.headerContainer.innerHTML = headerComponent;
    this.footerContainer.innerHTML = footerComponent;

    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    this.resultsContainer.addEventListener("click", (e) => {
      const tvShowCard = e.target.closest(".movie-card");
      if (tvShowCard) {
        const tvShowTitle =
          tvShowCard.querySelector(".movie-title").textContent;
        this.handleTVShowClick(tvShowTitle);
      }
    });

    this.main.addEventListener("click", (e) => {
      if (e.target.id === "back-button") {
        this.handleBack();
      } else if (e.target.id === "favorite-button") {
        this.toggleFavorite();
      }
    });

    this.loadPopularTVShows();
  }

  loadFavorites() {
    const favs = localStorage.getItem("favorites");
    return favs ? JSON.parse(favs) : [];
  }

  saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  toggleFavorite() {
    if (!this.currentTVShow) return;
    const index = this.favorites.findIndex(
      (m) => m.id === this.currentTVShow.id,
    );
    if (index === -1) {
      this.favorites.push(this.currentTVShow);
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
    if (!favButton || !this.currentTVShow) return;
    const isFav = this.favorites.some((m) => m.id === this.currentTVShow.id);
    favButton.textContent = isFav
      ? "Remove from Favorites"
      : "Add to Favorites";
  }

  async handleTVShowClick(title) {
    this.resultsContainer.style.display = "none";

    this.main.insertAdjacentHTML("beforeend", movieDetailComponent);

    const shows = await this.api.searchTVShows(title);
    if (!shows || shows.length === 0) {
      alert("TV Show details not found");
      this.handleBack();
      return;
    }
    const tvShowId = shows[0].id;
    const details = await this.api.getTVShowDetails(tvShowId);
    if (!details) {
      alert("TV Show details not found");
      this.handleBack();
      return;
    }
    this.currentTVShow = details;
    this.renderTVShowDetails(details);
  }

  renderTVShowDetails(details) {
    document.getElementById("detail-poster").src = details.poster_path
      ? "https://image.tmdb.org/t/p/w500" + details.poster_path
      : "https://via.placeholder.com/500x750?text=No+Image";
    document.getElementById("detail-poster").alt = details.name + " poster";
    document.getElementById("detail-title").textContent = details.name;
    document.getElementById("detail-genres").textContent = details.genres
      .map((g) => g.name)
      .join(", ");
    document.getElementById("detail-release-date").textContent =
      "First Air Date: " + (details.first_air_date || "N/A");
    document.getElementById("detail-overview").textContent = details.overview;
    document.getElementById("detail-rating").textContent =
      "Rating: " + (details.vote_average || "N/A");

    this.renderStreamingAvailability(details.id);
    this.renderTrailer(details.videos);
    this.renderCast(details.credits.cast);

    this.renderFavoriteButton();
  }

  async renderStreamingAvailability(tvShowId) {
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
  }

  async loadPopularTVShows() {
    this.resultsContainer.innerHTML = '<div class="spinner"></div>';
    const shows = await this.api.getPopularTVShows();
    this.renderResults(shows);
  }

  async handleSearch() {
    const query = this.searchInput.value.trim();
    if (!query) return;

    this.resultsContainer.innerHTML = '<div class="spinner"></div>';
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
      <div class="movie-card">
        <img class="movie-poster" src="${show.poster_path ? "https://image.tmdb.org/t/p/w500" + show.poster_path : "https://via.placeholder.com/500x750?text=No+Image"}" alt="${show.name} poster" />
        <div class="movie-info">
          <h3 class="movie-title">${show.name}</h3>
          <p class="movie-release-date">${show.first_air_date || "N/A"}</p>
        </div>
      </div>
    `,
      )
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new TVShowsApp();
});


  // 3) Wire up the hamburger menu toggle
  const btn = document.getElementById("hamburger-button");
  const nav = document.getElementById("nav-menu");
  if (btn && nav) {
    const toggle = () => {
      const open = nav.classList.toggle("open");
      btn.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    };

    btn.addEventListener("click", toggle);

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove("open");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", false);
      }
    });

    // close on link click
    nav
      .querySelectorAll(".nav-list a")
      .forEach((a) => a.addEventListener("click", () => toggle()));
  }


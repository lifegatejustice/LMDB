import { TMDbAPI } from "./api.js";
import {
  movieDetailComponent,
  castMemberComponent,
  streamingPlatformComponent,
} from "./components.js";
import { platformLogos } from "./platformLogos.js";

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
        const href = e.target.getAttribute("href");
        if (href === "#" || href === null) {
          e.preventDefault();
          const linkText = e.target.textContent.toLowerCase();
          if (linkText === "home") {
            this.handleBack();
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (linkText === "movies") {
            const featuredSection = document.getElementById(
              "featured-movies-section",
            );
            if (featuredSection) {
              featuredSection.scrollIntoView({ behavior: "smooth" });
            }
          } else if (linkText === "tv shows") {
            this.showTVShowsSection();
          } else if (linkText === "about") {
            this.showAboutSection();
          }
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

    // Prevent streaming platform links from triggering other click handlers
    const streamingContainer = document.getElementById(
      "streaming-availability",
    );
    if (streamingContainer) {
      streamingContainer.addEventListener("click", (e) => {
        if (e.target.closest("a.streaming-link")) {
          e.stopPropagation();
        }
      });
    }
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
    favButton.textContent = isFav
      ? "Remove from Favorites"
      : "Add to Favorites";
  }

  async handleMovieClick(title) {
    this.resultsContainer.style.display = "none";
    const featuredSection = document.getElementById("featured-movies-section");
    const genresSection = document.getElementById("genres-section");
    const topRatedSection = document.getElementById("top-rated-movies-section");

    if (featuredSection) featuredSection.style.display = "none";
    if (genresSection) genresSection.style.display = "none";
    if (topRatedSection) topRatedSection.style.display = "none";

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
    // Helper function to generate star rating HTML
    const generateStarRating = (rating) => {
      const maxStars = 5;
      const stars = [];
      const fullStars = Math.floor(rating / 2);
      const halfStar = rating % 2 >= 1 ? true : false;

      for (let i = 0; i < fullStars; i++) {
        stars.push('<span class="star full">&#9733;</span>'); // full star
      }
      if (halfStar) {
        stars.push('<span class="star half">&#9733;</span>'); // half star (can style differently)
      }
      const emptyStars = maxStars - stars.length;
      for (let i = 0; i < emptyStars; i++) {
        stars.push('<span class="star empty">&#9734;</span>'); // empty star
      }
      return stars.join("");
    };

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

    // Render star rating
    const ratingContainer = document.getElementById("detail-rating");
    ratingContainer.innerHTML =
      "Rating: " + generateStarRating(details.vote_average || 0);

    this.renderStreamingAvailability(details.id);
    this.renderTrailer(details.videos);
    this.renderCast(details.credits.cast);

    this.renderFavoriteButton();
  }

  async renderStreamingAvailability(movieId) {
    const container = document.getElementById("streaming-availability");
    container.innerHTML = `<p>Loading streaming availability...</p>`;

    if (!this.currentMovie || !this.currentMovie.imdb_id) {
      container.innerHTML = "<p>No streaming information available.</p>";
      return;
    }

    const streamingData = await this.api.getStreamingAvailability(
      this.currentMovie.imdb_id,
    );
    console.log("Streaming data:", streamingData);
    if (!streamingData || streamingData.length === 0) {
      container.innerHTML = "<p>No streaming availability found.</p>";
      return;
    }

    // Clear container
    container.innerHTML = "";

    // Remove duplicate platforms by name
    const uniquePlatforms = [];
    const platformNames = new Set();

    streamingData.forEach((source) => {
      if (!platformNames.has(source.name)) {
        platformNames.add(source.name);
        uniquePlatforms.push(source);
      }
    });

    // Render streaming sources with logos
    uniquePlatforms.forEach((source) => {
      if (!source.logo_url) {
        if (source.name && platformLogos[source.name]) {
          source.logo_url = platformLogos[source.name];
        } else {
          source.logo_url = "./images/streaming.webp";
        }
      }
      // Use web_url as the link URL instead of url
      const platformData = {
        ...source,
        url: source.web_url || "",
      };
      const sourceHtml = streamingPlatformComponent(platformData);
      container.insertAdjacentHTML("beforeend", sourceHtml);
    });
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
    const featuredSection = document.getElementById("featured-movies-section");
    const genresSection = document.getElementById("genres-section");
    const topRatedSection = document.getElementById("top-rated-movies-section");

    if (featuredSection) featuredSection.style.display = "";
    if (genresSection) genresSection.style.display = "";
    if (topRatedSection) topRatedSection.style.display = "";
  }

  async handleSearch() {
    const query = this.searchInput.value.trim();
    if (!query) return;

    // Redirect to search results page with query parameter
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
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

    const genreImages = {
      Action: "https://example.com/images/action.jpg",
      Adventure: "https://example.com/images/adventure.jpg",
      Animation: "https://example.com/images/animation.jpg",
      Comedy: "https://example.com/images/comedy.jpg",
      Crime: "https://example.com/images/crime.jpg",
      Documentary: "https://example.com/images/documentary.jpg",
      Drama: "https://example.com/images/drama.jpg",
      Family: "https://example.com/images/family.jpg",
      Fantasy: "https://example.com/images/fantasy.jpg",
      History: "https://example.com/images/history.jpg",
      Horror: "https://example.com/images/horror.jpg",
      Music: "https://example.com/images/music.jpg",
      Mystery: "https://example.com/images/mystery.jpg",
      Romance: "https://example.com/images/romance.jpg",
      ScienceFiction: "https://example.com/images/scifi.jpg",
      TVMovie: "https://example.com/images/tvmovie.jpg",
      Thriller: "https://example.com/images/thriller.jpg",
      War: "https://example.com/images/war.jpg",
      Western: "https://example.com/images/western.jpg",
    };

    this.genresList.innerHTML = genres
      .map((genre) => {
        const imageUrl =
          genreImages[genre.name.replace(/\s/g, "")] ||
          "https://via.placeholder.com/100x150?text=" +
            encodeURIComponent(genre.name);
        return `
      <li class="genre-item" data-genre-id="${genre.id}">
        <img src="${imageUrl}" alt="${genre.name}" />
        <span>${genre.name}</span>
      </li>
    `;
      })
      .join("");

    // Add click event listeners to genre items
    this.genresList.querySelectorAll(".genre-item").forEach((item) => {
      item.addEventListener("click", () => {
        const genreId = item.getAttribute("data-genre-id");
        this.handleGenreClick(genreId);
      });
    });
  }

  async handleGenreClick(genreId) {
    this.resultsContainer.innerHTML = '<div class="spinner"></div>';
    this.resultsContainer.style.display = "";
    const featuredSection = document.getElementById("featured-movies-section");
    const genresSection = document.getElementById("genres-section");
    const topRatedSection = document.getElementById("top-rated-movies-section");

    if (featuredSection) featuredSection.style.display = "none";
    if (genresSection) genresSection.style.display = "none";
    if (topRatedSection) topRatedSection.style.display = "none";

    const movies = await this.api.getMoviesByGenre(genreId);
    this.renderResults(movies);
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

  setupCarousel(containerId, prevBtnClass, nextBtnClass) {
    const container = document.getElementById(containerId);
    const prevBtn = container.parentElement.querySelector(`.${prevBtnClass}`);
    const nextBtn = container.parentElement.querySelector(`.${nextBtnClass}`);

    if (!container || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener("click", () => {
      container.scrollBy({
        left: -container.clientWidth,
        behavior: "smooth",
      });
    });

    nextBtn.addEventListener("click", () => {
      container.scrollBy({
        left: container.clientWidth,
        behavior: "smooth",
      });
    });

    // Swipe support for mobile
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener("mousedown", (e) => {
      isDown = true;
      container.classList.add("active");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener("mouseleave", () => {
      isDown = false;
      container.classList.remove("active");
    });

    container.addEventListener("mouseup", () => {
      isDown = false;
      container.classList.remove("active");
    });

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; //scroll-fast
      container.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    container.addEventListener("touchstart", (e) => {
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener("touchmove", (e) => {
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.loadHomePageSections();

  // Setup carousels for sections
  app.setupCarousel("featured-movies-container", "prev", "next");
  app.setupCarousel("genres-list", "prev-genres", "next-genres");
  app.setupCarousel(
    "top-rated-movies-container",
    "prev-toprated",
    "next-toprated",
  );
});

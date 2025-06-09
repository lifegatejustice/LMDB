export const headerComponent = `
  <header>
    <h1>LMDB</h1>
    <nav>
      <ul class="nav-list">
        <li><a href="#">Home</a></li>
        <li><a href="#">Movies</a></li>
        <li><a href="#">TV Shows</a></li>
        <li><a href="#">About</a></li>
      </ul>
    </nav>
  </header>
`;

 export const footerComponent = `
  <footer>
    &copy; 2025 Movie Companion App
  </footer>
`;

export const searchBarComponent = `
  <section id="search-section">
    <form id="search-form" aria-label="Search movies">
      <input type="text" id="search-input" placeholder="Search for movies or TV shows..." aria-label="Search input" required />
      <button type="submit" id="search-button">Search</button>
    </form>
  </section>
`;

export const featuredMoviesComponent = `
  <section id="featured-movies">
    <h2>Featured Movies</h2>
    <div class="movies-container" id="featured-movies-container">
      <!-- Featured movies will be rendered here -->
    </div>
  </section>
`;

export const genresComponent = `
  <section id="genres">
    <h2>Genres</h2>
    <ul class="genres-list" id="genres-list">
      <!-- Genres will be rendered here -->
    </ul>
  </section>
`;

export const topRatedMoviesComponent = `
  <section id="top-rated-movies">
    <h2>Top Rated Movies</h2>
    <div class="movies-container" id="top-rated-movies-container">
      <!-- Top rated movies will be rendered here -->
    </div>
  </section>
`;

// New component for movie detail view
export const movieDetailComponent = `
  <section id="movie-detail" class="movie-detail">
    <button id="back-button" aria-label="Back to search results">← Back</button>
    <div class="movie-detail-content">
      <img id="detail-poster" class="detail-poster" src="" alt="Movie Poster" />
      <div class="detail-info">
        <h2 id="detail-title"></h2>
        <p id="detail-genres"></p>
        <p id="detail-release-date"></p>
        <p id="detail-overview"></p>
        <p id="detail-rating"></p>
        <div id="streaming-availability"></div>
        <div id="trailer-container"></div>
        <div id="cast-container"></div>
        <button id="favorite-button" aria-label="Add to favorites">Add to Favorites</button>
      </div>
    </div>
  </section>
`;

// New component for cast member card
export const castMemberComponent = (cast) => `
  <div class="cast-member">
    <img src="${cast.profile_path ? "https://image.tmdb.org/t/p/w185" + cast.profile_path : "https://via.placeholder.com/185x278?text=No+Image"}" alt="${cast.name}" />
    <p class="cast-name">${cast.name}</p>
    <p class="cast-character">as ${cast.character}</p>
  </div>
`;

// New component for streaming platform link
export const streamingPlatformComponent = (platform) => `
  <a href="${platform.url}" target="_blank" rel="noopener noreferrer" class="streaming-link">
    <img src="${platform.logo_url}" alt="${platform.name}" title="${platform.name}" />
  </a>
`;

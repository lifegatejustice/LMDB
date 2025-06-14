export const headerComponent = `
  <header>
    <h1>LMDB</h1>
    <nav>
      <ul class="nav-list">
        <li><a href="index.html">Home</a></li>
        <li><a href="index.html#featured-movies-section">Movies</a></li>
        <li><a href="#">TV Shows</a></li>
        <li><a href="../about.html">About</a></li>
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

// New component for About section
export const aboutComponent = `
  <section id="about-section" class="about-section">
    <h2>About LMDB (Laala Movie Database)</h2>
    <p>Welcome to LMDB, your ultimate movie companion platform designed to bring the magic of cinema right to your fingertips.</p>
    <p>Our mission is to make movie discovery effortless and enjoyable by providing smart search, personalized recommendations, authentic reviews, and up-to-date streaming information—all in one place.</p>
    <h3>Key Features</h3>
    <ul>
      <li><strong>Smart Search:</strong> Quickly find movies and TV shows by title with accurate and fast results.</li>
      <li><strong>Personalized Recommendations:</strong> Discover new favorites based on your viewing preferences.</li>
      <li><strong>Detailed Reviews:</strong> Read and share honest reviews from fellow movie lovers.</li>
      <li><strong>Streaming Info:</strong> Know exactly where to watch your favorite titles across popular platforms.</li>
      <li><strong>Favorites List:</strong> Save and manage your must-watch list easily with local storage.</li>
      <li><strong>Responsive & Animated UI:</strong> Enjoy a modern, visually rich experience on any device.</li>
    </ul>
    <p>Created by movie lovers, for movie lovers. Dive in and explore the world of entertainment with LMDB!</p>
  </section>
`;

// New component for TV Shows section (placeholder)
export const tvShowsComponent = `
  <section id="tv-shows-section" class="tv-shows-section">
    <h2>TV Shows</h2>
    <p>This section is coming soon. Stay tuned for TV show search and details!</p>
  </section>
`;

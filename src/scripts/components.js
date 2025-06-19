export const headerComponent = `
  <header role="banner">
    <h1>LMDB</h1>
    <button id="hamburger-button" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-menu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
    <nav role="navigation" aria-label="Main navigation" id="nav-menu" class="nav-menu">
      <ul class="nav-list">
        <li><a href="index.html" id="nav-home">Home</a></li>
        <li><a href="index.html#featured-movies" id="nav-movies">Movies</a></li>
        <li><a href="tv-shows.html" id="nav-tvshows">TV Shows</a></li>
        <li><a href="about.html" id="nav-about">About</a></li>
        <li><a href="favorites.html" id="nav-favorites">Favorites</a></li>
      </ul>
    </nav>
  </header>
`;

export const footerComponent = `
  <footer>
    &copy; 2025 LMDB
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
    <button class="carousel-button prev" aria-label="Previous featured movies">&#9664;</button>
    <button class="carousel-button next" aria-label="Next featured movies">&#9654;</button>
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
  <section id="top-rated-movies" style="position: relative;">
    <h2>Top Rated Movies</h2>
    <button class="carousel-button prev-toprated" aria-label="Previous top rated movies">&#9664;</button>
    <button class="carousel-button next-toprated" aria-label="Next top rated movies">&#9654;</button>
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
        <p id="detail-release-date"><b></b></p>
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
  <a href="${platform.url}" target="_blank" rel="noopener noreferrer" class="streaming-link" style="display:flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit;">
    <img src="${platform.logo_url}" alt="${platform.name}" title="${platform.name}" style="width: 50px; height: 50px; object-fit: contain;" />
    <span style="font-size: 0.75rem; margin-top: 4px;">${platform.name}</span>
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

export const movieDetailsComponent = `
  <section id="movie-details" aria-live="polite" aria-atomic="true">

    <div class="movie-details-content">
    
      <div class="details-info">
        <h2 id="details-title"></h2>
        <p id="details-year-runtime-genres"></p>
        <p id="details-description"></p>
        <p id="details-rating"></p>
        <p id="details-cast"></p>
        <div id="details-trailer"></div>
        <div id="details-streaming-providers"></div>
      </div>
    </div>
  </section>
`;

export const favoritesComponent = `
  <section id="favorites" aria-live="polite" aria-atomic="true">
    
    <div id="favorites-container" class="movies-container">
      <!-- Favorite movies will be rendered here -->
    </div>
  </section>
`;

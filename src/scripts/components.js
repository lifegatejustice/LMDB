export const headerComponent = `
  <header role="banner">
    <h1>LMDB</h1>
    <nav role="navigation" aria-label="Main navigation">
      <ul class="nav-list">
        <li><a href="#" id="nav-home">Home</a></li>
        <li><a href="#" id="nav-movies">Movies</a></li>
        <li><a href="#" id="nav-tvshows">TV Shows</a></li>
        <li><a href="#" id="nav-about">About</a></li>
        <li><a href="#" id="nav-favorites">Favorites</a></li>
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
  <section id="top-rated-movies">
    <h2>Top Rated Movies</h2>
    <div class="movies-container" id="top-rated-movies-container">
      <!-- Top rated movies will be rendered here -->
    </div>
  </section>
`;

export const movieDetailsComponent = `
  <section id="movie-details" aria-live="polite" aria-atomic="true">
    <button id="back-to-search" aria-label="Back to search results">Back to Search</button>
    <div class="movie-details-content">
      <img id="details-poster" alt="Movie poster" />
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
    <h2>Your Favorites</h2>
    <div id="favorites-container" class="movies-container">
      <!-- Favorite movies will be rendered here -->
    </div>
  </section>
`;

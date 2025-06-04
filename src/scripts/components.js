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

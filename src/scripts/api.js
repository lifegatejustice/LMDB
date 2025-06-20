import { TMDB_API_KEY, TMDB_BASE_URL, WATCHMODE_API_KEY } from "../config.js";

export class TMDbAPI {
  constructor(apiKey = TMDB_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = TMDB_BASE_URL;
    this.watchmodeApiKey = WATCHMODE_API_KEY;
    this.watchmodeBaseUrl = "https://api.watchmode.com/v1";
  }

  async searchMovies(query) {
    const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  }

  async getMoviesByGenre(genreId) {
    const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      return [];
    }
  }

  async getPopularMovies() {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      return [];
    }
  }

  async getGenres() {
    const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error("Error fetching genres:", error);
      return [];
    }
  }

  async getTopRatedMovies() {
    const url = `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      return [];
    }
  }

  // New method to get movie details by ID
  async getMovieDetails(movieId) {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=videos,credits`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  }

  // New method to get streaming availability from Watchmode API by IMDb ID
  async getStreamingAvailability(imdbId) {
    if (!this.watchmodeApiKey) {
      console.error("Watchmode API key is not set");
      return null;
    }
    const url = `${this.watchmodeBaseUrl}/title/${imdbId}/sources/?apiKey=${this.watchmodeApiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data; // Array of streaming sources
    } catch (error) {
      console.error("Error fetching streaming availability:", error);
      return null;
    }
  }

  async searchTVShows(query) {
    const url = `${this.baseUrl}/search/tv?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching TV shows:", error);
      return [];
    }
  }

  async getPopularTVShows() {
    const url = `${this.baseUrl}/tv/popular?api_key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching popular TV shows:", error);
      return [];
    }
  }

  async getTopRatedTVShows() {
    const url = `${this.baseUrl}/tv/top_rated?api_key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching top rated TV shows:", error);
      return [];
    }
  }

  async getTVGenres() {
    const url = `${this.baseUrl}/genre/tv/list?api_key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error("Error fetching TV genres:", error);
      return [];
    }
  }

  async getTVShowDetails(tvShowId) {
    const url = `${this.baseUrl}/tv/${tvShowId}?api_key=${this.apiKey}&append_to_response=videos,credits`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching TV show details:", error);
      return null;
    }
  }
}

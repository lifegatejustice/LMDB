import { TMDB_API_KEY, TMDB_BASE_URL } from "../config.js";

export class TMDbAPI {
  constructor(apiKey = TMDB_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = TMDB_BASE_URL;
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
}

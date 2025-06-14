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

  async getMovieDetails(movieId) {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=credits`;
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

  async getMovieTrailerKey(movieId) {
    const url = `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube",
      );
      return trailer ? trailer.key : null;
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
      return null;
    }
  }

  async getStreamingProviders(movieId) {
    if (!this.watchmodeApiKey) {
      console.warn("Watchmode API key not set");
      return [];
    }
    try {
      // First, get the Watchmode ID for the movie using TMDb ID
      const searchUrl = `https://api.watchmode.com/v1/search/?apiKey=${this.watchmodeApiKey}&search_field=tmdb_id&search_value=${movieId}`;
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        throw new Error("Failed to fetch Watchmode search results");
      }
      const searchData = await searchResponse.json();
      if (!searchData.title_results || searchData.title_results.length === 0) {
        return [];
      }
      const watchmodeId = searchData.title_results[0].id;

      // Then, get the streaming sources for the Watchmode ID
      const sourcesUrl = `https://api.watchmode.com/v1/title/${watchmodeId}/sources/?apiKey=${this.watchmodeApiKey}`;
      const sourcesResponse = await fetch(sourcesUrl);
      if (!sourcesResponse.ok) {
        throw new Error("Failed to fetch Watchmode sources");
      }
      const sourcesData = await sourcesResponse.json();

      // Filter for streaming sources with logos
      const streamingProviders = sourcesData.filter(source => source.type === "sub" && source.logo_url);

      return streamingProviders;
    } catch (error) {
      console.error("Error fetching streaming providers:", error);
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
}

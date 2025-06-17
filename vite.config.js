import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        favorites: resolve(__dirname, "src/favorites.html"),
        tvshows: resolve(__dirname, "src/tv-shows.html"),
        search: resolve(__dirname, "src/search.html"),
        about: resolve(__dirname, "src/about.html"),
      },
    },
  },
});

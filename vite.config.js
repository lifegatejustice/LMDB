import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  publicDir: "src/images",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/about.html"),
        favorites: resolve(__dirname, "src/favorites.html"),
        search: resolve(__dirname, "src/search.html"),
        "tv-shows": resolve(__dirname, "src/tv-shows.html"),
      },
    },
  },
});

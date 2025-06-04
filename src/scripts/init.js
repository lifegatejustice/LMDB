import { headerComponent, footerComponent, searchBarComponent, featuredMoviesComponent, genresComponent, topRatedMoviesComponent } from "./components.js";

export function loadComponents() {
  document.getElementById("header-container").innerHTML = headerComponent;
  document.getElementById("footer-container").innerHTML = footerComponent;
  document.getElementById("search-container").innerHTML = searchBarComponent;

  // Create containers for new sections inside main
  const main = document.querySelector("main");

  const featuredSection = document.createElement("div");
  featuredSection.id = "featured-movies-section";
  featuredSection.innerHTML = featuredMoviesComponent;
  main.insertBefore(featuredSection, document.getElementById("results"));

  const genresSection = document.createElement("div");
  genresSection.id = "genres-section";
  genresSection.innerHTML = genresComponent;
  main.insertBefore(genresSection, document.getElementById("results"));

  const topRatedSection = document.createElement("div");
  topRatedSection.id = "top-rated-movies-section";
  topRatedSection.innerHTML = topRatedMoviesComponent;
  main.insertBefore(topRatedSection, document.getElementById("results"));
}

loadComponents();

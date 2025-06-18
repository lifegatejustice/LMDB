// init.js
import {
  headerComponent,
  footerComponent,
  searchBarComponent,
  featuredMoviesComponent,
  genresComponent,
  topRatedMoviesComponent,
  movieDetailsComponent,
  favoritesComponent,
  // ...any other components
} from "./components.js";

export function loadComponents() {
  // 1) Inject Header + Footer + Search Bar
  document.getElementById("header-container").innerHTML = headerComponent;
  document.getElementById("footer-container").innerHTML = footerComponent;
  document.getElementById("search-container").innerHTML = searchBarComponent;

  // 3) Wire up the hamburger menu toggle
  const btn = document.getElementById("hamburger-button");
  const nav = document.getElementById("nav-menu");
  if (btn && nav) {
    const toggle = () => {
      const open = nav.classList.toggle("open");
      btn.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    };

    btn.addEventListener("click", toggle);

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove("open");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", false);
      }
    });

    // close on link click
    nav
      .querySelectorAll(".nav-list a")
      .forEach((a) => a.addEventListener("click", () => toggle()));
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", loadComponents);

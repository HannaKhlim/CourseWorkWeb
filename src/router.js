import { selectGender } from "./utils/storageService.js";
import { registerTemplate, translate } from "./utils/i18n.js";
import { initProductsPage } from "./components/productsGrid.js";
import { initProductDetails } from "./components/productDetails.js";

const mainContent = document.getElementById("main-content");

const pages = {
  "/": "/src/pages/home.html",
  "/products": "/src/pages/products.html",
  "/product/:id": "/src/pages/productDetails.html",
};

const pageInits = {
  "/products": () => initProductsPage(),
  "/product/:id": ({ id }) => initProductDetails(id),
};

const renderNotFound = async () => {
  try {
    const response = await fetch("/src/pages/404.html");
    return response.text();
  } catch (error) {
    console.error("Error loading 404 page:", error);
    return "<h1>404</h1><p>Page not found</p>";
  }
};

const matchRoute = (path) => {
  if (pages[path]) return { pageFile: pages[path], pattern: path, params: {} };
  for (const pattern of Object.keys(pages)) {
    if (!pattern.includes(":")) continue;
    const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
    if (regex.test(path)) {
      const params = {};
      pattern.split("/").forEach((part, i) => {
        if (part.startsWith(":")) params[part.slice(1)] = path.split("/")[i];
      });
      return { pageFile: pages[pattern], pattern, params };
    }
  }
  return null;
};

const route = async () => {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("gender")) {
    selectGender(searchParams.get("gender"));
  }
  const match = matchRoute(path);

  let content;
  if (match) {
    try {
      const response = await fetch(match.pageFile);
      content = await response.text();
    } catch (error) {
      console.error("Error loading page:", error);
      content = await renderNotFound();
    }
  } else {
    content = await renderNotFound();
  }

  registerTemplate("main-content", content);
  const translated = translate(content);
  mainContent.replaceChildren(
    document.createRange().createContextualFragment(translated),
  );
  window.scrollTo({ top: 0, behavior: "smooth" });

  const init = match && pageInits[match.pattern];
  if (init) init(match.params);
};

export const navigateTo = (route) => {
  window.history.pushState(null, "", route);
  window.dispatchEvent(new Event("popstate"));
};

window.navigateTo = navigateTo;
window.addEventListener("popstate", route);
window.addEventListener("DOMContentLoaded", route);
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");
  if (!link) return;

  event.preventDefault();
  const href = link.getAttribute("href");
  navigateTo(href);
});

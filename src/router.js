import { selectGender, getUserData } from "./utils/storageService.js";
import { registerTemplate, translate } from "./utils/i18n.js";
import { initHomePage } from "./components/homePage.js";
import { initProductsPage } from "./components/productsGrid.js";
import { initProductDetails } from "./components/productDetails.js";
import { initAdminPanel } from "./components/adminPanel.js";
import { initLoginPage } from "./components/loginPage.js";
import { initProfilePage } from "./components/profilePage.js";

const mainContent = document.getElementById("main-content");

const pages = {
  "/": "/src/pages/home.html",
  "/products": "/src/pages/products.html",
  "/product/:id": "/src/pages/productDetails.html",
  "/login": "/src/pages/login.html",
  "/profile": "/src/pages/profile.html",
  "/checkout": "/src/pages/checkout.html",
  "/admin": "/src/pages/admin.html",
};

const pageInits = {
  "/": () => initHomePage(),
  "/products": () => initProductsPage(),
  "/product/:id": ({ id }) => initProductDetails(id),
  "/login": () => initLoginPage(),
  "/profile": () => initProfilePage(),
  "/admin": () => initAdminPanel(),
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

export const navigateTo = (route) => {
  window.history.pushState(null, "", route);
  window.dispatchEvent(new Event("popstate"));
  document.getElementById("mobile-menu-overlay").classList.remove("open");
};

const route = async () => {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("gender")) {
    selectGender(searchParams.get("gender"));
  }

  const isLoggedIn = Boolean(getUserData());
  if (path === "/login" && isLoggedIn) {
    navigateTo("/profile");
    return;
  }
  if ((path === "/profile" || path === "/checkout") && !isLoggedIn) {
    navigateTo("/login");
    return;
  }
  if (path === "/admin" && !getUserData()?.admin) {
    navigateTo("/profile");
    return;
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

window.navigateTo = navigateTo;
window.addEventListener("popstate", route);
window.addEventListener("DOMContentLoaded", route);
document.addEventListener("i18n:applied", () => {
  const path = window.location.pathname;
  const match = matchRoute(path);
  const init = match && pageInits[match.pattern];
  if (init) init(match.params);
});
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");
  if (!link) return;

  event.preventDefault();
  const href = link.getAttribute("href");
  navigateTo(href);
});

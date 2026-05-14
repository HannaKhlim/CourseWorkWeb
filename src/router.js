const mainContent = document.getElementById("main-content");

const pages = {
  "/": "/src/pages/home.html",
  "/products": "/src/pages/products.html",
  "/product/:id": "/src/pages/productDetails.html",
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
  if (pages[path]) return pages[path];
  for (const pattern of Object.keys(pages)) {
    if (!pattern.includes(":")) continue;
    const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
    if (regex.test(path)) return pages[pattern];
  }
  return null;
};

const route = async () => {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  if (params.has("gender")) {
    localStorage.setItem("selectedGender", params.get("gender"));
    document.dispatchEvent(new Event("localstorage:updated"));
  }
  const pageFile = matchRoute(path);

  let content;
  if (pageFile) {
    try {
      const response = await fetch(pageFile);
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
};

window.addEventListener("popstate", route);
window.addEventListener("DOMContentLoaded", route);
window.navigateTo = (route) => {
  window.history.pushState(null, "", route);
  window.dispatchEvent(new Event("popstate"));
};
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");
  if (!link) return;

  event.preventDefault();
  const href = link.getAttribute("href");
  navigateTo(href);
});

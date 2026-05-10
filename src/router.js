const mainContent = document.getElementById("main-content");

const pages = {
  "/": "src/pages/home.html",
  "/products": "src/pages/products.html",
};

const renderNotFound = async () => {
  try {
    const response = await fetch("src/pages/404.html");
    return response.text();
  } catch (error) {
    console.error("Error loading 404 page:", error);
    return "<h1>404</h1><p>Page not found</p>";
  }
};

const route = async () => {
  const path = window.location.pathname;
  const pageFile = pages[path];

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

  mainContent.innerHTML = content;
};

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-link]");
  if (!link) return;

  e.preventDefault();
  const href = link.getAttribute("href");
  history.pushState(null, "", href);
  route();
});

window.addEventListener("popstate", route);
window.addEventListener("DOMContentLoaded", route);

fetch("src/components/header.html?v=" + new Date().getTime())
  .then((response) => response.text())
  .then((html) => {
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
      headerContainer.innerHTML = html;
    }
  })
  .catch((error) => console.error("Error loading header:", error));

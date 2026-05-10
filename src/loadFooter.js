fetch("src/components/footer.html?v=" + new Date().getTime())
  .then((response) => response.text())
  .then((html) => {
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
      footerContainer.innerHTML = html;
    }
  })
  .catch((error) => console.error("Error loading footer:", error));

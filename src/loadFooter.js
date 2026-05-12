fetch("src/components/footer.html")
  .then((response) => response.text())
  .then((html) => {
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
      registerTemplate("footer-container", html);
      footerContainer.innerHTML = translate(html);
    }
  })
  .catch((error) => console.error("Error loading footer:", error));

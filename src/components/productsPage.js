window.initProductsPage = async function () {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  try {
    const response = await fetch("/db.json");
    const data = await response.json();
    const products = data.products || [];
    grid.innerHTML = products.map(createProductCard).join("");
  } catch (error) {
    console.error("Error loading products:", error);
    grid.innerHTML = "<p>Не удалось загрузить товары.</p>";
  }
};

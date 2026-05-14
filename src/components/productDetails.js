window.initProductDetails = async (id) => {
  const container = document.getElementById("product-details");
  if (!container) return;

  try {
    const response = await fetch("/db.json");
    const data = await response.json();
    const product = (data.products || []).find(
      (p) => String(p.id) === String(id),
    );

    if (!product) {
      return;
    }

    const price = product.price.toLocaleString("ru-RU");

    const html = `
<div class="product-details__image-wrapper">
  <img src="${product.image}" alt="${product.name}" class="product-details__img" />
</div>
<div class="product-details__info">
  <p class="product-details__brand">${product.brand}</p>
  <h1 class="product-details__name">${product.name}</h1>
  <p class="product-details__price">${price} ₽</p>
  <p class="product-details__description">${product.description}</p>
</div>`.trim();

    window.registerTemplate("product-details", html);
    container.innerHTML = window.translate(html);
  } catch (error) {
    console.error("Error loading product detail:", error);
  }
};

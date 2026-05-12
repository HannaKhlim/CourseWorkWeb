window.initProductPage = async function (id) {
  const container = document.getElementById("product-detail");
  if (!container) return;

  try {
    const response = await fetch("/db.json");
    const data = await response.json();
    const product = (data.products || []).find(
      (p) => String(p.id) === String(id)
    );

    if (!product) {
      container.innerHTML = "<p>Товар не найден.</p>";
      return;
    }

    const price = product.price.toLocaleString("ru-RU");

    container.innerHTML = `
<div class="product-detail__image-wrapper">
  <img src="${product.image}" alt="${product.name}" class="product-detail__img" />
</div>
<div class="product-detail__info">
  <p class="product-detail__brand">${product.brand}</p>
  <h1 class="product-detail__name">${product.name}</h1>
  <p class="product-detail__price">${price} ₽</p>
  <p class="product-detail__description">${product.description}</p>
  <button class="product-detail__btn btn-primary">Выбрать размер</button>
</div>`.trim();
  } catch (error) {
    console.error("Error loading product detail:", error);
    container.innerHTML = "<p>Не удалось загрузить товар.</p>";
  }
};

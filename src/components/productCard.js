window.createProductCard = function (product) {
  const price = product.price.toLocaleString("ru-RU");

  return `
<article
  class="product-tile"
  onclick="navigateTo('/product/${product.id}')"
  data-product-id="${product.id}"
>
  <img src="${product.image}" alt="${product.name}" class="product-tile__img" />
  <div class="product-tile__overlay">
    <div class="product-tile__main">
      <h3 class="product-tile__name">${product.name}</h3>
      <p class="product-tile__brand">${product.brand}</p>
      <p class="product-tile__price">${price} ₽</p>
    </div>
    <div class="product-tile__extra">
      <p class="product-tile__description">${product.description}</p>
      <button class="product-tile__btn">Выбрать размер</button>
    </div>
  </div>
</article>`.trim();
};

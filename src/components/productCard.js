import { registerTemplate, translate } from "../utils/i18n.js";
import { getSelectedLanguage } from "../utils/storageService.js";
import { checkIfInWishlist, toggleFavorite } from "../utils/wishlistService.js";
import { navigateTo } from "../router.js";

export const createProductCard = (product) => {
  const selectedLanguage = getSelectedLanguage();
  const price = product.price.toLocaleString(selectedLanguage);

  const article = document.createElement("article");
  article.className = "product-tile";

  const html = `
    <img src="${product.image}" alt="${product.name[selectedLanguage]}" class="product-tile__img" />
    <div class="wishlist-icon product-tile__wishlist ${checkIfInWishlist(product.id) ? "wishlist-icon--added" : ""}"></div>
    <div class="product-tile__overlay">
      <div class="product-tile__main">
        <h3 class="product-tile__name">${product.name[selectedLanguage]}</h3>
        <p class="product-tile__brand">${product.brand}</p>
        <p class="product-tile__price">${price} ₽</p>
      </div>
      <div class="product-tile__extra">
        <p class="product-tile__description">${product.description[selectedLanguage]}</p>
        <button class="product-tile__btn btn-secondary">{{productCard.selectSize}}</button>
      </div>
    </div>
  `.trim();

  registerTemplate(`product-card-${product.id}`, html);
  article.innerHTML = translate(html);
  article.addEventListener("click", () => navigateTo(`/product/${product.id}`));
  article
    .querySelector(".wishlist-icon")
    .addEventListener("click", (event) => toggleFavorite(event, product.id));

  return article;
};

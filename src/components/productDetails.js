import { registerTemplate, translate } from "../utils/i18n.js";
import { getSelectedLanguage } from "../utils/storageService.js";

export const initProductDetails = async (id) => {
  const selectedLanguage = getSelectedLanguage();
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

    const price = product.price.toLocaleString(selectedLanguage);

    const html = `
      <div class="product-details__image-wrapper">
        <img src="${product.image}" alt="${product.name[selectedLanguage]}" class="product-details__img" />
      </div>
      <div class="product-details__info">
        <h1 class="product-details__name">${product.name[selectedLanguage]}</h1>
        <h2 class="product-details__brand">${product.brand}</h2>
        <p class="product-details__price">${price} ₽</p>
        <p class="product-details__description">${product.description[selectedLanguage]}</p>
        <div class="product-details__materials">
          <p class="product-details__materials-label">{{productDetails.materials}}:</p>
          <p class="product-details__materials-value">${product.materials[selectedLanguage]}</p>
        </div>
        <div class="product-details__attributes">
          <div class="product-details__attribute">
            <span class="product-details__attribute-name">{{productDetails.id}}:</span>
            <span class="product-details__attribute-value">${product.id}</span>
          </div>
          <div class="product-details__attribute">
            <span class="product-details__attribute-name">{{productDetails.origin}}:</span>
            <span class="product-details__attribute-value">${product.origin[selectedLanguage]}</span>
          </div>
          <div class="product-details__attribute">
            <span class="product-details__attribute-name">{{productDetails.color}}:</span>
            <span class="product-details__attribute-value">${product.color[selectedLanguage]}</span>
          </div>
        </div>
      </div>
    `.trim();

    registerTemplate("product-details", html);
    container.innerHTML = translate(html);
  } catch (error) {
    console.error("Error loading product detail:", error);
  }
};

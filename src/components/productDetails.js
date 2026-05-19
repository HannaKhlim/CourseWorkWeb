import { navigateTo } from "../router.js";
import { translate } from "../utils/i18n.js";
import { getSelectedLanguage } from "../utils/storageService.js";
import { productsApi } from "../utils/api.js";
import { createCarousel } from "./productCarousel.js";
import { checkIfInWishlist, toggleFavorite } from "../utils/wishlistService.js";
import { getCart, setCartQuantity } from "../utils/cartService.js";
import { debounce } from "../utils/timers.js";

export const initProductDetails = async (id) => {
  const selectedLanguage = getSelectedLanguage();
  let addedCounter =
    getCart().find((item) => item.productId === String(id))?.quantity ?? 0;

  const debouncedSetCartQuantity = debounce(
    (quantity) => setCartQuantity(id, quantity),
    500,
  );

  try {
    const product = await productsApi.getById(id).catch(() => null);

    if (!product) {
      navigateTo("/404");
      return;
    }

    const container = document.getElementById("product-details");
    const img = (container.querySelector("[data-attr='img']").src =
      product.image);
    container.querySelector("[data-attr='name']").textContent =
      product.name[selectedLanguage];
    container.querySelector("[data-attr='brand']").textContent = product.brand;
    container.querySelector("[data-attr='price']").textContent =
      `${product.price.toLocaleString(selectedLanguage)} ₽`;
    container.querySelector("[data-attr='description']").textContent =
      product.description[selectedLanguage];
    container.querySelector("[data-attr='materials-value']").textContent =
      product.materials[selectedLanguage];
    container.querySelector("[data-attr='id']").textContent = product.id;
    container.querySelector("[data-attr='origin']").textContent =
      product.origin[selectedLanguage];
    container.querySelector("[data-attr='color']").textContent =
      product.color[selectedLanguage];
    container.querySelector("[data-attr='sizes']").textContent = product.sizes
      .split(",")
      .join(", ");

    const addToCart = container.querySelector(".product-details__add");
    const controls = container.querySelector(".product-details__cart-controls");
    const quantityDisplay = controls.querySelector("[data-quantity]");
    const wishlistIcon = container.querySelector(".wishlist-icon");

    wishlistIcon.classList.toggle(
      "wishlist-icon--added",
      checkIfInWishlist(product.id),
    );

    const updateQuantity = (quantity) => {
      if (quantity > 0) {
        controls.hidden = false;
        addToCart.hidden = true;
        quantityDisplay.textContent = quantity;
      } else {
        controls.hidden = true;
        addToCart.hidden = false;
      }
    };

    const handleControlClick = (quantity) => {
      addedCounter = quantity;
      debouncedSetCartQuantity(quantity);
      updateQuantity(quantity);
    };

    updateQuantity(addedCounter);

    wishlistIcon.addEventListener("click", (event) =>
      toggleFavorite(event, product.id),
    );
    addToCart.addEventListener("click", () => handleControlClick(1));
    container
      .querySelector("[data-action='increase']")
      .addEventListener("click", () => handleControlClick(addedCounter + 1));
    container
      .querySelector("[data-action='decrease']")
      .addEventListener("click", () => handleControlClick(addedCounter - 1));

    if (product.suggestions?.length) {
      const suggestionProducts = await Promise.all(
        product.suggestions.map((id) =>
          productsApi.getById(String(id)).catch(() => null),
        ),
      );
      const validProducts = suggestionProducts.filter(Boolean);
      if (validProducts.length) {
        const suggestionsContainer = document.getElementById(
          "suggestions-carousel",
        );
        if (suggestionsContainer) {
          suggestionsContainer.appendChild(
            createCarousel(
              translate("{{productDetails.suggestions}}"),
              validProducts,
            ),
          );
        }
      }
    }
  } catch (error) {
    console.error("Error loading product detail:", error);
  }
};

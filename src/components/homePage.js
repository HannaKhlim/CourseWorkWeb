import { productsApi } from "../utils/api.js";
import { translate } from "../utils/i18n.js";
import { createCarousel } from "./productCarousel.js";

export const initHomePage = async () => {
  const container = document.getElementById("new-arrivals-carousel");
  if (!container) return;

  try {
    const { data: products } = await productsApi.getAll({
      _sort: "-dateAdded",
      _page: 1,
      _per_page: 8,
    });

    container.appendChild(
      createCarousel(translate("{{newArrivals.title}}"), products),
    );
  } catch (error) {
    console.error("Error loading new arrivals:", error);
  }
};

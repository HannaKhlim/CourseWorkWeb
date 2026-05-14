import {
  getSelectedCategory,
  getSelectedGender,
} from "../utils/storageService.js";
import { createProductCard } from "./productCard.js";

export const initProductsPage = async () => {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  try {
    const response = await fetch("/db.json");
    const data = await response.json();
    const products = data.products || [];
    const selectedCategory = getSelectedCategory();
    const selectedGender = getSelectedGender();
    const filteredProducts = products.filter(
      (p) => p.gender === selectedGender && p.category === selectedCategory,
    );
    grid.innerHTML = filteredProducts.map(createProductCard).join("");
  } catch (error) {
    console.error("Error loading products:", error);
  }
};

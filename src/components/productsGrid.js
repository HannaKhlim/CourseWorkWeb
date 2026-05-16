import {
  getSelectedCategory,
  getSelectedGender,
} from "../utils/storageService.js";
import { createProductCard } from "./productCard.js";
import { productsApi } from "../utils/api.js";

const PAGE_SIZE = 10;

export const initProductsPage = async () => {
  const grid = document.querySelector(".products-grid");
  if (!grid) return;

  const selectedCategory = getSelectedCategory();
  const selectedGender = getSelectedGender();
  let currentPage = 1;

  const prev = document.getElementById("pagination-prev");
  const next = document.getElementById("pagination-next");
  const pagesContainer = document.getElementById("pagination-pages");

  prev.addEventListener("click", () => {
    currentPage--;
    render();
  });
  next.addEventListener("click", () => {
    currentPage++;
    render();
  });

  const render = async () => {
    try {
      const { data: products, last: totalPages } = await productsApi.getAll({
        gender: selectedGender,
        category: selectedCategory,
        _page: currentPage,
        _per_page: PAGE_SIZE,
      });

      grid.innerHTML = products.map(createProductCard).join("");

      prev.disabled = currentPage === 1;
      next.disabled = currentPage === totalPages;
      pagesContainer.innerHTML = "";

      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.classList.add("pagination--active");
        btn.addEventListener("click", () => {
          currentPage = i;
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        pagesContainer.appendChild(btn);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  render();
};

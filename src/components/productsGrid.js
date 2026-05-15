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

  try {
    const selectedCategory = getSelectedCategory();
    const selectedGender = getSelectedGender();
    const products = await productsApi.getAll({
      gender: selectedGender,
      category: selectedCategory,
    });

    let currentPage = 1;
    const totalPages = Math.ceil(products.length / PAGE_SIZE);

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

    const render = () => {
      const start = (currentPage - 1) * PAGE_SIZE;
      const pageItems = products.slice(start, start + PAGE_SIZE);
      grid.innerHTML = pageItems.map(createProductCard).join("");
      renderPagination();
    };

    const renderPagination = () => {
      pagesContainer.innerHTML = "";
      prev.disabled = currentPage === 1;
      next.disabled = currentPage === totalPages;

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
    };

    render();
  } catch (error) {
    console.error("Error loading products:", error);
  }
};

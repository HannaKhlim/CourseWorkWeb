import {
  getSelectedCategory,
  getSelectedGender,
} from "../utils/storageService.js";
import { createProductCard } from "./productCard.js";

const PAGE_SIZE = 10;

export const initProductsPage = async () => {
  const grid = document.querySelector(".products-grid");
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

    let currentPage = 1;
    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

    const render = () => {
      const start = (currentPage - 1) * PAGE_SIZE;
      const pageItems = filteredProducts.slice(start, start + PAGE_SIZE);
      grid.innerHTML = pageItems.map(createProductCard).join("");
      renderPagination();
    };

    const renderPagination = () => {
      let pagination = document.getElementById("pagination");
      if (!pagination) {
        pagination = document.createElement("div");
        pagination.id = "pagination";
        pagination.className = "pagination";
        grid.parentNode.insertBefore(pagination, grid.nextSibling);
      }
      pagination.innerHTML = "";
      if (totalPages <= 1) return;

      const prev = document.createElement("button");
      prev.textContent = "←";
      prev.disabled = currentPage === 1;
      prev.addEventListener("click", () => {
        currentPage--;
        render();
      });
      pagination.appendChild(prev);

      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.classList.add("pagination__active");
        btn.addEventListener("click", () => {
          currentPage = i;
          render();
        });
        pagination.appendChild(btn);
      }

      const next = document.createElement("button");
      next.textContent = "→";
      next.disabled = currentPage === totalPages;
      next.addEventListener("click", () => {
        currentPage++;
        render();
      });
      pagination.appendChild(next);
    };

    render();
  } catch (error) {
    console.error("Error loading products:", error);
  }
};

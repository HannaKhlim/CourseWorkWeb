import {
  getSelectedCategory,
  getSelectedGender,
} from "../utils/storageService.js";
import { createProductCard } from "./productCard.js";
import { productsApi } from "../utils/api.js";
import { getCurrentLang } from "../utils/i18n.js";
import { debounce } from "../utils/timers.js";

const PAGE_SIZE = 8;

const SORT_PARAMS = {
  newest: "-createdAt",
  oldest: "createdAt",
  priceDesc: "-price",
  priceAsc: "price",
};

let pageAbortController = null;

export const initProductsPage = async () => {
  const grid = document.querySelector(".products-grid");
  if (!grid) return;

  if (pageAbortController) pageAbortController.abort();
  pageAbortController = new AbortController();
  const { signal } = pageAbortController;

  const selectedCategory = getSelectedCategory();
  const selectedGender = getSelectedGender();

  let currentPage = 1;
  const prev = document.getElementById("pagination-prev");
  const next = document.getElementById("pagination-next");
  const pagesContainer = document.getElementById("pagination-pages");

  let sortBy = "newest";
  const selectedBrands = new Set();
  const selectedColors = new Set();
  const selectedSizes = new Set();
  const brandPanel = document.getElementById("brand-panel");
  const colorPanel = document.getElementById("color-panel");
  const sizePanel = document.getElementById("size-panel");
  const clearBtn = document.getElementById("clear-filters");

  const createFilterOption = (value, name) => `
    <label class="filter-group__option">
      <input type="checkbox" name="${name}" value="${value}" />
      <span>${value}</span>
    </label>`;

  const updateTriggerCount = (group, count) => {
    const label = group.querySelector(".filter-group__label");
    if (!label.dataset.base) {
      label.dataset.base = label.textContent.trim();
    }
    label.textContent =
      count > 0 ? `${label.dataset.base} (${count})` : label.dataset.base;
  };

  const addListenersToFilter = (filter, selectedSet) => {
    filter.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        checkbox.checked
          ? selectedSet.add(checkbox.value)
          : selectedSet.delete(checkbox.value);
        updateTriggerCount(filter.closest(".filter-group"), selectedSet.size);
        currentPage = 1;
        debouncedRender();
      });
    });
  };

  const populateFilters = (products) => {
    const lang = getCurrentLang();

    const brands = [...new Set(products.map((p) => p.brand))].sort();
    brandPanel.innerHTML = brands
      .map((brand) => createFilterOption(brand, "brand"))
      .join("");

    const sortedColors = [...new Set(products.map((p) => p.color.en))];
    colorPanel.innerHTML = sortedColors
      .map((color) => createFilterOption(color, "color"))
      .join("");

    document.querySelectorAll('input[name="sort"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          sortBy = radio.value;
          currentPage = 1;
          render();
        }
      });
    });

    addListenersToFilter(brandPanel, selectedBrands);
    addListenersToFilter(colorPanel, selectedColors);
    addListenersToFilter(sizePanel, selectedSizes);
  };

  try {
    const allProducts = await productsApi.getAll({
      gender: selectedGender,
      category: selectedCategory,
    });
    populateFilters(allProducts);
  } catch (e) {
    console.error("Error loading filter options:", e);
  }

  prev.addEventListener("click", () => {
    currentPage--;
    render();
  });
  next.addEventListener("click", () => {
    currentPage++;
    render();
  });

  clearBtn.addEventListener("click", () => {
    selectedBrands.clear();
    selectedColors.clear();
    selectedSizes.clear();
    document
      .querySelectorAll('.filter-group__option input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));
    document
      .querySelectorAll(".filter-group")
      .forEach((g) => updateTriggerCount(g, 0));
    currentPage = 1;
    render();
  });

  document.querySelectorAll(".filter-group__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const group = trigger.closest(".filter-group");
      group.classList.toggle("open");
    });
  });

  const getFilteredProducts = async () => {
    try {
      const params = {
        _sort: SORT_PARAMS[sortBy],
        _page: currentPage,
        _per_page: PAGE_SIZE,
      };
      const where = {
        gender: { eq: selectedGender },
        category: { eq: selectedCategory },
      };

      if (selectedBrands.size > 0)
        where.brand = { in: Array.from(selectedBrands) };
      if (selectedColors.size > 0)
        where.color = { en: { in: Array.from(selectedColors) } };
      if (selectedSizes.size > 0) {
        where.or = Array.from(selectedSizes).map((size) => ({
          sizes: { contains: size },
        }));
      }

      params._where = JSON.stringify(where);
      const result = await productsApi.getAll(params);
      return { products: result.data, totalPages: result.last || 1 };
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const renderPagination = (totalPages) => {
    prev.disabled = currentPage === 1;
    next.disabled = currentPage === totalPages;
    pagesContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "btn-outline--active" : "btn-outline";
      btn.addEventListener("click", () => {
        currentPage = i;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      pagesContainer.appendChild(btn);
    }
  };

  const render = async () => {
    const { products, totalPages } = await getFilteredProducts();
    grid.replaceChildren(...products.map(createProductCard));
    renderPagination(totalPages);
  };

  const debouncedRender = debounce(render, 700);

  render();
};

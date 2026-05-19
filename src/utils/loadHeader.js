import {
  selectGender,
  selectCategory,
  getSelectedGender,
  getSelectedCategory,
  getSelectedTheme,
  selectTheme,
  clearStorage,
} from "./storageService.js";
import { registerTemplate, translate, toggleLanguage } from "./i18n.js";
import { navigateTo } from "../router.js";

const getRadios = (form) => form.querySelectorAll('input[type="radio"]');

const clearRadioSelection = (form) => {
  getRadios(form).forEach((radio) => (radio.checked = false));
};

const initializeHeaderHandlers = () => {
  const handleRadioSelect = (event) => {
    const clickedRadio = event.target;
    const parentForm = clickedRadio.closest("form");
    clearRadioSelection(parentForm);
    clickedRadio.checked = true;

    const isOverlay = !!clickedRadio.closest(".mobile-menu-overlay");
    const formGender = document.querySelector(
      isOverlay ? "#overlay-gender-selection" : "#gender-selection",
    );
    const formCategory = document.querySelector(
      isOverlay ? "#overlay-category-selection" : "#category-selection",
    );

    const selectedGender = formGender.querySelector(
      'input[type="radio"]:checked',
    );
    const selectedCategory = formCategory.querySelector(
      'input[type="radio"]:checked',
    );

    if (selectedGender && selectedCategory) {
      selectGender(selectedGender.value);
      selectCategory(selectedCategory.value);
      navigateTo("/products");
    }
  };

  document.querySelectorAll(".header-navigation__option").forEach((input) => {
    input.addEventListener("click", handleRadioSelect);
  });
};

const initializeDefaultSelections = () => {
  const allGenderForms = document.querySelectorAll(
    "#gender-selection, #overlay-gender-selection",
  );
  const allCategoryForms = document.querySelectorAll(
    "#category-selection, #overlay-category-selection",
  );

  allGenderForms.forEach(clearRadioSelection);
  allCategoryForms.forEach(clearRadioSelection);

  const defaultGender = getSelectedGender();
  const defaultCategory = getSelectedCategory();

  allGenderForms.forEach((form) => {
    const r = form.querySelector(`input[value="${defaultGender}"]`);
    if (r) r.checked = true;
  });
  allCategoryForms.forEach((form) => {
    const r = form.querySelector(`input[value="${defaultCategory}"]`);
    if (r) r.checked = true;
  });
};

const initSearchHandlers = () => {
  document.querySelectorAll(".header-search").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const value = input.value.trim();
        if (value) navigateTo(`/product/${encodeURIComponent(value)}`);
      }
    });
  });
};

const initHeader = () => {
  initializeHeaderHandlers();
  initializeDefaultSelections();
  initSearchHandlers();

  document
    .getElementById("lang-toggle")
    .addEventListener("click", toggleLanguage);
  document.documentElement.setAttribute("data-theme", getSelectedTheme());
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = getSelectedTheme() === "dark" ? "light" : "dark";
    selectTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  });
  document
    .getElementById("clear-storage")
    .addEventListener("click", clearStorage);
  document
    .getElementById("overlay-clear-storage")
    .addEventListener("click", clearStorage);
  document
    .querySelector(".header-bottom-mobile__menu")
    .addEventListener("click", () => {
      document.getElementById("mobile-menu-overlay").classList.add("open");
    });
  document.getElementById("mobile-menu-close").addEventListener("click", () => {
    document.getElementById("mobile-menu-overlay").classList.remove("open");
  });
};

fetch("/src/components/header.html")
  .then((response) => response.text())
  .then((html) => {
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
      registerTemplate("header-container", html);
      headerContainer.innerHTML = translate(html);
      initHeader();
      document.addEventListener("i18n:applied", initHeader);
      document.addEventListener(
        "localstorage:updated",
        initializeDefaultSelections,
      );
    }
  })
  .catch((error) => console.error("Error loading header:", error));

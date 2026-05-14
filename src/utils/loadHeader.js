import {
  selectGender,
  selectCategory,
  getSelectedGender,
  getSelectedCategory,
} from "./storageService.js";
import { registerTemplate, translate, toggleLanguage } from "./i18n.js";
import { navigateTo } from "../router.js";

const getRadios = (form) => form.querySelectorAll('input[type="radio"]');

const clearRadioSelection = (form) => {
  getRadios(form).forEach((radio) => (radio.checked = false));
};

const initializeHeaderHandlers = () => {
  const handleRadioSelect = (event) => {
    const formGender = document.querySelector("#gender-selection");
    const formCategory = document.querySelector("#category-selection");

    const clickedRadio = event.target;
    const parentForm = clickedRadio.closest("form");
    clearRadioSelection(parentForm);
    clickedRadio.checked = true;

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
  clearRadioSelection(document.querySelector("#gender-selection"));
  clearRadioSelection(document.querySelector("#category-selection"));
  const defaultGender = getSelectedGender();
  const defaultCategory = getSelectedCategory();

  const genderRadio = document.querySelector(
    `#gender-selection input[value="${defaultGender}"]`,
  );
  const categoryRadio = document.querySelector(
    `#category-selection input[value="${defaultCategory}"]`,
  );
  if (genderRadio) genderRadio.checked = true;
  if (categoryRadio) categoryRadio.checked = true;
};

const initHeader = () => {
  initializeHeaderHandlers();
  initializeDefaultSelections();
  document
    .getElementById("lang-toggle")
    .addEventListener("click", toggleLanguage);
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

const initializeHeaderHandlers = () => {
  const handleRadioSelect = (event) => {
    const formGender = document.querySelector("#gender-selection");
    const formCategory = document.querySelector("#category-selection");

    const getRadios = (form) => form.querySelectorAll('input[type="radio"]');

    const clickedRadio = event.target;
    const parentForm = clickedRadio.closest("form");

    getRadios(parentForm).forEach((radio) => {
      if (radio !== clickedRadio) radio.checked = false;
    });

    const selectedGender = formGender.querySelector(
      'input[type="radio"]:checked',
    );
    const selectedCategory = formCategory.querySelector(
      'input[type="radio"]:checked',
    );

    if (selectedGender && selectedCategory) {
      localStorage.setItem("selectedGender", selectedGender.value);
      localStorage.setItem("selectedCategory", selectedCategory.value);
      navigateTo("/products");
    }
  };

  document.querySelectorAll(".header-navigation__option").forEach((input) => {
    input.addEventListener("change", handleRadioSelect);
  });
};

const initializeDefaultSelections = () => {
  const defaultGender = localStorage.getItem("selectedGender") || "female";
  const defaultCategory = localStorage.getItem("selectedCategory");

  const genderRadio = document.querySelector(
    `#gender-selection input[value="${defaultGender}"]`,
  );
  const categoryRadio = document.querySelector(
    `#category-selection input[value="${defaultCategory}"]`,
  );
  if (genderRadio) genderRadio.checked = true;
  if (categoryRadio) categoryRadio.checked = true;
};

fetch("src/components/header.html")
  .then((response) => response.text())
  .then((html) => {
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
      headerContainer.innerHTML = html;
      initializeHeaderHandlers();
      initializeDefaultSelections();
    }
  })
  .catch((error) => console.error("Error loading header:", error));

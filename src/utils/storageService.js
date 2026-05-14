export const getSelectedLanguage = () => {
  return localStorage.getItem("lang") || "ru";
};
export const getSelectedGender = () => {
  return localStorage.getItem("selectedGender") || "women";
};
export const getSelectedCategory = () => {
  return localStorage.getItem("selectedCategory") || "clothes";
};

export const selectLanguage = (language) => {
  localStorage.setItem("lang", language);
  document.dispatchEvent(new Event("localstorage:updated"));
};

export const selectGender = (gender) => {
  localStorage.setItem("selectedGender", gender);
  document.dispatchEvent(new Event("localstorage:updated"));
};

export const selectCategory = (category) => {
  localStorage.setItem("selectedCategory", category);
  document.dispatchEvent(new Event("localstorage:updated"));
};

export const clearStorage = () => {
  localStorage.clear();
  window.location.reload();
};

export const getSelectedLanguage = () => {
  return localStorage.getItem("lang") || "ru";
};

export const selectLanguage = (language) => {
  localStorage.setItem("lang", language);
  document.dispatchEvent(new Event("localstorage:updated"));
};

export const getSelectedGender = () => {
  return localStorage.getItem("selectedGender") || "women";
};

export const selectGender = (gender) => {
  localStorage.setItem("selectedGender", gender);
  document.dispatchEvent(new Event("localstorage:updated"));
};
export const getSelectedCategory = () => {
  return localStorage.getItem("selectedCategory") || "clothes";
};

export const selectCategory = (category) => {
  localStorage.setItem("selectedCategory", category);
  document.dispatchEvent(new Event("localstorage:updated"));
};

export const getSelectedTheme = () => {
  return localStorage.getItem("theme") || "light";
};

export const selectTheme = (theme) => {
  localStorage.setItem("theme", theme);
  document.dispatchEvent(new Event("localstorage:updated"));
};

export const getUserData = () => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

export const setUserData = (userData) => {
  localStorage.setItem("userData", JSON.stringify(userData));
  document.dispatchEvent(new Event("localstorage:updated"));
};

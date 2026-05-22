import { translate } from "./i18n.js";

const toastEl = document.getElementById("toast");
let hideTimeout = null;

export const showToast = (message) => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  toastEl.textContent = translate(message);
  toastEl.classList.add("visible");

  hideTimeout = setTimeout(() => {
    toastEl.classList.remove("visible");
    hideTimeout = null;
  }, 3000);
};

import {
  getAccessibilitySettings,
  setAccessibilitySettings,
} from "../utils/storageService.js";
import { registerTemplate, translate } from "../utils/i18n.js";

const DEFAULTS = {
  fontSize: "normal",
  colorScheme: "default",
  imagesOff: false,
};

const CONTENT_IMG_SELECTOR = [
  ".product-tile__img",
  ".product-details__img",
  ".hero-banner__img",
  ".genders__img",
  ".about__img",
  ".not-found__illustration",
].join(",");

const hideContentImages = () => {
  document.querySelectorAll(CONTENT_IMG_SELECTOR).forEach((img) => {
    if (img.dataset.a11yHidden) return;
    img.dataset.a11yHidden = "1";
    img.style.display = "none";
    const placeholder = document.createElement("div");
    placeholder.className = "a11y-img-placeholder";
    placeholder.textContent =
      img.alt || translate("[{{accessibility.imagePlaceholder}}]");
    img.parentNode?.insertBefore(placeholder, img.nextSibling);
  });
};

const showContentImages = () => {
  document.querySelectorAll(CONTENT_IMG_SELECTOR).forEach((img) => {
    if (!img.dataset.a11yHidden) return;
    img.style.display = "";
    delete img.dataset.a11yHidden;
    const next = img.nextElementSibling;
    if (next.classList.contains("a11y-img-placeholder")) next.remove();
  });
  document
    .querySelectorAll(".a11y-img-placeholder")
    .forEach((el) => el.remove());
};

let imgObserver = null;

const startImgObserver = () => {
  if (imgObserver) return;
  imgObserver = new MutationObserver(() => hideContentImages());
  imgObserver.observe(document.body, { childList: true, subtree: true });
};

const stopImgObserver = () => {
  imgObserver?.disconnect();
  imgObserver = null;
};

export const applyAccessibilitySettings = () => {
  const { fontSize, colorScheme, imagesOff } = getAccessibilitySettings();
  const root = document.documentElement;

  root.setAttribute("data-a11y-font", fontSize);
  root.setAttribute("data-a11y-scheme", colorScheme);

  if (imagesOff) {
    hideContentImages();
    startImgObserver();
  } else {
    stopImgObserver();
    showContentImages();
  }
};

const syncControlsToSettings = () => {
  const { fontSize, colorScheme, imagesOff } = getAccessibilitySettings();

  const fontRadio = document.querySelector(
    `input[name="a11y-font"][value="${fontSize}"]`,
  );
  if (fontRadio) fontRadio.checked = true;

  const schemeRadio = document.querySelector(
    `input[name="a11y-scheme"][value="${colorScheme}"]`,
  );
  if (schemeRadio) schemeRadio.checked = true;

  const imagesToggle = document.getElementById("a11y-images-toggle");
  if (imagesToggle) imagesToggle.checked = imagesOff;
};

const saveSettings = (patch) => {
  const current = getAccessibilitySettings();
  setAccessibilitySettings({ ...current, ...patch });
  applyAccessibilitySettings();
};

const initA11yModal = () => {
  document.getElementById("a11y-font-size").addEventListener("change", (e) => {
    if (e.target.name === "a11y-font")
      saveSettings({ fontSize: e.target.value });
  });
  document
    .getElementById("a11y-color-scheme")
    .addEventListener("change", (e) => {
      if (e.target.name === "a11y-scheme")
        saveSettings({ colorScheme: e.target.value });
    });
  document
    .getElementById("a11y-images-toggle")
    .addEventListener("change", (e) => {
      saveSettings({ imagesOff: e.target.checked });
    });
  document
    .getElementById("accessibility-close")
    .addEventListener("click", closeA11yModal);
  document
    .getElementById("accessibility-close-btn")
    .addEventListener("click", closeA11yModal);
  document
    .querySelector(".accessibility-modal__backdrop")
    .addEventListener("click", closeA11yModal);
  document
    .getElementById("accessibility-reset")
    .addEventListener("click", () => {
      setAccessibilitySettings(DEFAULTS);
      applyAccessibilitySettings();
      syncControlsToSettings();
    });
};

export const openA11yModal = () => {
  syncControlsToSettings();
  document.querySelector(".accessibility-modal").classList.add("open");
};

export const closeA11yModal = () => {
  document.querySelector(".accessibility-modal").classList.remove("open");
};

fetch("/src/components/accessibilityModal.html")
  .then((r) => r.text())
  .then((html) => {
    const container = document.getElementById("accessibility-modal-container");
    registerTemplate("accessibility-modal-container", html);
    container.innerHTML = translate(html);
    applyAccessibilitySettings();
    initA11yModal();
    document.addEventListener("i18n:applied", () => {
      initA11yModal();
    });
  })
  .catch((err) => console.error("Error loading accessibility modal:", err));

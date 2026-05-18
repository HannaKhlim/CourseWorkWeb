import { createProductCard } from "./productCard.js";

const SCROLL_AMOUNT = 260;

export const createCarousel = (title, products) => {
  const section = document.createElement("section");
  section.className = "product-carousel";
  section.innerHTML = `
    <div class="product-carousel__header">
      <h2 class="product-carousel__title">${title}</h2>
      <div class="product-carousel__controls">
        <button class="btn-outline product-carousel__btn--prev" aria-label="Scroll left">←</button>
        <button class="btn-outline product-carousel__btn--next" aria-label="Scroll right">→</button>
      </div>
    </div>
    <div class="product-carousel__wrapper">
      <div class="product-carousel__track"></div>
    </div>
  `;

  const track = section.querySelector(".product-carousel__track");
  const prevBtn = section.querySelector(".product-carousel__btn--prev");
  const nextBtn = section.querySelector(".product-carousel__btn--next");

  const updateButtons = () => {
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };

  products.forEach((product) => track.appendChild(createProductCard(product)));

  prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  });

  track.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);
  requestAnimationFrame(updateButtons);

  return section;
};

import { getCart, clearCart } from "../utils/cartService.js";
import { productsApi, ordersApi, couponsApi } from "../utils/api.js";
import { createCarousel } from "./productCarousel.js";
import { getUserData } from "../utils/storageService.js";
import { showToast } from "../utils/toast.js";
import { translate, getCurrentLang } from "../utils/i18n.js";
import { navigateTo } from "../router.js";

const PICKUP_POINTS = {
  moscow: {
    label: "{{checkout.pickupMoscow}}",
    coordinates: [37.6173, 55.7558],
  },
  minsk: { label: "{{checkout.pickupMinsk}}", coordinates: [27.5615, 53.9045] },
};

const updatePrices = (cartItems, products, coupon) => {
  const lang = getCurrentLang();
  const total = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const discountPercent = coupon ? coupon.discountPercent : 0;
  const discountAmount = Math.round(total * (discountPercent / 100));
  const finalPrice = total - discountAmount;

  document.querySelector("[data-value='subtotal']").textContent =
    `${total.toLocaleString(lang)} ₽`;

  const discountValueEl = document.querySelector("[data-value='discount']");
  discountValueEl.textContent = `${discountAmount.toLocaleString(lang)} ₽`;
  const discountRow = discountValueEl.closest(".checkout__order-price-row");

  document.querySelector("[data-value='total']").textContent =
    `${finalPrice.toLocaleString(lang)} ₽`;

  return { total, discountAmount, finalPrice };
};

const initMap = (selectedPickupRef, submitBtn) => {
  const mapContainer = document.getElementById("map");
  if (typeof ymaps3 === "undefined") {
    mapContainer.textContent = "Yandex Maps failed to load.";
    submitBtn.disabled = false;
    return;
  }

  ymaps3.ready.then(async () => {
    const {
      YMap,
      YMapDefaultSchemeLayer,
      YMapDefaultFeaturesLayer,
      YMapMarker,
    } = ymaps3;

    const map = new YMap(mapContainer, {
      location: { center: [33, 54.8], zoom: 5 },
    });

    map.addChild(new YMapDefaultSchemeLayer());
    map.addChild(new YMapDefaultFeaturesLayer());

    const markerElements = {};

    Object.entries(PICKUP_POINTS).forEach(([key, point]) => {
      const marker = document.createElement("div");
      marker.className = "map-marker";
      marker.dataset.key = key;
      marker.textContent = translate(point.label);

      marker.addEventListener("click", () => {
        Object.values(markerElements).forEach((m) =>
          m.classList.remove("map-marker--selected"),
        );
        marker.classList.add("map-marker--selected");

        selectedPickupRef.value = { city: key, coordinates: point.coordinates };

        document.getElementById("selected-pickup").textContent = translate(
          `{{checkout.selectedPickup}} ${point.label}`,
        );

        submitBtn.disabled = false;
      });

      markerElements[key] = marker;

      map.addChild(new YMapMarker({ coordinates: point.coordinates }, marker));
    });
  });
};

export const initCheckoutPage = async () => {
  const emptyMessage = document.getElementById("empty-message");
  const form = document.getElementById("form");
  const carousel = document.getElementById("carousel");
  const orderCta = document.getElementById("form-submit");

  const cart = getCart();

  if (cart.length > 0) {
    emptyMessage.hidden = true;
  }

  const products = (
    await Promise.all(
      cart.map((item) => productsApi.getById(item.productId).catch(() => null)),
    )
  ).filter(Boolean);

  const cartProducts = cart.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? Array(item.quantity).fill(product) : [];
  });

  if (cartProducts.length) {
    carousel.hidden = false;
    carousel.appendChild(
      createCarousel(translate("{{checkout.cartTitle}}"), cartProducts),
    );
  }

  let appliedCoupon = null;
  let priceState = updatePrices(cart, products, appliedCoupon);

  document
    .getElementById("promo-submit")
    .addEventListener("click", async () => {
      const code = document.getElementById("promo-code").value.trim();
      if (!code) return;

      const results = await couponsApi.getAll({ code }).catch(() => []);
      if (!results.length) {
        showToast("{{checkout.couponInvalid}}");
        return;
      }

      appliedCoupon = results[0];
      priceState = updatePrices(cart, products, appliedCoupon);
      showToast("{{checkout.couponApplied}}");
    });

  const selectedPickup = { name: "", coordinates: null };

  initMap(selectedPickup, orderCta);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedPickup.value) return;

    const user = getUserData();
    const order = {
      userId: user.id,
      items: cart,
      totalPrice: priceState.total,
      discountAmount: priceState.discountAmount,
      finalPrice: priceState.finalPrice,
      coupon: appliedCoupon?.code,
      pickupPoint: selectedPickup.value,
      status: "pending",
      createdAt: Date.now(),
    };

    await ordersApi.create(order);
    await clearCart();
    showToast("{{checkout.orderPlaced}}");
    navigateTo("/");
  });
};

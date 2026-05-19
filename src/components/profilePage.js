import { getUserData, clearStorage } from "../utils/storageService.js";
import { productsApi } from "../utils/api.js";
import { createCarousel } from "./productCarousel.js";
import { translate } from "../utils/i18n.js";

export const initProfilePage = async () => {
  const user = getUserData();

  document.getElementById("profile-name").value = user.name ?? "";
  document.getElementById("profile-surname").value = user.surname ?? "";
  document.getElementById("profile-middlename").value = user.middleName ?? "";
  document.getElementById("profile-nickname").value = user.nickname ?? "";
  document.getElementById("profile-email").value = user.email ?? "";
  document.getElementById("profile-phone").value = user.phone ?? "";
  document.getElementById("profile-dob").value = user.dateOfBirth ?? "";

  const adminBtn = document.getElementById("profile-admin");
  if (user.admin) {
    adminBtn.hidden = false;
  }

  document
    .getElementById("profile-logout")
    .addEventListener("click", clearStorage);

  const wishlist = user.wishlist ?? [];
  if (wishlist.length) {
    const products = (
      await Promise.all(
        wishlist.map((id) => productsApi.getById(id).catch(() => null)),
      )
    ).filter(Boolean);
    if (products.length) {
      const container = document.getElementById("profile-wishlist");
      container.appendChild(
        createCarousel(translate("{{profile.wishlistTitle}}"), products),
      );
    }
  }
};

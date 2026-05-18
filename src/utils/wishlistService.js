import { getUserData, setUserData } from "./storageService.js";
import { usersApi } from "./api.js";
import { showToast } from "./toast.js";
import { navigateTo } from "../router.js";

export const checkIfInWishlist = (productId) => {
  return (getUserData()?.wishlist ?? []).includes(String(productId));
};

const updateUserData = async (productId) => {
  const user = getUserData();
  const wishlist = user.wishlist ?? [];
  const inList = wishlist.includes(String(productId));
  const newWishlist = inList
    ? wishlist.filter((id) => id !== String(productId))
    : [...wishlist, String(productId)];
  await usersApi.patch(user.id, { wishlist: newWishlist });
  setUserData({ ...user, wishlist: newWishlist });
  return !inList;
};

export const toggleFavorite = async (event, productId) => {
  event.stopPropagation();

  if (!getUserData()) {
    navigateTo("/login");
    return;
  }

  const added = await updateUserData(productId);
  event.target.classList.toggle("wishlist-icon--added", added);
  showToast(
    added ? "{{profile.wishlistAdded}}" : "{{profile.wishlistRemoved}}",
  );
};

window.toggleFavorite = toggleFavorite;

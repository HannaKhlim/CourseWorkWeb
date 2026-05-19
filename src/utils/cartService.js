import { getUserData, setUserData } from "./storageService.js";
import { usersApi } from "./api.js";
import { showToast } from "./toast.js";
import { navigateTo } from "../router.js";

export const getCart = () => getUserData()?.cart ?? [];

export const checkIfInCart = (productId) =>
  getCart().some((item) => item.productId === String(productId));

export const clearCart = async () => {
  const user = getUserData();
  await usersApi.patch(user.id, { cart: [] });
  setUserData({ ...user, cart: [] });
};

export const setCartQuantity = async (productId, quantity) => {
  const user = getUserData();
  if (!user) {
    navigateTo("/login");
    return;
  }

  const cart = user.cart ?? [];
  const itemInCart = cart.find((item) => item.productId === String(productId));
  let newCart;

  if (!itemInCart && quantity > 0) {
    newCart = [{ productId: String(productId), quantity }, ...cart];
  }
  if (itemInCart && quantity > 0) {
    newCart = cart.map((item) =>
      item.productId === String(productId) ? { ...item, quantity } : item,
    );
  }
  if (itemInCart && quantity <= 0) {
    newCart = cart.filter((item) => item.productId !== String(productId));
  }

  await usersApi.patch(user.id, { cart: newCart });
  setUserData({ ...user, cart: newCart });
  showToast("{{checkout.cartUpdated}}");
};

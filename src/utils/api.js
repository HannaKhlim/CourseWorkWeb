import { sleep } from "./timers.js";

const BASE_URL = "/api";
const loader = document.getElementById("loader");

const request = async (path, options = {}) => {
  try {
    loader.classList.add("visible");
    await sleep(500);
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!response.ok) throw new Error(`API error: ${response.status} ${path}`);
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    loader.classList.remove("visible");
  }
};

const resource = (name) => ({
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/${name}${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/${name}/${id}`),
  create: (data) =>
    request(`/${name}`, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/${name}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  patch: (id, data) =>
    request(`/${name}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id) => request(`/${name}/${id}`, { method: "DELETE" }),
});

export const productsApi = resource("products");
export const ordersApi = resource("orders");
export const usersApi = resource("users");
export const couponsApi = resource("coupons");

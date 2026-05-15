const BASE_URL = "http://localhost:3001";

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error(`API error: ${response.status} ${path}`);
  return response.json();
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
  remove: (id) => request(`/${name}/${id}`, { method: "DELETE" }),
});

export const productsApi = resource("products");
export const usersApi = resource("users");
export const ordersApi = resource("orders");

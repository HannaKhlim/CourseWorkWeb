import { productsApi, ordersApi } from "../utils/api.js";

const PRODUCT_TEMPLATE = {
  price: 1999,
  gender: "women",
  category: "clothes",
  sizes: ["S", "M", "L"],
  brand: "Brand Name",
  name: { ru: "Название", en: "Name" },
  description: { ru: "Описание", en: "Description" },
  color: { ru: "Цвет", en: "Color" },
  materials: { ru: "Материал", en: "Material" },
  origin: { ru: "Страна", en: "Country" },
  image: "https://example.com/image.jpg",
  suggestions: [],
  createdAt: new Date(),
};

const ORDER_TEMPLATE = {
  userId: 1,
  productIds: [1000, 1001],
  status: "pending",
  createdAt: new Date(),
};

const RESOURCES = [
  {
    name: "Products",
    api: productsApi,
    template: PRODUCT_TEMPLATE,
    path: "/products",
  },
  { name: "Orders", api: ordersApi, template: ORDER_TEMPLATE, path: "/orders" },
];

const endpointDefs = ({ api, path, template }) => [
  {
    method: "GET",
    path,
    summary: "Retrieve all items",
    fields: [],
    call: () => api.getAll(),
  },
  {
    method: "GET",
    path: `${path}/{id}`,
    summary: "Retrieve a single item by ID",
    fields: ["id"],
    call: ({ id }) => api.getById(id),
  },
  {
    method: "POST",
    path,
    summary: "Create a new item",
    fields: ["body"],
    template,
    call: ({ body }) => api.create(JSON.parse(body)),
  },
  {
    method: "PUT",
    path: `${path}/{id}`,
    summary: "Update an existing item by ID",
    fields: ["id", "body"],
    template,
    call: ({ id, body }) => api.update(id, JSON.parse(body)),
  },
  {
    method: "DELETE",
    path: `${path}/{id}`,
    summary: "Delete an item by ID",
    fields: ["id"],
    call: ({ id }) => api.remove(id),
  },
];

const endpointHTML = (def) => `
  <div class="endpoint endpoint--${def.method.toLowerCase()}">
    <div class="endpoint__header">
      <span class="endpoint__method endpoint__method--${def.method.toLowerCase()}">${def.method}</span>
      <span class="endpoint__path">${def.path}</span>
      <span class="endpoint__summary">${def.summary}</span>
    </div>
    <div class="endpoint__body" hidden>
      ${def.fields.includes("id") ? `<label class="endpoint__label">ID</label><input class="endpoint__input" placeholder="e.g. 1000" data-field="id" />` : ""}
      ${def.fields.includes("body") ? `<label class="endpoint__label">Request Body (JSON)</label><textarea class="endpoint__textarea" rows="12" data-field="body"></textarea>` : ""}
      <button class="endpoint__execute btn-primary">Execute</button>
      <pre class="endpoint__response-body" hidden></pre>
    </div>
  </div>
`;

const attachListeners = (el, def) => {
  const header = el.querySelector(".endpoint__header");
  const body = el.querySelector(".endpoint__body");
  const btn = el.querySelector(".endpoint__execute");
  const responsePre = el.querySelector(".endpoint__response-body");

  if (def.template) {
    const textarea = body.querySelector("[data-field='body']");
    if (textarea) textarea.value = JSON.stringify(def.template, null, 2);
  }

  header.addEventListener("click", () => {
    const isOpen = !body.hidden;
    body.hidden = isOpen;
    header.classList.toggle("endpoint__header--open", !isOpen);
  });

  btn.addEventListener("click", async () => {
    const values = {};
    body.querySelectorAll("[data-field]").forEach((field) => {
      values[field.dataset.field] = field.value;
    });

    btn.disabled = true;
    btn.textContent = "Loading…";
    responsePre.hidden = false;
    responsePre.className = "endpoint__response-body";
    responsePre.textContent = "";

    try {
      const result = await def.call(values);
      responsePre.textContent = JSON.stringify(result, null, 2);
      responsePre.classList.add("endpoint__response-body--success");
    } catch (err) {
      responsePre.textContent = err.message;
      responsePre.classList.add("endpoint__response-body--error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Execute";
    }
  });
};

export const initAdminPanel = () => {
  const container = document.getElementById("admin-section");
  if (!container) return;

  container.innerHTML = RESOURCES.map(
    (resource) => `
    <section class="admin-section__resource">
      <div class="admin-section__heading">
        <h2 class="admin-section__title">${resource.name}</h2>
      </div>
      ${endpointDefs(resource).map(endpointHTML).join("")}
    </section>
  `,
  ).join("");

  const allDefs = RESOURCES.flatMap((resource) => endpointDefs(resource));
  container
    .querySelectorAll(".endpoint")
    .forEach((el, i) => attachListeners(el, allDefs[i]));
};

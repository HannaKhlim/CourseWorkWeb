import { selectLanguage } from "./storageService.js";

const translations = {
  ru: {
    genders: {
      women: "ЖЕНЩИНЫ",
      men: "МУЖЧИНЫ",
      kids: "ДЕТИ",
    },
    categories: {
      clothes: "Одежда",
      shoes: "Обувь",
      accessories: "Сумки и аксессуары",
      underwear: "Нижнее бельё",
    },
    header: {
      changeTheme: "Сменить тему",
      accessibility: "Слабовидящим",
      changeLanguage: "Сменить язык",
      contactlessDelivery: "Бесконтактная доставка",
      searchPlaceholder: "Поиск",
    },
    footer: {
      info: {
        title: "Информация",
        items: {
          1: "Обработка заказов",
          2: "Информация о доставке",
          3: "Условия оплаты",
          4: "Условия возврата",
          5: "Условия покупки",
          6: "Конфиденциальность и защита информации",
          7: "Реквизиты",
          8: "Информация по уходу",
        },
      },
      support: {
        title: "Служба поддержки",
        items: {
          1: "Чем мы можем вам помочь?",
          2: "Контакты",
          3: "Таблица размеров",
        },
      },
      service: {
        title: "Сервис для клиентов",
        items: {
          1: "Личный кабинет",
          2: "Корзина",
          3: "История заказов",
          4: "Рассылка новостей",
          5: "Поиск",
          6: "Карта сайта",
        },
      },
      deepmag: {
        title: "DEEPMAG",
        items: {
          1: "О нас",
          2: "Карта DEEPMAG",
          3: "Подарочная карта",
          4: "Работа в DEEPMAG",
          5: "Магазины",
        },
      },
      rights: "© 2021 DEEP MAG Все права защищены",
      privacy: "Политика конфиденциальности",
    },
    notFound: {
      title: "Страница не найдена",
      message: "Страница, которую вы ищете, не существует.",
      cta: "ВЕРНУТЬСЯ НА ГЛАВНУЮ",
    },
    productCard: {
      selectSize: "Выбрать размер",
    },
    newArrivals: {
      title: "Новинки этого сезона",
    },
    productDetails: {
      id: "Артикул",
      materials: "Материалы",
      origin: "Страна производства",
      color: "Цвет",
      sizes: "Размеры",
      addToCart: "ДОБАВИТЬ В КОРЗИНУ",
      addToWishlist: "Добавить в избранное",
      suggestions: "Вам может понравиться",
    },
  },
  en: {
    genders: {
      women: "WOMEN",
      men: "MEN",
      kids: "KIDS",
    },
    categories: {
      clothes: "Clothing",
      shoes: "Shoes",
      accessories: "Bags & Accessories",
      underwear: "Underwear",
    },
    header: {
      changeTheme: "Change Theme",
      accessibility: "Accessibility",
      changeLanguage: "Change Language",
      contactlessDelivery: "Contactless Delivery",
      searchPlaceholder: "Search",
    },
    footer: {
      info: {
        title: "Information",
        items: {
          1: "Order Processing",
          2: "Delivery Information",
          3: "Payment Terms",
          4: "Return Policy",
          5: "Purchase Terms",
          6: "Privacy & Data Protection",
          7: "Company Details",
          8: "Care Instructions",
        },
      },
      support: {
        title: "Support",
        items: {
          1: "How can we help you?",
          2: "Contacts",
          3: "Size Guide",
        },
      },
      service: {
        title: "Customer Service",
        items: {
          1: "My Account",
          2: "Cart",
          3: "Order History",
          4: "Newsletter",
          5: "Search",
          6: "Sitemap",
        },
      },
      deepmag: {
        title: "DEEPMAG",
        items: {
          1: "About Us",
          2: "DEEPMAG Map",
          3: "Gift Card",
          4: "Careers at DEEPMAG",
          5: "Stores",
        },
      },
      rights: "© 2021 DEEP MAG All rights reserved",
      privacy: "Privacy Policy",
    },
    notFound: {
      title: "Page Not Found",
      message: "The page you are looking for does not exist.",
      cta: "BACK TO HOME",
    },
    productCard: {
      selectSize: "Select Size",
    },
    newArrivals: {
      title: "New Arrivals",
    },
    productDetails: {
      id: "Article",
      materials: "Materials",
      origin: "Country of Origin",
      color: "Color",
      sizes: "Sizes",
      addToCart: "ADD TO CART",
      addToWishlist: "Add to Wishlist",
      suggestions: "You may also like",
    },
  },
};

const getNestedValue = (obj, path) => {
  let result = obj;
  const keys = path.split(".");

  for (const key of keys) {
    if (result === undefined || result === null) return undefined;
    result = result[key];
  }

  return result;
};

export const getCurrentLang = () => localStorage.getItem("lang") || "ru";

export const translate = (html) => {
  const t = translations[getCurrentLang()];
  return html.replace(
    /\{\{([^}]+)\}\}/g,
    (_, key) => getNestedValue(t, key) ?? key,
  );
};

const templates = new Map();

export const registerTemplate = (id, html) => templates.set(id, html);

export const applyTranslations = () => {
  templates.forEach((html, id) => {
    const el = document.getElementById(id);
    if (el)
      el.replaceChildren(
        document.createRange().createContextualFragment(translate(html)),
      );
  });
  document.dispatchEvent(new Event("i18n:applied"));
};

export const toggleLanguage = () => {
  selectLanguage(getCurrentLang() === "ru" ? "en" : "ru");
  applyTranslations();
};

const translations = {
  ru: {
    header: {
      changeTheme: "Сменить тему",
      accessibility: "Слабовидящим",
      changeLanguage: "Сменить язык",
      contactlessDelivery: "Бесконтактная доставка",
      nav: {
        women: "ЖЕНЩИНЫ",
        men: "МУЖЧИНЫ",
        kids: "ДЕТИ",
        clothes: "Одежда",
        shoes: "Обувь",
        bags: "Сумки и аксессуары",
        underwear: "Нижнее бельё",
        searchPlaceholder: "Поиск",
      },
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
    home: {
      women: "ЖЕНЩИНЫ",
      men: "МУЖЧИНЫ",
      kids: "ДЕТИ",
    },
    productCard: {
      selectSize: "Выбрать размер",
    },
  },
  en: {
    header: {
      changeTheme: "Change Theme",
      accessibility: "Accessibility",
      changeLanguage: "Change Language",
      contactlessDelivery: "Contactless Delivery",
      nav: {
        women: "WOMEN",
        men: "MEN",
        kids: "KIDS",
        clothes: "Clothing",
        shoes: "Shoes",
        bags: "Bags & Accessories",
        underwear: "Underwear",
        searchPlaceholder: "Search",
      },
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
    home: {
      women: "WOMEN",
      men: "MEN",
      kids: "KIDS",
    },
    productCard: {
      selectSize: "Select Size",
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

const getCurrentLang = () => localStorage.getItem("lang") || "ru";

const translate = (html) => {
  const t = translations[getCurrentLang()];
  return html.replace(
    /\{\{([^}]+)\}\}/g,
    (_, key) => getNestedValue(t, key) ?? key,
  );
};

const templates = new Map();

const registerTemplate = (id, html) => templates.set(id, html);

const applyTranslations = () => {
  templates.forEach((html, id) => {
    const el = document.getElementById(id);
    if (el)
      el.replaceChildren(
        document.createRange().createContextualFragment(translate(html)),
      );
  });
  document.dispatchEvent(new Event("i18n:applied"));
};

const toggleLanguage = () => {
  localStorage.setItem("lang", getCurrentLang() === "ru" ? "en" : "ru");
  applyTranslations();
};

window.getCurrentLang = getCurrentLang;
window.translate = translate;
window.registerTemplate = registerTemplate;
window.applyTranslations = applyTranslations;
window.toggleLanguage = toggleLanguage;

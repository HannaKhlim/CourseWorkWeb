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
    about: {
      header: "О компании",
      textHeader: "DEEPMAG",
      textParagraph:
        "— Cеть магазинов мировых брендов ARMANI EXCHANGE, GANT, CALVIN KLEIN, TOMMY HILFIGER, GEOX. Более 10 лет мы являемся официальными представителями всемирно известных брендов в Тюмени, законодателями ярких трендов и модных тенденций.",
    },
    subscribeModule: {
      header:
        "Подпишитесь на рассылку и получите <strong>10%</strong> скидку на Ваш заказ",
      emailPlaceholder: "Эл. почта",
      cta: "ПОДПИСАТЬСЯ",
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
      suggestions: "Вам может понравиться",
    },
    productsControls: {
      sort: "Сортировка",
      newest: "Сначала новые",
      oldest: "Сначала старые",
      mostExpensive: "Сначала дорогие",
      leastExpensive: "Сначала дешёвые",
      brand: "Бренд",
      color: "Цвет",
      size: "Размер",
      clearFilters: "Сбросить фильтры",
    },
    auth: {
      login: {
        title: "Вход",
        nicknameLabel: "Никнейм",
        nicknamePlaceholder: "Введите никнейм",
        passwordLabel: "Пароль",
        passwordPlaceholder: "Введите пароль",
        submitBtn: "ВОЙТИ",
        errorInvalid: "Неверный никнейм или пароль",
      },
      register: {
        title: "Регистрация",
        nameLabel: "Имя",
        namePlaceholder: "Введите имя",
        surnameLabel: "Фамилия",
        surnamePlaceholder: "Введите фамилию",
        middleNameLabel: "Отчество",
        middleNamePlaceholder: "Введите отчество (необязательно)",
        nicknameLabel: "Никнейм",
        nicknamePlaceholder: "Введите никнейм",
        emailLabel: "Эл. почта",
        emailPlaceholder: "Введите адрес эл. почты",
        phoneLabel: "Номер телефона (BY)",
        phonePlaceholder: "+375XXXXXXXXX",
        dobLabel: "Дата рождения",
        passwordLabel: "Пароль",
        passwordPlaceholder: "Введите пароль",
        repeatPasswordLabel: "Повторите пароль",
        repeatPasswordPlaceholder: "Введите пароль ещё раз",
        agreementText: "Я принимаю условия пользовательского соглашения",
        submitBtn: "ЗАРЕГИСТРИРОВАТЬСЯ",
      },
      errors: {
        required: "Обязательное поле",
        nameInvalid: "Введите корректное имя",
        surnameInvalid: "Введите корректную фамилию",
        nicknameFormat: "3–20 символов: буквы, цифры, подчёркивание",
        nicknameTaken: "Никнейм уже занят",
        emailFormat: "Введите корректный адрес эл. почты",
        emailTaken: "Эл. почта уже зарегистрирована",
        phoneFormat: "Формат: +375 (25|29|33|44) XXXXXXX",
        dobMin: "Регистрация доступна с 16 лет",
        passwordStrength:
          "8–20 символов, минимум 1 цифра, 1 спецсимвол, 1 строчная и 1 заглавная буква",
        passwordMismatch: "Пароли не совпадают",
        agreementRequired: "Необходимо принять соглашение",
      },
    },
    profile: {
      title: "Профиль",
      logoutBtn: "ВЫЙТИ",
      adminBtn: "АДМИН",
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
    about: {
      header: "About Us",
      textHeader: "DEEPMAG",
      textParagraph:
        "— A chain of stores of world brands ARMANI EXCHANGE, GANT, CALVIN KLEIN, TOMMY HILFIGER, GEOX. For more than 10 years we have been official representatives of world-famous brands in Tyumen, setting bright trends and fashion trends.",
    },
    subscribeModule: {
      header:
        "Subscribe to newsletter and get <strong>10%</strong> off your order",
      emailPlaceholder: "Email",
      cta: "SUBSCRIBE",
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
      suggestions: "You may also like",
    },
    productsControls: {
      sort: "Sort",
      newest: "Newest",
      oldest: "Oldest",
      mostExpensive: "Most Expensive",
      leastExpensive: "Least Expensive",
      brand: "Brand",
      color: "Color",
      size: "Size",
      clearFilters: "Clear Filters",
    },
    auth: {
      login: {
        title: "Sign In",
        nicknameLabel: "Nickname",
        nicknamePlaceholder: "Enter your nickname",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        submitBtn: "SIGN IN",
        errorInvalid: "Invalid nickname or password",
      },
      register: {
        title: "Create Account",
        nameLabel: "First Name",
        namePlaceholder: "Enter your first name",
        surnameLabel: "Last Name",
        surnamePlaceholder: "Enter your last name",
        middleNameLabel: "Middle Name",
        middleNamePlaceholder: "Enter middle name (optional)",
        nicknameLabel: "Nickname",
        nicknamePlaceholder: "Enter a nickname",
        emailLabel: "Email",
        emailPlaceholder: "Enter your email address",
        phoneLabel: "Phone number (BY)",
        phonePlaceholder: "+375XXXXXXXXX",
        dobLabel: "Date of Birth",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter a password",
        repeatPasswordLabel: "Repeat Password",
        repeatPasswordPlaceholder: "Enter password again",
        agreementText: "I accept the terms of the user agreement",
        submitBtn: "CREATE ACCOUNT",
      },
      errors: {
        required: "This field is required",
        nameInvalid: "Enter a valid first name",
        surnameInvalid: "Enter a valid last name",
        nicknameFormat: "3–20 characters: letters, digits, underscores",
        nicknameTaken: "Nickname is already taken",
        emailFormat: "Enter a valid email address",
        emailTaken: "Email is already registered",
        phoneFormat: "Format: +375 (25|29|33|44) XXXXXXX",
        dobMin: "You must be at least 16 years old to register",
        passwordStrength:
          "8–20 characters, at least 1 digit, 1 special character, 1 lowercase and 1 uppercase letter",
        passwordMismatch: "Passwords do not match",
        agreementRequired: "You must accept the agreement",
      },
    },
    profile: {
      title: "Profile",
      logoutBtn: "LOGOUT",
      adminBtn: "ADMIN",
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

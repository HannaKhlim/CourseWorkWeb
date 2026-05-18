import { usersApi } from "../utils/api.js";
import { setUserData } from "../utils/storageService.js";
import { navigateTo } from "../router.js";
import { translate } from "../utils/i18n.js";
import {
  validateName,
  validateSurname,
  validateNicknameFormat,
  validatePhone,
  validateDob,
  validatePassword,
  validateRepeatPassword,
  validateNicknameAsync,
  validateEmailAsync,
  setError,
  markField,
} from "../utils/registrationValidation.js";
import { generatePassword, generateNickname } from "../utils/generators.js";
import { hashPassword } from "../utils/crypto.js";

const loginFields = {
  nickname: null,
  password: null,
};
const registrationFields = {
  name: null,
  surname: null,
  nickname: null,
  email: null,
  phone: null,
  dob: null,
  password: null,
  repeatPassword: null,
  agreement: null,
};
let isPasswordGenerated = false;

const updateSubmitButton = (button, fields) => {
  const allValid = Object.values(fields).every(Boolean);
  button.disabled = !allValid;
};

const resetForms = () => {
  isPasswordGenerated = false;
  Object.keys(loginFields).forEach((k) => (loginFields[k] = null));
  Object.keys(registrationFields).forEach(
    (k) => (registrationFields[k] = null),
  );
};

export const initLoginPage = () => {
  const loginSubmit = document.getElementById("login-submit");
  const registrationSubmit = document.getElementById("register-submit");

  resetForms();

  const blurValidators = {
    "login-nickname": (value) => {
      const error = value ? null : translate("{{auth.errors.required}}");
      loginFields.nickname = !error;
      markField("login-nickname", error);
      updateSubmitButton(loginSubmit, loginFields);
    },
    "login-password": (value) => {
      const error = value ? null : translate("{{auth.errors.required}}");
      loginFields.password = !error;
      markField("login-password", error);
      updateSubmitButton(loginSubmit, loginFields);
    },
    "reg-name": (value) => {
      const error = validateName(value);
      registrationFields.name = !error;
      markField("reg-name", error);
      updateSubmitButton(registrationSubmit, registrationFields);
    },
    "reg-surname": (value) => {
      const error = validateSurname(value);
      registrationFields.surname = !error;
      markField("reg-surname", error);
      updateSubmitButton(registrationSubmit, registrationFields);
    },
    "reg-nickname": async (value) => {
      registrationFields.nickname = null;
      const error = await validateNicknameAsync(value);
      registrationFields.nickname = error === null;
      markField("reg-nickname", error);
      updateSubmitButton(registrationSubmit, registrationFields);
    },
    "reg-email": async (value) => {
      registrationFields.email = null;
      const error = await validateEmailAsync(value);
      registrationFields.email = error === null;
      markField("reg-email", error);
      updateSubmitButton(registrationSubmit, registrationFields);
    },
    "reg-phone": (value) => {
      const error = validatePhone(value);
      registrationFields.phone = !error;
      markField("reg-phone", error);
      updateSubmitButton(registrationSubmit, registrationFields);
    },
    "reg-dob": (value) => {
      const error = validateDob(value);
      registrationFields.dob = !error;
      markField("reg-dob", error);
      updateSubmitButton(registrationSubmit, registrationFields);
    },
    "reg-password": (value) => {
      const error = validatePassword(value);
      registrationFields.password = !error;
      markField("reg-password", error);
      if (registrationFields.repeatPassword !== null) {
        const repeatEl = document.getElementById("reg-repeat-password");
        const repeatErr = validateRepeatPassword(
          repeatEl?.value || "",
          value,
          isPasswordGenerated,
        );
        registrationFields.repeatPassword = !repeatErr;
        markField("reg-repeat-password", repeatErr);
      }
      updateSubmitButton(registrationSubmit, registrationFields);
    },
    "reg-repeat-password": (value) => {
      if (isPasswordGenerated) return;
      const password = document.getElementById("reg-password").value;
      const error = validateRepeatPassword(
        value,
        password,
        isPasswordGenerated,
      );
      registrationFields.repeatPassword = !error;
      markField("reg-repeat-password", error);
      updateSubmitButton(registrationSubmit, registrationFields);
    },
  };

  Object.entries(blurValidators).forEach(([id, fn]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur", () => fn(el.value));
    el.addEventListener("input", () => markField(id, null));
  });

  const agreement = document.getElementById("reg-agreement");
  agreement.addEventListener("change", () => {
    const err = agreement.checked
      ? null
      : translate("{{auth.errors.agreementRequired}}");
    registrationFields.agreement = agreement.checked;
    setError("reg-agreement", err || "");
    updateSubmitButton(registrationSubmit, registrationFields);
  });

  const repeatPassword = document.getElementById("reg-repeat-password");
  repeatPassword.addEventListener("paste", (e) => e.preventDefault());

  const genNicknameBtn = document.getElementById("btn-gen-nickname");
  genNicknameBtn.addEventListener("click", async () => {
    const nick = generateNickname();
    const input = document.getElementById("reg-nickname");
    input.value = nick;
    registrationFields.nickname = null;
    const err = await validateNicknameAsync(nick);
    registrationFields.nickname = err === null;
    markField("reg-nickname", err);
    updateSubmitButton(registrationSubmit, registrationFields);
  });

  const genPasswordBtn = document.getElementById("btn-gen-password");
  genPasswordBtn.addEventListener("click", () => {
    const password = generatePassword();
    const input = document.getElementById("reg-password");
    input.value = password;
    input.type = "text";
    setTimeout(() => (input.type = "password"), 2000);
    const err = validatePassword(password);
    registrationFields.password = !err;
    markField("reg-password", err);

    isPasswordGenerated = true;
    registrationFields.repeatPassword = true;

    const repeatField = document.getElementById("repeat-password-field");
    repeatField.style.display = "none";

    updateSubmitButton(registrationSubmit, registrationFields);
  });

  const passwordInput = document.getElementById("reg-password");
  passwordInput.addEventListener("input", () => {
    if (isPasswordGenerated) {
      isPasswordGenerated = false;
      registrationFields.repeatPassword = null;
      const repeatField = document.getElementById("repeat-password-field");
      if (repeatField) repeatField.style.display = "";
      updateSubmitButton(registrationSubmit, registrationFields);
    }
  });

  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("registration-general", "");
    if (registrationSubmit.disabled) return;

    const data = new FormData(registerForm);
    const body = {
      name: data.get("name").trim(),
      surname: data.get("surname").trim(),
      middleName: data.get("middleName").trim() || "",
      nickname: data.get("nickname").trim(),
      email: data.get("email").trim(),
      phone: data.get("phone").trim(),
      dateOfBirth: data.get("dateOfBirth"),
      password: data.get("password"),
    };

    try {
      await blurValidators["reg-nickname"](body.nickname);
      await blurValidators["reg-email"](body.email);
      if (registrationSubmit.disabled) return;

      const { password, ...rest } = body;
      const newUser = {
        id: crypto.randomUUID(),
        ...rest,
        passwordHash: await hashPassword(password),
        createdAt: Date.now(),
      };
      const saved = await usersApi.create(newUser);
      const { passwordHash: _, ...publicUser } = saved;
      setUserData(publicUser);
      navigateTo("/profile");
    } catch (error) {
      setError("registration-general", error.message);
    }
  });

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("login-general", "");
    if (loginSubmit.disabled) return;

    try {
      const data = new FormData(loginForm);
      const nickname = data.get("nickname").trim();
      const password = data.get("password");
      const user = (await usersApi.getAll({ nickname }))[0];
      if (!user || (await hashPassword(password)) !== user.passwordHash) {
        throw new Error("invalid");
      }
      const { passwordHash: _, ...publicUser } = user;
      setUserData(publicUser);
      navigateTo("/profile");
    } catch {
      setError("login-general", translate("{{auth.login.errorInvalid}}"));
    }
  });
};

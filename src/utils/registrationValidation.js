import { translate } from "./i18n.js";
import { usersApi } from "./api.js";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = (v) => /^\+375(25|29|33|44)\d{7}$/.test(v);
const isValidNickname = (v) => /^\w{3,20}$/.test(v);
const isValidPassword = (v) =>
  v.length >= 8 &&
  v.length <= 20 &&
  /[a-z]/.test(v) &&
  /[A-Z]/.test(v) &&
  /\d/.test(v) &&
  /[!@#$%^&*()\-_=+[\]{}|;:,.<>?]/.test(v);

const getAge = (dob) => {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

export const validateName = (value) => {
  if (!value.trim()) return translate("{{auth.errors.required}}");
  if (value.trim().length < 2) return translate("{{auth.errors.nameInvalid}}");
  return null;
};

export const validateSurname = (value) => {
  if (!value.trim()) return translate("{{auth.errors.required}}");
  if (value.trim().length < 2)
    return translate("{{auth.errors.surnameInvalid}}");
  return null;
};

export const validateNicknameFormat = (value) => {
  if (!value.trim()) return translate("{{auth.errors.required}}");
  if (!isValidNickname(value))
    return translate("{{auth.errors.nicknameFormat}}");
  return null;
};

export const validateEmail = (value) => {
  if (!value.trim()) return translate("{{auth.errors.required}}");
  if (!isValidEmail(value)) return translate("{{auth.errors.emailFormat}}");
  return null;
};

export const validatePhone = (value) => {
  if (!value.trim()) return translate("{{auth.errors.required}}");
  if (!isValidPhone(value)) return translate("{{auth.errors.phoneFormat}}");
  return null;
};

export const validateDob = (value) => {
  if (!value) return translate("{{auth.errors.required}}");
  if (getAge(value) < 16) return translate("{{auth.errors.dobMin}}");
  return null;
};

export const validatePassword = (value) => {
  if (!value) return translate("{{auth.errors.required}}");
  if (!isValidPassword(value))
    return translate("{{auth.errors.passwordStrength}}");
  return null;
};

export const validateRepeatPassword = (value, passwordValue, isGenerated) => {
  if (isGenerated) return null;
  if (!value) return translate("{{auth.errors.required}}");
  if (value !== passwordValue)
    return translate("{{auth.errors.passwordMismatch}}");
  return null;
};

export const validateNicknameAsync = async (value) => {
  const syncErr = validateNicknameFormat(value);
  if (syncErr) return syncErr;
  try {
    const users = await usersApi.getAll({ nickname: value });
    return users.length === 0
      ? null
      : translate("{{auth.errors.nicknameTaken}}");
  } catch {
    return null;
  }
};

export const validateEmailAsync = async (value) => {
  const syncErr = validateEmail(value);
  if (syncErr) return syncErr;
  try {
    const users = await usersApi.getAll({ email: value });
    return users.length === 0 ? null : translate("{{auth.errors.emailTaken}}");
  } catch {
    return null;
  }
};

export const setError = (fieldId, msg) => {
  const el = document.getElementById(`error-${fieldId}`);
  if (!el) return;
  el.textContent = msg || "";
};

export const setInvalid = (fieldId, isInvalid) => {
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.classList.toggle("invalid", isInvalid);
};

export const markField = (fieldId, errorMsg) => {
  const hasError = !!errorMsg;
  setInvalid(fieldId, hasError);
  setError(fieldId, errorMsg || "");
  return !hasError;
};

import { getUserData, clearStorage } from "../utils/storageService.js";

export const initProfilePage = () => {
  const user = getUserData();

  document.getElementById("profile-name").value = user.name ?? "";
  document.getElementById("profile-surname").value = user.surname ?? "";
  document.getElementById("profile-middlename").value = user.middleName ?? "";
  document.getElementById("profile-nickname").value = user.nickname ?? "";
  document.getElementById("profile-email").value = user.email ?? "";
  document.getElementById("profile-phone").value = user.phone ?? "";
  document.getElementById("profile-dob").value = user.dateOfBirth ?? "";

  const adminBtn = document.getElementById("profile-admin");
  if (user.admin) {
    adminBtn.style.display = "block";
  }

  document
    .getElementById("profile-logout")
    .addEventListener("click", clearStorage);
};

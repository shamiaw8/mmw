import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

export function getLoginPath() {
  return window.location.pathname.includes("/pages/")
    ? "../login.html"
    : "login.html";
}

export function getHomePath() {
  return window.location.pathname.includes("/pages/")
    ? "../index.html"
    : "index.html";
}

export function requireUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = getLoginPath();
        return;
      }

      resolve(user);
    });
  });
}

export function setupLogout() {
  const button = document.getElementById("logoutBtn");
  if (!button) return;

  button.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = getLoginPath();
  });
}

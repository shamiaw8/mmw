import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

export function requireUser(redirectPath = "login.html") {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.replace(redirectPath);
        return;
      }

      resolve(user);
    });
  });
}

export function setupLogout(buttonId = "logoutBtn", redirectPath = "login.html") {
  const button = document.getElementById(buttonId);
  if (!button) return;

  button.addEventListener("click", async () => {
    await signOut(auth);
    window.location.replace(redirectPath);
  });
}


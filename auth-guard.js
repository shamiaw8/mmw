import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

export function requireUser(loginPath = "login.html") {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = loginPath;
        return;
      }

      resolve(user);
    });
  });
}

export function setupLogout(buttonId = "logoutBtn") {
  const button = document.getElementById(buttonId);
  if (!button) return;

  button.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

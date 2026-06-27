import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("authMessage");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("index.html");
  }
});

loginBtn.addEventListener("click", async () => {
  message.textContent = "signing in...";

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    window.location.replace("index.html");
  } catch (error) {
    message.textContent = error.message;
  }
});

signupBtn.addEventListener("click", async () => {
  message.textContent = "creating account...";

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    window.location.replace("index.html");
  } catch (error) {
    message.textContent = error.message;
  }
});

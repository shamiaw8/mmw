import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("authMessage");

document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    window.location.href = "index.html";
  } catch (error) {
    message.textContent = error.message;
  }
});

document.getElementById("signupBtn").addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    window.location.href = "index.html";
  } catch (error) {
    message.textContent = error.message;
  }
});

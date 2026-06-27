import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAz0_uzstqnas1v2VsEdip3iw8bLzpeiQ",
  authDomain: "mermaid-manifestation-world.firebaseapp.com",
  projectId: "mermaid-manifestation-world",
  storageBucket: "mermaid-manifestation-world.firebasestorage.app",
  messagingSenderId: "953285124299",
  appId: "1:953285124299:web:0d5b2873179462ae74bb4e",
  measurementId: "G-SHPB0FQK6F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

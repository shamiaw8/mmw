import { requireUser, setupLogout } from "./auth-guard.js";
import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const app = document.getElementById("app");
let currentUser = null;

const rooms = {
  island: ["🏝️", "the inevitability island", "your private operating system for becoming the version of you who already has it."],
  desires: ["🐚", "desire lagoon", "drop each desire like a pearl. track it from chosen to received."],
  proof: ["🐠", "proof reef", "log signs, wins, synchronicities, compliments, and evidence."],
  identity: ["🌴", "identity island", "build the self-concept that makes your dream life feel normal."],
  ritual: ["🪸", "ritual cave", "affirm, script, act, and release."],
  future: ["⭐", "future lighthouse", "write letters to your future self and save long-range visions."],
  garden: ["🌺", "abundance garden", "plant goals and water them with action."],
  oracle: ["📖", "oracle library", "pull cards, prompts, and affirmations."]
};

const roomButtons = [
  ["desires", "🐚", "desire lagoon"],
  ["proof", "🐠", "proof reef"],
  ["identity", "🌴", "identity island"],
  ["ritual", "🪸", "ritual cave"],
  ["future", "⭐", "future lighthouse"],
  ["garden", "🌺", "abundance garden"],
  ["oracle", "📖", "oracle library"]
];

function getRoute() {
  return window.location.hash.replace("#", "") || "island";
}

function go(route) {
  window.location.hash = route;
}

function userCollection(name) {
  return collection(db, "users", currentUser.uid, name);
}

function userDoc(collectionName, docName) {
  return doc(db, "users", currentUser.uid, collectionName, docName);
}

async function getUserDocs(name) {
  const q = query(userCollection(name), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function addUserDoc(name, data) {
  await addDoc(userCollection(name), {
    ...data,
    createdAt: serverTimestamp()
  });
}

async function deleteUserDoc(name, id) {
  await deleteDoc(doc(db, "users", currentUser.uid, name, id));
}

async function saveJournal(roomName, data) {
  await setDoc(userDoc("journals", roomName), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

async function loadJournal(roomName) {
  const snapshot = await getDoc(userDoc("journals", roomName));
  return snapshot.exists() ? snapshot.data() : {};
}

function layout(content) {
  const route = getRoute();
  const [emoji, title, description] = rooms[route] || rooms.island;

  app.innerHTML = `
    <div class="app-shell">
      <div class="top-bar">
        <button id="homeBtn" class="secondary">home</button>
        <button id="logoutBtn" class="secondary">log out</button>
      </div>

      <header class="hero">
        <p class="eyebrow">inevitability operating system</p>
        <h1>${emoji} ${title}</h1>
        <p class="subtitle">${description}</p>
      </header>

      <section class="room fade-in">
        ${content}
      </section>
    </div>
  `;

  document.getElementById("homeBtn").addEventListener("click", () => go("island"));
  setupLogout("logoutBtn", "login.html");
}

function renderIsland() {
  layout(`
    <div class="island-map">
      ${roomButtons.map(([route, emoji, label]) => `
        <button class="place ${route}" data-route="${route}">
          ${emoji}
          <span>${label}</span>
        </button>
      `).join("")}
      <div class="ocean">🌊 🌊 🌊 🌊 🌊</div>
    </div>
    <p class="hint">choose a place to enter.</p>
  `);

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => go(button.dataset.route));
  });
}

async function renderDesires() {
  layout(`
    <div class="input-row">
      <input id="desireInput" placeholder="add a desire..." />
      <select id="desireRealm">
        <option>love</option>
        <option>money</option>
        <option>career</option>
        <option>beauty</option>
        <option>body</option>
        <option>home</option>
      </select>
      <button id="addDesire">add pearl</button>
    </div>
    <div id="desireList" class="cards-list"><article class="card">loading pearls...</article></div>
  `);

  async function draw() {
    const desires = await getUserDocs("desires");
    const list = document.getElementById("desireList");

    list.innerHTML = desires.length
      ? desires.map((desire) => `
        <article class="card">
          <h3>🐚 ${desire.text}</h3>
          <span class="badge">${desire.realm}</span>
          <span class="badge">${desire.status}</span>
          <button data-delete="${desire.id}" class="delete">delete</button>
        </article>
      `).join("")
      : `<article class="card">no pearls yet.</article>`;

    document.querySelectorAll("[data-delete]").forEach((button) => {
      button.addEventListener("click", async () => {
        await deleteUserDoc("desires", button.dataset.delete);
        await draw();
      });
    });
  }

  document.getElementById("addDesire").addEventListener("click", async () => {
    const input = document.getElementById("desireInput");
    const realm = document.getElementById("desireRealm");

    if (!input.value.trim()) return;

    await addUserDoc("desires", {
      text: input.value.trim(),
      realm: realm.value,
      status: "chosen"
    });

    input.value = "";
    await draw();
  });

  await draw();
}

async function renderProof() {
  layout(`
    <div class="input-row two">
      <input id="proofInput" placeholder="what showed you it’s working?" />
      <button id="addProof">log proof</button>
    </div>
    <div id="proofList" class="cards-list"><article class="card">loading proof...</article></div>
  `);

  async function draw() {
    const proofs = await getUserDocs("proofs");
    const list = document.getElementById("proofList");

    list.innerHTML = proofs.length
      ? proofs.map((proof) => `
        <article class="card">
          <h3>🐠 proof</h3>
          <p>${proof.text}</p>
          <button data-delete="${proof.id}" class="delete">delete</button>
        </article>
      `).join("")
      : `<article class="card">the reef is waiting for evidence.</article>`;

    document.querySelectorAll("[data-delete]").forEach((button) => {
      button.addEventListener("click", async () => {
        await deleteUserDoc("proofs", button.dataset.delete);
        await draw();
      });
    });
  }

  document.getElementById("addProof").addEventListener("click", async () => {
    const input = document.getElementById("proofInput");
    if (!input.value.trim()) return;

    await addUserDoc("proofs", { text: input.value.trim() });
    input.value = "";
    await draw();
  });

  await draw();
}

async function renderJournalRoom(roomName, fields) {
  const savedData = await loadJournal(roomName);

  layout(`
    <div class="journal-grid">
      ${fields.map(([id, title, placeholder]) => `
        <article class="card">
          <h3>${title}</h3>
          <textarea id="${id}" placeholder="${placeholder}">${savedData[id] || ""}</textarea>
        </article>
      `).join("")}
    </div>

    <button id="saveJournalBtn">save ${roomName}</button>
    <p id="saveMessage" class="save-message"></p>
  `);

  document.getElementById("saveJournalBtn").addEventListener("click", async () => {
    const data = {};

    fields.forEach(([id]) => {
      data[id] = document.getElementById(id).value;
    });

    await saveJournal(roomName, data);

    const message = document.getElementById("saveMessage");
    message.textContent = "saved to your island.";
    setTimeout(() => {
      message.textContent = "";
    }, 2000);
  });
}

function renderOracle() {
  const cards = [
    "stop checking. start becoming.",
    "high tide: choose confidence before evidence.",
    "rest is still part of the ritual.",
    "make the dream feel normal today."
  ];

  layout(`
    <div class="oracle-grid">
      <article class="card">
        <h3>daily card</h3>
        <p id="oracleText">pull a card for today’s tide.</p>
        <button id="pullOracle">pull card</button>
      </article>
    </div>
  `);

  document.getElementById("pullOracle").addEventListener("click", () => {
    document.getElementById("oracleText").textContent =
      cards[Math.floor(Math.random() * cards.length)];
  });
}

async function render() {
  if (!currentUser) currentUser = await requireUser("login.html");

  const route = getRoute();

  if (route === "island") renderIsland();
  if (route === "desires") await renderDesires();
  if (route === "proof") await renderProof();

  if (route === "identity") await renderJournalRoom("identity", [
    ["identityText", "i am becoming someone who...", "write your new identity..."],
    ["standardsText", "my standards are...", "what no longer gets access?"],
    ["embodyText", "today i embody...", "how does this version move?"]
  ]);

  if (route === "ritual") await renderJournalRoom("ritual", [
    ["affirmText", "affirm", "what is already true?"],
    ["scriptText", "script", "write from the end..."],
    ["releaseText", "release", "what are you done carrying?"]
  ]);

  if (route === "future") await renderJournalRoom("future", [
    ["futureLetter", "future self letter", "dear future me..."]
  ]);

  if (route === "garden") await renderJournalRoom("garden", [
    ["gardenGoals", "abundance garden", "plant your goals here..."]
  ]);

  if (route === "oracle") renderOracle();
}

window.addEventListener("hashchange", render);
render();

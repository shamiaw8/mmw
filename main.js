import { requireUser, setupLogout } from "./auth-guard.js";

const app = document.getElementById("app");

const rooms = {
  island: {
    title: "the inevitability island",
    emoji: "🏝️",
    description: "your private operating system for becoming the version of you who already has it."
  },
  desires: {
    title: "desire lagoon",
    emoji: "🐚",
    description: "drop each desire like a pearl. track it from chosen to received."
  },
  proof: {
    title: "proof reef",
    emoji: "🐠",
    description: "log signs, wins, synchronicities, compliments, and evidence."
  },
  identity: {
    title: "identity island",
    emoji: "🌴",
    description: "build the self-concept that makes your dream life feel normal."
  },
  ritual: {
    title: "ritual cave",
    emoji: "🪸",
    description: "affirm, script, act, and release."
  },
  future: {
    title: "future lighthouse",
    emoji: "⭐",
    description: "write letters to your future self and save long-range visions."
  },
  garden: {
    title: "abundance garden",
    emoji: "🌺",
    description: "plant goals and water them with action."
  },
  oracle: {
    title: "oracle library",
    emoji: "📖",
    description: "pull cards, prompts, and affirmations."
  }
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

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function setRoute(route) {
  window.location.hash = route;
  render();
}

function getRoute() {
  return window.location.hash.replace("#", "") || "island";
}

function layout(content) {
  const route = getRoute();
  const room = rooms[route] || rooms.island;

  app.innerHTML = `
    <div class="app-shell">
      <div class="top-bar">
        <button class="secondary" onclick="window.location.hash='island'">home</button>
        <button id="logoutBtn" class="secondary">log out</button>
      </div>

      <header class="hero">
        <p class="eyebrow">inevitability operating system</p>
        <h1>${room.emoji} ${room.title}</h1>
        <p class="subtitle">${room.description}</p>
      </header>

      <section class="room fade-in">
        ${content}
      </section>
    </div>
  `;

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
    button.addEventListener("click", () => setRoute(button.dataset.route));
  });
}

function renderDesires() {
  const desires = load("desires", []);

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

    <div id="desireList" class="cards-list"></div>
  `);

  const list = document.getElementById("desireList");

  function draw() {
    list.innerHTML = desires.length
      ? desires.map((desire, index) => `
        <article class="card">
          <h3>🐚 ${desire.text}</h3>
          <span class="badge">${desire.realm}</span>
          <span class="badge">${desire.status}</span>
          <button data-delete="${index}" class="delete">delete</button>
        </article>
      `).join("")
      : `<article class="card">no pearls yet.</article>`;

    document.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        desires.splice(btn.dataset.delete, 1);
        save("desires", desires);
        draw();
      });
    });
  }

  document.getElementById("addDesire").addEventListener("click", () => {
    const input = document.getElementById("desireInput");
    const realm = document.getElementById("desireRealm");

    if (!input.value.trim()) return;

    desires.unshift({
      text: input.value.trim(),
      realm: realm.value,
      status: "chosen"
    });

    save("desires", desires);
    input.value = "";
    draw();
  });

  draw();
}

function renderProof() {
  const proofs = load("proofs", []);

  layout(`
    <div class="input-row two">
      <input id="proofInput" placeholder="what showed you it’s working?" />
      <button id="addProof">log proof</button>
    </div>

    <div id="proofList" class="cards-list"></div>
  `);

  const list = document.getElementById("proofList");

  function draw() {
    list.innerHTML = proofs.length
      ? proofs.map((proof, index) => `
        <article class="card">
          <h3>🐠 proof</h3>
          <p>${proof}</p>
          <button data-delete="${index}" class="delete">delete</button>
        </article>
      `).join("")
      : `<article class="card">the reef is waiting for evidence.</article>`;

    document.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        proofs.splice(btn.dataset.delete, 1);
        save("proofs", proofs);
        draw();
      });
    });
  }

  document.getElementById("addProof").addEventListener("click", () => {
    const input = document.getElementById("proofInput");
    if (!input.value.trim()) return;

    proofs.unshift(input.value.trim());
    save("proofs", proofs);
    input.value = "";
    draw();
  });

  draw();
}

function renderJournalRoom(key, fields) {
  layout(`
    <div class="journal-grid">
      ${fields.map(([id, title, placeholder]) => `
        <article class="card">
          <h3>${title}</h3>
          <textarea id="${id}" placeholder="${placeholder}">${load(id, "")}</textarea>
        </article>
      `).join("")}
    </div>
  `);

  fields.forEach(([id]) => {
    const element = document.getElementById(id);
    element.addEventListener("input", () => save(id, element.value));
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
  await requireUser("login.html");

  const route = getRoute();

  if (route === "island") renderIsland();
  if (route === "desires") renderDesires();
  if (route === "proof") renderProof();
  if (route === "identity") renderJournalRoom("identity", [
    ["identityText", "i am becoming someone who...", "write your new identity..."],
    ["standardsText", "my standards are...", "what no longer gets access?"],
    ["embodyText", "today i embody...", "how does this version move?"]
  ]);
  if (route === "ritual") renderJournalRoom("ritual", [
    ["affirmText", "affirm", "what is already true?"],
    ["scriptText", "script", "write from the end..."],
    ["releaseText", "release", "what are you done carrying?"]
  ]);
  if (route === "future") renderJournalRoom("future", [
    ["futureLetter", "future self letter", "dear future me..."]
  ]);
  if (route === "garden") renderJournalRoom("garden", [
    ["gardenGoals", "abundance garden", "plant your goals here..."]
  ]);
  if (route === "oracle") renderOracle();
}

window.addEventListener("hashchange", render);
render();

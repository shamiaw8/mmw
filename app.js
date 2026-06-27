const islandView = document.getElementById("islandView");
const roomView = document.getElementById("roomView");
const roomContent = document.getElementById("roomContent");
const currentRoom = document.getElementById("currentRoom");

const statuses = ["chosen", "unfolding", "embodied", "received"];

const oracleCards = [
  "stop checking. start becoming.",
  "high tide: choose confidence before evidence.",
  "rest is still part of the ritual.",
  "make the dream feel normal today.",
  "your future self is not impressed by fear. she is amused, then she gets dressed."
];

const prompts = [
  "what would i do today if i knew it was already unfolding?",
  "what proof did i almost ignore?",
  "how can i make my desired life feel familiar today?",
  "what does my future self want me to stop negotiating?",
  "where am i allowed to become softer because i finally trust myself?"
];

const affirmations = [
  "i am safe to receive what i want.",
  "my desires are allowed to arrive easily.",
  "i embody and receive.",
  "my future is already responding.",
  "i am becoming the natural home for my dream life."
];

function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  clock.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function showIsland() {
  islandView.classList.add("active-view");
  roomView.classList.remove("active-view");
  currentRoom.textContent = "island";
  document.body.className = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showRoom(roomName) {
  islandView.classList.remove("active-view");
  roomView.classList.add("active-view");
  currentRoom.textContent = roomName;
  document.body.className = `${roomName}-room`;
  renderRoom(roomName);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderRoom(roomName) {
  const templates = {
    desire: desireTemplate,
    proof: proofTemplate,
    oracle: oracleTemplate,
    identity: identityTemplate,
    ritual: ritualTemplate,
    future: futureTemplate,
    abundance: abundanceTemplate
  };

  roomContent.innerHTML = templates[roomName]();
  setupRoom(roomName);
}

function roomShell(title, intro, inside) {
  return `
    <section class="room">
      <h1 class="room-title">${title}</h1>
      <p class="room-intro">${intro}</p>
      ${inside}
    </section>
  `;
}

function desireTemplate() {
  return roomShell(
    "🐚 desire lagoon",
    "drop each desire here like a pearl. chosen, unfolding, embodied, received.",
    `
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
    `
  );
}

function proofTemplate() {
  return roomShell(
    "🐠 proof reef",
    "log signs, wins, compliments, synchronicities, money, opportunities, and tiny evidence.",
    `
      <div class="input-row">
        <input id="proofInput" placeholder="what showed you it’s working?" />
        <select id="proofType">
          <option>sign</option>
          <option>win</option>
          <option>synchronicity</option>
          <option>compliment</option>
          <option>money</option>
          <option>opportunity</option>
        </select>
        <button id="addProof">log proof</button>
      </div>
      <div id="proofList" class="cards-list"></div>
    `
  );
}

function oracleTemplate() {
  return roomShell(
    "📖 oracle library",
    "pull a card, prompt, or affirmation when the tide needs a little direction.",
    `
      <div class="oracle-grid">
        <article class="card oracle-card">
          <h3>daily card</h3>
          <p id="dailyCard">pull a card for today’s tide.</p>
          <button id="pullCard">pull card</button>
        </article>

        <article class="card oracle-card">
          <h3>journal prompt</h3>
          <p id="prompt">ask the ocean what to write.</p>
          <button id="pullPrompt">new prompt</button>
        </article>

        <article class="card oracle-card">
          <h3>affirmation</h3>
          <p id="affirmation">receive a sentence to repeat.</p>
          <button id="pullAffirmation">new affirmation</button>
        </article>
      </div>
    `
  );
}

function identityTemplate() {
  return roomShell(
    "🌴 identity island",
    "build the version of you who already has it. standards, self-concept, and daily embodiment live here.",
    `
      <div class="journal-grid">
        <article class="card">
          <h3>i am becoming someone who...</h3>
          <textarea id="identityText" placeholder="write your new identity here..."></textarea>
        </article>

        <article class="card">
          <h3>my standards are...</h3>
          <textarea id="standardsText" placeholder="what no longer gets access to you?"></textarea>
        </article>

        <article class="card">
          <h3>today i embody...</h3>
          <textarea id="embodyText" placeholder="how does this version move today?"></textarea>
        </article>
      </div>
    `
  );
}

function ritualTemplate() {
  return roomShell(
    "🪸 ritual cave",
    "your daily practice: affirm, script, act, release. mystical, but with tabs open.",
    `
      <div class="checklist">
        <label>affirm <input type="checkbox" class="ritual-check" /></label>
        <label>script <input type="checkbox" class="ritual-check" /></label>
        <label>act <input type="checkbox" class="ritual-check" /></label>
        <label>release <input type="checkbox" class="ritual-check" /></label>
      </div>

      <p class="score-pill">ritual completion: <span id="ritualScore">0%</span></p>

      <div class="journal-grid">
        <article class="card">
          <h3>affirm</h3>
          <textarea id="affirmText" placeholder="what is already true?"></textarea>
        </article>

        <article class="card">
          <h3>script</h3>
          <textarea id="scriptText" placeholder="write from the end..."></textarea>
        </article>

        <article class="card">
          <h3>release</h3>
          <textarea id="releaseText" placeholder="what are you done carrying?"></textarea>
        </article>
      </div>
    `
  );
}

function futureTemplate() {
  return roomShell(
    "⭐ future lighthouse",
    "write letters to your future self and save the visions that guide you back to the end.",
    `
      <div class="input-row two">
        <input id="letterTitle" placeholder="letter title..." />
        <button id="saveLetter">save letter</button>
      </div>

      <textarea id="letterBody" class="big-textarea" placeholder="dear future me..."></textarea>
      <div id="letterList" class="cards-list"></div>
    `
  );
}

function abundanceTemplate() {
  return roomShell(
    "🌺 abundance garden",
    "plant goals and water them with action. money, career, beauty, love, health, home, creativity.",
    `
      <div class="input-row">
        <input id="goalInput" placeholder="plant a goal..." />
        <select id="goalRealm">
          <option>money</option>
          <option>career</option>
          <option>beauty</option>
          <option>love</option>
          <option>health</option>
          <option>home</option>
          <option>creativity</option>
        </select>
        <button id="addGoal">plant</button>
      </div>

      <div id="goalList" class="cards-list"></div>
    `
  );
}

function setupRoom(roomName) {
  if (roomName === "desire") setupDesires();
  if (roomName === "proof") setupProofs();
  if (roomName === "oracle") setupOracle();
  if (roomName === "identity") setupTextareas(["identityText", "standardsText", "embodyText"]);
  if (roomName === "ritual") setupRitual();
  if (roomName === "future") setupLetters();
  if (roomName === "abundance") setupGoals();
}

function setupDesires() {
  document.getElementById("addDesire").addEventListener("click", () => {
    const input = document.getElementById("desireInput");
    const realm = document.getElementById("desireRealm");

    if (!input.value.trim()) return;

    const desires = load("desires", []);
    desires.unshift({
      text: input.value.trim(),
      realm: realm.value,
      status: "chosen",
      date: new Date().toLocaleDateString()
    });

    save("desires", desires);
    input.value = "";
    renderDesires();
  });

  renderDesires();
}

function renderDesires() {
  const desires = load("desires", []);
  const list = document.getElementById("desireList");
  list.innerHTML = "";

  if (!desires.length) {
    list.innerHTML = `<article class="empty">no pearls yet. add the first one.</article>`;
    return;
  }

  desires.forEach((desire, index) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h3>🐚 ${desire.text}</h3>
      <span class="badge">${desire.realm}</span>
      <span class="badge">${desire.status}</span>
      <span class="badge">${desire.date}</span>

      <select>
        ${statuses.map(status => `
          <option ${status === desire.status ? "selected" : ""}>${status}</option>
        `).join("")}
      </select>

      <button class="delete">delete</button>
    `;

    card.querySelector("select").addEventListener("change", event => {
      desires[index].status = event.target.value;
      save("desires", desires);
      renderDesires();
    });

    card.querySelector(".delete").addEventListener("click", () => {
      desires.splice(index, 1);
      save("desires", desires);
      renderDesires();
    });

    list.appendChild(card);
  });
}

function setupProofs() {
  document.getElementById("addProof").addEventListener("click", () => {
    const input = document.getElementById("proofInput");
    const type = document.getElementById("proofType");

    if (!input.value.trim()) return;

    const proofs = load("proofs", []);
    proofs.unshift({
      text: input.value.trim(),
      type: type.value,
      date: new Date().toLocaleDateString()
    });

    save("proofs", proofs);
    input.value = "";
    renderProofs();
  });

  renderProofs();
}

function renderProofs() {
  const proofs = load("proofs", []);
  const list = document.getElementById("proofList");
  list.innerHTML = "";

  if (!proofs.length) {
    list.innerHTML = `<article class="empty">the reef is waiting for its first sparkle.</article>`;
    return;
  }

  proofs.forEach((proof, index) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h3>🐠 ${proof.type}</h3>
      <p>${proof.text}</p>
      <span class="badge">${proof.date}</span>
      <button class="delete">delete</button>
    `;

    card.querySelector(".delete").addEventListener("click", () => {
      proofs.splice(index, 1);
      save("proofs", proofs);
      renderProofs();
    });

    list.appendChild(card);
  });
}

function setupOracle() {
  document.getElementById("pullCard").addEventListener("click", () => {
    document.getElementById("dailyCard").textContent = randomFrom(oracleCards);
  });

  document.getElementById("pullPrompt").addEventListener("click", () => {
    document.getElementById("prompt").textContent = randomFrom(prompts);
  });

  document.getElementById("pullAffirmation").addEventListener("click", () => {
    document.getElementById("affirmation").textContent = randomFrom(affirmations);
  });
}

function setupTextareas(ids) {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    element.value = load(id, "");
    element.addEventListener("input", () => save(id, element.value));
  });
}

function setupRitual() {
  setupTextareas(["affirmText", "scriptText", "releaseText"]);

  const checks = document.querySelectorAll(".ritual-check");
  const savedChecks = load("ritualChecks", []);

  function updateRitualScore() {
    const values = [...checks].map((check) => check.checked);
    const completed = values.filter(Boolean).length;
    const score = Math.round((completed / values.length) * 100);

    document.getElementById("ritualScore").textContent = `${score}%`;
    save("ritualChecks", values);
  }

  checks.forEach((check, index) => {
    check.checked = savedChecks[index] || false;
    check.addEventListener("change", updateRitualScore);
  });

  updateRitualScore();
}

function setupLetters() {
  document.getElementById("saveLetter").addEventListener("click", () => {
    const title = document.getElementById("letterTitle");
    const body = document.getElementById("letterBody");

    if (!title.value.trim() || !body.value.trim()) return;

    const letters = load("letters", []);
    letters.unshift({
      title: title.value.trim(),
      body: body.value.trim(),
      date: new Date().toLocaleDateString()
    });

    save("letters", letters);
    title.value = "";
    body.value = "";
    renderLetters();
  });

  renderLetters();
}

function renderLetters() {
  const letters = load("letters", []);
  const list = document.getElementById("letterList");
  list.innerHTML = "";

  if (!letters.length) {
    list.innerHTML = `<article class="empty">no letters yet. the lighthouse is dramatic but patient.</article>`;
    return;
  }

  letters.forEach((letter, index) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h3>${letter.title}</h3>
      <span class="badge">${letter.date}</span>
      <p>${letter.body}</p>
      <button class="delete">delete</button>
    `;

    card.querySelector(".delete").addEventListener("click", () => {
      letters.splice(index, 1);
      save("letters", letters);
      renderLetters();
    });

    list.appendChild(card);
  });
}

function setupGoals() {
  document.getElementById("addGoal").addEventListener("click", () => {
    const input = document.getElementById("goalInput");
    const realm = document.getElementById("goalRealm");

    if (!input.value.trim()) return;

    const goals = load("goals", []);
    goals.unshift({
      text: input.value.trim(),
      realm: realm.value,
      watered: 0,
      date: new Date().toLocaleDateString()
    });

    save("goals", goals);
    input.value = "";
    renderGoals();
  });

  renderGoals();
}

function renderGoals() {
  const goals = load("goals", []);
  const list = document.getElementById("goalList");
  list.innerHTML = "";

  if (!goals.length) {
    list.innerHTML = `<article class="empty">no goals planted yet. the garden is waiting to be extra.</article>`;
    return;
  }

  goals.forEach((goal, index) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h3>🌺 ${goal.text}</h3>
      <span class="badge">${goal.realm}</span>
      <span class="badge">${goal.date}</span>
      <p class="water-count">watered ${goal.watered} times</p>
      <button class="water">water goal</button>
      <button class="delete">delete</button>
    `;

    card.querySelector(".water").addEventListener("click", () => {
      goals[index].watered += 1;
      save("goals", goals);
      renderGoals();
    });

    card.querySelector(".delete").addEventListener("click", () => {
      goals.splice(index, 1);
      save("goals", goals);
      renderGoals();
    });

    list.appendChild(card);
  });
}

document.querySelectorAll(".place").forEach((place) => {
  place.addEventListener("click", () => {
    showRoom(place.dataset.room);
  });
});

document.getElementById("backToIsland").addEventListener("click", showIsland);

updateClock();
setInterval(updateClock, 1000);

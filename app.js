const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const places = {
  "mermaid home": {
    title: "mermaid home",
    description: "welcome back to your world. this is your soft landing place before choosing where your energy wants to go."
  },
  "identity island": {
    title: "identity island",
    description: "build the version of you who already has it. this is where your standards, self-concept, and daily embodiment live."
  },
  "desire lagoon": {
    title: "desire lagoon",
    description: "drop every desire here like a pearl. each pearl gets a realm, status, and its own little glow-up arc."
  },
  "proof reef": {
    title: "proof reef",
    description: "collect evidence that your world is responding. small signs, big wins, synchronicities, compliments, opportunities, all of it."
  },
  "ritual cave": {
    title: "ritual cave",
    description: "your daily practice lives here: affirm, script, act, release, and return to the end. very mystical. very organized."
  },
  "future lighthouse": {
    title: "future lighthouse",
    description: "write letters to your future self, set long-range visions, and let the lighthouse remind you where you are going."
  },
  "abundance garden": {
    title: "abundance garden",
    description: "plant money, career, creativity, beauty, love, health, and home goals here. water them with action and attention."
  },
  "oracle library": {
    title: "oracle library",
    description: "a library of prompts, transmissions, affirmations, and daily cards for whatever realm you are manifesting."
  }
};

const statuses = ["chosen", "unfolding", "embodied", "received"];

const oracles = [
  "today’s tide says: stop checking. start becoming.",
  "your next level does not need panic. it needs repetition.",
  "you are not behind. you are being arranged.",
  "make one tiny choice today that proves the dream is normal.",
  "the sign is not the point. your embodiment is the portal.",
  "high tide: choose confidence before evidence.",
  "soft tide: rest is still part of the ritual.",
  "your future self is not impressed by fear. she is amused, then she gets dressed."
];

const journalPrompts = [
  "what would i do today if i fully believed this was already unfolding?",
  "what evidence did i ignore because it felt too small?",
  "what part of me is ready to stop auditioning and start receiving?",
  "how can i make my desired life feel familiar today?",
  "what would the most relaxed version of me decide next?",
  "what became sexier in my discipline, standards, or energy this week?"
];

const affirmations = [
  "i am safe to receive what i want.",
  "my desires are allowed to arrive easily.",
  "i am becoming the natural home for my dream life.",
  "everything i want recognizes me.",
  "i do not chase. i embody and receive.",
  "my future is already responding to who i am becoming."
];

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

function updateClock() {
  $("#clock").textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function setPlace(placeName) {
  const place = places[placeName];

  $("#placeTitle").textContent = place.title;
  $("#placeDescription").textContent = place.description;
  $("#focusRealm").textContent = place.title.split(" ")[0];

  $$(".location").forEach((button) => {
    button.classList.toggle("active", button.dataset.place === placeName);
  });

  save("current-place", placeName);

  const sectionMap = {
    "desire lagoon": "#desireLagoon",
    "proof reef": "#proofReef",
    "oracle library": "#oracleLibrary"
  };

  if (sectionMap[placeName]) {
    document.querySelector(sectionMap[placeName]).scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function setupMap() {
  $$(".location").forEach((button) => {
    button.addEventListener("click", () => setPlace(button.dataset.place));
  });

  $("#resetPlace").addEventListener("click", () => setPlace("mermaid home"));

  $("#dailyOracle").addEventListener("click", () => {
    $("#oracleText").textContent = randomFrom(oracles);
  });

  setPlace(load("current-place", "mermaid home"));
}

function renderDesires() {
  const desires = load("desires", []);
  const list = $("#desireList");
  list.innerHTML = "";

  $("#pearlCount").textContent = desires.length;
  $("#receivedCount").textContent = desires.filter((desire) => desire.status === "received").length;

  if (desires.length === 0) {
    list.innerHTML = `<div class="empty">no pearls yet. add your first desire and let the lagoon get dramatic.</div>`;
    return;
  }

  desires.forEach((desire, index) => {
    const card = document.createElement("article");
    card.className = "item-card pearl";

    card.innerHTML = `
      <h3>🐚 ${desire.text}</h3>
      <div class="meta-row">
        <span class="badge">${desire.realm}</span>
        <span class="badge">${desire.status}</span>
        <span class="badge">${desire.date}</span>
      </div>

      <select class="status-select">
        ${statuses.map((status) => `
          <option ${status === desire.status ? "selected" : ""}>${status}</option>
        `).join("")}
      </select>

      <div class="card-actions">
        <button class="secondary embody">embody</button>
        <button class="delete">delete</button>
      </div>
    `;

    card.querySelector(".status-select").addEventListener("change", (event) => {
      desires[index].status = event.target.value;
      save("desires", desires);
      renderDesires();
    });

    card.querySelector(".embody").addEventListener("click", () => {
      desires[index].status = "embodied";
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

function setupDesires() {
  $("#addDesire").addEventListener("click", () => {
    const input = $("#desireInput");
    const realm = $("#desireRealm");
    const text = input.value.trim();

    if (!text) return;

    const desires = load("desires", []);
    desires.unshift({
      text,
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

function renderProofs() {
  const proofs = load("proofs", []);
  const list = $("#proofList");
  list.innerHTML = "";

  $("#proofCount").textContent = proofs.length;

  if (proofs.length === 0) {
    list.innerHTML = `<div class="empty">no proof yet. the reef is waiting for evidence, even tiny sparkly evidence.</div>`;
    return;
  }

  proofs.forEach((proof, index) => {
    const card = document.createElement("article");
    card.className = "item-card proof";

    card.innerHTML = `
      <h3>🐠 ${proof.type}</h3>
      <p>${proof.text}</p>
      <div class="meta-row">
        <span class="badge">${proof.date}</span>
      </div>

      <div class="card-actions">
        <button class="delete">delete</button>
      </div>
    `;

    card.querySelector(".delete").addEventListener("click", () => {
      proofs.splice(index, 1);
      save("proofs", proofs);
      renderProofs();
    });

    list.appendChild(card);
  });
}

function setupProofs() {
  $("#addProof").addEventListener("click", () => {
    const input = $("#proofInput");
    const type = $("#proofType");
    const text = input.value.trim();

    if (!text) return;

    const proofs = load("proofs", []);
    proofs.unshift({
      text,
      type: type.value,
      date: new Date().toLocaleDateString()
    });

    save("proofs", proofs);
    input.value = "";
    renderProofs();
  });

  renderProofs();
}

function setupOracleLibrary() {
  $("#pullDailyCard").addEventListener("click", () => {
    $("#dailyCard").textContent = randomFrom(oracles);
  });

  $("#pullPrompt").addEventListener("click", () => {
    $("#journalPrompt").textContent = randomFrom(journalPrompts);
  });

  $("#pullAffirmation").addEventListener("click", () => {
    $("#affirmation").textContent = randomFrom(affirmations);
  });
}

updateClock();
setInterval(updateClock, 1000);

setupMap();
setupDesires();
setupProofs();
setupOracleLibrary();

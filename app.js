const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const places = {
  "mermaid home": {
    title: "mermaid home",
    focus: "home",
    description:
      "welcome back to your world. this is your soft landing place before choosing where your energy wants to go."
  },
  "identity island": {
    title: "identity island",
    focus: "identity",
    description:
      "build the version of you who already has it. this is where your standards, self-concept, and daily embodiment live."
  },
  "desire lagoon": {
    title: "desire lagoon",
    focus: "desires",
    description:
      "drop every desire here like a pearl. each desire gets a realm, a status, and a future-self note."
  },
  "proof reef": {
    title: "proof reef",
    focus: "proof",
    description:
      "collect evidence that your world is responding. small signs, big wins, synchronicities, compliments, opportunities, all of it."
  },
  "ritual cave": {
    title: "ritual cave",
    focus: "ritual",
    description:
      "your daily practice lives here: affirm, script, act, release, and return to the end."
  },
  "future lighthouse": {
    title: "future lighthouse",
    focus: "future",
    description:
      "write letters to your future self, set long-range visions, and let the lighthouse remind you where you are going."
  },
  "abundance garden": {
    title: "abundance garden",
    focus: "abundance",
    description:
      "plant money, career, creativity, beauty, love, health, and home goals here. water them with action and attention."
  },
  "oracle library": {
    title: "oracle library",
    focus: "oracle",
    description:
      "a library of prompts, transmissions, affirmations, and daily cards for whatever realm you are manifesting."
  }
};

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

const desireStatuses = ["chosen", "unfolding", "embodied", "received"];

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function todayString() {
  return new Date().toLocaleDateString();
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
  $("#focusRealm").textContent = place.focus;

  $$(".location").forEach((button) => {
    button.classList.toggle("active", button.dataset.place === placeName);
  });

  $("#desireSection").classList.toggle("hidden", placeName !== "desire lagoon");
  $("#proofSection").classList.toggle("hidden", placeName !== "proof reef");

  save("current-place", placeName);
}

function setupMap() {
  $$(".location").forEach((button) => {
    button.addEventListener("click", () => {
      setPlace(button.dataset.place);
    });
  });

  $("#resetPlace").addEventListener("click", () => {
    setPlace("mermaid home");
  });

  $("#dailyOracle").addEventListener("click", () => {
    const random = Math.floor(Math.random() * oracles.length);
    $("#oracleText").textContent = oracles[random];
  });

  setPlace(load("current-place", "mermaid home"));
}

/* v0.2 desire lagoon */

function renderDesires() {
  const desires = load("mmw-desires", []);
  const list = $("#desireList");
  list.innerHTML = "";

  if (desires.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        no pearls in the lagoon yet. add your first desire.
      </div>
    `;
    return;
  }

  desires.forEach((desire, index) => {
    const card = document.createElement("article");
    card.className = "list-card";

    card.innerHTML = `
      <div class="list-top">
        <strong>${desire.text}</strong>
        <button class="small-btn delete-btn">delete</button>
      </div>

      <div class="meta-row">
        <span class="badge">${desire.realm}</span>
        <span class="badge">${desire.date}</span>
      </div>

      <select class="status-select">
        ${desireStatuses
          .map(
            (status) =>
              `<option value="${status}" ${status === desire.status ? "selected" : ""}>${status}</option>`
          )
          .join("")}
      </select>

      <textarea class="card-note" placeholder="future-self note...">${desire.note || ""}</textarea>

      <div class="mini-actions">
        <button class="small-btn received-btn">mark received</button>
      </div>
    `;

    card.querySelector(".status-select").addEventListener("change", (event) => {
      desires[index].status = event.target.value;
      save("mmw-desires", desires);
      renderDesires();
    });

    card.querySelector(".card-note").addEventListener("input", (event) => {
      desires[index].note = event.target.value;
      save("mmw-desires", desires);
    });

    card.querySelector(".received-btn").addEventListener("click", () => {
      desires[index].status = "received";
      save("mmw-desires", desires);
      renderDesires();
    });

    card.querySelector(".delete-btn").addEventListener("click", () => {
      desires.splice(index, 1);
      save("mmw-desires", desires);
      renderDesires();
    });

    list.appendChild(card);
  });
}

function setupDesireLagoon() {
  $("#addDesire").addEventListener("click", () => {
    const input = $("#desireInput");
    const realm = $("#desireRealm").value;
    const text = input.value.trim();

    if (!text) return;

    const desires = load("mmw-desires", []);

    desires.unshift({
      text,
      realm,
      status: "chosen",
      date: todayString(),
      note: ""
    });

    save("mmw-desires", desires);
    input.value = "";
    renderDesires();
  });

  renderDesires();
}

/* v0.3 proof reef */

function renderProofs() {
  const proofs = load("mmw-proofs", []);
  const list = $("#proofList");
  list.innerHTML = "";

  const today = todayString();
  const todayProofs = proofs.filter((proof) => proof.date === today);

  $("#proofTotal").textContent = proofs.length;
  $("#proofToday").textContent = todayProofs.length;

  if (proofs.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        proof reef is empty. log the first little wink from reality.
      </div>
    `;
    return;
  }

  proofs.forEach((proof, index) => {
    const card = document.createElement("article");
    card.className = "list-card";

    card.innerHTML = `
      <div class="list-top">
        <strong>${proof.text}</strong>
        <button class="small-btn delete-btn">delete</button>
      </div>

      <div class="meta-row">
        <span class="badge">${proof.category}</span>
        <span class="badge">${proof.date}</span>
      </div>
    `;

    card.querySelector(".delete-btn").addEventListener("click", () => {
      proofs.splice(index, 1);
      save("mmw-proofs", proofs);
      renderProofs();
    });

    list.appendChild(card);
  });
}

function setupProofReef() {
  $("#addProof").addEventListener("click", () => {
    const input = $("#proofInput");
    const category = $("#proofCategory").value;
    const text = input.value.trim();

    if (!text) return;

    const proofs = load("mmw-proofs", []);

    proofs.unshift({
      text,
      category,
      date: todayString()
    });

    save("mmw-proofs", proofs);
    input.value = "";
    renderProofs();
  });

  renderProofs();
}

updateClock();
setInterval(updateClock, 1000);

setupMap();
setupDesireLagoon();
setupProofReef();

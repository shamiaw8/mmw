const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const places = {
  "mermaid home": {
    title: "mermaid home",
    description:
      "welcome back to your world. this is your soft landing place before choosing where your energy wants to go."
  },
  "identity island": {
    title: "identity island",
    description:
      "build the version of you who already has it. this is where your standards, self-concept, and daily embodiment live."
  },
  "desire lagoon": {
    title: "desire lagoon",
    description:
      "drop every desire here like a pearl. each pearl can have a realm, status, and tiny little main-character folder energy."
  },
  "proof reef": {
    title: "proof reef",
    description:
      "collect evidence that your world is responding. small signs, big wins, synchronicities, compliments, opportunities, all of it."
  },
  "ritual cave": {
    title: "ritual cave",
    description:
      "your daily practice lives here: affirm, script, act, release, and return to the end."
  },
  "future lighthouse": {
    title: "future lighthouse",
    description:
      "write letters to your future self, set long-range visions, and let the lighthouse remind you where you are going."
  },
  "abundance garden": {
    title: "abundance garden",
    description:
      "plant money, career, creativity, beauty, love, health, and home goals here."
  },
  "oracle library": {
    title: "oracle library",
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

const statuses = ["chosen", "unfolding", "embodied", "received"];

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
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

  const desirePanel = $("#desireLagoonApp");
  if (placeName === "desire lagoon") {
    desirePanel.classList.remove("hidden");
  } else {
    desirePanel.classList.add("hidden");
  }

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

function getDesires() {
  return load("mmw-desires", []);
}

function setDesires(desires) {
  save("mmw-desires", desires);
}

function renderDesires() {
  const desires = getDesires();
  const list = $("#desireList");

  list.innerHTML = "";

  $("#desireCount").textContent = desires.length;
  $("#receivedCount").textContent = desires.filter((d) => d.status === "received").length;
  $("#embodiedCount").textContent = desires.filter((d) => d.status === "embodied").length;

  if (desires.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        no pearls yet. add your first desire and let the lagoon get nosy.
      </div>
    `;
    return;
  }

  desires.forEach((desire, index) => {
    const pearl = document.createElement("article");
    pearl.className = "pearl";

    pearl.innerHTML = `
      <div class="pearl-top">
        <div>
          <div class="pearl-title">🐚 ${desire.text}</div>
          <div class="pearl-meta">
            <span class="pearl-badge">realm: ${desire.realm}</span>
            <span class="pearl-badge">status: ${desire.status}</span>
            <span class="pearl-badge">added: ${desire.date}</span>
          </div>
        </div>
        <button class="pearl-delete">delete</button>
      </div>

      <div class="pearl-controls">
        <select class="status-select">
          ${statuses
            .map(
              (status) =>
                `<option value="${status}" ${status === desire.status ? "selected" : ""}>${status}</option>`
            )
            .join("")}
        </select>
      </div>
    `;

    pearl.querySelector(".status-select").addEventListener("change", (event) => {
      desires[index].status = event.target.value;
      setDesires(desires);
      renderDesires();
    });

    pearl.querySelector(".pearl-delete").addEventListener("click", () => {
      desires.splice(index, 1);
      setDesires(desires);
      renderDesires();
    });

    list.appendChild(pearl);
  });
}

function setupDesireLagoon() {
  $("#addDesire").addEventListener("click", () => {
    const input = $("#desireInput");
    const realm = $("#desireRealm").value;
    const text = input.value.trim();

    if (!text) return;

    const desires = getDesires();

    desires.unshift({
      text,
      realm,
      status: "chosen",
      date: new Date().toLocaleDateString()
    });

    setDesires(desires);
    input.value = "";
    renderDesires();
  });

  $("#desireInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      $("#addDesire").click();
    }
  });

  renderDesires();
}

updateClock();
setInterval(updateClock, 1000);

setupMap();
setupDesireLagoon();

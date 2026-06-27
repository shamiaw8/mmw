const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const transmissions = [
  "your future self is not far away. she is installed through repetition.",
  "nothing is random. even your discipline is flirting with destiny.",
  "the desire picked you because you are available for the upgrade.",
  "act like the version of you who already has the evidence.",
  "you are not forcing it. you are becoming the place where it lands.",
  "make your future feel familiar today."
];

const identityStatements = [
  "i am already becoming undeniable.",
  "i am the version of me who receives with ease.",
  "i move like the outcome is already handled.",
  "i do not chase. i embody and attract.",
  "i am safe to become visible, chosen, wealthy, loved, and free.",
  "my standards are the doorway to my dream life."
];

const statuses = ["chosen", "unfolding", "embodied", "received"];

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

function setupTabs() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((button) => button.classList.remove("active"));
      $$(".page").forEach((page) => page.classList.remove("active"));

      tab.classList.add("active");
      $(`#${tab.dataset.tab}`).classList.add("active");
    });
  });
}

function setupHome() {
  $("#newTransmission").addEventListener("click", () => {
    $("#transmission").textContent = randomFrom(transmissions);
  });

  const realm = $("#realm");
  realm.value = load("realm", "love");
  $("#realmText").textContent = `current realm: ${realm.value}`;

  realm.addEventListener("change", () => {
    save("realm", realm.value);
    $("#realmText").textContent = `current realm: ${realm.value}`;
  });

  const savedAlign = load("alignment", []);

  $$(".align").forEach((box, index) => {
    box.checked = savedAlign[index] || false;

    box.addEventListener("change", () => {
      const values = [...$$(".align")].map((item) => item.checked);
      save("alignment", values);
      updateAlignment();
    });
  });

  const oceanNote = $("#oceanNote");
  oceanNote.value = load("ocean-note", "");
  oceanNote.addEventListener("input", () => save("ocean-note", oceanNote.value));

  updateAlignment();
}

function updateAlignment() {
  const boxes = [...$$(".align")];
  const checked = boxes.filter((box) => box.checked).length;
  const percent = Math.round((checked / boxes.length) * 100);
  $("#score").textContent = `${percent}%`;
}

function setupIdentity() {
  $("#identityButton").addEventListener("click", () => {
    $("#identityStatement").textContent = randomFrom(identityStatements);
  });

  ["identityInput", "standardsInput"].forEach((id) => {
    const element = $(`#${id}`);
    element.value = load(id, "");
    element.addEventListener("input", () => save(id, element.value));
  });
}

function renderDesires() {
  const desires = load("desires", []);
  const list = $("#desireList");
  list.innerHTML = "";

  desires.forEach((desire, index) => {
    const item = document.createElement("div");
    item.className = "list-item";

    item.innerHTML = `
      <div class="list-top">
        <strong>${desire.text}</strong>
        <button class="delete">x</button>
      </div>

      <span class="badge">status: ${desire.status}</span>

      <select>
        ${statuses.map((status) => `
          <option ${status === desire.status ? "selected" : ""}>${status}</option>
        `).join("")}
      </select>
    `;

    item.querySelector("select").addEventListener("change", (event) => {
      desires[index].status = event.target.value;
      save("desires", desires);
      renderDesires();
    });

    item.querySelector(".delete").addEventListener("click", () => {
      desires.splice(index, 1);
      save("desires", desires);
      renderDesires();
    });

    list.appendChild(item);
  });
}

function setupDesires() {
  $("#addDesire").addEventListener("click", () => {
    const input = $("#desireInput");
    const text = input.value.trim();

    if (!text) return;

    const desires = load("desires", []);
    desires.unshift({
      text,
      status: "chosen"
    });

    save("desires", desires);
    input.value = "";
    renderDesires();
  });

  renderDesires();
}

function setupRitual() {
  ["affirmText", "scriptText", "actText", "releaseText"].forEach((id) => {
    const element = $(`#${id}`);
    element.value = load(id, "");
    element.addEventListener("input", () => save(id, element.value));
  });
}

function renderProofs() {
  const proofs = load("proofs", []);
  const list = $("#proofList");
  list.innerHTML = "";

  $("#proofCount").textContent = proofs.length;

  proofs.forEach((proof, index) => {
    const item = document.createElement("div");
    item.className = "list-item";

    item.innerHTML = `
      <div class="list-top">
        <span>${proof}</span>
        <button class="delete">x</button>
      </div>
    `;

    item.querySelector(".delete").addEventListener("click", () => {
      proofs.splice(index, 1);
      save("proofs", proofs);
      renderProofs();
    });

    list.appendChild(item);
  });
}

function setupProofLog() {
  $("#addProof").addEventListener("click", () => {
    const input = $("#proofInput");
    const text = input.value.trim();

    if (!text) return;

    const proofs = load("proofs", []);
    proofs.unshift(text);
    save("proofs", proofs);

    input.value = "";
    renderProofs();
  });

  renderProofs();
}

function setupReview() {
  ["sexierText", "fitsText", "inevitableText"].forEach((id) => {
    const element = $(`#${id}`);
    element.value = load(id, "");
    element.addEventListener("input", () => save(id, element.value));
  });
}

updateClock();
setInterval(updateClock, 1000);

setupTabs();
setupHome();
setupIdentity();
setupDesires();
setupRitual();
setupProofLog();
setupReview();

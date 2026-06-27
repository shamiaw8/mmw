import { requireUser, setupLogout } from "./auth-guard.js";

function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  clock.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function startApp() {
  try {
    await requireUser();
    setupLogout();
    updateClock();
    setInterval(updateClock, 1000);
  } catch (error) {
    document.body.innerHTML = `
      <main class="app">
        <section class="room">
          <h1 class="room-title">something went sideways</h1>
          <p>${error.message}</p>
          <a class="back-link" href="login.html">go to login</a>
        </section>
      </main>
    `;
  }
}

startApp();

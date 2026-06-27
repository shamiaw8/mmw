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
  await requireUser("login.html");
  setupLogout();

  updateClock();
  setInterval(updateClock, 1000);
}

startApp();

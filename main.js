import { requireUser, setupLogout } from "./auth-guard.js";

function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  clock.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

try {
  await requireUser("login.html");
  setupLogout();

  updateClock();
  setInterval(updateClock, 1000);
} catch (error) {
  console.error("mmw startup error:", error);
}

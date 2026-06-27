const overlay = document.createElement("div");

overlay.className = "water-transition";
overlay.id = "waterOverlay";

overlay.innerHTML = `
  <svg class="water-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
    <path fill="#55d6d6" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L0,320Z"></path>
  </svg>
  <div class="water-body"></div>
`;

document.body.appendChild(overlay);

window.addEventListener("pageshow", () => {
  document.body.classList.add("page-loaded");

  overlay.classList.remove("fill-page");
  overlay.classList.add("drain-page");

  setTimeout(() => {
    overlay.classList.remove("drain-page");
  }, 850);
});

document.querySelectorAll("a").forEach((link) => {
  const href = link.getAttribute("href");

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("http") ||
    href.includes("login") ||
    href.includes("auth")
  ) {
    return;
  }

  link.addEventListener("click", (event) => {
    event.preventDefault();

    overlay.classList.remove("drain-page");
    overlay.classList.add("fill-page");

    setTimeout(() => {

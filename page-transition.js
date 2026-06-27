const transition = document.createElement("div");

transition.className = "ocean-transition";
transition.innerHTML = `
  <div class="wave wave-one"></div>
  <div class="wave wave-two"></div>
  <div class="wave wave-three"></div>
`;

document.body.appendChild(transition);

window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
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

    document.body.classList.add("page-leaving");

    setTimeout(() => {
      window.location.href = href;
    }, 750);
  });
});

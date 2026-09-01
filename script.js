const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("theme");
let theme = savedTheme === "light" ? "light" : "dark";

function applyTheme(nextTheme) {
  theme = nextTheme;
  root.dataset.theme = theme;
  const nextLabel = theme === "dark" ? "light" : "dark";
  themeButton.setAttribute("aria-label", `Switch to ${nextLabel} mode`);
  themeButton.setAttribute("title", `Switch to ${nextLabel} mode`);
  themeButton.querySelector("span").textContent = theme === "dark" ? "☀" : "●";
}

applyTheme(theme);
themeButton.addEventListener("click", () => {
  const nextTheme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", nextTheme);
  applyTheme(nextTheme);
});

const burger = document.querySelector(".burger");
const drawer = document.querySelector(".drawer");

function setMenu(open) {
  burger.classList.toggle("open", open);
  drawer.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  drawer.setAttribute("aria-hidden", String(!open));
}

burger.addEventListener("click", () => setMenu(!drawer.classList.contains("open")));
document.querySelectorAll(".drawer-link, .wordmark").forEach((link) => link.addEventListener("click", () => setMenu(false)));

const record = document.querySelector(".record");
const recordButton = document.querySelector(".record-toggle");
if (record && recordButton) {
  recordButton.addEventListener("click", () => {
    const open = !record.classList.contains("record-open");
    record.classList.toggle("record-open", open);
    recordButton.setAttribute("aria-expanded", String(open));
    recordButton.textContent = open ? "Show fewer" : "Show 3 more";
  });
}

const principleBodies = [
  "I start with the operating problem, define the decision a product needs to support, and stay close through launch. Success includes adoption and measurable workflow change.",
  "I trace metrics back to source systems, test edge cases, and make the logic legible. A dashboard earns trust when users understand what changed and why.",
  "My biology training shapes how I work with uncertainty. I separate evidence from assumptions, design checks early, and revise the approach when results disagree with the model."
];

const principleBody = document.querySelector("#principle-body");
if (principleBody) {
  document.querySelectorAll("[data-principle]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-principle]").forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      principleBody.textContent = principleBodies[Number(button.dataset.principle)];
    });
  });
}

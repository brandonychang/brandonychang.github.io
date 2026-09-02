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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".interactive-surface").forEach((surface) => {
  surface.addEventListener("pointermove", (event) => {
    const bounds = surface.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    surface.style.setProperty("--pointer-x", `${x}%`);
    surface.style.setProperty("--pointer-y", `${y}%`);
  });
});

if (!reducedMotion) {
  document.querySelectorAll("[data-tilt]").forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const bounds = surface.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      surface.style.setProperty("--tilt-x", `${x * 5}deg`);
      surface.style.setProperty("--tilt-y", `${y * -5}deg`);
    });
    surface.addEventListener("pointerleave", () => {
      surface.style.setProperty("--tilt-x", "0deg");
      surface.style.setProperty("--tilt-y", "0deg");
    });
  });
}

const projectPeeks = {
  "healthcare-analytics.html": ["6 product releases", [42, 68, 78, 90]],
  "email-ticket-automation.html": ["136 open items surfaced", [28, 44, 67, 94]],
  "glean-ai-rollout.html": ["trust → repeat use", [31, 52, 63, 82]],
  "chatdb.html": ["SQL + NoSQL execution", [80, 42, 72, 58]],
  "protein-binding.html": ["967 PDB complexes", [95, 62, 39, 24]],
  "genai-chatbot.html": ["retrieve → ground → act", [25, 52, 77, 91]],
  "dog-poop-detector.html": ["camera → clip → alert", [33, 48, 86, 66]],
  "usc-parking.html": ["documents + maps + traffic", [72, 38, 57, 88]],
};

document.querySelectorAll("#work .index-row[href]").forEach((row) => {
  const key = row.getAttribute("href");
  const preview = projectPeeks[key];
  if (!preview) return;
  const peek = document.createElement("span");
  peek.className = "index-peek";
  peek.setAttribute("aria-hidden", "true");
  peek.innerHTML = `<span class="peek-bars">${preview[1].map((height) => `<i style="--h:${height}%"></i>`).join("")}</span><span class="peek-label">${preview[0]}</span>`;
  row.appendChild(peek);
});

const queryExamples = {
  group: {
    intent: "Sum transaction quantity by store location.",
    sql: "SELECT store_location, SUM(transaction_qty)<br>FROM coffee_shop_sales<br>GROUP BY store_location;",
  },
  where: {
    intent: "Find transactions where quantity exceeds ten.",
    sql: "SELECT transaction_id, transaction_qty<br>FROM coffee_shop_sales<br>WHERE transaction_qty &gt; 10;",
  },
  order: {
    intent: "List products from highest to lowest unit price.",
    sql: "SELECT product_category, unit_price<br>FROM coffee_shop_sales<br>ORDER BY unit_price DESC;",
  },
};

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-query]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const example = queryExamples[button.dataset.query];
    document.querySelector("#query-intent").textContent = example.intent;
    document.querySelector("#query-code").innerHTML = example.sql;
  });
});

document.querySelectorAll("[data-model-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-model-tab]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-model-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.modelPanel === button.dataset.modelTab));
  });
});

const parkingChoices = {
  primary: { title: "Structure A", body: "Best fit for the destination and current route. Source context supports the recommendation.", walk: "6 min", traffic: "Moderate", confidence: "High" },
  alt: { title: "Structure B", body: "Useful alternative when capacity or traffic changes near the primary route.", walk: "11 min", traffic: "Light", confidence: "Medium" },
};

document.querySelectorAll("[data-parking-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-parking-choice]").forEach((item) => item.classList.toggle("active", item === button));
    const choice = parkingChoices[button.dataset.parkingChoice];
    document.querySelector("#parking-choice-title").textContent = choice.title;
    document.querySelector("#parking-choice-body").textContent = choice.body;
    document.querySelector("#parking-walk").textContent = choice.walk;
    document.querySelector("#parking-traffic").textContent = choice.traffic;
    document.querySelector("#parking-confidence").textContent = choice.confidence;
  });
});

const lossChart = document.querySelector("#loss-chart");
if (lossChart) {
  const train = [162.6854,34.4661,25.5287,26.8442,27.5876,25.6168,27.0515,26.3599,26.3472,25.7894,25.0961,25.6238,24.7756,24.1085,21.9693,22.2692,23.1771,22.0344,20.2076,21.8262,20.1282,17.8754,22.4478,19.0754,16.9902,18.0725,16.0191,14.8257,14.8922,14.5574,13.9593,15.6313,12.3143,10.9711,9.0983,15.6629,8.6775,9.1573,8.4611,7.8819,7.6008,7.3906,7.9307,6.5996,5.9736,6.4214,5.6343,5.1199,9.2312,4.9365];
  const validation = [46.4806,29.9560,29.5559,29.3730,29.5219,29.3576,29.6779,29.1342,29.5148,30.3630,28.7086,29.2406,28.5305,34.1396,28.7985,28.5654,28.5212,28.7167,34.5260,29.0204,30.3331,33.6360,31.5821,31.5480,30.3178,30.3611,30.5052,30.5692,31.5720,31.2679,39.1381,31.2591,31.9754,32.2567,38.9915,32.2737,33.7671,33.0901,33.5049,34.3858,33.7551,34.1688,34.8011,34.1074,34.4649,34.5306,34.2523,42.4374,34.4473,36.8020];
  const svg = lossChart.querySelector("svg");
  const ns = "http://www.w3.org/2000/svg";
  const bounds = { left: 62, right: 875, top: 24, bottom: 372 };
  const maxY = 50;
  const x = (index) => bounds.left + (index / 49) * (bounds.right - bounds.left);
  const y = (value) => bounds.bottom - (Math.min(value, maxY) / maxY) * (bounds.bottom - bounds.top);
  const make = (tag, attributes = {}) => {
    const element = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };
  [0,10,20,30,40,50].forEach((value) => {
    svg.appendChild(make("line", { x1: bounds.left, x2: bounds.right, y1: y(value), y2: y(value), class: "grid-line" }));
    const label = make("text", { x: bounds.left - 14, y: y(value) + 4, "text-anchor": "end", class: "axis-label" });
    label.textContent = value;
    svg.appendChild(label);
  });
  [1,10,20,30,40,50].forEach((value) => {
    const label = make("text", { x: x(value - 1), y: bounds.bottom + 28, "text-anchor": "middle", class: "axis-label" });
    label.textContent = value;
    svg.appendChild(label);
  });
  const pathFor = (values) => values.map((value, index) => `${index ? "L" : "M"}${x(index).toFixed(2)},${y(value).toFixed(2)}`).join(" ");
  svg.appendChild(make("path", { d: pathFor(train), class: "train-line" }));
  svg.appendChild(make("path", { d: pathFor(validation), class: "val-line" }));
  const offScale = make("text", { x: x(0) + 8, y: bounds.top + 14, class: "axis-label" });
  offScale.textContent = "Epoch 1 train loss 162.7, above chart scale";
  svg.appendChild(offScale);
  const hoverLine = make("line", { y1: bounds.top, y2: bounds.bottom, class: "hover-line", visibility: "hidden" });
  svg.appendChild(hoverLine);
  const hitArea = make("rect", { x: bounds.left, y: bounds.top, width: bounds.right - bounds.left, height: bounds.bottom - bounds.top, fill: "transparent" });
  svg.appendChild(hitArea);
  const tooltip = lossChart.querySelector(".chart-tooltip");
  hitArea.addEventListener("pointermove", (event) => {
    const rect = svg.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * 900;
    const index = Math.max(0, Math.min(49, Math.round(((svgX - bounds.left) / (bounds.right - bounds.left)) * 49)));
    hoverLine.setAttribute("x1", x(index));
    hoverLine.setAttribute("x2", x(index));
    hoverLine.setAttribute("visibility", "visible");
    tooltip.style.display = "block";
    tooltip.style.left = `${Math.min(event.clientX - lossChart.getBoundingClientRect().left + 12, lossChart.clientWidth - 170)}px`;
    tooltip.style.top = `${event.clientY - lossChart.getBoundingClientRect().top - 58}px`;
    tooltip.textContent = `Epoch ${index + 1} · train ${train[index].toFixed(2)} · validation ${validation[index].toFixed(2)}`;
  });
  hitArea.addEventListener("pointerleave", () => {
    hoverLine.setAttribute("visibility", "hidden");
    tooltip.style.display = "none";
  });
}

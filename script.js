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
  "usc-parking.html": ["routes + crowds + event traffic", [72, 38, 57, 88]],
};

const releaseOrbitData = [
  { number: "01", product: "Glean AI", outcome: "87% daily active use" },
  { number: "02", product: "Safety Dashboard", outcome: "35% to 80%+ adoption" },
  { number: "03", product: "PCT Retention", outcome: "40% longer pilot retention" },
  { number: "04", product: "Pyramid Report", outcome: "80% faster reporting" },
  { number: "05", product: "Clinical Heatmap", outcome: "4 hours to 5 seconds" },
  { number: "06", product: "Request Tracker", outcome: "250 requests, 40+ fields" },
];

function renderReleaseOrbit(index) {
  const number = document.querySelector("#dial-number");
  if (!number) return;
  const release = releaseOrbitData[index];
  number.textContent = release.number;
  document.querySelector("#dial-product").textContent = release.product;
  document.querySelector("#dial-outcome").textContent = release.outcome;
  const dial = document.querySelector(".portfolio-dial");
  dial.dataset.activeRelease = String(index + 1);
  document.querySelectorAll("[data-release-orbit]").forEach((button) => {
    const active = Number(button.dataset.releaseOrbit) === index;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

document.querySelectorAll("[data-release-orbit]").forEach((button) => {
  const index = Number(button.dataset.releaseOrbit);
  ["mouseenter", "focus"].forEach((eventName) => button.addEventListener(eventName, () => renderReleaseOrbit(index)));
  button.addEventListener("click", () => {
    renderReleaseOrbit(index);
    const tile = document.querySelectorAll(".release-tile")[index];
    document.querySelectorAll(".release-tile").forEach((item) => item.classList.remove("orbit-linked"));
    tile?.classList.add("orbit-linked");
    window.setTimeout(() => tile?.classList.remove("orbit-linked"), 1200);
  });
});

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

const parkingData = {
  blue: {
    title: "Blue Structure", walk: 7, access: 90,
    drive: { normal: 10, event: 20, evening: 12 },
    crowd: { normal: 58, event: 94, evening: 46 },
    status: { normal: "Open", event: "Expo closure nearby", evening: "Open · lit route" },
  },
  flower: {
    title: "Flower Street Structure", walk: 11, access: 78,
    drive: { normal: 12, event: 15, evening: 14 },
    crowd: { normal: 44, event: 68, evening: 38 },
    status: { normal: "Open", event: "Open · slower exit", evening: "Open" },
  },
  royal: {
    title: "Royal Street Structure", walk: 14, access: 84,
    drive: { normal: 14, event: 16, evening: 13 },
    crowd: { normal: 35, event: 52, evening: 30 },
    status: { normal: "Open", event: "Open · lower crowd", evening: "Open · lit route" },
  },
};

const parkingState = { condition: "normal", priority: "fastest", tolerance: 3, selected: "blue" };

function parkingScores() {
  return Object.entries(parkingData).map(([key, item]) => {
    const drive = item.drive[parkingState.condition];
    const crowd = item.crowd[parkingState.condition];
    const totalMinutes = drive + item.walk;
    const timeFit = Math.max(22, Math.min(98, 126 - totalMinutes * 2.15));
    const crowdFit = Math.max(15, Math.min(98, 108 - crowd + (parkingState.tolerance - 3) * 9));
    const weights = parkingState.priority === "fastest" ? [0.62, 0.2, 0.18]
      : parkingState.priority === "crowd" ? [0.25, 0.6, 0.15]
      : [0.24, 0.16, 0.6];
    const score = Math.round(timeFit * weights[0] + crowdFit * weights[1] + item.access * weights[2]);
    return { key, item, drive, crowd, timeFit, crowdFit, score };
  }).sort((a, b) => b.score - a.score);
}

function crowdLabel(value) {
  if (value >= 85) return "Very high";
  if (value >= 62) return "High";
  if (value >= 42) return "Medium";
  return "Low";
}

function renderParking(preferredChoice) {
  const title = document.querySelector("#parking-choice-title");
  if (!title) return;
  const ranked = parkingScores();
  const best = ranked[0];
  parkingState.selected = preferredChoice || best.key;
  const selected = ranked.find((entry) => entry.key === parkingState.selected) || best;
  const selectedRank = ranked.findIndex((entry) => entry.key === selected.key) + 1;
  const conditionName = { normal: "weekday", event: "football-event", evening: "evening" }[parkingState.condition];
  const priorityName = { fastest: "fastest arrival", crowd: "lower crowd exposure", accessible: "route accessibility" }[parkingState.priority];

  document.querySelectorAll("[data-parking-choice], [data-parking-card]").forEach((item) => {
    const key = item.dataset.parkingChoice || item.dataset.parkingCard;
    const active = key === selected.key;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-route-line]").forEach((line) => line.classList.toggle("active", line.dataset.routeLine === selected.key));

  const map = document.querySelector("#xposition-map");
  map.classList.remove("condition-normal", "condition-event", "condition-evening");
  map.classList.add(`condition-${parkingState.condition}`);
  map.style.setProperty("--heat-opacity", String(0.62 - (parkingState.tolerance - 1) * 0.09));

  title.textContent = selected.item.title;
  document.querySelector("#parking-choice-body").textContent = selected.key === best.key
    ? `Top-ranked for ${priorityName} during the selected ${conditionName} scenario.`
    : `Selected alternative. It ranks ${selectedRank} of 3 for ${priorityName} during the ${conditionName} scenario.`;
  document.querySelector("#parking-drive").textContent = `${selected.drive} min`;
  document.querySelector("#parking-walk").textContent = `${selected.item.walk} min`;
  document.querySelector("#parking-traffic").textContent = crowdLabel(selected.crowd);
  document.querySelector("#parking-status").textContent = selected.item.status[parkingState.condition];
  document.querySelector("#parking-score").textContent = selected.score;
  document.querySelector("#parking-rank").textContent = String(selectedRank).padStart(2, "0");
  document.querySelector("#parking-time-bar").style.width = `${selected.timeFit}%`;
  document.querySelector("#parking-crowd-bar").style.width = `${selected.crowdFit}%`;
  document.querySelector("#parking-access-bar").style.width = `${selected.item.access}%`;
  document.querySelector("#parking-source").textContent = `Score combines ${selected.drive} minutes of driving, ${selected.item.walk} minutes of walking, ${crowdLabel(selected.crowd).toLowerCase()} crowd exposure, and the selected priority.`;

  const conditions = {
    normal: ["WEEKDAY · 4:30 PM", "Moderate traffic around Exposition Boulevard", "No closures"],
    event: ["FOOTBALL EVENT · 6:30 PM", "Heavy crowding and an Exposition Boulevard closure", "Closure + event crowd"],
    evening: ["EVENING · 9:15 PM", "Lower traffic with lit-route guidance", "Night lighting shown"],
  };
  const condition = conditions[parkingState.condition];
  document.querySelector("#map-condition-label").textContent = condition[0];
  document.querySelector("#map-live-status").textContent = condition[1];
  document.querySelector("#map-change-summary").textContent = condition[2];

  Object.entries(parkingData).forEach(([key, item]) => {
    const drive = item.drive[parkingState.condition];
    const crowd = crowdLabel(item.crowd[parkingState.condition]).toLowerCase();
    document.querySelector(`#parking-card-${key}`).textContent = `${drive} min drive · ${item.walk} min walk · ${crowd} crowd`;
  });
}

document.querySelectorAll("[data-parking-condition]").forEach((button) => {
  button.addEventListener("click", () => {
    parkingState.condition = button.dataset.parkingCondition;
    document.querySelectorAll("[data-parking-condition]").forEach((item) => item.classList.toggle("active", item === button));
    renderParking();
  });
});

document.querySelectorAll("[data-parking-priority]").forEach((button) => {
  button.addEventListener("click", () => {
    parkingState.priority = button.dataset.parkingPriority;
    document.querySelectorAll("[data-parking-priority]").forEach((item) => item.classList.toggle("active", item === button));
    renderParking();
  });
});

document.querySelectorAll("[data-parking-choice], [data-parking-card]").forEach((button) => {
  button.addEventListener("click", () => renderParking(button.dataset.parkingChoice || button.dataset.parkingCard));
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      renderParking(button.dataset.parkingChoice || button.dataset.parkingCard);
    }
  });
});

const crowdTolerance = document.querySelector("#crowd-tolerance");
crowdTolerance?.addEventListener("input", () => {
  parkingState.tolerance = Number(crowdTolerance.value);
  document.querySelector("#crowd-tolerance-output").textContent = ["", "Very low", "Low", "Medium", "High", "Very high"][parkingState.tolerance];
  renderParking();
});

if (document.querySelector("#parking-choice-title")) renderParking();

const dogConfidence = document.querySelector("#dog-confidence");
const dogDuration = document.querySelector("#dog-duration");
let dogCondition = "clear";

function renderDogLab() {
  if (!dogConfidence || !dogDuration) return;
  const threshold = Number(dogConfidence.value);
  const duration = Number(dogDuration.value);
  const penalties = { clear: 0, dark: 12, occluded: 18, stretch: 23 };
  const sensitivity = Math.max(38, Math.min(96, Math.round(116 - threshold * 0.48 - duration * 4 - penalties[dogCondition] * 0.35)));
  const falseScore = Math.round((100 - threshold) * 1.25 + (6 - duration) * 7 + (dogCondition === "stretch" ? 18 : 0));
  const falseRisk = falseScore > 65 ? "High" : falseScore > 38 ? "Medium" : "Low";
  const status = falseRisk === "High" ? "Fast, noisy" : sensitivity < 60 ? "Conservative" : "Balanced";
  const notes = {
    clear: "Clear framing provides the cleanest keypoint geometry.",
    dark: "Low light lowers keypoint confidence and makes temporal evidence more important.",
    occluded: "Partial framing increases missed-event risk when spine or tail points disappear.",
    stretch: "A similar pose is the hardest false-positive test; longer duration and stronger voting help.",
  };
  document.querySelector("#dog-confidence-output").textContent = `${threshold}%`;
  document.querySelector("#dog-duration-output").textContent = `${duration.toFixed(1)}s`;
  document.querySelector("#dog-lab-status").textContent = status;
  document.querySelector("#dog-sensitivity").textContent = `${sensitivity}%`;
  document.querySelector("#dog-false-risk").textContent = falseRisk;
  document.querySelector("#dog-response").textContent = `${duration.toFixed(1)} seconds`;
  document.querySelector("#dog-gauge-fill").style.width = `${sensitivity}%`;
  document.querySelector("#dog-lab-note").textContent = notes[dogCondition];
}

document.querySelectorAll("[data-dog-condition]").forEach((button) => {
  button.addEventListener("click", () => {
    dogCondition = button.dataset.dogCondition;
    document.querySelectorAll("[data-dog-condition]").forEach((item) => item.classList.toggle("active", item === button));
    renderDogLab();
  });
});

[dogConfidence, dogDuration].forEach((input) => input?.addEventListener("input", renderDogLab));
renderDogLab();

const dogRun = document.querySelector("#dog-run");
if (dogRun) {
  dogRun.addEventListener("click", () => {
    const demo = document.querySelector(".dog-live-demo");
    const running = !demo.classList.contains("dog-confirmed");
    demo.classList.toggle("dog-confirmed", running);
    document.querySelector("#dog-event-label").textContent = running ? "event confirmed · 81% temporal vote" : "candidate posture · collecting votes";
    document.querySelector("#dog-live-title").textContent = running ? "Event logged" : "Candidate detected";
    document.querySelector("#dog-live-copy").textContent = running
      ? "The state machine crossed its vote threshold, saved the event context, and placed a cleanup marker."
      : "Run the detector to aggregate posture votes, confirm the event, and place the rear-location marker.";
    document.querySelector("#dog-actions").innerHTML = running
      ? "<span>Screenshot + timestamp saved</span><span>Cleanup map marker added</span>"
      : "<span>Event log waiting</span><span>Cleanup map waiting</span>";
    dogRun.textContent = running ? "Reset simulation" : "Run detector";
  });
}

const poseFrames = {
  yard: {
    title: "Yard frame",
    score: 81,
    decision: "Candidate above 75% threshold",
    note: "Strong spine and tail geometry produce a candidate vote. The time window still decides whether the event becomes confirmed.",
  },
  indoor: {
    title: "Indoor frame",
    score: 34,
    decision: "Hard negative below threshold",
    note: "The crouched body resembles the target posture, but weak tail confidence and visible movement keep the frame below the event threshold.",
  },
};

let activePoseFrame = "yard";

function renderPoseFrame(frameName) {
  const frame = poseFrames[frameName];
  if (!frame) return;
  activePoseFrame = frameName;
  document.querySelectorAll("[data-pose-frame]").forEach((card) => {
    const active = card.dataset.poseFrame === frameName;
    card.classList.toggle("active", active);
    card.setAttribute("aria-pressed", String(active));
  });
  document.querySelector("#pose-frame-title").textContent = frame.title;
  document.querySelector("#pose-frame-score").textContent = `${frame.score}%`;
  document.querySelector("#pose-frame-bar").style.width = `${frame.score}%`;
  document.querySelector("#pose-frame-decision").textContent = frame.decision;
  document.querySelector("#pose-frame-note").textContent = frame.note;
}

document.querySelectorAll("[data-pose-frame]").forEach((card) => {
  card.addEventListener("click", () => renderPoseFrame(card.dataset.poseFrame));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      renderPoseFrame(card.dataset.poseFrame);
    }
  });
});

document.querySelectorAll("[data-pose-layer]").forEach((button) => {
  button.addEventListener("click", () => {
    const active = !button.classList.contains("active");
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    document.querySelector("#pose-image-grid").classList.toggle(`hide-${button.dataset.poseLayer}`, !active);
  });
});

const poseRun = document.querySelector("#pose-run");
if (poseRun) {
  poseRun.addEventListener("click", () => {
    const grid = document.querySelector("#pose-image-grid");
    grid.classList.remove("inference-complete");
    grid.classList.add("inference-running");
    poseRun.disabled = true;
    poseRun.textContent = "Reading frame...";
    window.setTimeout(() => {
      grid.classList.remove("inference-running");
      grid.classList.add("inference-complete");
      renderPoseFrame(activePoseFrame);
      poseRun.disabled = false;
      poseRun.textContent = "Run again";
    }, 1150);
  });
}

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

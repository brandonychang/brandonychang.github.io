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
  "aparicio-lab.html": ["edit → grow → screen → confirm", [24, 51, 73, 96]],
};

const aminoAcidInfo = {
  A: ["Alanine", "small hydrophobic residue"], C: ["Cysteine", "sulfur-containing residue"], D: ["Aspartic acid", "negatively charged residue"],
  E: ["Glutamic acid", "negatively charged residue"], F: ["Phenylalanine", "aromatic hydrophobic residue"], G: ["Glycine", "small flexible residue"],
  H: ["Histidine", "ionizable residue"], I: ["Isoleucine", "branched hydrophobic residue"], K: ["Lysine", "positively charged residue"],
  L: ["Leucine", "hydrophobic residue"], M: ["Methionine", "sulfur-containing residue"], N: ["Asparagine", "polar residue"],
  P: ["Proline", "rigid ring residue"], Q: ["Glutamine", "polar residue"], R: ["Arginine", "positively charged residue"],
  S: ["Serine", "polar residue"], T: ["Threonine", "polar residue"], V: ["Valine", "branched hydrophobic residue"],
  W: ["Tryptophan", "aromatic hydrophobic residue"], Y: ["Tyrosine", "aromatic polar residue"],
};

function renderEncodingReadout(row) {
  const aa = row?.querySelector("strong")?.textContent.trim();
  const info = aminoAcidInfo[aa];
  if (!aa || !info) return;
  const index = Object.keys(aminoAcidInfo).indexOf(aa) + 1;
  const vector = Array.from({ length: 20 }, (_, i) => i === index - 1 ? 1 : 0);
  const setText = (selector, value) => document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  setText("#encoding-aa, #encoding-v2-aa", aa);
  setText("#encoding-name, #encoding-v2-name", info[0]);
  setText("#encoding-position, #encoding-v2-position", `Position ${String(index).padStart(2, "0")} of the 20-class alphabet · ${info[1]}`);
  setText("#encoding-copy, #encoding-v2-copy", `The row contains a 1 at position ${index} and a 0 in the other 19 positions. This gives the model a consistent numeric record for ${info[0].toLowerCase()}.`);
  setText("#encoding-vector-value, #encoding-v2-vector-value", `[${vector.join(", ")}]`);
  setText("#encoding-shape, #encoding-v2-shape", "1 × 20");
  setText("#encoding-v2-summary", `${info[0]} activates position ${index}`);
  setText("#encoding-v2-readout-title", `${info[0]} uses position ${index}.`);
  document.querySelectorAll(".matrix-row").forEach((item) => item.classList.toggle("selected", item === row));
}

document.querySelectorAll(".matrix-row").forEach((row) => {
  ["mouseenter", "focus", "click"].forEach((eventName) => row.addEventListener(eventName, () => renderEncodingReadout(row)));
});

document.querySelectorAll(".encoding-matrix-v2 .matrix-row").forEach((row) => {
  const readout = row.querySelector(":scope > span");
  let cells = row.querySelectorAll(":scope > i").length;
  while (cells < 20) {
    const cell = document.createElement("i");
    row.insertBefore(cell, readout);
    cells += 1;
  }
});

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

const replicationStages = {
  recognize: {
    kicker: "Late M / early G1",
    title: "ORC recognizes an origin.",
    copy: "Yeast origins contain an autonomously replicating sequence, or ARS. A nucleosome-free region gives the Origin Recognition Complex access to this DNA.",
    plain: "ORC marks a place where DNA copying is allowed to begin.",
    method: "Fkh1 and Fkh2 act later, after the origin has been recognized and licensed.",
    caption: "A nucleosome-free ARS gives ORC access to the origin.",
  },
  license: {
    kicker: "G1 phase",
    title: "Cdc6 and Cdt1 load the helicase.",
    copy: "Cdc6 joins ORC, while Cdt1 brings Mcm2-7 to the origin. Two Mcm2-7 rings load head-to-head around the DNA and remain inactive until S phase.",
    plain: "The cell installs an inactive DNA-unwinding motor before copying starts.",
    method: "Licensing happens once per cycle so the genome is copied once, not repeatedly.",
    caption: "Cdc6 and Cdt1 load an inactive Mcm2-7 double hexamer around the DNA.",
  },
  recruit: {
    kicker: "Late G1",
    title: "Forkhead proteins favor selected early origins.",
    copy: "Fkh1 and Fkh2 bind DNA near some licensed origins, interact with ORC, and help those origins gather limiting activation factors such as Dbf4-Cdc7 and Cdc45.",
    plain: "Forkhead proteins help flag which prepared origins should start early.",
    method: "Changing Forkhead binding or Dbf4 recruitment tests whether an origin loses its early timing.",
    caption: "Forkhead proteins help selected origins collect limiting activation factors.",
  },
  fire: {
    kicker: "S phase",
    title: "The active helicase opens two copying forks.",
    copy: "DDK and S-CDK trigger activation. Cdc45 and GINS join Mcm2-7 to form the CMG helicase. CMG opens the duplex while DNA polymerases build new strands in opposite directions.",
    plain: "The inactive motor turns on, opens the DNA, and sends two copying teams outward.",
    method: "BrdU sequencing tracks newly copied DNA, while FACS checks that cell-cycle timing stayed comparable.",
    caption: "CMG unwinds DNA while polymerases build new strands at two moving forks.",
  },
};

function renderReplicationStage(stageName) {
  const stage = replicationStages[stageName];
  if (!stage || !document.querySelector("#replication-stage-title")) return;
  document.querySelectorAll("[data-replication-stage]").forEach((button) => {
    const active = button.dataset.replicationStage === stageName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelector("#replication-diagram").dataset.stage = stageName;
  document.querySelector("#replication-kicker").textContent = stage.kicker;
  document.querySelector("#replication-stage-title").textContent = stage.title;
  document.querySelector("#replication-stage-copy").textContent = stage.copy;
  document.querySelector("#replication-plain").textContent = stage.plain;
  document.querySelector("#replication-method").textContent = stage.method;
  const caption = document.querySelector("#machine-caption");
  if (caption) caption.textContent = stage.caption;
}

document.querySelectorAll("[data-replication-stage]").forEach((button) => {
  button.addEventListener("click", () => renderReplicationStage(button.dataset.replicationStage));
});

const hcmSteps = {
  design: {
    label: "Step 01",
    title: "Design primers that carry the mutation.",
    copy: "The forward and reverse primers match opposite DNA strands and include the planned HCM1 DNA-binding changes. Their overlap tells PCR exactly which bases to copy.",
    result: "Checkpoint: the intended HCM1 sequence is defined base by base.",
  },
  pcr: {
    label: "Step 02",
    title: "Copy the edited DNA with PCR.",
    copy: "Each PCR cycle separates the strands, lets the primers bind, and extends new DNA. Repeating the cycle produces enough edited fragment for transformation.",
    result: "Checkpoint: PCR produced enough edited HCM1 DNA for transformation.",
  },
  transform: {
    label: "Step 03",
    title: "Move the DNA into yeast.",
    copy: "Lithium acetate and PEG help the PCR fragment enter yeast cells. Each surviving colony begins from a cell that may have taken up the DNA.",
    result: "Checkpoint: transformed cells received material from the experiment.",
  },
  recombine: {
    label: "Step 04",
    title: "Let matching DNA guide the edit.",
    copy: "The fragment aligns with matching genomic DNA on both sides of HCM1. Yeast repair machinery uses those matching regions to replace the original sequence.",
    result: "Checkpoint: matching DNA guides the fragment to the HCM1 locus.",
  },
  screen: {
    label: "Step 05",
    title: "Screen the colonies.",
    copy: "Selection removes many cells that did not take up the marker. Colony PCR then uses primers around HCM1 to check for a product at the expected size.",
    result: "Checkpoint: colony PCR identifies the strongest candidates for sequencing.",
  },
  sequence: {
    label: "Step 06",
    title: "Read the exact DNA letters.",
    copy: "Sanger sequencing aligns each colony read with the expected HCM1 sequence. Matching peaks at the designed bases provide the final confirmation.",
    result: "Checkpoint: the sequencing read matches the intended mutation.",
  },
};

function renderHcmStep(stepName) {
  const step = hcmSteps[stepName];
  if (!step || !document.querySelector("#hcm-step-title")) return;
  document.querySelectorAll("[data-hcm-step]").forEach((button) => {
    const active = button.dataset.hcmStep === stepName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelector("#gene-edit-diagram").dataset.step = stepName;
  document.querySelector("#hcm-step-label").textContent = step.label;
  document.querySelector("#hcm-step-title").textContent = step.title;
  document.querySelector("#hcm-step-copy").textContent = step.copy;
  document.querySelector("#hcm-step-result").textContent = step.result;
}

document.querySelectorAll("[data-hcm-step]").forEach((button) => {
  button.addEventListener("click", () => renderHcmStep(button.dataset.hcmStep));
});

const forkheadContacts = {
  core: {
    label: "Core recognition",
    title: "Helix H3 reads the main DNA sequence.",
    copy: "H3 sits in the DNA major groove and makes base-specific contacts with the GTAAACA core motif. This provides the main sequence-recognition step.",
    result: "Main idea: the core motif tells Fkh1 where to bind.",
  },
  wing1: {
    label: "3′ flanking contact",
    title: "Wing 1 checks the DNA beside the core.",
    copy: "Wing 1 reaches into the 3′ flanking minor groove. Lysine 373 helps anchor this contact, so the protein reads more than the seven-base core motif.",
    result: "Main idea: neighboring DNA helps steady the protein-DNA complex.",
  },
  wing2: {
    label: "5′ flanking contact",
    title: "The extended Wing 2 grips the opposite flank.",
    copy: "The unusually long Wing 2 reaches the 5′ flanking minor groove. Arginines 400 and 401 support this contact, while helices H5 and H6 stabilize the wing.",
    result: "Main idea: Fkh1 reads DNA shape and sequence on both sides of the core.",
  },
};

function renderForkheadContact(contactName) {
  const contact = forkheadContacts[contactName];
  const visual = document.querySelector("#forkhead-visual");
  if (!contact || !visual) return;
  document.querySelectorAll("[data-forkhead-contact]").forEach((button) => {
    const active = button.dataset.forkheadContact === contactName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  visual.dataset.contact = contactName;
  document.querySelector("#forkhead-contact-label").textContent = contact.label;
  document.querySelector("#forkhead-contact-title").textContent = contact.title;
  document.querySelector("#forkhead-contact-copy").textContent = contact.copy;
  document.querySelector("#forkhead-contact-result").textContent = contact.result;
}

document.querySelectorAll("[data-forkhead-contact]").forEach((button) => {
  button.addEventListener("click", () => renderForkheadContact(button.dataset.forkheadContact));
});

const sequencingStages = {
  crosslink: { label: "Stage 01", title: "Freeze protein-DNA contacts.", copy: "Crosslinking preserves a snapshot of which DNA fragments carried the tagged protein at that moment in the cell cycle.", result: "Output: preserved protein-DNA contacts from the cell population." },
  pull: { label: "Stage 02", title: "Pull down the tagged protein.", copy: "An antibody catches the FLAG tag. The attached DNA comes with it, while most unrelated fragments wash away.", result: "Output: DNA enriched for fragments attached to the tagged protein." },
  library: { label: "Stage 03", title: "Add adapters and copy the library.", copy: "Known adapter sequences attach to both ends of each fragment. Universal primers then copy the unknown DNA between those adapters.", result: "Output: adapter-linked DNA that the sequencer can read." },
  qc: { label: "Stage 04", title: "Check library size and concentration.", copy: "A Bioanalyzer reveals the fragment-size range and unwanted primer dimers. Clean, balanced libraries move into the final pool.", result: "Output: a concentration and fragment-size check for every sample." },
  sequence: { label: "Stage 05", title: "Read millions of short fragments.", copy: "The sequencer converts each library molecule into a short string of DNA letters. Each read still needs a genomic address.", result: "Output: short DNA reads from the enriched sample." },
  align: { label: "Stage 06", title: "Align reads and find binding peaks.", copy: "Software maps reads to the yeast genome, sorts them, removes repeated copies, groups signal into 50-base bins, and normalizes samples.", result: "Output: genomic peaks showing where protein binding was enriched." },
};

function renderSequencingStage(stageName) {
  const stage = sequencingStages[stageName];
  const visual = document.querySelector("#seq-visual");
  if (!stage || !visual) return;
  document.querySelectorAll("[data-seq-stage]").forEach((button) => {
    const active = button.dataset.seqStage === stageName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  visual.dataset.stage = stageName;
  document.querySelector("#seq-stage-label").textContent = stage.label;
  document.querySelector("#seq-stage-title").textContent = stage.title;
  document.querySelector("#seq-stage-copy").textContent = stage.copy;
  document.querySelector("#seq-stage-result").textContent = stage.result;
}

document.querySelectorAll("[data-seq-stage]").forEach((button) => {
  button.addEventListener("click", () => renderSequencingStage(button.dataset.seqStage));
});

const plateStages = {
  growth: {
    label: "Stage 01 · Growth",
    plate: "Rich growth media",
    title: "First, let transformed cells grow.",
    copy: "Growth shows which cells formed colonies. It does not prove the HCM1 edit yet.",
  },
  selection: {
    label: "Stage 02 · Selection",
    plate: "Selection media",
    title: "Keep colonies with the selection marker.",
    copy: "Only colonies carrying the selectable marker stay visible. These colonies move to the DNA check.",
  },
  pcr: {
    label: "Stage 03 · PCR check",
    plate: "Colony PCR screen",
    title: "Check the edit at the HCM1 location.",
    copy: "A correctly sized PCR band supports the planned integration. Unclear colonies get checked again or removed.",
  },
};

let activePlateStage = "growth";

function renderPlateStage(stageName) {
  const stage = plateStages[stageName];
  if (!stage || !document.querySelector("#yeast-plate")) return;
  activePlateStage = stageName;
  document.querySelectorAll("[data-plate-condition]").forEach((button) => {
    const active = button.dataset.plateCondition === stageName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  const plate = document.querySelector("#yeast-plate");
  plate.dataset.condition = stageName;
  document.querySelector("#plate-label").textContent = stage.plate;
  document.querySelector("#plate-stage-label").textContent = stage.label;
  document.querySelector("#plate-stage-title").textContent = stage.title;
  document.querySelector("#plate-stage-copy").textContent = stage.copy;
  document.querySelector("#selected-colony-id").textContent = "Choose a dot";
  document.querySelector("#selected-colony-copy").textContent = "Select any visible colony to see what this stage tells you.";
  document.querySelectorAll(".yeast-colony").forEach((colony) => {
    const survives = colony.dataset.select === "yes";
    colony.classList.remove("active", "confirmed", "recheck", "dimmed");
    if (stageName !== "growth" && !survives) colony.classList.add("dimmed");
    if (stageName === "pcr" && survives) colony.classList.add(colony.dataset.pcr === "confirmed" ? "confirmed" : "recheck");
  });
}

document.querySelectorAll("[data-plate-condition]").forEach((button) => {
  button.addEventListener("click", () => renderPlateStage(button.dataset.plateCondition));
});

document.querySelectorAll(".yeast-colony").forEach((colony) => {
  colony.addEventListener("click", () => {
    if (colony.classList.contains("dimmed")) return;
    document.querySelectorAll(".yeast-colony").forEach((item) => item.classList.remove("active"));
    colony.classList.add("active");
    document.querySelector("#selected-colony-id").textContent = `Colony ${colony.dataset.colony}`;
    const messages = {
      growth: "This colony grew on rich media. Growth alone does not confirm the edit.",
      selection: "This colony survived selection, so it moves to the PCR screen.",
      pcr: colony.dataset.pcr === "confirmed" ? "The expected PCR result supports the planned HCM1 edit." : "The PCR result needs another check before this strain is used.",
    };
    document.querySelector("#selected-colony-copy").textContent = messages[activePlateStage];
  });
});

const labMethods = {
  pcr: { question: "Measurement: DNA integration at the HCM1 locus", name: "PCR", copy: "I copied a chosen DNA region and checked the product size. A band at the expected size supported successful integration.", work: "Primer design · colony screening · gel checks" },
  chip: { question: "Measurement: protein binding at specific DNA sites", name: "ChIP", copy: "I fixed proteins to DNA, pulled down one tagged protein, and purified the attached DNA. Sequencing or qPCR then showed where the protein had bound.", work: "Cell fixation · antibody pull-down · DNA cleanup · controls" },
  qpcr: { question: "Measurement: target DNA enrichment", name: "qPCR", copy: "I measured selected DNA regions across samples and controls. This helped compare protein binding or DNA enrichment at known sites.", work: "Primer checks · replicate comparison · normalized signals" },
  facs: { question: "Measurement: DNA content across the cell population", name: "FACS", copy: "A fluorescent dye measured the amount of DNA in each cell. A strong G1 peak showed the culture had stopped before DNA copying began.", work: "Cell synchronization · DNA staining · peak review" },
  seq: { question: "Measurement: exact DNA bases and genomic locations", name: "Sequencing", copy: "Sequencing checked the exact DNA letters in edited strains and mapped ChIP DNA fragments back to the yeast genome.", work: "Library preparation · quality checks · alignment · review" },
  stability: { question: "Measurement: plasmid loss during cell growth", name: "Plasmid stability assay", copy: "I compared colony growth with and without selection. The difference estimated how often cells lost a plasmid during growth.", work: "Replica plating · colony counts · wild-type and mutant comparison" },
};

function renderLabMethod(methodName) {
  const method = labMethods[methodName];
  if (!method || !document.querySelector("#method-name")) return;
  document.querySelectorAll("[data-lab-method]").forEach((button) => {
    const active = button.dataset.labMethod === methodName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelector("#method-question").textContent = method.question;
  document.querySelector("#method-name").textContent = method.name;
  document.querySelector("#method-copy").textContent = method.copy;
  document.querySelector("#method-work").textContent = method.work;
}

document.querySelectorAll("[data-lab-method]").forEach((button) => {
  button.addEventListener("click", () => renderLabMethod(button.dataset.labMethod));
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

const aiRoleDetails = {
  knowledge: {
    name: "Knowledge workers",
    task: "Find authoritative answers across disconnected systems.",
    copy: "The product needed to retrieve and synthesize source material without asking users to remember which repository held the answer.",
    barrier: "Unclear citations and inconsistent coverage",
    response: "Grounded answers, visible sources, and feedback tied to repeatable defects",
    signal: "A useful answer followed by repeat use",
  },
  support: {
    name: "Support teams",
    task: "Resolve questions quickly without inventing policy guidance.",
    copy: "Support staff needed short, source-backed answers they could verify before using them in a case or sharing them with a clinic.",
    barrier: "Confidently wrong answers created operational risk",
    response: "Curated policy sources, prebuilt prompts, UAT, and a clear fallback when evidence was weak",
    signal: "Faster resolution with zero incorrect policy instructions during the validation month",
  },
  leaders: {
    name: "Field leaders",
    task: "Get role-specific guidance without leaving the flow of work.",
    copy: "Clinic leaders needed concise answers on mobile and in the browser. A separate destination would have added another step to their work.",
    barrier: "Workflow friction and uncertainty about which sources applied",
    response: "Role-specific entry points, browser access, and guidance grounded in the approved knowledge set",
    signal: "87% daily active use across three pilot clinics",
  },
};

function renderAIRole(roleName) {
  const role = aiRoleDetails[roleName];
  if (!role || !document.querySelector("#ai-role-name")) return;
  document.querySelectorAll("[data-ai-role]").forEach((button) => {
    const active = button.dataset.aiRole === roleName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelector("#ai-role-name").textContent = role.name;
  document.querySelector("#ai-role-task").textContent = role.task;
  document.querySelector("#ai-role-copy").textContent = role.copy;
  document.querySelector("#ai-role-barrier").textContent = role.barrier;
  document.querySelector("#ai-role-response").textContent = role.response;
  document.querySelector("#ai-role-signal").textContent = role.signal;
}

document.querySelectorAll("[data-ai-role]").forEach((button) => {
  button.addEventListener("click", () => renderAIRole(button.dataset.aiRole));
});

const adoptionStages = {
  diagnose: {
    kicker: "Initial signal",
    metric: "<20%",
    title: "Fewer than 20% tried the tool.",
    copy: "Feedback identified privacy concerns and confidently wrong answers as the largest barriers.",
    details: ["40% of negative feedback cited privacy concerns", "35% cited confidently wrong answers", "Low trial was recorded as a product problem for the team to solve"],
  },
  rebuild: {
    kicker: "Product response",
    metric: "3 clinics",
    title: "The pilot rebuilt trust around real workflows.",
    copy: "The team narrowed the rollout, cleaned the source library, created prebuilt prompts, and added UAT plus a clear fallback when the system lacked evidence.",
    details: ["Authoritative content replaced fragmented or stale sources", "Prompts matched common clinic questions", "Feedback became a quality backlog with owners and retests"],
  },
  validate: {
    kicker: "Validated outcome",
    metric: "87%",
    title: "Daily use became the proof of trust.",
    copy: "The redesigned pilot reached 87% daily active use across three clinics while avoiding incorrect policy instructions for one month.",
    details: ["Zero incorrect policy instructions during the validation month", "About four hours saved per user each week", "Evidence supported leadership alignment and $1M in program funding"],
  },
};

function renderAdoptionStage(stageName) {
  const stage = adoptionStages[stageName];
  if (!stage || !document.querySelector("#adoption-stage-title")) return;
  document.querySelectorAll("[data-adoption-stage]").forEach((button) => {
    const active = button.dataset.adoptionStage === stageName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelector("#adoption-stage-kicker").textContent = stage.kicker;
  document.querySelector("#adoption-stage-metric").textContent = stage.metric;
  document.querySelector("#adoption-stage-title").textContent = stage.title;
  document.querySelector("#adoption-stage-copy").textContent = stage.copy;
  const list = document.querySelector("#adoption-stage-details");
  list.replaceChildren(...stage.details.map((detail) => {
    const item = document.createElement("li");
    item.textContent = detail;
    return item;
  }));
}

document.querySelectorAll("[data-adoption-stage]").forEach((button) => {
  button.addEventListener("click", () => renderAdoptionStage(button.dataset.adoptionStage));
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
  const crowdBase = { normal: 0.92, event: 1, evening: 0.86 }[parkingState.condition];
  const toleranceOpacity = { 1: 1, 2: 0.78, 3: 0.5, 4: 0.22, 5: 0.05 }[parkingState.tolerance];
  map.style.setProperty("--heat-opacity", String(crowdBase * toleranceOpacity));

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
  document.querySelector("#crowd-tolerance-output").textContent = ["", "Very low · zones strongest", "Low · zones bold", "Medium · balanced view", "High · zones soft", "Very high · zones faint"][parkingState.tolerance];
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
    clear: "A clear view makes it easiest to find the dog's body points.",
    dark: "Low light makes body points less certain, so the system waits for more matching frames.",
    occluded: "When part of the dog is blocked, the system may miss the event.",
    stretch: "Stretching can look similar. Requiring the pose to continue for longer helps avoid a false alert.",
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
    document.querySelector("#dog-event-label").textContent = running ? "event confirmed · 81% match" : "possible event · checking more frames";
    document.querySelector("#dog-live-title").textContent = running ? "Event saved" : "Possible event found";
    document.querySelector("#dog-live-copy").textContent = running
      ? "Enough frames matched, so the system saved the time and placed a cleanup marker."
      : "Run the detector to check several frames, confirm the event, and mark the cleanup location.";
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
    spine: "94%",
    tail: "89%",
    motion: "Low",
    decision: "Above the 75% match threshold",
    note: "The spine and tail points match the target posture. The system still checks several nearby frames before confirming the event.",
  },
  indoor: {
    title: "Indoor frame",
    score: 34,
    spine: "93%",
    tail: "34%",
    motion: "High",
    decision: "Below the 75% match threshold",
    note: "The crouched body looks similar. Weak tail confidence and visible movement keep this photo below the alert threshold.",
  },
};

function renderPoseFrame(frameName) {
  const frame = poseFrames[frameName];
  if (!frame) return;
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
  document.querySelector("#pose-spine-confidence").textContent = frame.spine;
  document.querySelector("#pose-tail-confidence").textContent = frame.tail;
  document.querySelector("#pose-motion").textContent = frame.motion;
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
    document.querySelector(".pose-inspector").classList.toggle(`hide-${button.dataset.poseLayer}`, !active);
    const visibleLayers = [...document.querySelectorAll("[data-pose-layer]")].filter((item) => item.classList.contains("active")).length;
    document.querySelector("#pose-layer-status").textContent = visibleLayers === 3
      ? "All 3 views shown"
      : visibleLayers === 0
        ? "All views hidden"
        : `${visibleLayers} of 3 views shown`;
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

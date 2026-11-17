/**
 * POSADA CHELEM 2026 — TALLER VISUAL NATIVO & EXPERIENCIA GAMIFICADA
 * - Selección 100% visual de piezas mediante cuadrícula de miniaturas SVG en vivo
 * - Sin prompts ni etiquetas inventadas: ves cada pieza y la tocas para equiparla
 * - 19 colores de chasis + selector RGB libre, colores de fondo, espejo, zoom y giro
 * - Cero emojis
 */

const EVENT_DATE = new Date("2026-12-19T15:00:00-06:00").getTime();

// Catálogo completo de piezas nativas de DiceBear Bottts v7 (sin nombres inventados)
const NATIVE_PARTS = {
  eyes: [
    "eva", "shade01", "robocop", "happy", "glow", "sensor",
    "roundFrame01", "roundFrame02", "bulging", "hearts", "dizzy",
    "frame1", "frame2", "round"
  ],
  face: [
    "round01", "round02", "square01", "square02", "square03", "square04"
  ],
  mouth: [
    "smile01", "smile02", "grill03", "bite", "diagram",
    "grill01", "grill02", "square01", "square02", "none"
  ],
  top: [
    "radar", "glowingBulb01", "horns", "lights", "pyramid",
    "antenna", "antennaCrooked", "bulb01", "glowingBulb02", "none"
  ],
  sides: [
    "cables01", "cables02", "antenna01", "antenna02",
    "round", "square", "squareAssymetric", "none"
  ],
  texture: [
    "none", "circuits", "dots", "camo01", "camo02",
    "grunge01", "grunge02", "dirty01", "dirty02"
  ]
};

// Los 19 colores nativos de chasis + opción libre RGB
const CHASSIS_HEX_LIST = [
  "039be5", "e53935", "00897b", "ffb300", "fb8c00",
  "8e24aa", "00acc1", "d81b60", "43a047", "3949ab",
  "1e88e5", "f4511e", "5e35b1", "7cb342", "fdd835",
  "c0ca33", "546e7a", "6d4c41", "757575"
];

// Paleta de fondos de pedestal + opción libre RGB
const PEDESTAL_BG_LIST = [
  "#E3F2FD", "#FFE8EA", "#E0F8F0", "#FFF4E0", "#EFEFFD",
  "#F2EFE6", "#E0F7FA", "#FCE4EC", "#F1F8E9", "#FFFDE7"
];

const DEFAULT_ATTENDEES = [
  {
    id: 1, name: "Reyvell", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "ffb300", bgColor: "#FFF4E0", eyes: "shade01", face: "round01", mouth: "smile02", top: "radar", sides: "round", texture: "none", flip: false, scale: 100, rotate: 0 }
  },
  {
    id: 2, name: "Roberto", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "039be5", bgColor: "#E3F2FD", eyes: "eva", face: "square01", mouth: "smile01", top: "glowingBulb01", sides: "cables01", texture: "circuits", flip: false, scale: 100, rotate: 0 }
  },
  {
    id: 3, name: "Daniel", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "00897b", bgColor: "#E0F8F0", eyes: "happy", face: "round02", mouth: "grill03", top: "lights", sides: "antenna01", texture: "none", flip: false, scale: 100, rotate: 0 }
  },
  {
    id: 4, name: "Pinzón", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "e53935", bgColor: "#FFE8EA", eyes: "robocop", face: "square02", mouth: "smile01", top: "horns", sides: "cables02", texture: "none", flip: false, scale: 100, rotate: 0 }
  },
  {
    id: 5, name: "Alejandro", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "8e24aa", bgColor: "#EFEFFD", eyes: "glow", face: "round01", mouth: "diagram", top: "pyramid", sides: "round", texture: "dots", flip: false, scale: 100, rotate: 0 }
  },
  {
    id: 6, name: "Erik", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "fb8c00", bgColor: "#FFF4E0", eyes: "sensor", face: "square03", mouth: "grill01", top: "antenna", sides: "cables01", texture: "none", flip: false, scale: 100, rotate: 0 }
  },
  {
    id: 7, name: "Iván", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "00acc1", bgColor: "#E0F7FA", eyes: "roundFrame01", face: "square01", mouth: "smile02", top: "radar", sides: "antenna02", texture: "circuits", flip: false, scale: 100, rotate: 0 }
  },
  {
    id: 8, name: "Francisco", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "d81b60", bgColor: "#FCE4EC", eyes: "frame1", face: "round02", mouth: "bite", top: "antennaCrooked", sides: "round", texture: "none", flip: false, scale: 100, rotate: 0 }
  },
  {
    id: 9, name: "Carlos", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "546e7a", bgColor: "#F2EFE6", eyes: "roundFrame02", face: "square04", mouth: "square01", top: "bulb01", sides: "square", texture: "dots", flip: false, scale: 100, rotate: 0 }
  }
];

const DEFAULT_PLAN_OPTIONS = [
  {
    id: 1,
    tag: "Torneo",
    tagClass: "berry",
    title: "Torneo de Super Smash Bros Ultimate",
    desc: "Retas en pantalla grande o proyector en la sala. Eliminatorias 1v1 y todos contra todos.",
    votes: 3
  },
  {
    id: 2,
    tag: "Comida",
    tagClass: "amber",
    title: "Asado al carbón en la terraza",
    desc: "Parrillada frente al mar en Chelem con hamburguesas al carbón, cortes y guarniciones.",
    votes: 4
  }
];

let currentUser = null;
let activeCategory = "eyes";
let attendeesList = [];
let carsList = [];
let planOptions = [];
let userVotes = new Set();
let missionState = { step1: false, step2: false, step3: false, step4: false };

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  loadState();
  initSwatches();
  renderAll();
  setupEventListeners();
});

// ----------------- Construcción Nativa de URL SVG ----------------- //
function buildRobotUrl(cfg, overrideKey = null, overrideVal = null) {
  if (!cfg) return "https://api.dicebear.com/7.x/bottts/svg?seed=chelem";
  const c = Object.assign({}, cfg);
  if (overrideKey) c[overrideKey] = overrideVal;

  const cleanHex = (c.baseColor || "039be5").replace("#", "");
  const params = new URLSearchParams({
    baseColor: cleanHex,
    eyes: c.eyes || "eva",
    face: c.face || "round01"
  });

  if (c.mouth && c.mouth !== "none") {
    params.set("mouth", c.mouth);
    params.set("mouthProbability", "100");
  } else {
    params.set("mouthProbability", "0");
  }

  if (c.top && c.top !== "none") {
    params.set("top", c.top);
    params.set("topProbability", "100");
  } else {
    params.set("topProbability", "0");
  }

  if (c.sides && c.sides !== "none") {
    params.set("sides", c.sides);
    params.set("sidesProbability", "100");
  } else {
    params.set("sidesProbability", "0");
  }

  if (c.texture && c.texture !== "none") {
    params.set("texture", c.texture);
    params.set("textureProbability", "100");
  } else {
    params.set("textureProbability", "0");
  }

  if (c.flip) params.set("flip", "true");
  if (c.scale && c.scale !== 100) params.set("scale", String(c.scale));
  if (c.rotate && c.rotate !== 0) params.set("rotate", String(c.rotate));

  return `https://api.dicebear.com/7.x/bottts/svg?${params.toString()}`;
}

// ----------------- Contador Regresivo ----------------- //
function initCountdown() {
  const elDays = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMins = document.getElementById("cdMins");
  const elSecs = document.getElementById("cdSecs");

  function update() {
    const now = new Date().getTime();
    const diff = EVENT_DATE - now;
    if (diff <= 0) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    elDays.textContent = String(d).padStart(2, "0");
    elHours.textContent = String(h).padStart(2, "0");
    elMins.textContent = String(m).padStart(2, "0");
    elSecs.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ----------------- Estado Local (v5 Visual Nativo) ----------------- //
function loadState() {
  const savedAttendees = localStorage.getItem("posada_attendees_v5");
  attendeesList = savedAttendees ? JSON.parse(savedAttendees) : DEFAULT_ATTENDEES;

  const savedCars = localStorage.getItem("posada_cars_v5");
  carsList = savedCars ? JSON.parse(savedCars) : [];

  const savedOptions = localStorage.getItem("posada_options_v5");
  planOptions = savedOptions ? JSON.parse(savedOptions) : DEFAULT_PLAN_OPTIONS;

  const savedVotes = localStorage.getItem("posada_votes_v5");
  if (savedVotes) userVotes = new Set(JSON.parse(savedVotes));

  const savedMissions = localStorage.getItem("posada_missions_v5");
  if (savedMissions) missionState = JSON.parse(savedMissions);

  const savedUser = localStorage.getItem("posada_user_v5");
  if (savedUser) {
    const parsed = JSON.parse(savedUser);
    currentUser = attendeesList.find(u => u.id === parsed.id) || attendeesList[1];
  } else {
    currentUser = attendeesList.find(u => u.name === "Roberto") || attendeesList[0];
  }
}

function saveState() {
  localStorage.setItem("posada_attendees_v5", JSON.stringify(attendeesList));
  localStorage.setItem("posada_cars_v5", JSON.stringify(carsList));
  localStorage.setItem("posada_options_v5", JSON.stringify(planOptions));
  localStorage.setItem("posada_votes_v5", JSON.stringify(Array.from(userVotes)));
  localStorage.setItem("posada_missions_v5", JSON.stringify(missionState));
  if (currentUser) {
    localStorage.setItem("posada_user_v5", JSON.stringify(currentUser));
  }
}

// ----------------- Paleta de Colores + Selector RGB Libre ----------------- //
function initSwatches() {
  const chassisWrap = document.getElementById("chassisColorSwatches");
  const bgWrap = document.getElementById("bgColorSwatches");

  chassisWrap.innerHTML = "";
  CHASSIS_HEX_LIST.forEach(hex => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-swatch";
    btn.style.backgroundColor = `#${hex}`;
    btn.dataset.hex = hex;
    btn.onclick = () => {
      if (!currentUser) return;
      currentUser.config.baseColor = hex;
      triggerPedestalBounce();
      syncWorkshopUI();
      renderWhosGoing();
      renderUserHud();
    };
    chassisWrap.appendChild(btn);
  });

  // Selector libre RGB para el chasis
  const customChassisInput = document.createElement("input");
  customChassisInput.type = "color";
  customChassisInput.className = "custom-color-picker";
  customChassisInput.title = "Elegir cualquier color personalizado";
  customChassisInput.value = "#039be5";
  customChassisInput.addEventListener("input", (e) => {
    if (!currentUser) return;
    currentUser.config.baseColor = e.target.value.replace("#", "");
    syncWorkshopUI();
    renderWhosGoing();
    renderUserHud();
  });
  chassisWrap.appendChild(customChassisInput);

  bgWrap.innerHTML = "";
  PEDESTAL_BG_LIST.forEach(bgHex => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-swatch";
    btn.style.backgroundColor = bgHex;
    btn.dataset.bg = bgHex;
    btn.onclick = () => {
      if (!currentUser) return;
      currentUser.config.bgColor = bgHex;
      triggerPedestalBounce();
      syncWorkshopUI();
      renderWhosGoing();
    };
    bgWrap.appendChild(btn);
  });

  // Selector libre RGB para el fondo
  const customBgInput = document.createElement("input");
  customBgInput.type = "color";
  customBgInput.className = "custom-color-picker";
  customBgInput.title = "Elegir cualquier color de fondo";
  customBgInput.value = "#E3F2FD";
  customBgInput.addEventListener("input", (e) => {
    if (!currentUser) return;
    currentUser.config.bgColor = e.target.value;
    syncWorkshopUI();
    renderWhosGoing();
  });
  bgWrap.appendChild(customBgInput);
}

function triggerPedestalBounce() {
  const ped = document.getElementById("robotPedestal");
  if (!ped) return;
  ped.classList.remove("pop-anim");
  void ped.offsetWidth;
  ped.classList.add("pop-anim");
  setTimeout(() => ped.classList.remove("pop-anim"), 340);
}

// ----------------- Renderizado General ----------------- //
function renderAll() {
  renderUserHud();
  renderWhosGoing();
  syncWorkshopUI();
  renderTransportSection();
  renderPlanOptions();
  renderSwitchUserList();
}

function renderUserHud() {
  if (!currentUser) return;
  document.getElementById("navUserAvatar").src = buildRobotUrl(currentUser.config);
  document.getElementById("navUserName").textContent = currentUser.name;

  let xp = 0;
  let completedCount = 0;

  if (missionState.step1) { xp += 100; completedCount++; }
  if (missionState.step2) { xp += currentUser.puedo_dar_coche ? 150 : 100; completedCount++; }
  if (userVotes.size > 0) { missionState.step3 = true; xp += userVotes.size * 50; completedCount++; }
  if (missionState.step4) { xp += 200; completedCount++; }

  document.getElementById("hudXpBadge").textContent = `${xp} XP`;
  document.getElementById("hudLevelText").textContent = `${completedCount}/4`;
  document.getElementById("hudProgressFill").style.width = `${(completedCount / 4) * 100}%`;

  ["step1", "step2", "step3", "step4"].forEach((k, idx) => {
    const pill = document.getElementById(`hudStep${idx + 1}`);
    if (pill) pill.classList.toggle("done", Boolean(missionState[k]));
  });
}

function syncWorkshopUI() {
  if (!currentUser) return;
  const cfg = currentUser.config;

  const previewImg = document.getElementById("avatarPreviewTarget");
  const pedestal = document.getElementById("robotPedestal");
  const nameInput = document.getElementById("nameEditField");
  const sliderScale = document.getElementById("sliderScale");
  const sliderRotate = document.getElementById("sliderRotate");

  if (previewImg) previewImg.src = buildRobotUrl(cfg);
  if (pedestal) pedestal.style.backgroundColor = cfg.bgColor || "#E3F2FD";
  if (nameInput && document.activeElement !== nameInput) {
    nameInput.value = currentUser.name;
  }
  if (sliderScale) sliderScale.value = cfg.scale || 100;
  if (sliderRotate) sliderRotate.value = cfg.rotate || 0;

  document.querySelectorAll("#chassisColorSwatches .color-swatch").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.hex === cfg.baseColor);
  });

  document.querySelectorAll("#bgColorSwatches .color-swatch").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.bg === cfg.bgColor);
  });

  renderVisualCatalogGrid();
}

// Renderiza la cuadrícula visual de miniaturas SVG para la categoría activa
function renderVisualCatalogGrid() {
  const grid = document.getElementById("visualPartsGrid");
  if (!grid || !currentUser) return;
  grid.innerHTML = "";

  const cfg = currentUser.config;
  const options = NATIVE_PARTS[activeCategory] || [];

  options.forEach(partVal => {
    const isSelected = cfg[activeCategory] === partVal;
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `visual-part-tile ${isSelected ? 'selected' : ''}`;

    if (partVal === "none") {
      tile.innerHTML = `<span class="tile-none-box">Sin pieza</span>`;
    } else {
      const thumbUrl = buildRobotUrl(cfg, activeCategory, partVal);
      tile.innerHTML = `<img src="${thumbUrl}" alt="${partVal}" loading="lazy">`;
    }

    tile.onclick = () => {
      cfg[activeCategory] = partVal;
      triggerPedestalBounce();
      syncWorkshopUI();
      renderWhosGoing();
      renderUserHud();
    };

    grid.appendChild(tile);
  });
}

function renderWhosGoing() {
  const grid = document.getElementById("whosGoingGrid");
  grid.innerHTML = "";

  attendeesList.forEach(person => {
    const isMe = currentUser && currentUser.id === person.id;
    const isVIP = person.puedo_dar_coche === 1;

    const card = document.createElement("div");
    card.className = `friend-card ${isMe ? 'active' : ''}`;

    let statusText = "Confirmado";
    if (isVIP) statusText = "Conductor VIP";
    else if (person.travelMode === "passenger") statusText = "Pasajero";

    card.innerHTML = `
      <div class="friend-avatar-wrap" style="background-color: ${person.config.bgColor || '#E3F2FD'};">
        <img src="${buildRobotUrl(person.config)}" alt="${person.name}">
      </div>
      <div class="friend-info">
        <div class="friend-name">${person.name}</div>
        <span class="friend-status ${isVIP ? 'vip' : ''}">${statusText}</span>
      </div>
    `;

    card.onclick = () => {
      currentUser = person;
      saveState();
      renderAll();
      triggerPedestalBounce();
      showToast(`Editando a ${person.name}`);
    };

    grid.appendChild(card);
  });
}

function renderTransportSection() {
  const driverCard = document.getElementById("choiceDriverCard");
  const passCard = document.getElementById("choicePassengerCard");

  if (currentUser) {
    driverCard.classList.toggle("selected-mode", currentUser.puedo_dar_coche === 1);
    passCard.classList.toggle("selected-mode", currentUser.travelMode === "passenger" && currentUser.puedo_dar_coche === 0);
  }

  const container = document.getElementById("carsContainer");
  container.innerHTML = "";

  if (carsList.length === 0) return;

  const list = document.createElement("div");
  list.className = "plan-deck";

  carsList.forEach(car => {
    const isMine = currentUser && car.driverId === currentUser.id;
    const item = document.createElement("div");
    item.className = "plan-card";
    item.style.background = "var(--pine-bg)";

    item.innerHTML = `
      <div>
        <div class="plan-card-top">
          <span class="plan-tag pine">Auto VIP Activo</span>
          <span class="plan-votes-num">${car.seats} lugares</span>
        </div>
        <h4 class="plan-card-title">${car.driver} &mdash; ${car.model}</h4>
        <p class="plan-card-desc">
          Salida: <strong>${car.zone}</strong> a las <strong>${car.time}</strong>
          ${car.notes ? `<br>Nota: ${car.notes}` : ''}
        </p>
      </div>
      <div>
        ${
          isMine
            ? `<button type="button" class="btn btn-sm" onclick="retireCar(${car.id})">Retirar mi coche</button>`
            : `<button type="button" class="btn btn-ocean btn-sm" onclick="joinCar('${car.driver}')">Pedir lugar en este auto</button>`
        }
      </div>
    `;
    list.appendChild(item);
  });

  container.appendChild(list);
}

function joinCar(driverName) {
  if (currentUser) {
    currentUser.travelMode = "passenger";
  }
  missionState.step2 = true;
  saveState();
  renderAll();
  launchConfetti();
  showToast(`Lugar solicitado con ${driverName} (+100 XP)`);
}

function renderPlanOptions() {
  const grid = document.getElementById("optionsGrid");
  grid.innerHTML = "";

  const maxVotes = Math.max(5, ...planOptions.map(o => o.votes));

  planOptions.forEach(opt => {
    const voted = userVotes.has(opt.id);
    const pct = Math.min(100, Math.round((opt.votes / maxVotes) * 100));

    const card = document.createElement("div");
    card.className = `plan-card ${voted ? 'voted-card' : ''}`;

    card.innerHTML = `
      <div>
        <div class="plan-card-top">
          <span class="plan-tag ${opt.tagClass || 'teal'}">${opt.tag}</span>
          <span class="plan-votes-num">${opt.votes} ${opt.votes === 1 ? 'voto' : 'votos'}</span>
        </div>
        <h3 class="plan-card-title">${opt.title}</h3>
        <p class="plan-card-desc">${opt.desc}</p>
      </div>
      <div>
        <div class="plan-progress">
          <div class="plan-progress-bar" style="width: ${pct}%;"></div>
        </div>
        <button type="button" class="btn ${voted ? 'btn-berry' : 'btn-sun'}" style="width:100%;" onclick="toggleVote(${opt.id})">
          ${voted ? 'Voto registrado (Quitar)' : 'Dar mi voto (+50 XP)'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function toggleVote(id) {
  const opt = planOptions.find(o => o.id === id);
  if (!opt) return;

  const wasEmpty = userVotes.size === 0;

  if (userVotes.has(id)) {
    userVotes.delete(id);
    opt.votes = Math.max(0, opt.votes - 1);
    showToast(`Voto retirado de ${opt.title}`);
  } else {
    userVotes.add(id);
    opt.votes += 1;
    missionState.step3 = true;
    if (wasEmpty) launchConfetti();
    showToast(`+50 XP por votar en: ${opt.title}`);
  }

  saveState();
  renderAll();
}

function retireCar(id) {
  carsList = carsList.filter(c => c.id !== id);
  if (currentUser) {
    currentUser.puedo_dar_coche = 0;
  }
  saveState();
  renderAll();
  showToast("Coche retirado");
}

// ----------------- pus.io: Forjador de Sugerencias ----------------- //
function handlePusioSuggestion(rawText) {
  const text = rawText.trim();
  if (!text) return;

  addChatBubble(text, "user");

  setTimeout(() => {
    const parsed = parseIdea(text);
    const newOption = {
      id: Date.now(),
      tag: parsed.category,
      tagClass: parsed.tagClass,
      title: parsed.title,
      desc: `Sugerencia forjada por ${currentUser ? currentUser.name : 'un amigo'} con pus.io.`,
      votes: 1
    };

    planOptions.push(newOption);
    userVotes.add(newOption.id);
    missionState.step4 = true;
    missionState.step3 = true;

    saveState();
    renderAll();
    launchConfetti();

    addChatBubble(
      `Excelente idea, ${currentUser ? currentUser.name : ''}. Acabo de forjar la carta "${parsed.title}" en el Paso 3 con tu primer voto (+200 XP).`,
      "bot"
    );
    showToast(`+200 XP: Nueva carta añadida al plan`);
  }, 300);
}

function parseIdea(text) {
  const lower = text.toLowerCase();
  let category = "Propuesta";
  let tagClass = "teal";

  if (lower.includes("comida") || lower.includes("asado") || lower.includes("aguachile") || lower.includes("botana") || lower.includes("carne") || lower.includes("tacos") || lower.includes("pizza")) {
    category = "Comida";
    tagClass = "amber";
  } else if (lower.includes("bebida") || lower.includes("cerveza") || lower.includes("hielera") || lower.includes("refresco") || lower.includes("hielo")) {
    category = "Bebidas";
    tagClass = "pine";
  } else if (lower.includes("juego") || lower.includes("torneo") || lower.includes("mario") || lower.includes("smash") || lower.includes("reta") || lower.includes("pong")) {
    category = "Juego";
    tagClass = "berry";
  } else if (lower.includes("cine") || lower.includes("película") || lower.includes("proyectar") || lower.includes("música") || lower.includes("bocina")) {
    category = "Ambiente";
    tagClass = "teal";
  }

  let title = text
    .replace(/^(propongo|sugiero que|sugiero|podríamos|hay que|llevar|armar|preparar)\s+/i, "")
    .trim();

  title = title.charAt(0).toUpperCase() + title.slice(1);
  if (title.endsWith(".")) title = title.slice(0, -1);

  return { category, tagClass, title };
}

function addChatBubble(text, role) {
  const win = document.getElementById("pusioChatArea");
  const div = document.createElement("div");
  div.className = `bubble ${role}`;
  div.textContent = text;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

// ----------------- Confeti Vectorial ----------------- //
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#FF4757", "#00A878", "#0984E3", "#FFB142", "#6C5CE7"];
  const pieces = Array.from({ length: 55 }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 260,
    y: canvas.height * 0.45,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 14 - 4,
    size: 7 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
    vrot: (Math.random() - 0.5) * 0.25
  }));

  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.rot += p.vrot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.strokeStyle = "#121316";
      ctx.lineWidth = 1;
      ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    });
    frame++;
    if (frame < 75) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(tick);
}

function showToast(msg) {
  const toast = document.getElementById("toastNotice");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

// ----------------- Event Listeners ----------------- //
function setupEventListeners() {
  document.getElementById("btnUserChip").onclick = () => openModal("modalSwitchUser");
  document.getElementById("btnOpenCarModal").onclick = () => openModal("modalCar");

  // Cambio de pestaña de categoría de piezas
  document.querySelectorAll("#workshopTabs .part-tab-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll("#workshopTabs .part-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.cat;
      renderVisualCatalogGrid();
    };
  });

  // Invertir orientación horizontal (flip)
  document.getElementById("btnFlipRobot").onclick = () => {
    if (!currentUser) return;
    currentUser.config.flip = !currentUser.config.flip;
    triggerPedestalBounce();
    syncWorkshopUI();
    renderWhosGoing();
    renderUserHud();
  };

  // Sliders nativos de Zoom y Giro
  document.getElementById("sliderScale").addEventListener("input", (e) => {
    if (!currentUser) return;
    currentUser.config.scale = parseInt(e.target.value, 10);
    syncWorkshopUI();
    renderWhosGoing();
    renderUserHud();
  });

  document.getElementById("sliderRotate").addEventListener("input", (e) => {
    if (!currentUser) return;
    currentUser.config.rotate = parseInt(e.target.value, 10);
    syncWorkshopUI();
    renderWhosGoing();
    renderUserHud();
  });

  // Combinación al azar
  document.getElementById("btnRandomRobot").onclick = () => {
    if (!currentUser) return;
    const cfg = currentUser.config;
    cfg.baseColor = CHASSIS_HEX_LIST[Math.floor(Math.random() * CHASSIS_HEX_LIST.length)];
    cfg.bgColor = PEDESTAL_BG_LIST[Math.floor(Math.random() * PEDESTAL_BG_LIST.length)];
    Object.keys(NATIVE_PARTS).forEach(k => {
      const list = NATIVE_PARTS[k];
      cfg[k] = list[Math.floor(Math.random() * list.length)];
    });
    cfg.rotate = 0;
    cfg.scale = 100;
    triggerPedestalBounce();
    syncWorkshopUI();
    renderWhosGoing();
    renderUserHud();
  };

  // Guardar personaje (+100 XP)
  document.getElementById("btnSaveCharacter").onclick = () => {
    if (!currentUser) return;
    const nameVal = document.getElementById("nameEditField").value.trim();
    if (nameVal) currentUser.name = nameVal;

    const wasDone = missionState.step1;
    missionState.step1 = true;
    saveState();
    renderAll();
    if (!wasDone) launchConfetti();
    showToast(`Personaje guardado para ${currentUser.name} (+100 XP)`);
  };

  // Editar nombre en vivo
  document.getElementById("nameEditField").addEventListener("input", (e) => {
    if (!currentUser) return;
    const v = e.target.value.trim();
    if (v) {
      currentUser.name = v;
      renderWhosGoing();
      renderUserHud();
    }
  });

  // Confirmar como pasajero
  document.getElementById("btnConfirmPassenger").onclick = () => {
    if (!currentUser) return;
    currentUser.travelMode = "passenger";
    currentUser.puedo_dar_coche = 0;
    const wasDone = missionState.step2;
    missionState.step2 = true;
    saveState();
    renderAll();
    if (!wasDone) launchConfetti();
    showToast(`${currentUser.name} confirmado como pasajero (+100 XP)`);
  };

  // Registrar coche
  document.getElementById("carForm").onsubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const newCar = {
      id: Date.now(),
      driverId: currentUser.id,
      driver: currentUser.name,
      model: document.getElementById("carInputModel").value.trim(),
      seats: document.getElementById("carInputSeats").value,
      zone: document.getElementById("carInputZone").value.trim(),
      time: document.getElementById("carInputTime").value.trim(),
      notes: document.getElementById("carInputNotes").value.trim()
    };

    carsList.push(newCar);
    currentUser.puedo_dar_coche = 1;
    currentUser.travelMode = "driver";
    missionState.step2 = true;

    saveState();
    closeModal("modalCar");
    document.getElementById("carForm").reset();
    renderAll();
    launchConfetti();
    showToast(`Coche registrado y Rango VIP activado (+150 XP)`);
  };

  // Cartas rápidas de pus.io
  document.querySelectorAll(".idea-chip-btn").forEach(btn => {
    btn.onclick = () => {
      const idea = btn.getAttribute("data-idea");
      if (idea) handlePusioSuggestion(idea);
    };
  });

  // Formulario pus.io
  document.getElementById("pusioForm").onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("pusioInput");
    const val = input.value.trim();
    if (val) {
      handlePusioSuggestion(val);
      input.value = "";
    }
  };

  // Cerrar modales
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.onclick = () => closeModal(btn.getAttribute("data-close"));
  });
}

function renderSwitchUserList() {
  const container = document.getElementById("userSwitchOptions");
  if (!container) return;
  container.innerHTML = "";

  attendeesList.forEach(u => {
    const isMe = currentUser && currentUser.id === u.id;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn ${isMe ? 'btn-sun' : ''}`;
    btn.style.width = "100%";
    btn.style.justifyContent = "space-between";
    btn.style.marginBottom = "8px";
    btn.innerHTML = `
      <span style="display:flex; align-items:center; gap:10px;">
        <img src="${buildRobotUrl(u.config)}" style="width:32px; height:32px; border-radius:50%; background:${u.config.bgColor}; border:1px solid #121316;">
        <span style="font-family:var(--font-display); font-size:1.25rem;">${u.name}</span>
      </span>
      <span style="font-family:var(--font-mono); font-size:0.72rem;">${isMe ? 'JUGANDO' : 'ELEGIR'}</span>
    `;
    btn.onclick = () => {
      currentUser = u;
      saveState();
      renderAll();
      closeModal("modalSwitchUser");
      showToast(`Jugador activo: ${u.name}`);
    };
    container.appendChild(btn);
  });
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

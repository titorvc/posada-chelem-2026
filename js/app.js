/**
 * POSADA CHELEM 2026 — CONTROLADOR GAMIFICADO & TALLER DE PERSONAJE
 * - Taller interactivo de robot con partes seleccionables y paleta de colores
 * - Sistema de misiones (Pasos 1 a 4) con puntos XP y confeti vectorial
 * - Asistente pus.io que forja tarjetas votables en vivo
 * - Cero emojis
 */

const EVENT_DATE = new Date("2026-12-19T15:00:00-06:00").getTime();

// Catálogo oficial de piezas de DiceBear Bottts v7
const ROBOT_PARTS = {
  eyes: [
    { id: "eva", label: "Eva Cyber" },
    { id: "shade01", label: "Lentes de Sol" },
    { id: "robocop", label: "Visor Robocop" },
    { id: "happy", label: "Arco Feliz" },
    { id: "glow", label: "Brillo Neón" },
    { id: "sensor", label: "Sensor Óptico" },
    { id: "roundFrame01", label: "Marco Redondo" },
    { id: "roundFrame02", label: "Doble Lente" },
    { id: "bulging", label: "Ojos Saltones" },
    { id: "hearts", label: "Modo Fiesta" },
    { id: "dizzy", label: "Mareado" },
    { id: "frame1", label: "Visor Ancho" }
  ],
  top: [
    { id: "radar", label: "Antena Radar" },
    { id: "glowingBulb01", label: "Foco Brillante" },
    { id: "horns", label: "Cuernos Arcade" },
    { id: "lights", label: "Sirena Triple" },
    { id: "pyramid", label: "Pirámide" },
    { id: "antenna", label: "Antena Clásica" },
    { id: "antennaCrooked", label: "Antena Doblada" },
    { id: "bulb01", label: "Bulbo Retro" },
    { id: "glowingBulb02", label: "Foco Solar" }
  ],
  mouth: [
    { id: "smile01", label: "Sonrisa" },
    { id: "smile02", label: "Gran Sonrisa" },
    { id: "grill03", label: "Vocoder" },
    { id: "bite", label: "Mordida" },
    { id: "diagram", label: "Ondas de Audio" },
    { id: "grill01", label: "Rejilla Clásica" },
    { id: "grill02", label: "Rejilla Fina" },
    { id: "square01", label: "Pixelada" },
    { id: "square02", label: "Sintetizador" }
  ],
  face: [
    { id: "round01", label: "Clásico" },
    { id: "round02", label: "Cápsula" },
    { id: "square01", label: "Cuadrado Retro" },
    { id: "square02", label: "Blindado" },
    { id: "square03", label: "Compacto" },
    { id: "square04", label: "Industrial" }
  ],
  sides: [
    { id: "cables01", label: "Cables" },
    { id: "cables02", label: "Doble Cable" },
    { id: "antenna01", label: "Antena Lateral" },
    { id: "antenna02", label: "Transmisor" },
    { id: "round", label: "Audífonos" },
    { id: "square", label: "Bloques" },
    { id: "squareAssymetric", label: "Asimétrico" }
  ],
  texture: [
    { id: "none", label: "Limpio" },
    { id: "circuits", label: "Circuitos" },
    { id: "dots", label: "Puntos" },
    { id: "camo01", label: "Camuflaje" },
    { id: "grunge01", label: "Urbano" }
  ]
};

const CHASSIS_COLORS = [
  { hex: "039be5", label: "Azul Chelem" },
  { hex: "e53935", label: "Rojo Coral" },
  { hex: "00897b", label: "Verde Pino" },
  { hex: "ffb300", label: "Amarillo Sol" },
  { hex: "fb8c00", label: "Naranja Playa" },
  { hex: "8e24aa", label: "Morado Arcade" },
  { hex: "00acc1", label: "Turquesa Mar" },
  { hex: "d81b60", label: "Berry Festivo" },
  { hex: "546e7a", label: "Acero Titanio" }
];

const PEDESTAL_BG_COLORS = [
  { hex: "#E3F2FD", label: "Cielo" },
  { hex: "#FFE8EA", label: "Coral Suave" },
  { hex: "#E0F8F0", label: "Menta" },
  { hex: "#FFF4E0", label: "Arena" },
  { hex: "#EFEFFD", label: "Lavanda" },
  { hex: "#F2EFE6", label: "Crema" }
];

// Lista inicial de amigos con configuraciones distintas de piezas y colores
const DEFAULT_ATTENDEES = [
  {
    id: 1, name: "Reyvell", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "ffb300", bgColor: "#FFF4E0", eyes: 1, top: 0, mouth: 1, face: 0, sides: 4, texture: 0 }
  },
  {
    id: 2, name: "Roberto", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "039be5", bgColor: "#E3F2FD", eyes: 0, top: 1, mouth: 0, face: 2, sides: 0, texture: 1 }
  },
  {
    id: 3, name: "Daniel", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "00897b", bgColor: "#E0F8F0", eyes: 3, top: 3, mouth: 2, face: 1, sides: 2, texture: 0 }
  },
  {
    id: 4, name: "Pinzón", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "e53935", bgColor: "#FFE8EA", eyes: 2, top: 2, mouth: 0, face: 3, sides: 1, texture: 0 }
  },
  {
    id: 5, name: "Alejandro", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "8e24aa", bgColor: "#EFEFFD", eyes: 4, top: 4, mouth: 4, face: 0, sides: 4, texture: 2 }
  },
  {
    id: 6, name: "Erik", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "fb8c00", bgColor: "#FFF4E0", eyes: 5, top: 5, mouth: 2, face: 4, sides: 0, texture: 0 }
  },
  {
    id: 7, name: "Iván", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "00acc1", bgColor: "#E3F2FD", eyes: 6, top: 0, mouth: 1, face: 2, sides: 3, texture: 1 }
  },
  {
    id: 8, name: "Francisco", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "d81b60", bgColor: "#FFE8EA", eyes: 1, top: 6, mouth: 3, face: 1, sides: 4, texture: 0 }
  },
  {
    id: 9, name: "Carlos", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "546e7a", bgColor: "#F2EFE6", eyes: 2, top: 1, mouth: 4, face: 5, sides: 1, texture: 1 }
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

// ----------------- URL Dinámica de DiceBear con Partes Seleccionables ----------------- //
function buildRobotUrl(cfg) {
  if (!cfg) return "https://api.dicebear.com/7.x/bottts/svg?seed=chelem";
  const eyesId = ROBOT_PARTS.eyes[cfg.eyes % ROBOT_PARTS.eyes.length].id;
  const topId = ROBOT_PARTS.top[cfg.top % ROBOT_PARTS.top.length].id;
  const mouthId = ROBOT_PARTS.mouth[cfg.mouth % ROBOT_PARTS.mouth.length].id;
  const faceId = ROBOT_PARTS.face[cfg.face % ROBOT_PARTS.face.length].id;
  const sidesId = ROBOT_PARTS.sides[cfg.sides % ROBOT_PARTS.sides.length].id;
  const texObj = ROBOT_PARTS.texture[cfg.texture % ROBOT_PARTS.texture.length];

  const params = new URLSearchParams({
    baseColor: cfg.baseColor || "039be5",
    eyes: eyesId,
    top: topId,
    mouth: mouthId,
    face: faceId,
    sides: sidesId,
    mouthProbability: "100",
    sidesProbability: "100",
    topProbability: "100"
  });

  if (texObj && texObj.id !== "none") {
    params.set("texture", texObj.id);
    params.set("textureProbability", "100");
  } else {
    params.set("textureProbability", "0");
  }

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

// ----------------- Estado Local (v4 Gamificado) ----------------- //
function loadState() {
  const savedAttendees = localStorage.getItem("posada_attendees_v4");
  attendeesList = savedAttendees ? JSON.parse(savedAttendees) : DEFAULT_ATTENDEES;

  const savedCars = localStorage.getItem("posada_cars_v4");
  carsList = savedCars ? JSON.parse(savedCars) : [];

  const savedOptions = localStorage.getItem("posada_options_v4");
  planOptions = savedOptions ? JSON.parse(savedOptions) : DEFAULT_PLAN_OPTIONS;

  const savedVotes = localStorage.getItem("posada_votes_v4");
  if (savedVotes) userVotes = new Set(JSON.parse(savedVotes));

  const savedMissions = localStorage.getItem("posada_missions_v4");
  if (savedMissions) missionState = JSON.parse(savedMissions);

  const savedUser = localStorage.getItem("posada_user_v4");
  if (savedUser) {
    const parsed = JSON.parse(savedUser);
    currentUser = attendeesList.find(u => u.id === parsed.id) || attendeesList[1];
  } else {
    currentUser = attendeesList.find(u => u.name === "Roberto") || attendeesList[0];
  }
}

function saveState() {
  localStorage.setItem("posada_attendees_v4", JSON.stringify(attendeesList));
  localStorage.setItem("posada_cars_v4", JSON.stringify(carsList));
  localStorage.setItem("posada_options_v4", JSON.stringify(planOptions));
  localStorage.setItem("posada_votes_v4", JSON.stringify(Array.from(userVotes)));
  localStorage.setItem("posada_missions_v4", JSON.stringify(missionState));
  if (currentUser) {
    localStorage.setItem("posada_user_v4", JSON.stringify(currentUser));
  }
}

// ----------------- Inicialización de Swatches de Color ----------------- //
function initSwatches() {
  const chassisWrap = document.getElementById("chassisColorSwatches");
  const bgWrap = document.getElementById("bgColorSwatches");

  chassisWrap.innerHTML = "";
  CHASSIS_COLORS.forEach(c => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-swatch";
    btn.style.backgroundColor = `#${c.hex}`;
    btn.title = c.label;
    btn.dataset.hex = c.hex;
    btn.onclick = () => {
      if (!currentUser) return;
      currentUser.config.baseColor = c.hex;
      triggerPedestalBounce();
      syncWorkshopUI();
      renderWhosGoing();
      renderUserHud();
    };
    chassisWrap.appendChild(btn);
  });

  bgWrap.innerHTML = "";
  PEDESTAL_BG_COLORS.forEach(bg => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-swatch";
    btn.style.backgroundColor = bg.hex;
    btn.title = bg.label;
    btn.dataset.bg = bg.hex;
    btn.onclick = () => {
      if (!currentUser) return;
      currentUser.config.bgColor = bg.hex;
      triggerPedestalBounce();
      syncWorkshopUI();
      renderWhosGoing();
    };
    bgWrap.appendChild(btn);
  });
}

function triggerPedestalBounce() {
  const ped = document.getElementById("robotPedestal");
  if (!ped) return;
  ped.classList.remove("pop-anim");
  void ped.offsetWidth;
  ped.classList.add("pop-anim");
  setTimeout(() => ped.classList.remove("pop-anim"), 360);
}

// ----------------- Cambiar Piezas del Robot (< / >) ----------------- //
function cyclePart(partKey, delta) {
  if (!currentUser || !ROBOT_PARTS[partKey]) return;
  const list = ROBOT_PARTS[partKey];
  const currentIdx = currentUser.config[partKey] || 0;
  const nextIdx = (currentIdx + delta + list.length) % list.length;
  currentUser.config[partKey] = nextIdx;

  triggerPedestalBounce();
  syncWorkshopUI();
  renderWhosGoing();
  renderUserHud();
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

  // Calcular XP y pasos completados
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
    if (pill) {
      if (missionState[k]) pill.classList.add("done");
      else pill.classList.remove("done");
    }
  });
}

function syncWorkshopUI() {
  if (!currentUser) return;
  const cfg = currentUser.config;

  const previewImg = document.getElementById("avatarPreviewTarget");
  const pedestal = document.getElementById("robotPedestal");
  const nameInput = document.getElementById("nameEditField");

  if (previewImg) previewImg.src = buildRobotUrl(cfg);
  if (pedestal) pedestal.style.backgroundColor = cfg.bgColor || "#E3F2FD";
  if (nameInput && document.activeElement !== nameInput) {
    nameInput.value = currentUser.name;
  }

  // Etiquetas de piezas actuales
  Object.keys(ROBOT_PARTS).forEach(key => {
    const lblEl = document.getElementById(`labelPart_${key}`);
    if (lblEl) {
      const idx = cfg[key] % ROBOT_PARTS[key].length;
      lblEl.textContent = ROBOT_PARTS[key][idx].label;
    }
  });

  // Etiqueta de color y estado activo en swatches
  const colorObj = CHASSIS_COLORS.find(c => c.hex === cfg.baseColor) || CHASSIS_COLORS[0];
  const colorLbl = document.getElementById("selectedColorLabel");
  if (colorLbl) colorLbl.textContent = colorObj.label;

  document.querySelectorAll("#chassisColorSwatches .color-swatch").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.hex === cfg.baseColor);
  });

  document.querySelectorAll("#bgColorSwatches .color-swatch").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.bg === cfg.bgColor);
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

// ----------------- Acciones de Juego ----------------- //
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

// Traducir un prompt en español a piezas reales del robot
function applyPromptToRobot(promptText) {
  if (!currentUser || !promptText) return;
  const lower = promptText.toLowerCase();
  const cfg = currentUser.config;

  // Colores por palabra clave
  if (lower.includes("rojo") || lower.includes("coral") || lower.includes("fuego")) cfg.baseColor = "e53935";
  else if (lower.includes("azul") || lower.includes("mar") || lower.includes("playa") || lower.includes("surfer")) cfg.baseColor = "039be5";
  else if (lower.includes("verde") || lower.includes("pino") || lower.includes("navid")) cfg.baseColor = "00897b";
  else if (lower.includes("amarillo") || lower.includes("oro") || lower.includes("dorado") || lower.includes("sol")) cfg.baseColor = "ffb300";
  else if (lower.includes("morado") || lower.includes("violeta") || lower.includes("cyber")) cfg.baseColor = "8e24aa";
  else if (lower.includes("naranja")) cfg.baseColor = "fb8c00";
  else if (lower.includes("rosa") || lower.includes("berry")) cfg.baseColor = "d81b60";

  // Ojos por palabra clave
  if (lower.includes("lente") || lower.includes("gafa") || lower.includes("sol") || lower.includes("cool")) cfg.eyes = 1;
  else if (lower.includes("robocop") || lower.includes("laser") || lower.includes("láser")) cfg.eyes = 2;
  else if (lower.includes("feliz") || lower.includes("alegre")) cfg.eyes = 3;
  else if (lower.includes("neon") || lower.includes("neón") || lower.includes("brill")) cfg.eyes = 4;
  else if (lower.includes("fiesta") || lower.includes("coraz")) cfg.eyes = 9;

  // Tope / Antena
  if (lower.includes("cuerno") || lower.includes("diablo") || lower.includes("rock")) cfg.top = 2;
  else if (lower.includes("radar")) cfg.top = 0;
  else if (lower.includes("foco") || lower.includes("idea") || lower.includes("luz")) cfg.top = 1;
  else if (lower.includes("sirena") || lower.includes("polic")) cfg.top = 3;
  else if (lower.includes("piramid") || lower.includes("pirámid")) cfg.top = 4;

  // Si no coincidió con palabras específicas, usar hash determinístico del prompt para variar todas las piezas
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash * 31 + lower.charCodeAt(i)) % 10000;
  }
  if (!lower.includes("lente") && !lower.includes("robocop") && !lower.includes("feliz")) {
    cfg.eyes = hash % ROBOT_PARTS.eyes.length;
  }
  cfg.mouth = (hash >> 2) % ROBOT_PARTS.mouth.length;
  cfg.face = (hash >> 3) % ROBOT_PARTS.face.length;
  cfg.sides = (hash >> 4) % ROBOT_PARTS.sides.length;

  triggerPedestalBounce();
  syncWorkshopUI();
  renderWhosGoing();
  renderUserHud();
  showToast(`Prompt aplicado al robot de ${currentUser.name}`);
}

// ----------------- pus.io: Forjador Gamificado de Sugerencias ----------------- //
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

// ----------------- Confeti Vectorial en Canvas ----------------- //
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

// ----------------- Notificación Toast ----------------- //
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

  // Botón Tirar Dados (Robot al azar)
  document.getElementById("btnRandomRobot").onclick = () => {
    if (!currentUser) return;
    const cfg = currentUser.config;
    cfg.baseColor = CHASSIS_COLORS[Math.floor(Math.random() * CHASSIS_COLORS.length)].hex;
    cfg.bgColor = PEDESTAL_BG_COLORS[Math.floor(Math.random() * PEDESTAL_BG_COLORS.length)].hex;
    Object.keys(ROBOT_PARTS).forEach(k => {
      cfg[k] = Math.floor(Math.random() * ROBOT_PARTS[k].length);
    });
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

  // Aplicar prompt al robot
  document.getElementById("btnApplyPrompt").onclick = () => {
    const val = document.getElementById("avatarPromptField").value.trim();
    if (val) applyPromptToRobot(val);
  };

  document.getElementById("avatarPromptField").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val) applyPromptToRobot(val);
    }
  });

  // Confirmar como pasajero (Paso 2)
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

  // Registrar coche (Paso 2 VIP)
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

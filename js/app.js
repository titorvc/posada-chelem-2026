/**
 * POSADA CHELEM 2026 — MOTOR AUTÉNTICO BOTTTS CON COLOR PRIMARIO/SECUNDARIO POR PIEZA
 * - Utiliza las ilustraciones vectoriales originales de Pablo Stanley (Bottts)
 * - Cada pieza (Cabeza, Ojos, Boca, Antena, Laterales, Textura, Fondo) tiene su propio
 *   Color Principal y Color Secundario controlados con Rueda de Hue + Saturación/Brillo
 * - Autenticación única con PIN/Clave secreta y Tablero de Planes y Propuestas
 * - Cero emojis
 */

const EVENT_DATE = new Date("2026-12-19T15:00:00-06:00").getTime();

const CATALOG_KEYS = {
  face:    ["round01", "round02", "square01", "square02", "square03", "square04"],
  eyes:    ["eva", "shade01", "robocop", "happy", "glow", "sensor", "roundFrame01", "roundFrame02", "bulging", "hearts", "dizzy", "frame1", "frame2", "round"],
  mouth:   ["smile01", "smile02", "grill03", "bite", "diagram", "grill01", "grill02", "square01", "square02", "none"],
  top:     ["radar", "glowingBulb01", "horns", "lights", "pyramid", "antenna", "antennaCrooked", "bulb01", "glowingBulb02", "none"],
  sides:   ["cables01", "cables02", "antenna01", "antenna02", "round", "square", "squareAssymetric", "none"],
  texture: ["none", "circuits", "dots", "camo01", "camo02", "grunge01", "grunge02", "dirty01", "dirty02"],
  bg:      ["solid", "linear", "radial", "rings", "grid", "split"]
};

const PART_LABELS = {
  face:    { title: "Diseños de Cabeza",    pri: "Color Principal",   sec: "Sombra y Detalle" },
  eyes:    { title: "Diseños de Ojos",      pri: "Mirada",            sec: "Marco y Gafas" },
  mouth:   { title: "Diseños de Boca",      pri: "Sonrisa",           sec: "Contorno" },
  top:     { title: "Detalle Superior",     pri: "Elemento Superior", sec: "Base" },
  sides:   { title: "Diseños Laterales",    pri: "Laterales",         sec: "Conectores" },
  texture: { title: "Patrón y Acabado",     pri: "Color del Patrón",  sec: "Fondo del Patrón" },
  bg:      { title: "Estilo de Fondo",      pri: "Fondo Primario",    sec: "Fondo Secundario" }
};

const QUICK_HSL_SWATCHES = [
  { h: 198, s: 90, l: 48 }, // Ocean Cyan
  { h: 168, s: 85, l: 42 }, // Emerald Teal
  { h: 350, s: 85, l: 58 }, // Coral Berry
  { h: 38,  s: 95, l: 54 }, // Sunny Gold
  { h: 262, s: 78, l: 58 }, // Electric Violet
  { h: 18,  s: 90, l: 55 }, // Sunset Orange
  { h: 145, s: 72, l: 45 }, // Nordic Pine
  { h: 215, s: 25, l: 22 }, // Dark Slate
  { h: 195, s: 75, l: 90 }, // Soft Sky
  { h: 42,  s: 80, l: 92 }  // Warm Cream
];

function createBotConfig(hue, fIdx, eIdx, mIdx, tIdx, sIdx, txIdx = 0) {
  return {
    face:    { shape: CATALOG_KEYS.face[fIdx % 6],       pri: { h: hue, s: 82, l: 52 }, sec: { h: (hue + 20) % 360, s: 75, l: 32 } },
    eyes:    { shape: CATALOG_KEYS.eyes[eIdx % 14],      pri: { h: (hue + 150) % 360, s: 95, l: 60 }, sec: { h: 215, s: 30, l: 15 } },
    mouth:   { shape: CATALOG_KEYS.mouth[mIdx % 9],      pri: { h: 165, s: 90, l: 62 }, sec: { h: 215, s: 28, l: 16 } },
    top:     { shape: CATALOG_KEYS.top[tIdx % 9],        pri: { h: (hue + 45) % 360, s: 88, l: 56 }, sec: { h: 42, s: 92, l: 58 } },
    sides:   { shape: CATALOG_KEYS.sides[sIdx % 7],      pri: { h: hue, s: 78, l: 48 }, sec: { h: 210, s: 32, l: 24 } },
    texture: { shape: CATALOG_KEYS.texture[txIdx % 9],   pri: { h: (hue + 180) % 360, s: 80, l: 75 }, sec: { h: hue, s: 82, l: 52 } },
    bg:      { shape: "linear",                          pri: { h: hue, s: 68, l: 92 }, sec: { h: (hue + 35) % 360, s: 65, l: 83 } }
  };
}

const DEFAULT_ATTENDEES = [
  { id: 1, name: "Reyvell",   email: "reyvelljk87@gmail.com",          pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(38,  0, 1, 1, 0, 4, 0) },
  { id: 2, name: "Roberto",   email: "titorvc08@gmail.com",            pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(198, 2, 0, 0, 1, 0, 1) },
  { id: 3, name: "Daniel",    email: "danielitoestabonito16@gmail.com",pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(162, 1, 3, 2, 3, 2, 0) },
  { id: 4, name: "Pinzón",    email: "mendoza.lpinzon@gmail.com",      pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(350, 3, 2, 0, 2, 1, 0) },
  { id: 5, name: "Alejandro", email: "alejandroaltamiranopuc@gmail.com",pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(265, 0, 4, 4, 4, 4, 2) },
  { id: 6, name: "Erik",      email: "joserikb@gmail.com",             pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(22,  4, 5, 5, 5, 0, 0) },
  { id: 7, name: "Iván",      email: "ivan.raygosa@gmail.com",         pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(184, 2, 6, 1, 0, 3, 1) },
  { id: 8, name: "Francisco", email: "fjvc091002@gmail.com",           pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(332, 1, 11, 3, 6, 4, 0) },
  { id: 9, name: "Carlos",    email: "cplus.lat@gmail.com",            pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(212, 5, 7, 7, 7, 5, 2) }
];

let currentUser = null;
let activePart = "face";
let activeColorChannel = "pri"; // "pri" o "sec"
let attendeesList = [];
let carsList = [];
let collaborations = [];
let uidCounter = 1;

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  loadState();
  initQuickSwatches();
  renderAll();
  setupEventListeners();
  setupModernHueWheel();
});

function hslStr(c) {
  if (!c) return "hsl(200, 80%, 50%)";
  return `hsl(${Math.round(c.h)}, ${Math.round(c.s)}%, ${Math.round(c.l)}%)`;
}

function computePinHash(email, pin) {
  const str = `${email.toLowerCase().trim()}::posada2026::${pin.trim()}`;
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

// ==========================================================================
// ENSAMBLADOR SVG AUTÉNTICO DE BOTTTS CON COLORES INDEPENDIENTES POR CAPA
// ==========================================================================
function renderRobotSVG(robotCfg, overridePart = null, overrideShape = null) {
  const lib = window.BOTTTS_LIBRARY;
  if (!lib) return `<svg viewBox="0 0 180 180"></svg>`;

  const r = JSON.parse(JSON.stringify(robotCfg || createBotConfig(200, 0, 0, 0, 0, 0)));
  if (overridePart && overrideShape !== null) {
    r[overridePart].shape = overrideShape;
  }

  const uid = "u" + (uidCounter++);

  // 1. Fondo personalizado
  const bgPri = hslStr(r.bg.pri);
  const bgSec = hslStr(r.bg.sec);
  let bgSvg = `<rect width="180" height="180" fill="${bgPri}"/>`;
  if (r.bg.shape === "linear") {
    bgSvg = `<defs><linearGradient id="bg_${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bgPri}"/><stop offset="100%" stop-color="${bgSec}"/></linearGradient></defs><rect width="180" height="180" fill="url(#bg_${uid})"/>`;
  } else if (r.bg.shape === "radial") {
    bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><circle cx="90" cy="95" r="68" fill="${bgSec}"/>`;
  } else if (r.bg.shape === "rings") {
    bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><circle cx="90" cy="95" r="72" fill="none" stroke="${bgSec}" stroke-width="10"/><circle cx="90" cy="95" r="50" fill="none" stroke="${bgSec}" stroke-width="6"/>`;
  } else if (r.bg.shape === "grid") {
    bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><path d="M0 45 H180 M0 90 H180 M0 135 H180 M45 0 V180 M90 0 V180 M135 0 V180" stroke="${bgSec}" stroke-width="2.5"/>`;
  } else if (r.bg.shape === "split") {
    bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><polygon points="0,180 180,0 180,180" fill="${bgSec}"/>`;
  }

  // 2. Laterales (sides)
  let sidesSvg = "";
  if (r.sides.shape && r.sides.shape !== "none" && lib.sides[r.sides.shape]) {
    sidesSvg = lib.sides[r.sides.shape]
      .replace(/\{\{UID\}\}/g, uid)
      .replace(/\{\{PRI\}\}/g, hslStr(r.sides.pri))
      .replace(/\{\{SEC\}\}/g, hslStr(r.sides.sec));
  }

  // 3. Antena (top)
  let topSvg = "";
  if (r.top.shape && r.top.shape !== "none" && lib.top[r.top.shape]) {
    topSvg = lib.top[r.top.shape]
      .replace(/\{\{UID\}\}/g, uid)
      .replace(/\{\{PRI\}\}/g, hslStr(r.top.pri))
      .replace(/\{\{SEC\}\}/g, hslStr(r.top.sec));
  }

  // 4. Textura dentro de Cabeza (texture)
  let texSvg = "";
  const texKey = r.texture ? r.texture.shape : "none";
  if (texKey && texKey !== "none" && lib.texture[texKey]) {
    const texColor = activePart === "texture" ? hslStr(r.texture.pri) : hslStr(r.face.sec);
    texSvg = lib.texture[texKey]
      .replace(/\{\{UID\}\}/g, uid)
      .replace(/\{\{SEC\}\}/g, texColor);
  }

  // 5. Cabeza (face)
  const faceKey = lib.face[r.face.shape] ? r.face.shape : "round01";
  const faceSvg = lib.face[faceKey]
    .replace(/\{\{UID\}\}/g, uid)
    .replace(/\{\{PRI\}\}/g, hslStr(r.face.pri))
    .replace(/\{\{TEXTURE\}\}/g, texSvg);

  // 6. Boca (mouth)
  let mouthSvg = "";
  if (r.mouth.shape && r.mouth.shape !== "none" && lib.mouth[r.mouth.shape]) {
    mouthSvg = lib.mouth[r.mouth.shape]
      .replace(/\{\{UID\}\}/g, uid)
      .replace(/\{\{PRI\}\}/g, hslStr(r.mouth.pri))
      .replace(/\{\{SEC\}\}/g, hslStr(r.mouth.sec));
  }

  // 7. Ojos (eyes)
  const eyesKey = lib.eyes[r.eyes.shape] ? r.eyes.shape : "eva";
  const eyesSvg = lib.eyes[eyesKey]
    .replace(/\{\{UID\}\}/g, uid)
    .replace(/\{\{PRI\}\}/g, hslStr(r.eyes.pri))
    .replace(/\{\{SEC\}\}/g, hslStr(r.eyes.sec));

  return `<svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">${bgSvg}${sidesSvg}${topSvg}${faceSvg}${mouthSvg}${eyesSvg}</svg>`;
}

// ----------------- Contador y Metadatos ----------------- //
function initCountdown() {
  const el = document.getElementById("heroMetaText");
  function update() {
    const now = new Date().getTime();
    const diff = EVENT_DATE - now;
    if (!el) return;
    if (diff <= 0) {
      el.innerHTML = "Chelem Puerto, Yucatán &bull; ¡Es hoy la Posada!";
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    el.innerHTML = `Chelem Puerto, Yucatán &bull; Sábado 19 Dic 2026 &bull; Faltan ${d} días (${h} hrs)`;
  }
  update();
  setInterval(update, 60000);
}

// ----------------- Estado Local (v8 con Bottts Auténticos + HSL por Pieza) ----------------- //
function loadState() {
  const savedAttendees = localStorage.getItem("posada_attendees_v8");
  attendeesList = savedAttendees ? JSON.parse(savedAttendees) : DEFAULT_ATTENDEES;

  const savedCars = localStorage.getItem("posada_cars_v8");
  carsList = savedCars ? JSON.parse(savedCars) : [];

  const savedCollabs = localStorage.getItem("posada_collabs_v8");
  collaborations = savedCollabs ? JSON.parse(savedCollabs) : [];

  const savedSessionEmail = localStorage.getItem("posada_active_email_v8");
  if (savedSessionEmail) {
    currentUser = attendeesList.find(u => u.email.toLowerCase() === savedSessionEmail.toLowerCase()) || null;
  }
}

function saveState() {
  localStorage.setItem("posada_attendees_v8", JSON.stringify(attendeesList));
  localStorage.setItem("posada_cars_v8", JSON.stringify(carsList));
  localStorage.setItem("posada_collabs_v8", JSON.stringify(collaborations));
  if (currentUser) {
    localStorage.setItem("posada_active_email_v8", currentUser.email);
  }
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-trigger").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

// ----------------- Renderizado General ----------------- //
function renderAll() {
  renderSessionHeader();
  renderHeroStats();
  renderCollabBoard();
  renderRobotStudio();
  renderWhosGoing();
  renderTransportSection();
}

function renderSessionHeader() {
  const avatarWrap = document.getElementById("navUserAvatar");
  const nameEl = document.getElementById("navUserName");
  const statusEl = document.getElementById("navUserStatus");

  if (currentUser) {
    avatarWrap.innerHTML = renderRobotSVG(currentUser.robot);
    nameEl.textContent = currentUser.name;
    statusEl.textContent = "Sesión verificada";
  } else {
    avatarWrap.innerHTML = renderRobotSVG(createBotConfig(198, 0, 0, 0, 0, 0));
    nameEl.textContent = "Iniciar sesión";
    statusEl.textContent = "Toca para identificarte";
  }
}

function renderHeroStats() {
  const planesSub = document.getElementById("heroPlanesSub");
  if (planesSub) {
    const totalTasks = collaborations.reduce((acc, c) => acc + c.items.length, 0);
    const coveredTasks = collaborations.reduce((acc, c) => acc + c.items.filter(i => i.claimedBy).length, 0);
    planesSub.textContent = collaborations.length > 0
      ? `${collaborations.length} ${collaborations.length === 1 ? 'plan' : 'planes'} &bull; ${coveredTasks}/${totalTasks} insumos cubiertos`
      : "0 planes activos &bull; Proponer el primero";
  }
}

// ==========================================================================
// ESTUDIO MODERNO DE PERSONAJE (BOTTTS + RUEDA DE HUES UNIFICADA)
// ==========================================================================
function getEditingRobot() {
  if (currentUser) return currentUser.robot;
  return attendeesList[1].robot;
}

function initQuickSwatches() {
  const row = document.getElementById("quickSwatchesRow");
  if (!row) return;
  row.innerHTML = "";

  QUICK_HSL_SWATCHES.forEach(sw => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mini-swatch";
    btn.style.backgroundColor = hslStr(sw);
    btn.onclick = () => {
      if (!requireAuth()) return;
      const r = getEditingRobot();
      r[activePart][activeColorChannel] = { h: sw.h, s: sw.s, l: sw.l };
      if (activePart === "texture") {
        r.face.sec = { h: sw.h, s: sw.s, l: sw.l };
      }
      saveState();
      renderRobotStudio();
      renderSessionHeader();
      renderWhosGoing();
    };
    row.appendChild(btn);
  });
}

function renderRobotStudio() {
  const r = getEditingRobot();
  const canvasWrap = document.getElementById("studioCanvasWrap");
  const nameInput = document.getElementById("studioNameInput");
  const hintEl = document.getElementById("studioAuthHint");

  if (canvasWrap) canvasWrap.innerHTML = renderRobotSVG(r);
  if (nameInput && document.activeElement !== nameInput) {
    nameInput.value = currentUser ? currentUser.name : "";
    nameInput.disabled = !currentUser;
    nameInput.placeholder = currentUser ? "Tu nombre..." : "Inicia sesión para editar";
  }
  if (hintEl) {
    hintEl.textContent = currentUser
      ? `Editando el robot de ${currentUser.name} (${currentUser.email})`
      : "Vista previa libre. Inicia sesión arriba para guardar en tu perfil.";
  }

  const meta = PART_LABELS[activePart];
  document.getElementById("activePartTitle").textContent = meta.title;
  document.getElementById("lblChannelPri").textContent = meta.pri;
  document.getElementById("lblChannelSec").textContent = meta.sec;

  // Puntos de color en el selector de canal Primario / Secundario
  document.getElementById("dotChannelPri").style.backgroundColor = hslStr(r[activePart].pri);
  document.getElementById("dotChannelSec").style.backgroundColor = hslStr(r[activePart].sec);

  document.getElementById("btnChannelPri").classList.toggle("active", activeColorChannel === "pri");
  document.getElementById("btnChannelSec").classList.toggle("active", activeColorChannel === "sec");

  // Cuadrícula de diseños Bottts de la pieza activa
  const shapesGrid = document.getElementById("shapesGrid");
  shapesGrid.innerHTML = "";
  const keys = CATALOG_KEYS[activePart] || [];

  keys.forEach(shapeKey => {
    const isSel = r[activePart].shape === shapeKey;
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `shape-tile ${isSel ? 'selected' : ''}`;

    if (shapeKey === "none") {
      tile.innerHTML = `<span class="shape-none-label">Sin pieza</span>`;
    } else {
      tile.innerHTML = renderRobotSVG(r, activePart, shapeKey);
    }

    tile.onclick = () => {
      if (!requireAuth()) return;
      r[activePart].shape = shapeKey;
      triggerCanvasPop();
      saveState();
      renderAll();
    };
    shapesGrid.appendChild(tile);
  });

  // Sincronizar el Círculo de Hue y los Sliders con el canal activo (Primario o Secundario)
  const activeHsl = r[activePart][activeColorChannel];
  syncWheelAndSliders(activeHsl);
}

function syncWheelAndSliders(hslObj) {
  const centerSwatch = document.getElementById("activeColorCenterSwatch");
  const thumb = document.getElementById("hueThumb");
  const sSat = document.getElementById("sliderSat");
  const sLight = document.getElementById("sliderLight");

  if (centerSwatch) centerSwatch.style.backgroundColor = hslStr(hslObj);

  // Posicionar el indicador circular (#hueThumb) sobre el anillo de 136px (radio medio = 52px)
  if (thumb) {
    const rad = ((hslObj.h - 90) * Math.PI) / 180;
    const radius = 52;
    const x = 68 + radius * Math.cos(rad);
    const y = 68 + radius * Math.sin(rad);
    thumb.style.left = `${x}px`;
    thumb.style.top = `${y}px`;
    thumb.style.backgroundColor = `hsl(${hslObj.h}, 90%, 55%)`;
  }

  document.getElementById("valSat").textContent = `${Math.round(hslObj.s)}%`;
  document.getElementById("valLight").textContent = `${Math.round(hslObj.l)}%`;

  if (sSat) {
    sSat.value = hslObj.s;
    sSat.style.background = `linear-gradient(90deg, hsl(${hslObj.h}, 0%, ${hslObj.l}%), hsl(${hslObj.h}, 100%, ${hslObj.l}%))`;
  }
  if (sLight) {
    sLight.value = hslObj.l;
    sLight.style.background = `linear-gradient(90deg, hsl(${hslObj.h}, ${hslObj.s}%, 12%), hsl(${hslObj.h}, ${hslObj.s}%, 50%), hsl(${hslObj.h}, ${hslObj.s}%, 92%))`;
  }
}

function setupModernHueWheel() {
  const wheel = document.getElementById("interactiveHueWheel");
  if (!wheel) return;

  let dragging = false;

  function updateHueFromPointer(e) {
    if (!requireAuth()) return;
    const rect = wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let angle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const r = getEditingRobot();
    r[activePart][activeColorChannel].h = Math.round(angle) % 360;
    if (activePart === "texture") {
      r.face.sec.h = r.texture.pri.h;
    }
    saveState();
    renderRobotStudio();
    renderSessionHeader();
    renderWhosGoing();
  }

  wheel.addEventListener("mousedown", (e) => { dragging = true; updateHueFromPointer(e); });
  window.addEventListener("mousemove", (e) => { if (dragging) updateHueFromPointer(e); });
  window.addEventListener("mouseup", () => { dragging = false; });

  wheel.addEventListener("touchstart", (e) => { e.preventDefault(); updateHueFromPointer(e); }, { passive: false });
  wheel.addEventListener("touchmove", (e) => { e.preventDefault(); updateHueFromPointer(e); }, { passive: false });

  // Botones de cambio entre Color Principal y Color Secundario
  document.getElementById("btnChannelPri").onclick = () => {
    activeColorChannel = "pri";
    renderRobotStudio();
  };
  document.getElementById("btnChannelSec").onclick = () => {
    activeColorChannel = "sec";
    renderRobotStudio();
  };

  // Sliders de Saturación y Brillo
  document.getElementById("sliderSat").addEventListener("input", (e) => {
    if (!requireAuth()) return;
    const r = getEditingRobot();
    r[activePart][activeColorChannel].s = Number(e.target.value);
    if (activePart === "texture") r.face.sec.s = r.texture.pri.s;
    saveState();
    renderRobotStudio();
    renderSessionHeader();
    renderWhosGoing();
  });

  document.getElementById("sliderLight").addEventListener("input", (e) => {
    if (!requireAuth()) return;
    const r = getEditingRobot();
    r[activePart][activeColorChannel].l = Number(e.target.value);
    if (activePart === "texture") r.face.sec.l = r.texture.pri.l;
    saveState();
    renderRobotStudio();
    renderSessionHeader();
    renderWhosGoing();
  });
}

function triggerCanvasPop() {
  const wrap = document.getElementById("studioCanvasWrap");
  if (!wrap) return;
  wrap.classList.remove("pop");
  void wrap.offsetWidth;
  wrap.classList.add("pop");
  setTimeout(() => wrap.classList.remove("pop"), 240);
}

// ==========================================================================
// PLANES Y PROPUESTAS, CRECIMIENTO CON IA (PUS.IO) Y COLABORACIONES
// ==========================================================================
const SMART_GROWTH_SUGGESTIONS = {
  pastor: [
    "Cebollitas cambray asadas con salsa inglesa",
    "Frijoles charros calientes en olla",
    "Piña asada picada y limones extra",
    "Refrescos de toronja y manzana fríos"
  ],
  asado: [
    "Chorizo artesanal / Chistorra para picar",
    "Queso provoleta / asadero para fundir",
    "Chiles toreados con salsa de soya y limón",
    "Bolsa extra de carbón e iniciador"
  ],
  hamburguesa: [
    "Tocino ahumado crujiente",
    "Papas a la francesa o gajo sazonadas",
    "Queso cheddar fundido extra",
    "Pepinillos dulces y salsa barbecue"
  ],
  ceviche: [
    "Galletas saladas y tostadas horneadas extra",
    "Clamato preparado con salsa inglesa y sal marina",
    "Salsa picante habanera casera",
    "Cervezas claras heladas para acompañar"
  ],
  smash: [
    "Pausa técnica para pizzas a domicilio",
    "Snacks salados para los espectadores",
    "Bracket impreso o digital para el torneo",
    "Extensión eléctrica de uso rudo y multicontacto"
  ],
  bebida: [
    "Vasos térmicos con marcador indeleble",
    "Hielo frappé extra para coctelería",
    "Cítricos y menta fresca para escarchar",
    "Garrafón de agua pura purificada"
  ],
  default: [
    "Botanas y papas para la espera",
    "Servilletas y platos desechables biodegradables",
    "Bolsas de basura para recoger al final",
    "Bolsa de hielo extra para hielera"
  ]
};

let activeGrowPlanId = null;

function toggleGrowPlan(collabId) {
  if (!requireAuth()) return;
  activeGrowPlanId = activeGrowPlanId === collabId ? null : collabId;
  renderCollabBoard();
}

function addSuggestedItemToCollab(collabId, itemName) {
  if (!requireAuth()) return;
  const collab = collaborations.find(c => c.id === collabId);
  if (!collab) return;

  collab.items.push({
    id: "item_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: itemName,
    claimedBy: null,
    claimedByEmail: null
  });

  saveState();
  renderAll();
  showToast(`Sumado a ${collab.title}: ${itemName}`);
}

function renderCollabBoard() {
  const container = document.getElementById("collabBoardContainer");
  const badgeCount = document.getElementById("badgePlanesCount");

  if (badgeCount) badgeCount.textContent = String(collaborations.length);
  container.innerHTML = "";

  if (collaborations.length === 0) {
    container.innerHTML = `
      <div class="empty-board">
        <h3 class="empty-board-title">Aún no hay planes ni propuestas</h3>
        <p class="empty-board-desc">
          Escribe arriba lo que quieras comer o hacer, o elige alguna de las ideas para que <strong>pus.io</strong> desglose los insumos y podamos irlos creciendo entre todos.
        </p>
        <button type="button" class="btn btn-pusio" onclick="switchTab('tabPusio')">Abrir chat pus.io</button>
      </div>
    `;
    return;
  }

  const list = document.createElement("div");
  list.className = "collab-list";

  collaborations.forEach(collab => {
    const claimedCount = collab.items.filter(i => i.claimedBy).length;
    const totalCount = collab.items.length;

    const lower = (collab.title + " " + collab.category).toLowerCase();
    let catClass = "cat-other";
    let growthKey = "default";

    if (lower.includes("pastor") || lower.includes("taco") || lower.includes("taquiza")) {
      catClass = "cat-food";
      growthKey = "pastor";
    } else if (lower.includes("asado") || lower.includes("carne") || lower.includes("parrillada")) {
      catClass = "cat-food";
      growthKey = "asado";
    } else if (lower.includes("hamburguesa") || lower.includes("burger")) {
      catClass = "cat-food";
      growthKey = "hamburguesa";
    } else if (lower.includes("ceviche") || lower.includes("aguachile") || lower.includes("marisco")) {
      catClass = "cat-food";
      growthKey = "ceviche";
    } else if (lower.includes("smash") || lower.includes("mario") || lower.includes("juego") || lower.includes("torneo")) {
      catClass = "cat-activity";
      growthKey = "smash";
    } else if (lower.includes("hielera") || lower.includes("bebida") || lower.includes("cerveza") || lower.includes("hielo")) {
      catClass = "cat-drinks";
      growthKey = "bebida";
    }

    const card = document.createElement("div");
    card.className = `collab-card ${catClass}`;

    let itemsHtml = "";
    collab.items.forEach(item => {
      const isClaimed = Boolean(item.claimedBy);
      const ownerObj = attendeesList.find(u => u.email.toLowerCase() === (item.claimedByEmail || "").toLowerCase());
      const miniSvg = ownerObj ? renderRobotSVG(ownerObj.robot) : "";

      itemsHtml += `
        <div class="task-row ${isClaimed ? 'claimed' : ''}">
          <span class="task-name">${item.name}</span>
          ${
            isClaimed
              ? `<button type="button" class="task-assignee" onclick="toggleClaimItem(${collab.id}, '${item.id}')">
                   <span class="task-assignee-icon">${miniSvg}</span>
                   <span>${item.claimedBy}</span>
                 </button>`
              : `<button type="button" class="claim-btn" onclick="toggleClaimItem(${collab.id}, '${item.id}')">
                   Yo lo llevo
                 </button>`
          }
        </div>
      `;
    });

    const isGrowing = activeGrowPlanId === collab.id;
    const pool = SMART_GROWTH_SUGGESTIONS[growthKey] || SMART_GROWTH_SUGGESTIONS.default;
    const available = pool.filter(p => !collab.items.some(i => i.name.toLowerCase() === p.toLowerCase())).slice(0, 3);

    card.innerHTML = `
      <div class="collab-card-head">
        <div>
          <span class="collab-cat-badge">${collab.category}</span>
          <h3 class="collab-title">${collab.title}</h3>
          <div class="collab-author">Propuesto por ${collab.author}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="collab-progress-pill">${claimedCount}/${totalCount} cubiertos</span>
          <button type="button" class="modal-close-btn" style="width:26px; height:26px; font-size:0.9rem;" onclick="deleteCollab(${collab.id})" title="Eliminar plan">&times;</button>
        </div>
      </div>

      <div class="checklist-items">
        ${itemsHtml}
      </div>

      <form class="add-subitem-row" onsubmit="addCustomSubItem(event, ${collab.id})">
        <input type="text" class="add-subitem-input" placeholder="+ Agregar otro insumo a este plan..." required>
        <button type="submit" class="btn btn-sm">Sumar</button>
      </form>

      <div class="ai-grow-bar">
        <button type="button" class="ai-grow-trigger" onclick="toggleGrowPlan(${collab.id})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          <span>${isGrowing ? 'Ocultar sugerencias de IA' : 'Hacer crecer este plan con pus.io'}</span>
        </button>
        ${
          isGrowing
            ? `<div class="ai-grow-suggestions">
                 <span style="font-size:0.75rem; color:var(--ink-secondary); font-weight:600;">Sugerencias para sumar con un toque:</span>
                 ${
                   available.length > 0
                     ? available.map(sug => `
                         <button type="button" class="ai-suggestion-chip" onclick="addSuggestedItemToCollab(${collab.id}, '${sug.replace(/'/g, "\\'")}')">
                           <span>+</span> <span>${sug}</span>
                         </button>
                       `).join("")
                     : `<span style="font-size:0.75rem; color:var(--ink-muted);">¡Plan completo con todas las sugerencias clave!</span>`
                 }
               </div>`
            : ""
        }
      </div>
    `;

    list.appendChild(card);
  });

  container.appendChild(list);
}

function requireAuth() {
  if (!currentUser) {
    openModal("modalAuth");
    showToast("Inicia sesión con tu correo y PIN para interactuar");
    return false;
  }
  return true;
}

function toggleClaimItem(collabId, itemId) {
  if (!requireAuth()) return;

  const collab = collaborations.find(c => c.id === collabId);
  if (!collab) return;
  const item = collab.items.find(i => String(i.id) === String(itemId));
  if (!item) return;

  if (item.claimedBy) {
    if (item.claimedByEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      item.claimedBy = null;
      item.claimedByEmail = null;
      showToast(`Liberaste: ${item.name}`);
    } else {
      showToast(`Este insumo ya lo lleva ${item.claimedBy}`);
      return;
    }
  } else {
    item.claimedBy = currentUser.name;
    item.claimedByEmail = currentUser.email;
    showToast(`${currentUser.name} se encarga de: ${item.name}`);
  }

  saveState();
  renderAll();
}

function addCustomSubItem(e, collabId) {
  e.preventDefault();
  if (!requireAuth()) return;

  const input = e.target.querySelector("input");
  const val = input.value.trim();
  if (!val) return;

  const collab = collaborations.find(c => c.id === collabId);
  if (!collab) return;

  collab.items.push({
    id: "item_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: val.charAt(0).toUpperCase() + val.slice(1),
    claimedBy: null,
    claimedByEmail: null
  });

  input.value = "";
  saveState();
  renderAll();
  showToast(`Insumo sumado a ${collab.title}`);
}

function deleteCollab(collabId) {
  if (!requireAuth()) return;
  collaborations = collaborations.filter(c => c.id !== collabId);
  saveState();
  renderAll();
  showToast("Plan eliminado");
}

function handlePusioMessage(rawText) {
  if (!requireAuth()) return;
  const text = rawText.trim();
  if (!text) return;

  appendChatMsg(text, "user");

  setTimeout(() => {
    const plan = decomposeProposalIntoTasks(text);
    if (!plan.isActionable) {
      appendChatMsg(plan.reply, "bot");
      return;
    }

    const newCollab = {
      id: Date.now(),
      title: plan.title,
      category: plan.category,
      author: currentUser.name,
      items: plan.items.map((name, idx) => ({
        id: `t_${Date.now()}_${idx}`,
        name: name,
        claimedBy: null,
        claimedByEmail: null
      }))
    };

    collaborations.unshift(newCollab);
    saveState();
    renderAll();

    appendChatMsg(
      `Listo, ${currentUser.name}. Agregué "${plan.title}" en Planes y propuestas dividido en: ${plan.items.join(", ")}.`,
      "bot"
    );

    showToast(`Plan creado: ${plan.title}`);
  }, 280);
}

function decomposeProposalIntoTasks(text) {
  const lower = text.toLowerCase();

  if ((lower.startsWith("cuándo") || lower.startsWith("cuando") || lower.startsWith("dónde") || lower.startsWith("donde")) && text.includes("?")) {
    return {
      isActionable: false,
      reply: "La posada es el sábado 19 de diciembre de 2026 en la casa de Reyvell en Chelem. Escribe qué te gustaría comer o hacer para armar la lista."
    };
  }

  if (lower.includes("nacho") && lower.includes("pastor")) {
    return {
      isActionable: true,
      title: "Nachos de pastor",
      category: "Comida colaborativa",
      items: [
        "Carne al pastor (1.5 kg)",
        "Totopos / Tostadas (3 bolsas)",
        "Queso para fundir y jalapeños",
        "Guacamole, cilantro y cebolla",
        "Charolas de aluminio y servilletas"
      ]
    };
  }

  if (lower.includes("nacho")) {
    return {
      isActionable: true,
      title: "Nachos preparados",
      category: "Comida colaborativa",
      items: [
        "Totopos / Tostadas grandes",
        "Carne o arrachera picada",
        "Queso para fundir",
        "Guacamole y pico de gallo",
        "Chiles jalapeños y charolas"
      ]
    };
  }

  if (lower.includes("pastor") || lower.includes("taco") || lower.includes("taquiza")) {
    return {
      isActionable: true,
      title: "Tacos al pastor / Taquiza",
      category: "Comida colaborativa",
      items: [
        "Carne al pastor / bistec (2 kg)",
        "Tortillas taqueras y piña",
        "Cilantro, cebolla picada y limones",
        "Salsas (verde, roja y habanero)",
        "Platos y servilletas"
      ]
    };
  }

  if (lower.includes("hamburguesa") || lower.includes("burger")) {
    return {
      isActionable: true,
      title: "Hamburguesas al carbón",
      category: "Comida colaborativa",
      items: [
        "Carne para hamburguesa y tocino",
        "Pan para hamburguesa y queso americano",
        "Lechuga, tomate, cebolla y pepinillos",
        "Aderezos y papas",
        "Carbón e iniciador de fuego"
      ]
    };
  }

  if (lower.includes("asado") || lower.includes("carne asada") || lower.includes("parrillada")) {
    return {
      isActionable: true,
      title: "Carne asada en la terraza",
      category: "Comida colaborativa",
      items: [
        "Cortes de carne para asar",
        "Chorizo, queso y cebollitas",
        "Tortillas, guacamole y limones",
        "Carbón (2 bolsas) e iniciador",
        "Desechables y salsas"
      ]
    };
  }

  if (lower.includes("ceviche") || lower.includes("aguachile") || lower.includes("marisco")) {
    return {
      isActionable: true,
      title: lower.includes("aguachile") ? "Aguachile playero" : "Ceviche frente al mar",
      category: "Comida colaborativa",
      items: [
        "Camarón / pescado fresco limpio",
        "Limones (1 kg)",
        "Pepino, cebolla morada, cilantro y chile",
        "Tostadas y galletas saladas",
        "Aguacates y salsa marisquera"
      ]
    };
  }

  if (lower.includes("smash") || lower.includes("mario kart") || lower.includes("switch") || lower.includes("torneo")) {
    const gameName = lower.includes("mario") ? "Torneo de Mario Kart" : "Torneo de Super Smash Bros";
    return {
      isActionable: true,
      title: gameName,
      category: "Actividad / Torneo",
      items: [
        "Consola Nintendo Switch con el juego",
        "Dock, cable HDMI y proyector / TV",
        "Controles extra (mínimo 4 mandos)",
        "Extensión eléctrica y multicontacto",
        "Botanas para las retas"
      ]
    };
  }

  if (lower.includes("hielera") || lower.includes("bebida") || lower.includes("cerveza") || lower.includes("hielo") || lower.includes("refresco")) {
    return {
      isActionable: true,
      title: "Hieleras y bebidas",
      category: "Bebidas",
      items: [
        "Hielera grande",
        "Bolsas de hielo (4 bolsas)",
        "Refrescos, agua mineral y jugos",
        "Cervezas / bebidas del grupo",
        "Vasos grandes y limones"
      ]
    };
  }

  let cleanTitle = text
    .replace(/^(quiero comer|quiero hacer|quiero|propongo|sugiero|hay que|vamos a|hacer|armar|llevar|organizar)\s+/i, "")
    .trim();

  cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
  if (cleanTitle.endsWith(".")) cleanTitle = cleanTitle.slice(0, -1);

  const isFood = lower.includes("comer") || lower.includes("cena") || lower.includes("botana") || lower.includes("postre") || lower.includes("pizza");

  return {
    isActionable: true,
    title: cleanTitle,
    category: isFood ? "Comida colaborativa" : "Actividad grupal",
    items: isFood
      ? [
          `Ingrediente principal para ${cleanTitle.toLowerCase()}`,
          "Complementos, guarnición y salsas",
          "Tostadas, pan o tortillas",
          "Bebidas para acompañar",
          "Platos y servilletas"
        ]
      : [
          `Equipo o material principal para ${cleanTitle.toLowerCase()}`,
          "Accesorios o insumos secundarios",
          "Coordinación y montaje en la casa",
          "Snacks durante la actividad"
        ]
  };
}

function appendChatMsg(text, role) {
  const area = document.getElementById("pusioChatArea");
  const div = document.createElement("div");
  div.className = `chat-msg ${role}`;
  div.textContent = text;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function renderWhosGoing() {
  const grid = document.getElementById("whosGoingGrid");
  grid.innerHTML = "";

  attendeesList.forEach((person, idx) => {
    const isMe = currentUser && currentUser.email.toLowerCase() === person.email.toLowerCase();
    const isVIP = person.puedo_dar_coche === 1;

    let statusLabel = "Confirmado";
    if (isVIP) statusLabel = "Conductor VIP";
    else if (person.travelMode === "passenger") statusLabel = "Pasajero";

    const tile = document.createElement("div");
    tile.className = `friend-tile ${isMe ? 'is-me' : ''}`;

    // Animación orgánica desincronizada para cada robot (movimiento aleatorio)
    const animTypes = ["anim-a", "anim-b", "anim-c"];
    const animClass = animTypes[idx % 3];
    const dur = (3.2 + ((idx * 1.37) % 1.6)).toFixed(2);
    const del = (-((idx * 1.83) % 2.5)).toFixed(2);

    tile.innerHTML = `
      <div class="friend-tile-avatar">
        <div class="bot-anim ${animClass}" style="--dur:${dur}s; --del:${del}s;">
          ${renderRobotSVG(person.robot)}
        </div>
      </div>
      <div>
        <div class="friend-tile-name">${person.name}</div>
        <span class="friend-tile-tag">${isMe ? 'Tu perfil activo' : statusLabel}</span>
      </div>
    `;

    grid.appendChild(tile);
  });
}

function renderTransportSection() {
  const container = document.getElementById("carsContainer");
  container.innerHTML = "";

  if (carsList.length === 0) return;

  const list = document.createElement("div");
  list.className = "collab-list";

  carsList.forEach(car => {
    const isMine = currentUser && car.driverEmail.toLowerCase() === currentUser.email.toLowerCase();
    const item = document.createElement("div");
    item.className = "collab-card";

    item.innerHTML = `
      <div class="collab-card-head" style="margin-bottom:0; border-bottom:none; padding-bottom:0;">
        <div>
          <span class="collab-cat-badge">Auto disponible (${car.seats} lugares)</span>
          <h3 class="collab-title">${car.driver} &mdash; ${car.model}</h3>
          <div class="collab-author">Salida: ${car.zone} a las ${car.time}</div>
        </div>
        <div>
          ${
            isMine
              ? `<button type="button" class="btn btn-secondary btn-sm" onclick="retireCar(${car.id})">Retirar</button>`
              : `<button type="button" class="btn btn-pusio btn-sm" onclick="showToast('Lugar solicitado con ${car.driver}')">Pedir lugar</button>`
          }
        </div>
      </div>
    `;
    list.appendChild(item);
  });

  container.appendChild(list);
}

function retireCar(id) {
  if (!requireAuth()) return;
  carsList = carsList.filter(c => c.id !== id);
  currentUser.puedo_dar_coche = 0;
  saveState();
  renderAll();
  showToast("Coche retirado");
}

function setupEventListeners() {
  document.querySelectorAll(".tab-trigger").forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });

  document.getElementById("btnOpenAuthModal").onclick = () => {
    document.getElementById("authErrorMsg").style.display = "none";
    if (currentUser) {
      document.getElementById("authInputEmail").value = currentUser.email;
      document.getElementById("authInputName").value = currentUser.name;
    }
    openModal("modalAuth");
  };

  document.getElementById("btnOpenCarModal").onclick = () => {
    if (!requireAuth()) return;
    openModal("modalCar");
  };

  document.getElementById("secureAuthForm").onsubmit = (e) => {
    e.preventDefault();
    const emailVal = document.getElementById("authInputEmail").value.trim().toLowerCase();
    const nameVal = document.getElementById("authInputName").value.trim();
    const pinVal = document.getElementById("authInputPin").value.trim();
    const errEl = document.getElementById("authErrorMsg");

    if (!emailVal || !nameVal || pinVal.length < 4) return;

    const candidateHash = computePinHash(emailVal, pinVal);
    let existing = attendeesList.find(u => u.email.toLowerCase() === emailVal);

    if (existing) {
      if (existing.pinHash && existing.pinHash !== candidateHash) {
        errEl.textContent = "Clave o PIN incorrecto para este correo. Nadie puede entrar a una cuenta ajena.";
        errEl.style.display = "block";
        return;
      }
      existing.pinHash = candidateHash;
      existing.name = nameVal;
      currentUser = existing;
    } else {
      const rndHue = Math.floor(Math.random() * 360);
      const newUser = {
        id: Date.now(),
        name: nameVal,
        email: emailVal,
        pinHash: candidateHash,
        travelMode: null,
        puedo_dar_coche: 0,
        robot: createBotConfig(rndHue, 0, 0, 0, 0, 0)
      };
      attendeesList.push(newUser);
      currentUser = newUser;
    }

    errEl.style.display = "none";
    document.getElementById("authInputPin").value = "";
    saveState();
    renderAll();
    closeModal("modalAuth");
    showToast(`Sesión verificada: ${currentUser.name}`);
  };

  // Pestañas de anatomía del robot
  document.querySelectorAll("#anatomyTabs .anatomy-pill").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll("#anatomyTabs .anatomy-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activePart = btn.dataset.part;
      renderRobotStudio();
    };
  });

  document.getElementById("studioNameInput").addEventListener("input", (e) => {
    if (!currentUser) return;
    const v = e.target.value.trim();
    if (v) {
      currentUser.name = v;
      saveState();
      renderSessionHeader();
      renderWhosGoing();
    }
  });

  // Mezclar al azar con diseños Bottts reales
  document.getElementById("btnRandomRobot").onclick = () => {
    if (!requireAuth()) return;
    const hue = Math.floor(Math.random() * 360);
    currentUser.robot = createBotConfig(
      hue,
      Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 14),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 7),
      Math.floor(Math.random() * 4)
    );
    triggerCanvasPop();
    saveState();
    renderAll();
    showToast("Personaje mezclado con nuevas piezas");
  };

  document.getElementById("btnSaveRobotStudio").onclick = () => {
    if (!requireAuth()) return;
    saveState();
    renderAll();
    showToast(`Personaje guardado en el perfil de ${currentUser.name}`);
  };

  document.getElementById("btnConfirmPassenger").onclick = () => {
    if (!requireAuth()) return;
    currentUser.travelMode = "passenger";
    currentUser.puedo_dar_coche = 0;
    saveState();
    renderAll();
    showToast(`${currentUser.name} confirmado como pasajero`);
  };

  document.getElementById("carForm").onsubmit = (e) => {
    e.preventDefault();
    if (!requireAuth()) return;

    carsList.push({
      id: Date.now(),
      driverEmail: currentUser.email,
      driver: currentUser.name,
      model: document.getElementById("carInputModel").value.trim(),
      seats: document.getElementById("carInputSeats").value,
      zone: document.getElementById("carInputZone").value.trim(),
      time: document.getElementById("carInputTime").value.trim()
    });

    currentUser.puedo_dar_coche = 1;
    currentUser.travelMode = "driver";
    saveState();
    closeModal("modalCar");
    document.getElementById("carForm").reset();
    renderAll();
    showToast(`Coche registrado para ${currentUser.name}`);
  };

  document.querySelectorAll(".example-pill").forEach(btn => {
    btn.onclick = () => {
      const prompt = btn.dataset.prompt;
      if (prompt) handlePusioMessage(prompt);
    };
  });

  document.getElementById("pusioForm").onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("pusioInput");
    const val = input.value.trim();
    if (val) {
      handlePusioMessage(val);
      input.value = "";
    }
  };

  // Compositor rápido en pestaña de Planes y propuestas
  const inlineForm = document.getElementById("inlineProposalForm");
  if (inlineForm) {
    inlineForm.onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById("inlineProposalInput");
      const val = input.value.trim();
      if (val) {
        handlePusioMessage(val);
        input.value = "";
        switchTab("tabPlanes");
      }
    };
  }

  // Chispas de ideas interactivas
  document.querySelectorAll(".spark-chip").forEach(chip => {
    chip.onclick = () => {
      const prompt = chip.dataset.prompt;
      if (prompt) {
        handlePusioMessage(prompt);
        switchTab("tabPlanes");
      }
    };
  });

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.onclick = () => closeModal(btn.getAttribute("data-close"));
  });
}

function showToast(msg) {
  const toast = document.getElementById("toastNotice");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

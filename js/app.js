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
  { id: 1,  name: "Roybolas",  email: "reyvelljk87@gmail.com",          pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(38,  0, 1,  1, 0, 4, 0) },
  { id: 2,  name: "Tito",      email: "titorvc08@gmail.com",            pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(198, 2, 0,  0, 1, 0, 1) },
  { id: 3,  name: "Diarrea",   email: "fjvc091002@gmail.com",           pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(332, 1, 11, 3, 6, 4, 0) },
  { id: 4,  name: "Luis",      email: "mendoza.lpinzon@gmail.com",      pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(350, 3, 2,  0, 2, 1, 0) },
  { id: 5,  name: "Alex",      email: "alejandroaltamiranopuc@gmail.com",pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(265, 0, 4,  4, 4, 4, 2) },
  { id: 6,  name: "Joserik",   email: "joserikb@gmail.com",             pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(22,  4, 5,  5, 5, 0, 0) },
  { id: 7,  name: "Rubén",     email: "ivan.raygosa@gmail.com",         pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(184, 2, 6,  1, 0, 3, 1) },
  { id: 9,  name: "Papaddzul", email: "danielitoestabonito16@gmail.com",pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(162, 1, 3,  2, 3, 2, 0) },
  { id: 10, name: "César",     email: "cesar.amigo@posadachelem.com",   pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(140, 2, 8,  6, 3, 2, 1) },
  { id: 12, name: "Noé",       email: "noe.amigo@posadachelem.com",     pinHash: null, attendance: "pending", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(45,  1, 10, 2, 5, 0, 2) },
  { id: 1795018647356, name: "Otis",      email: "alberto34188@gmail.com",         pinHash: null, attendance: "seen", travelMode: "driver", puedo_dar_coche: 1, robot: createBotConfig(150, 0, 1, 0, 3, 2, 0) },
  { id: 1795019785482, name: "Shalom",    email: "ayorasuasteandresmiguel@gmai.com",pinHash: null, attendance: "confirmed", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(51, 1, 3, 2, 1, 0, 0) },
  { id: 1795022352684, name: "Alpaquiña", email: "aldopantoja2002@gmail.com",       pinHash: null, attendance: "seen", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(166, 0, 1, 0, 3, 2, 0) }
];

// Tablero inicial completamente limpio y vacío para la versión final de producción
const DEFAULT_COLLABORATIONS = [];

// Recompensas iniciales sugeridas para el concurso de personalización de Pus.io
const DEFAULT_REWARD_IDEAS = [
  "Elegir la primera canción que sonará al llegar a la casa de Chelem",
  "El primer plato servido en la comida del atardecer",
  "Inmunidad y pase directo a la final en el torneo de Smash",
  "Derecho a elegir la película de la madrugada en la sala",
  "Título honorario de Capitán de Playa Chelem 2026",
  "El mejor asiento frente al ventilador en la terraza",
  "No lavar platos ni vasos en todo el fin de semana"
];

let currentUser = null;
let activePart = "face";
let activeColorChannel = "pri"; // "pri" o "sec"
let attendeesList = [];
let carsList = [];
let collaborations = [];
let pusioRobot = null;
let editingTarget = "user"; // "user" o "pusio"
let studioOriginalState = null; // Snapshot al abrir el estudio para descartar si no guarda
let studioIsDirty = false; // Indica si hubo cambios sin guardar
let pusioContest = {
  submissions: [],
  rewardIdeas: [...DEFAULT_REWARD_IDEAS],
  votes: {} // email -> submissionId
};
let uidCounter = 1;

// Configuración por defecto de Pus.io: robot alegre, amigable y cómico
const DEFAULT_PUSIO_ROBOT = createBotConfig(165, 0, 1, 0, 3, 2, 0);

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  loadState();
  initQuickSwatches();
  renderAll();
  setupEventListeners();
  setupModernHueWheel();
  setupMobileTabs();
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
function renderRobotSVG(robotCfg, overridePart = null, overrideShape = null, noBackground = false) {
  const lib = window.BOTTTS_LIBRARY;
  if (!lib) return `<svg viewBox="0 0 180 180"></svg>`;

  const r = JSON.parse(JSON.stringify(robotCfg || createBotConfig(200, 0, 0, 0, 0, 0)));
  if (overridePart && overrideShape !== null) {
    r[overridePart].shape = overrideShape;
  }

  const uid = "u" + (uidCounter++);

  // 1. Fondo personalizado (omitido si noBackground es true)
  let bgSvg = "";
  if (!noBackground) {
    const bgPri = hslStr(r.bg.pri);
    const bgSec = hslStr(r.bg.sec);
    bgSvg = `<rect width="180" height="180" fill="${bgPri}"/>`;
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
  const elMeta = document.getElementById("heroMetaText");
  const elDays = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMins = document.getElementById("cdMins");
  const elSecs = document.getElementById("cdSecs");

  if (elMeta) elMeta.innerHTML = "Casa de Reyvell &bull; S&aacute;bado 19/DIC/26";

  function update() {
    const now = new Date().getTime();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      if (elDays) elDays.textContent = "00";
      if (elHours) elHours.textContent = "00";
      if (elMins) elMins.textContent = "00";
      if (elSecs) elSecs.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(d).padStart(2, "0");
    if (elHours) elHours.textContent = String(h).padStart(2, "0");
    if (elMins) elMins.textContent = String(m).padStart(2, "0");
    if (elSecs) elSecs.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ----------------- Estado Local & Nube (Supabase Sync) ----------------- //
const SUPABASE_URL = "https://zrxingfpnczypophqbai.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kRulPNGJbnmw-Gj8FG_ljg_RWMFbzL2";

let syncDebounceTimer = null;

async function syncFetchFromCloud() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posada_sync?key=eq.global_state&select=data`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) return;
    const rows = await res.json();
    if (rows && rows.length > 0 && rows[0].data) {
      const cloud = rows[0].data;

      // Fusionar lista de participantes conservando los datos más recientes
      if (Array.isArray(cloud.attendees) && cloud.attendees.length > 0) {
        attendeesList = cloud.attendees.map(u => ({
          ...u,
          attendance: u.attendance || (u.pinHash ? "seen" : "unanswered")
        }));
        localStorage.setItem("posada_attendees_v10", JSON.stringify(attendeesList));
      }

      if (Array.isArray(cloud.cars)) {
        carsList = cloud.cars;
        localStorage.setItem("posada_cars_v10", JSON.stringify(carsList));
      }

      if (Array.isArray(cloud.collabs)) {
        collaborations = cloud.collabs;
        localStorage.setItem("posada_collabs_v10", JSON.stringify(collaborations));
      }

      if (cloud.pusioRobot) {
        pusioRobot = cloud.pusioRobot;
        localStorage.setItem("posada_pusio_robot_v10", JSON.stringify(pusioRobot));
      }

      if (cloud.pusioContest) {
        pusioContest = cloud.pusioContest;
        localStorage.setItem("posada_pusio_contest_v10", JSON.stringify(pusioContest));
      }

      // Re-vincular sesión activa del usuario local
      const savedEmail = localStorage.getItem("posada_active_email_v10");
      if (savedEmail) {
        currentUser = attendeesList.find(u => u.email.toLowerCase() === savedEmail.toLowerCase()) || currentUser;
      }

      renderAll();
    }
  } catch (err) {
    console.warn("Supabase fetch warning:", err);
  }
}

async function syncPushToCloud() {
  clearTimeout(syncDebounceTimer);
  syncDebounceTimer = setTimeout(async () => {
    try {
      const payload = {
        key: "global_state",
        data: {
          attendees: attendeesList,
          cars: carsList,
          collabs: collaborations,
          pusioRobot: pusioRobot,
          pusioContest: pusioContest,
          lastUpdated: Date.now()
        }
      };

      await fetch(`${SUPABASE_URL}/rest/v1/posada_sync`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Supabase push warning:", err);
    }
  }, 400);
}

function loadState() {
  const savedAttendees = localStorage.getItem("posada_attendees_v10");
  if (savedAttendees) {
    try {
      const parsed = JSON.parse(savedAttendees);
      if (Array.isArray(parsed) && parsed.length > 0) {
        attendeesList = parsed.map(u => ({
          ...u,
          attendance: u.attendance || (u.pinHash ? "seen" : "unanswered")
        }));
      } else {
        attendeesList = JSON.parse(JSON.stringify(DEFAULT_ATTENDEES));
      }
    } catch (e) {
      attendeesList = JSON.parse(JSON.stringify(DEFAULT_ATTENDEES));
    }
  } else {
    attendeesList = JSON.parse(JSON.stringify(DEFAULT_ATTENDEES));
  }

  const savedCars = localStorage.getItem("posada_cars_v10");
  carsList = savedCars ? JSON.parse(savedCars) : [];

  const savedCollabs = localStorage.getItem("posada_collabs_v10");
  collaborations = savedCollabs ? JSON.parse(savedCollabs) : [];

  const savedSessionEmail = localStorage.getItem("posada_active_email_v10");
  if (savedSessionEmail) {
    currentUser = attendeesList.find(u => u.email.toLowerCase() === savedSessionEmail.toLowerCase()) || null;
  }

  const savedPusio = localStorage.getItem("posada_pusio_robot_v10");
  pusioRobot = savedPusio ? JSON.parse(savedPusio) : JSON.parse(JSON.stringify(DEFAULT_PUSIO_ROBOT));

  const savedContest = localStorage.getItem("posada_pusio_contest_v10");
  if (savedContest) {
    try {
      pusioContest = JSON.parse(savedContest);
      if (!Array.isArray(pusioContest.rewardIdeas) || pusioContest.rewardIdeas.length === 0) {
        pusioContest.rewardIdeas = [...DEFAULT_REWARD_IDEAS];
      }
    } catch (e) {
      pusioContest = { submissions: [], rewardIdeas: [...DEFAULT_REWARD_IDEAS], votes: {} };
    }
  }

  // Cargar estado actualizado desde la nube Supabase de inmediato
  syncFetchFromCloud();
}

function saveState() {
  localStorage.setItem("posada_attendees_v10", JSON.stringify(attendeesList));
  localStorage.setItem("posada_cars_v10", JSON.stringify(carsList));
  localStorage.setItem("posada_collabs_v10", JSON.stringify(collaborations));
  if (currentUser) {
    localStorage.setItem("posada_active_email_v10", currentUser.email);
  }
  if (pusioRobot) {
    localStorage.setItem("posada_pusio_robot_v10", JSON.stringify(pusioRobot));
  }
  localStorage.setItem("posada_pusio_contest_v10", JSON.stringify(pusioContest));

  // Sincronizar en segundo plano hacia Supabase
  syncPushToCloud();
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
  renderMySummary();
  renderSummaryPanel();
  renderPusioMascot();
  renderDynamicSparks();
  renderInlineRecentPlan();
  renderAgendaBoards();
  renderDynamicTimeline();
  renderRobotStudio();
  renderWhosGoing();
}

function renderMySummary() {
  const modalContainer = document.getElementById("modalUserSummaryBody");
  if (!modalContainer) return;

  const buildHTML = () => {
    if (!currentUser) {
      // Estado NO AUTENTICADO
      return `
        <div class="my-summary-guest-box">
          <div class="my-summary-guest-visual">
            <div class="guest-avatar-preview">
              ${renderRobotSVG(createBotConfig(198, 0, 0, 0, 0, 0), null, null, true)}
            </div>
          </div>
          <div class="my-summary-guest-info">
            <span class="my-summary-eyebrow">Paso 1: Identifícate en la Posada</span>
            <h3 class="my-summary-title">Verifica tu asistencia y dale estilo a tu personaje</h3>
            <p class="my-summary-desc">
              Todos los muñequitos empiezan apagados en gris. Inicia sesión con tu correo para encender tu robot en azul (visto), confirmar si irás a Chelem y desbloquear tus propuestas.
            </p>
            <div class="my-summary-guest-actions">
              <button type="button" class="btn btn-pusio" onclick="closeModal('modalUserSummary'); openModal('modalAuth')">
                Iniciar sesión / Entrar con mi PIN
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Estado AUTENTICADO: Resumen personalizado
    const isVIP = currentUser.puedo_dar_coche === 1;
    const currentAtt = currentUser.attendance || "seen";

    let statusBadgeLabel = "Visto";
    let statusBadgeClass = "status-seen";
    if (currentAtt === "confirmed") {
      statusBadgeLabel = "Confirmado";
      statusBadgeClass = "status-confirmed";
    } else if (currentAtt === "declined") {
      statusBadgeLabel = "No voy";
      statusBadgeClass = "status-declined";
    } else if (currentAtt === "pending") {
      statusBadgeLabel = "Pendiente";
      statusBadgeClass = "status-pending";
    }

    // En qué auto viaja (conductor o pasajero)
    const driverCar = carsList.find(c => c.driverEmail.toLowerCase() === currentUser.email.toLowerCase());
    const passengerCar = carsList.find(c => Array.isArray(c.passengers) && c.passengers.some(p => p.email && p.email.toLowerCase() === currentUser.email.toLowerCase()));

    let transportSummary = "Sin auto asignado todavía";
    if (driverCar) {
      const passCount = (driverCar.passengers || []).length;
      transportSummary = `Conductor de ${driverCar.model} (${passCount}/${driverCar.seats} ocupados)`;
    } else if (passengerCar) {
      transportSummary = `Pasajero en auto de ${passengerCar.driver} (${passengerCar.model})`;
    }

    // Contar planes e insumos
    const userPlans = collaborations.filter(c =>
      (c.authorEmail && c.authorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      (c.author && c.author.toLowerCase() === currentUser.name.toLowerCase())
    );

    let claimedItemsCount = 0;
    collaborations.forEach(c => {
      (c.items || []).forEach(it => {
        if (it.claimedByEmail && it.claimedByEmail.toLowerCase() === currentUser.email.toLowerCase()) {
          claimedItemsCount++;
        }
      });
    });

    const totalAttendeesConfirmed = attendeesList.filter(u => u.attendance === "confirmed").length;
    const totalCarsActive = carsList.length;

    return `
      <div class="my-summary-user-box modal-user-box-layout">
        <!-- Columna izquierda: Avatar y personalización directa -->
        <div class="my-summary-user-profile">
          <div class="user-summary-avatar-wrap" onclick="closeModal('modalUserSummary'); selectUserForCustomization(${currentUser.id})" title="Clic para editar tu muñequito">
            ${renderRobotSVG(currentUser.robot, null, null, true)}
            <span class="user-summary-edit-badge" title="Editar diseño">Editar</span>
          </div>
          <div class="user-summary-meta">
            <h3 class="user-summary-name">${currentUser.name}</h3>
            <span class="attendance-badge ${statusBadgeClass}">${statusBadgeLabel}</span>
            ${isVIP ? '<span class="avatar-vip-badge" style="position:static; display:inline-block; margin-top:4px;">VIP</span>' : ''}
          </div>
        </div>

        <!-- Columna central: Mis eventos y roles -->
        <div class="my-summary-details-grid">
          <div class="my-summary-stat-tile">
            <span class="stat-tile-label">Tu Transporte</span>
            <strong class="stat-tile-value">${transportSummary}</strong>
          </div>
          <div class="my-summary-stat-tile">
            <span class="stat-tile-label">Tus Planes Propuestos</span>
            <strong class="stat-tile-value">${userPlans.length} planes creados</strong>
          </div>
          <div class="my-summary-stat-tile">
            <span class="stat-tile-label">Cosas / Tareas que llevas</span>
            <strong class="stat-tile-value">${claimedItemsCount} elementos asignados</strong>
          </div>
          <div class="my-summary-stat-tile">
            <span class="stat-tile-label">Evento General</span>
            <strong class="stat-tile-value">${totalAttendeesConfirmed} confirmados • ${totalCarsActive} autos</strong>
          </div>
        </div>

        <!-- Columna derecha: Acciones rápidas de confirmación -->
        <div class="my-summary-action-col">
          <span class="my-summary-action-title">Cambiar tu asistencia:</span>
          <div class="attendance-toggle-pills" style="width:100%;">
            <button type="button" class="attend-btn btn-attend-confirmed ${currentAtt === 'confirmed' ? 'active' : ''}" onclick="setAttendanceStatus('confirmed')">Confirmar</button>
            <button type="button" class="attend-btn btn-attend-seen ${currentAtt === 'seen' ? 'active' : ''}" onclick="setAttendanceStatus('seen')">Visto</button>
            <button type="button" class="attend-btn btn-attend-pending ${currentAtt === 'pending' ? 'active' : ''}" onclick="setAttendanceStatus('pending')">Pendiente</button>
            <button type="button" class="attend-btn btn-attend-declined ${currentAtt === 'declined' ? 'active' : ''}" onclick="setAttendanceStatus('declined')">No voy</button>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" style="margin-top:8px; width:100%;" onclick="closeModal('modalUserSummary'); selectUserForCustomization(${currentUser.id})">
            Personalizar mi personaje
          </button>
        </div>
      </div>
    `;
  };

  modalContainer.innerHTML = buildHTML();
}

function renderSessionHeader() {
  const avatarWrap = document.getElementById("navUserAvatar");
  const nameEl = document.getElementById("navUserName");
  const statusEl = document.getElementById("navUserStatus");

  if (currentUser) {
    avatarWrap.innerHTML = renderRobotSVG(currentUser.robot);
    nameEl.textContent = currentUser.name;
    if (statusEl) {
      statusEl.textContent = "Sesión verificada";
      statusEl.style.display = "block";
    }
  } else {
    avatarWrap.innerHTML = renderRobotSVG(createBotConfig(198, 0, 0, 0, 0, 0));
    nameEl.textContent = "Iniciar sesión";
    if (statusEl) {
      statusEl.textContent = "";
      statusEl.style.display = "none";
    }
  }
}

function setAttendanceStatus(status) {
  if (!requireAuth()) return;
  currentUser.attendance = status;
  currentUser.attendanceSetByUser = true;
  saveState();
  renderAll();
  let label = "en pendiente";
  if (status === "confirmed") label = "confirmada";
  else if (status === "declined") label = "cancelada (no voy)";
  else if (status === "seen") label = "como visto";
  showToast(`Asistencia de ${currentUser.name} marcada ${label}`);
}

function setStudioAttendance(status) {
  if (editingTarget !== "user") return;
  if (!requireAuth()) return;
  currentUser.attendance = status;
  currentUser.attendanceSetByUser = true;
  studioIsDirty = true;
  renderRobotStudio();
}

function selectUserForCustomization(personId) {
  const person = attendeesList.find(u => u.id === personId);
  if (!person) return;

  // Si la cuenta tiene clave establecida o el usuario actual no tiene sesión, pedir autenticación
  if (!currentUser || currentUser.email.toLowerCase() !== person.email.toLowerCase()) {
    document.getElementById("authErrorMsg").style.display = "none";
    document.getElementById("authInputEmail").value = person.email;
    document.getElementById("authInputName").value = person.name;
    document.getElementById("authInputPin").value = "";
    checkAuthDeduplication();
    openModal("modalAuth");
    showToast(`Inicia sesión con tu PIN para personalizar el perfil y estado de ${person.name}.`);
    return;
  }

  editingTarget = "user";
  // Guardar snapshot original antes de cualquier modificación
  studioOriginalState = {
    target: "user",
    userId: person.id,
    name: person.name,
    attendance: person.attendance || "pending",
    robot: JSON.parse(JSON.stringify(person.robot))
  };
  studioIsDirty = false;

  renderRobotStudio();
  openModal("modalRobotStudio");
  showToast(`Personalizando a ${person.name}. Toca las piezas para editar.`);
}

function openPusioActionMenu() {
  if (!requireAuth()) return;
  openModal("modalPusioActions");
}

function selectPusioForCustomization() {
  if (!requireAuth()) return;
  editingTarget = "pusio";
  if (!pusioRobot) {
    pusioRobot = JSON.parse(JSON.stringify(DEFAULT_PUSIO_ROBOT));
  }
  // Guardar snapshot original de Pus.io
  studioOriginalState = {
    target: "pusio",
    robot: JSON.parse(JSON.stringify(pusioRobot))
  };
  studioIsDirty = false;

  renderRobotStudio();
  openModal("modalRobotStudio");
  showToast("Personalizando el avatar de Pus.io. Toca las piezas para cambiar su estilo.");
}

function renderPusioMascot() {
  const mascotWrap = document.getElementById("pusioMascotWrap");
  if (!mascotWrap) return;
  const cfg = pusioRobot || DEFAULT_PUSIO_ROBOT;
  // Render sin fondo plano para que se fusione con la insignia suave
  mascotWrap.innerHTML = renderRobotSVG(cfg, null, null, true);
}

let pendingPlanProposal = null;
let expandedPlanIds = new Set();
let newlyAddedPlanId = null;

function renderInlineRecentPlan() {
  const slot = document.getElementById("pusioInlineRecentPlan");
  if (!slot) return;

  if (!pendingPlanProposal) {
    slot.innerHTML = "";
    return;
  }

  const p = pendingPlanProposal;
  const isFood = (p.category || "").toLowerCase().includes("comida") || (p.category || "").toLowerCase().includes("bebida");
  const catLabel = isFood ? "Comida o Bebida" : "Actividad o Dinámica";
  const itemsNoun = isFood ? "Ingredientes e insumos" : "Cosas y tareas necesarias";
  const targetBoard = isFood ? "Comidas" : "Actividades";

  const itemsListHtml = p.items.map((it, idx) => `
    <li class="preview-item-row">
      <span class="preview-item-dot"></span>
      <span class="preview-item-text">${it}</span>
      <button type="button" class="preview-item-del-btn" onclick="removePendingProposalItem(${idx})" title="Quitar este elemento">&times;</button>
    </li>
  `).join("");

  slot.innerHTML = `
    <div class="inline-plan-card plan-enter-anim preview-mode-card">
      <div class="inline-plan-head">
        <div>
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span class="inline-plan-badge ${isFood ? 'badge-food' : 'badge-activity'}">${catLabel}</span>
            <span class="preview-tag-pill">&bull; Propuesta lista</span>
          </div>
          <h4 class="inline-plan-title">${p.title}</h4>
        </div>
        <button type="button" class="inline-plan-close-btn" onclick="discardPendingProposal()" title="Descartar esta propuesta">&times;</button>
      </div>

      <div class="preview-items-section">
        <span class="preview-items-title">${itemsNoun} sugeridas:</span>
        <ul class="preview-items-list">
          ${itemsListHtml}
        </ul>
      </div>

      <div class="preview-card-actions">
        <button type="button" class="btn btn-sm btn-confirm-plan" onclick="confirmPendingProposal()">
          <span>Añadir a ${targetBoard}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <button type="button" class="btn btn-sm btn-secondary" onclick="discardPendingProposal()">
          Descartar
        </button>
      </div>
    </div>
  `;
}

function removePendingProposalItem(idx) {
  if (!pendingPlanProposal || !pendingPlanProposal.items) return;
  pendingPlanProposal.items.splice(idx, 1);
  renderInlineRecentPlan();
}

function discardPendingProposal() {
  pendingPlanProposal = null;
  renderInlineRecentPlan();
  showToast("Propuesta descartada");
}

function confirmPendingProposal() {
  if (!pendingPlanProposal) return;
  if (!requireAuth()) return;

  const p = pendingPlanProposal;
  const isFood = (p.category || "").toLowerCase().includes("comida") || (p.category || "").toLowerCase().includes("bebida");

  const newCollab = {
    id: Date.now(),
    title: p.title,
    category: p.category,
    stage: p.stage || "stage2",
    author: currentUser.name,
    authorEmail: currentUser.email,
    items: p.items.map((name, idx) => ({
      id: `t_${Date.now()}_${idx}`,
      name: name,
      claimedBy: null,
      claimedByEmail: null
    }))
  };

  collaborations.unshift(newCollab);
  newlyAddedPlanId = newCollab.id;
  // Expandir por defecto el plan recién añadido para que el creador vea sus elementos
  expandedPlanIds.add(newCollab.id);
  pendingPlanProposal = null;

  saveState();
  renderAll();

  // Animación y scroll suave hacia la tarjeta acomodada en su columna
  setTimeout(() => {
    const el = document.getElementById(`planCard_${newCollab.id}`);
    if (el) {
      el.classList.add("plan-just-landed-anim");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        el.classList.remove("plan-just-landed-anim");
        newlyAddedPlanId = null;
      }, 2000);
    }
  }, 100);

  showToast(`¡Añadido a ${isFood ? 'Comidas' : 'Actividades'}!`);
}

function renderSummaryPanel() {
  // Sincronizar barra de confirmación rápida del usuario activo
  const myActionBox = document.getElementById("attendeeStatusActionBox");
  const myBadge = document.getElementById("myAttendanceBadge");
  if (myActionBox && myBadge) {
    if (currentUser) {
      myActionBox.style.display = "block";
      const att = currentUser.attendance || "seen";
      myBadge.className = `attendance-badge status-${att}`;
      if (att === "confirmed") myBadge.textContent = "Confirmado";
      else if (att === "declined") myBadge.textContent = "No voy";
      else if (att === "seen") myBadge.textContent = "Visto";
      else myBadge.textContent = "Pendiente";

      const btnConf = myActionBox.querySelector(".btn-attend-confirmed");
      const btnSeen = myActionBox.querySelector(".btn-attend-seen");
      const btnPend = myActionBox.querySelector(".btn-attend-pending");
      const btnDecl = myActionBox.querySelector(".btn-attend-declined");
      if (btnConf) btnConf.classList.toggle("active", att === "confirmed");
      if (btnSeen) btnSeen.classList.toggle("active", att === "seen");
      if (btnPend) btnPend.classList.toggle("active", att === "pending");
      if (btnDecl) btnDecl.classList.toggle("active", att === "declined");
    } else {
      myActionBox.style.display = "none";
    }
  }

  // 1. Lado izquierdo: Avatares con estados de color (azul/visto al entrar, verde/amarillo/rojo por asistencia, dorado VIP)
  const avatarsGrid = document.getElementById("summaryAvatarsGrid");
  if (avatarsGrid) {
    avatarsGrid.innerHTML = "";
    attendeesList.forEach(person => {
      const isMe = currentUser && currentUser.email.toLowerCase() === person.email.toLowerCase();
      const hasSession = Boolean(person.pinHash);
      const isVIP = person.puedo_dar_coche === 1;
      const att = person.attendance || (person.pinHash ? "seen" : "unanswered");

      let statusClass = "status-unanswered";
      let statusText = "Sin entrar";

      // Si la persona nunca ha iniciado sesión ni configurado cuenta, permanece en gris (apagado)
      if (!hasSession && !person.attendanceSetByUser) {
        statusClass = "status-unanswered";
        statusText = "Sin entrar";
      } else if (att === "confirmed") {
        statusClass = "status-confirmed";
        statusText = "Confirmado";
      } else if (att === "declined") {
        statusClass = "status-declined";
        statusText = "No voy";
      } else if (att === "seen") {
        statusClass = "status-seen";
        statusText = "Visto";
      } else {
        statusClass = "status-pending";
        statusText = "Pendiente";
      }

      if (isVIP) {
        statusText = "Conductor VIP";
      }

      const btn = document.createElement("button");
      btn.type = "button";
      const loggedClass = isMe ? "is-logged-in" : "";
      const vipClass = isVIP ? "is-vip" : "";
      btn.className = `avatar-token ${statusClass} ${vipClass} ${loggedClass}`;
      btn.title = `${person.name}: ${statusText}${isMe ? ' (En línea / Sesión activa)' : ''}. Clic para personalizar.`;
      btn.onclick = () => selectUserForCustomization(person.id);

      // Render robot sin fondo (únicamente los íconos vectoriales)
      const svgIcon = renderRobotSVG(person.robot, null, null, true);

      btn.innerHTML = `
        <div class="avatar-svg-wrap">
          ${svgIcon}
          ${isVIP ? '<span class="avatar-vip-badge">VIP</span>' : ''}
          ${isMe ? '<span class="avatar-online-badge" title="Sesión activa"></span>' : ''}
        </div>
        <span class="avatar-token-name">${person.name}${isMe ? ' (Tú)' : ''}</span>
        <span class="avatar-token-status">${statusText}</span>
      `;
      avatarsGrid.appendChild(btn);
    });

    // Botón para sumar nuevo participante a la lista
    const addToken = document.createElement("button");
    addToken.type = "button";
    addToken.className = "avatar-token avatar-token-add";
    addToken.title = "No votaste en la encuesta o eres nuevo? Haz clic para unirte a la posada.";
    addToken.onclick = () => {
      document.getElementById("authErrorMsg").style.display = "none";
      document.getElementById("authInputEmail").value = "";
      document.getElementById("authInputName").value = "";
      document.getElementById("authInputPin").value = "";
      openModal("modalAuth");
      showToast("Ingresa tu correo, nombre y un PIN de 4 dígitos para sumarte.");
    };
    addToken.innerHTML = `
      <div class="avatar-svg-wrap avatar-add-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      <span class="avatar-token-name">+ Unirme</span>
      <span class="avatar-token-status">Nuevo</span>
    `;
    avatarsGrid.appendChild(addToken);
  }

  // 2. Lado central: 5 siluetas de vehículos y medidor de capacidad para 13 participantes
  const capacityStats = document.getElementById("transportCapacityStats");
  const capacityFill = document.getElementById("transportCapacityFill");

  let totalCarCapacity = 0;
  let totalCarTaken = 0;

  carsList.forEach(c => {
    const s = Number(c.seats) || 3;
    const p = Array.isArray(c.passengers) ? c.passengers.length : 0;
    totalCarCapacity += (s + 1); // conductor + pasajeros
    totalCarTaken += (p + 1);
  });

  if (capacityStats) {
    capacityStats.textContent = `${totalCarTaken} / 13 asientos`;
  }
  if (capacityFill) {
    const pct = Math.min(100, Math.round((totalCarTaken / 13) * 100));
    capacityFill.style.width = `${pct}%`;
  }

  const carsGrid = document.getElementById("summaryCarsGrid");
  if (carsGrid) {
    carsGrid.innerHTML = "";
    const maxCars = 5;
    for (let i = 0; i < maxCars; i++) {
      const car = carsList[i] || null;
      const isMine = car && currentUser && car.driverEmail.toLowerCase() === currentUser.email.toLowerCase();

      if (car) {
        const totalSeats = Number(car.seats) || 3;
        const passengers = Array.isArray(car.passengers) ? car.passengers : [];
        const takenPassengerSeats = passengers.length;
        const freePassengerSeats = Math.max(0, totalSeats - takenPassengerSeats);

        const totalCapacity = totalSeats + 1; // contando al conductor
        const totalPeople = takenPassengerSeats + 1;
        const fillPercent = Math.round((totalPeople / totalCapacity) * 100);

        let vibeTier = "vibe-tier-low";
        let vibeLabel = "Solo piloto";

        if (freePassengerSeats === 0) {
          vibeTier = "vibe-tier-max";
          vibeLabel = "Auto completo • Fiesta";
        } else if (takenPassengerSeats >= 2 || (takenPassengerSeats / totalSeats) >= 0.5) {
          vibeTier = "vibe-tier-high";
          vibeLabel = `${freePassengerSeats} libre${freePassengerSeats > 1 ? 's' : ''} • Casi lleno`;
        } else if (takenPassengerSeats >= 1) {
          vibeTier = "vibe-tier-mid";
          vibeLabel = `${freePassengerSeats} libre${freePassengerSeats > 1 ? 's' : ''} • Buena vibra`;
        } else {
          vibeTier = "vibe-tier-low";
          vibeLabel = `${freePassengerSeats} lugares libres`;
        }

        const slot = document.createElement("div");
        slot.className = `car-slot filled ${vibeTier} ${isMine ? 'is-mine' : ''}`;

        // Generar puntitos de visualización:
        // 1er punto: Conductor (siempre lleno con ámbar/dorado)
        // Siguientes puntos: Pasajeros (lleno o vacío)
        let dotsHtml = `<span class="seat-dot driver-dot" title="Conductor: ${car.driver}"></span>`;
        for (let s = 0; s < totalSeats; s++) {
          if (s < takenPassengerSeats) {
            const pName = passengers[s] ? passengers[s].name : "Pasajero";
            dotsHtml += `<span class="seat-dot dot-taken" title="Ocupado por ${pName}"></span>`;
          } else {
            dotsHtml += `<span class="seat-dot dot-free" title="Asiento libre para pasajero"></span>`;
          }
        }

        slot.title = `Auto de ${car.driver}: ${vibeLabel} (${totalPeople}/${totalCapacity} a bordo). Clic para ver detalles.`;
        slot.onclick = (e) => {
          // Si hace clic en el botón de quitar, no abrir modal
          if (e.target.closest(".car-retire-quick-btn")) return;
          openCarDetailModal(car.id);
        };

        slot.innerHTML = `
          ${isMine ? `<button type="button" class="car-retire-quick-btn" title="Quitar mi auto" onclick="retireCar(${car.id})">&times;</button>` : ''}
          <div class="car-card-top-row">
            <svg class="car-silhouette-svg" viewBox="0 0 44 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 17h36v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5z"/>
              <path d="M8 17l4-9h20l4 9"/>
              <circle cx="12" cy="22" r="2.5" fill="currentColor"/>
              <circle cx="32" cy="22" r="2.5" fill="currentColor"/>
            </svg>
            <span class="car-zone-tag">${car.zone || 'Mérida'}</span>
          </div>
          <span class="car-slot-title">${car.driver}</span>
          <div class="car-vibe-bar">
            <div class="car-vibe-fill" style="width:${fillPercent}%;"></div>
          </div>
          <div class="car-seats-dots">
            ${dotsHtml}
          </div>
          <span class="car-slot-desc">${car.model}</span>
          <span class="car-status-pill">${vibeLabel}</span>
        `;
        carsGrid.appendChild(slot);
      } else {
        const slot = document.createElement("div");
        slot.className = "car-slot empty";
        slot.title = `Cupo libre ${i + 1}. Clic para registrar tu coche y ser Conductor VIP.`;
        slot.onclick = () => {
          if (!requireAuth()) return;
          openModal("modalCar");
        };
        slot.innerHTML = `
          <svg class="car-silhouette-svg" viewBox="0 0 44 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="3 3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 17h36v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5z"/>
            <path d="M8 17l4-9h20l4 9"/>
            <circle cx="12" cy="22" r="2"/>
            <circle cx="32" cy="22" r="2"/>
          </svg>
          <span class="car-slot-title">Auto ${i + 1} libre</span>
          <span class="car-slot-desc">Llevaré mi coche</span>
          <span class="car-action-hint">+ Activar VIP</span>
        `;
        carsGrid.appendChild(slot);
      }
    }
  }
}

// ==========================================================================
// ESTUDIO MODERNO DE PERSONAJE (BOTTTS + RUEDA DE HUES UNIFICADA)
// ==========================================================================
function getEditingRobot() {
  if (editingTarget === "pusio") {
    if (!pusioRobot) pusioRobot = JSON.parse(JSON.stringify(DEFAULT_PUSIO_ROBOT));
    return pusioRobot;
  }
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
      if (editingTarget !== "pusio" && !requireAuth()) return;
      const r = getEditingRobot();
      r[activePart][activeColorChannel] = { h: sw.h, s: sw.s, l: sw.l };
      if (activePart === "texture") {
        r.face.sec = { h: sw.h, s: sw.s, l: sw.l };
      }
      studioIsDirty = true;
      renderRobotStudio();
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
    if (editingTarget === "pusio") {
      nameInput.value = "Pus.io (Asistente Oficial)";
      nameInput.disabled = true;
      nameInput.placeholder = "Pus.io";
    } else {
      nameInput.value = currentUser ? currentUser.name : "";
      nameInput.disabled = !currentUser;
      nameInput.placeholder = currentUser ? "Tu nombre..." : "Inicia sesión para editar";
    }
  }
  if (hintEl) {
    if (editingTarget === "pusio") {
      hintEl.textContent = "Personalizando el avatar oficial de Pus.io. Se actualizará en la tarjeta de actividades.";
    } else {
      hintEl.textContent = currentUser
        ? `Editando el robot de ${currentUser.name} (${currentUser.email})`
        : "Vista previa libre. Inicia sesión arriba para guardar en tu perfil.";
    }
  }

  // Sincronizar sección de estado de asistencia en el estudio
  const studioAttendSec = document.getElementById("studioAttendanceSection");
  if (studioAttendSec) {
    if (editingTarget === "pusio") {
      studioAttendSec.style.display = "none";
    } else {
      studioAttendSec.style.display = "block";
      const curAtt = (currentUser && currentUser.attendance) ? currentUser.attendance : "pending";
      document.querySelectorAll(".studio-status-pill").forEach(pill => {
        pill.classList.toggle("active", pill.dataset.status === curAtt);
      });
    }
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
      if (editingTarget !== "pusio" && !requireAuth()) return;
      r[activePart].shape = shapeKey;
      triggerCanvasPop();
      studioIsDirty = true;
      renderRobotStudio();
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
    if (editingTarget !== "pusio" && !requireAuth()) return;
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
    studioIsDirty = true;
    renderRobotStudio();
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
    if (editingTarget !== "pusio" && !requireAuth()) return;
    const r = getEditingRobot();
    r[activePart][activeColorChannel].s = Number(e.target.value);
    if (activePart === "texture") r.face.sec.s = r.texture.pri.s;
    studioIsDirty = true;
    renderRobotStudio();
  });

  document.getElementById("sliderLight").addEventListener("input", (e) => {
    if (editingTarget !== "pusio" && !requireAuth()) return;
    const r = getEditingRobot();
    r[activePart][activeColorChannel].l = Number(e.target.value);
    if (activePart === "texture") r.face.sec.l = r.texture.pri.l;
    studioIsDirty = true;
    renderRobotStudio();
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
// Catálogo curado de sugerencias vivas de Pus.io
const PUSIO_CANDIDATE_IDEAS = [
  {
    title: "Ceviche frente al mar",
    shortLabel: "Ceviche playero",
    category: "Comida",
    dot: "dot-teal",
    keywords: ["ceviche", "marisco", "pescado"],
    prompt: "Preparar ceviche playero y botanas de marisco frente al mar"
  },
  {
    title: "Hieleras comunitarias",
    shortLabel: "Hieleras y barra libre",
    category: "Comida",
    dot: "dot-pine",
    keywords: ["hielera", "bebida", "cerveza", "refresco"],
    prompt: "Hieleras con hielo, refrescos y bebidas frías"
  },
  {
    title: "Intercambio de regalos",
    shortLabel: "Intercambio de regalos",
    category: "Actividad",
    dot: "dot-coral",
    keywords: ["regalo", "intercambio", "elefante blanco"],
    prompt: "Intercambio de regalos chuscos estilo elefante blanco"
  },
  {
    title: "Karaoke en la terraza",
    shortLabel: "Karaoke en la terraza",
    category: "Actividad",
    dot: "dot-purple",
    keywords: ["karaoke", "cantar", "microfono"],
    prompt: "Sesión de karaoke y música con bocina frente al mar"
  },
  {
    title: "Retas de Beer Pong",
    shortLabel: "Beer Pong playero",
    category: "Actividad",
    dot: "dot-amber",
    keywords: ["beer pong", "pong", "vasos rojos"],
    prompt: "Armar mesa y retas de beer pong con vasos rojos y pelotas"
  },
  {
    title: "Fogata playera nocturna",
    shortLabel: "Fogata con malvaviscos",
    category: "Actividad",
    dot: "dot-coral",
    keywords: ["fogata", "malvavisco", "fuego en la playa"],
    prompt: "Fogata playera nocturna con malvaviscos y música acústica"
  },
  {
    title: "Voleibol en la playa",
    shortLabel: "Voleibol playero",
    category: "Actividad",
    dot: "dot-teal",
    keywords: ["voleibol", "voley", "balon", "playa"],
    prompt: "Partido de voleibol en la arena al atardecer"
  },
  {
    title: "Juegos de mesa rápidos",
    shortLabel: "Juegos de mesa",
    category: "Actividad",
    dot: "dot-slate",
    keywords: ["juegos de mesa", "uno", "cartas", "codenames", "catan"],
    prompt: "Juegos de mesa rápidos y cartas (Uno, Exploding Kittens, Codenames)"
  },
  {
    title: "Coctelería & Mojitos",
    shortLabel: "Barra de coctelería",
    category: "Comida",
    dot: "dot-pine",
    keywords: ["coctel", "mojito", "piña colada", "ron", "tequila"],
    prompt: "Barra de coctelería playera con mojitos, piña colada y escarchados"
  },
  {
    title: "Choripanes al carbón",
    shortLabel: "Choripanes argentinos",
    category: "Comida",
    dot: "dot-amber",
    keywords: ["choripan", "chorizo argentino", "chimichurri"],
    prompt: "Choripanes al carbón con chimichurri casero y pan rústico"
  }
];

function renderDynamicSparks() {
  const container = document.getElementById("sparksGridContainer");
  if (!container) return;

  // Aprendizaje: detectar qué temas ya existen en el tablero de colaboraciones
  const existingTitles = collaborations.map(c => (c.title || "").toLowerCase());
  
  const filteredCandidates = PUSIO_CANDIDATE_IDEAS.filter(idea => {
    // Si algún plan existente contiene las palabras clave, se descarta para no repetir
    const isAlreadyPresent = existingTitles.some(title => {
      if (title.includes(idea.title.toLowerCase()) || idea.title.toLowerCase().includes(title)) return true;
      return idea.keywords.some(k => title.includes(k));
    });
    return !isAlreadyPresent;
  });

  // Mostrar un conjunto fresco de hasta 6 sugerencias
  const toShow = filteredCandidates.slice(0, 6);

  if (toShow.length === 0) {
    container.innerHTML = `
      <div style="font-size:0.75rem; color:var(--ink-muted); grid-column:1/-1; padding:8px 0;">
        ¡Increíble! Casi todas las dinámicas sugeridas ya están en el tablero. Escribe cualquier idea propia arriba.
      </div>
    `;
    return;
  }

  container.innerHTML = toShow.map(idea => `
    <button type="button" class="spark-chip" onclick="handlePusioMessage('${idea.prompt.replace(/'/g, "\\'")}')">
      <span class="spark-dot ${idea.dot}"></span>
      <span>${idea.shortLabel}</span>
    </button>
  `).join("");
}

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
  renderAgendaBoards();
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

function togglePlanCollapse(planId) {
  if (expandedPlanIds.has(planId)) {
    expandedPlanIds.delete(planId);
  } else {
    expandedPlanIds.add(planId);
  }
  renderAgendaBoards();
}

function calculateCollabTraction(collab) {
  const total = collab.items.length || 1;
  const claimed = collab.items.filter(i => i.claimedBy).length;
  // Prioridad matemática: mayor porcentaje de cobertura y mayor cantidad de asignados
  return (claimed / total) * 100 + (claimed * 10);
}

function renderAgendaBoards() {
  const foodContainer = document.getElementById("foodBoardContainer");
  const activityContainer = document.getElementById("activityBoardContainer");
  const badgeFood = document.getElementById("badgeFoodCount");
  const badgeActivity = document.getElementById("badgeActivityCount");

  if (!foodContainer || !activityContainer) return;

  const foodPlans = collaborations
    .filter(c => (c.category || "").toLowerCase().includes("comida") || (c.category || "").toLowerCase().includes("bebida"))
    .sort((a, b) => calculateCollabTraction(b) - calculateCollabTraction(a));

  const activityPlans = collaborations
    .filter(c => !(c.category || "").toLowerCase().includes("comida") && !(c.category || "").toLowerCase().includes("bebida"))
    .sort((a, b) => calculateCollabTraction(b) - calculateCollabTraction(a));

  if (badgeFood) badgeFood.textContent = String(foodPlans.length);
  if (badgeActivity) badgeActivity.textContent = String(activityPlans.length);

  foodContainer.innerHTML = foodPlans.length === 0
    ? `<div class="empty-column-notice">Sin propuestas de comida o bebida aún.</div>`
    : "";

  activityContainer.innerHTML = activityPlans.length === 0
    ? `<div class="empty-column-notice">Sin dinámicas propuestas aún.</div>`
    : "";

  foodPlans.forEach(plan => {
    foodContainer.appendChild(createPlanCardElement(plan, "cat-food"));
  });

  activityPlans.forEach(plan => {
    activityContainer.appendChild(createPlanCardElement(plan, "cat-activity"));
  });
}

function getCollabVibeTier(claimed, total) {
  if (total === 0 || claimed === 0) return { tier: "vibe-tier-low", label: "Sin comenzar" };
  const ratio = claimed / total;
  if (ratio >= 1) return { tier: "vibe-tier-max", label: "Completado" };
  if (ratio >= 0.5) return { tier: "vibe-tier-high", label: "Casi listo" };
  return { tier: "vibe-tier-mid", label: "En marcha" };
}

let editingSubItem = null;

function canManagePlan(collab) {
  if (!currentUser || !collab) return false;
  const isAuthor = (
    (collab.authorEmail && collab.authorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
    (collab.author && collab.author.toLowerCase() === currentUser.name.toLowerCase())
  );
  const isAdmin = (
    (currentUser.email && currentUser.email.toLowerCase() === "titorvc08@gmail.com") ||
    (currentUser.name && currentUser.name.toLowerCase() === "tito")
  );
  return Boolean(isAuthor || isAdmin);
}

function startEditSubItem(collabId, itemId) {
  editingSubItem = { collabId, itemId };
  renderAll();
  setTimeout(() => {
    const input = document.getElementById(`editSubItemInput_${collabId}_${itemId}`);
    if (input) {
      input.focus();
      input.select();
    }
  }, 40);
}

function cancelEditSubItem() {
  editingSubItem = null;
  renderAll();
}

function saveEditSubItem(collabId, itemId) {
  const input = document.getElementById(`editSubItemInput_${collabId}_${itemId}`);
  if (!input) return;
  const newName = input.value.trim();
  if (!newName) {
    showToast("El nombre no puede estar vacío.");
    return;
  }

  const collab = collaborations.find(c => c.id === collabId);
  if (!collab) return;
  if (!canManagePlan(collab)) {
    showToast("Solo el creador o Tito (Admin) pueden modificar este elemento.");
    return;
  }

  const item = collab.items.find(i => String(i.id) === String(itemId));
  if (!item) return;

  item.name = newName.charAt(0).toUpperCase() + newName.slice(1);
  editingSubItem = null;
  saveState();
  renderAll();
  showToast("Elemento actualizado");
}

function deleteSubItem(collabId, itemId) {
  const collab = collaborations.find(c => c.id === collabId);
  if (!collab) return;
  if (!canManagePlan(collab)) {
    showToast("Solo el creador o Tito (Admin) pueden eliminar este elemento.");
    return;
  }

  const itemIndex = collab.items.findIndex(i => String(i.id) === String(itemId));
  if (itemIndex === -1) return;

  const itemName = collab.items[itemIndex].name;
  collab.items.splice(itemIndex, 1);
  if (editingSubItem && editingSubItem.collabId === collabId && editingSubItem.itemId === itemId) {
    editingSubItem = null;
  }

  saveState();
  renderAll();
  showToast(`Elemento eliminado: ${itemName}`);
}

function createPlanCardElement(collab, catClass) {
  const claimedCount = collab.items.filter(i => i.claimedBy).length;
  const totalCount = collab.items.length;
  const isComplete = totalCount > 0 && claimedCount === totalCount;
  const hasVolunteers = claimedCount > 0;
  const canManage = canManagePlan(collab);
  const isMine = canManage;
  const isExpanded = expandedPlanIds.has(collab.id);

  const isFood = (collab.category || "").toLowerCase().includes("comida") || (collab.category || "").toLowerCase().includes("bebida");
  const itemsNoun = isFood ? "ingredientes" : "cosas necesarias";
  const addItemPlaceholder = isFood ? "+ Sumar otro ingrediente o insumo..." : "+ Sumar otra cosa o tarea necesaria...";
  const addBtnLabel = isFood ? "Sumar" : "Agregar";

  const vibe = getCollabVibeTier(claimedCount, totalCount);

  const card = document.createElement("div");
  card.id = `planCard_${collab.id}`;
  card.className = `plan-item-card ${catClass} ${vibe.tier} ${isComplete ? 'is-complete' : (hasVolunteers ? 'has-traction' : '')} ${isExpanded ? 'is-expanded' : 'is-collapsed'}`;

  let itemsHtml = "";
  collab.items.forEach(item => {
    const isClaimed = Boolean(item.claimedBy);
    const ownerObj = attendeesList.find(u => u.email.toLowerCase() === (item.claimedByEmail || "").toLowerCase());
    const miniSvg = ownerObj ? renderRobotSVG(ownerObj.robot, null, null, true) : "";
    const isEditing = editingSubItem && editingSubItem.collabId === collab.id && String(editingSubItem.itemId) === String(item.id);

    if (isEditing) {
      itemsHtml += `
        <div class="task-row is-editing-subitem">
          <form class="edit-subitem-form" onsubmit="event.preventDefault(); saveEditSubItem(${collab.id}, '${item.id}');">
            <input type="text" id="editSubItemInput_${collab.id}_${item.id}" class="edit-subitem-input" value="${item.name.replace(/"/g, '&quot;')}" required />
            <div class="edit-subitem-actions">
              <button type="submit" class="btn-subitem-icon save" title="Guardar cambios">✔</button>
              <button type="button" class="btn-subitem-icon cancel" onclick="cancelEditSubItem()" title="Cancelar">✕</button>
            </div>
          </form>
        </div>
      `;
    } else {
      const manageControls = canManage ? `
        <div class="subitem-manage-btns">
          <button type="button" class="subitem-btn-icon edit" onclick="startEditSubItem(${collab.id}, '${item.id}')" title="Modificar este elemento">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button type="button" class="subitem-btn-icon delete" onclick="deleteSubItem(${collab.id}, '${item.id}')" title="Eliminar este elemento">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      ` : "";

      itemsHtml += `
        <div class="task-row ${isClaimed ? 'claimed' : ''}">
          <div class="task-info-wrap">
            <span class="task-name">${item.name}</span>
            ${manageControls}
          </div>
          ${
            isClaimed
              ? `<button type="button" class="task-assignee" onclick="toggleClaimItem(${collab.id}, '${item.id}')" title="Asignado a ${item.claimedBy}. Clic para liberar si es tuyo.">
                   <span class="task-assignee-icon">${miniSvg}</span>
                   <span>${item.claimedBy}</span>
                 </button>`
              : `<button type="button" class="claim-btn" onclick="toggleClaimItem(${collab.id}, '${item.id}')">
                   Yo lo llevo
                 </button>`
          }
        </div>
      `;
    }
  });

  const isGrowing = activeGrowPlanId === collab.id;
  const lower = (collab.title + " " + collab.category).toLowerCase();
  let growthKey = "default";
  if (lower.includes("pastor") || lower.includes("taco")) growthKey = "pastor";
  else if (lower.includes("asado") || lower.includes("carne")) growthKey = "asado";
  else if (lower.includes("hamburguesa") || lower.includes("burger")) growthKey = "hamburguesa";
  else if (lower.includes("ceviche") || lower.includes("aguachile")) growthKey = "ceviche";
  else if (lower.includes("smash") || lower.includes("mario") || lower.includes("torneo")) growthKey = "smash";
  else if (lower.includes("hielera") || lower.includes("bebida") || lower.includes("cerveza")) growthKey = "bebida";

  const pool = SMART_GROWTH_SUGGESTIONS[growthKey] || SMART_GROWTH_SUGGESTIONS.default;
  const available = pool.filter(p => !collab.items.some(i => i.name.toLowerCase() === p.toLowerCase())).slice(0, 3);

  const stageLabels = {
    stage1: "Tarde de Sol",
    stage2: "Atardecer & Fuego",
    stage3: "Noche Estelar"
  };
  const stageName = stageLabels[collab.stage] || "Posada";

  // Puntitos indicadores de progreso estilo coche
  let dotsHtml = "";
  const maxDots = Math.min(totalCount, 8);
  for (let idx = 0; idx < maxDots; idx++) {
    const isTaken = idx < claimedCount;
    dotsHtml += `<span class="plan-seat-dot ${isTaken ? 'dot-taken' : 'dot-free'}"></span>`;
  }
  if (totalCount > 8) {
    dotsHtml += `<span style="font-size:0.68rem; font-weight:700; margin-left:2px; opacity:0.8;">+${totalCount - 8}</span>`;
  }

  card.innerHTML = `
    ${isMine ? `<button type="button" class="plan-delete-corner-btn" onclick="event.stopPropagation(); deleteCollab(${collab.id})" title="Eliminar este plan que propusiste">&times;</button>` : ''}
    
    <!-- Encabezado compacto / interactivo -->
    <div class="plan-card-head" onclick="togglePlanCollapse(${collab.id})" title="Clic para expandir o contraer">
      <div class="plan-head-left-info">
        <div class="plan-card-tags-row">
          <span class="plan-cat-pill">${collab.category}</span>
          <span class="plan-stage-pill">&bull; ${stageName}</span>
        </div>
        <h4 class="plan-card-title">${collab.title}</h4>
        <div class="plan-card-author">Propuesto por ${collab.author}</div>
      </div>
      <div class="plan-head-right-status">
        <span class="plan-vibe-pill ${vibe.tier}">${vibe.label} &bull; ${claimedCount}/${totalCount}</span>
        <div class="plan-progress-dots">
          ${dotsHtml}
        </div>
        <button type="button" class="plan-toggle-expand-btn" aria-label="Expandir o contraer">
          <svg class="chevron-expand-icon ${isExpanded ? 'rotated' : ''}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
    </div>

    <!-- Cuerpo expandible con los insumos/tareas completas -->
    <div class="plan-body-collapsible ${isExpanded ? 'open' : 'closed'}">
      <div class="plan-insumos-list">
        ${itemsHtml}
      </div>

      <form class="add-subitem-row" onsubmit="addCustomSubItem(event, ${collab.id})">
        <input type="text" class="add-subitem-input" placeholder="${addItemPlaceholder}" required>
        <button type="submit" class="btn btn-sm">${addBtnLabel}</button>
      </form>

      <div class="ai-grow-bar">
        <button type="button" class="ai-grow-trigger" onclick="toggleGrowPlan(${collab.id})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          <span>${isGrowing ? 'Ocultar sugerencias pus.io' : 'Desarrollar esta idea con <strong>pus.io</strong>'}</span>
        </button>
        ${
          isGrowing
            ? `<div class="ai-grow-suggestions">
                 <span style="font-size:0.75rem; color:var(--ink-secondary); font-weight:600;">Sugerencias para sumar en 1 clic:</span>
                 ${
                   available.length > 0
                     ? available.map(sug => `
                         <button type="button" class="ai-suggestion-chip" onclick="addSuggestedItemToCollab(${collab.id}, '${sug.replace(/'/g, "\'")}')">
                           <span>+</span> <span>${sug}</span>
                         </button>
                       `).join("")
                     : `<span style="font-size:0.75rem; color:var(--ink-muted);">Plan completo con los elementos clave.</span>`
                 }
               </div>`
            : ""
        }
      </div>
    </div>
  `;

  return card;
}

function renderDynamicTimeline() {
  const s1 = document.getElementById("timelineStage1");
  const s2 = document.getElementById("timelineStage2");
  const s3 = document.getElementById("timelineStage3");

  if (!s1 || !s2 || !s3) return;

  s1.innerHTML = "";
  s2.innerHTML = "";
  s3.innerHTML = "";

  // Agrupar colaboraciones según su etapa o inferencia
  collaborations.forEach(collab => {
    let targetStage = collab.stage || "stage2";
    const lower = (collab.title + " " + collab.category).toLowerCase();

    if (!collab.stage) {
      if (lower.includes("smash") || lower.includes("regalo") || lower.includes("película") || lower.includes("cine")) {
        targetStage = "stage3";
      } else if (lower.includes("ceviche") || lower.includes("bienvenida") || lower.includes("llegada") || lower.includes("playa") || lower.includes("voleibol")) {
        targetStage = "stage1";
      } else {
        targetStage = "stage2";
      }
    }

    const claimedCount = collab.items.filter(i => i.claimedBy).length;
    const totalCount = collab.items.length;
    const isPromoted = claimedCount > 0;

    const row = document.createElement("div");
    row.className = `timeline-plan-row ${isPromoted ? 'is-promoted' : ''}`;

    row.innerHTML = `
      <div class="timeline-plan-info">
        <span class="timeline-plan-title">${collab.title}</span>
        <span class="timeline-plan-meta">&bull; ${collab.author}</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="timeline-plan-pill ${isPromoted ? 'promoted-badge' : ''}">${claimedCount}/${totalCount} cubiertos</span>
      </div>
    `;

    if (targetStage === "stage1") s1.appendChild(row);
    else if (targetStage === "stage3") s3.appendChild(row);
    else s2.appendChild(row);
  });

  // Mostrar mensaje de aliento si alguna etapa no tiene aún planes
  [
    { container: s1, text: "Sin actividades aún" },
    { container: s2, text: "Sin dinámicas aún" },
    { container: s3, text: "Sin actividades aún" }
  ].forEach(stage => {
    if (stage.container.children.length === 0) {
      stage.container.innerHTML = `<div class="empty-stage-hint">${stage.text}</div>`;
    }
  });
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

let lastDeletedPlanCache = null;

function deleteCollab(collabId) {
  if (!requireAuth()) return;
  const targetPlan = collaborations.find(c => c.id === collabId);
  if (targetPlan) {
    if (!canManagePlan(targetPlan)) {
      showToast("Solo quien propuso esta idea o Tito (Admin) puede eliminarla.");
      return;
    }
  }

  const targetIdx = collaborations.findIndex(c => c.id === collabId);
  if (targetIdx === -1) return;
  const removedPlan = collaborations[targetIdx];

  collaborations.splice(targetIdx, 1);
  if (lastCreatedPlanId === collabId) {
    lastCreatedPlanId = null;
  }
  saveState();
  renderAll();

  lastDeletedPlanCache = {
    plan: removedPlan,
    index: targetIdx
  };

  showToast("Plan eliminado", "Deshacer", () => {
    if (!lastDeletedPlanCache) return;
    const { plan, index } = lastDeletedPlanCache;
    const insertAt = Math.min(index, collaborations.length);
    collaborations.splice(insertAt, 0, plan);
    lastDeletedPlanCache = null;
    saveState();
    renderAll();
    showToast("Plan restaurado");
  }, 7000);
}

function handlePusioMessage(rawText) {
  if (!requireAuth()) return;
  const text = rawText.trim();
  if (!text) return;

  const plan = decomposeProposalIntoTasks(text);
  if (!plan.isActionable) {
    showToast(plan.reply);
    return;
  }

  // En lugar de guardar directo al tablero general, lo dejamos como propuesta en preview
  pendingPlanProposal = {
    title: plan.title,
    category: plan.category,
    stage: plan.stage || "stage2",
    items: [...plan.items]
  };

  renderInlineRecentPlan();

  // Scroll suave al preview justo bajo el input en cualquier pantalla si es necesario
  const inlineSlot = document.getElementById("pusioInlineRecentPlan");
  if (inlineSlot) {
    inlineSlot.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  showToast(`Propuesta generada para: ${plan.title}`);
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
      category: "Comida",
      stage: "stage2",
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
      category: "Comida",
      stage: "stage1",
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
      category: "Comida",
      stage: "stage2",
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
      category: "Comida",
      stage: "stage2",
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
      category: "Comida",
      stage: "stage2",
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
      category: "Comida",
      stage: "stage1",
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
      category: "Actividad",
      stage: "stage3",
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
      category: "Comida",
      stage: "stage1",
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

  const isFood = lower.includes("comer") || lower.includes("cena") || lower.includes("botana") || lower.includes("postre") || lower.includes("pizza") || lower.includes("carne");
  const isNight = lower.includes("smash") || lower.includes("noche") || lower.includes("torneo") || lower.includes("regalo") || lower.includes("cine");
  const isAfternoon = lower.includes("llegada") || lower.includes("bienvenida") || lower.includes("alberca") || lower.includes("playa") || lower.includes("ceviche");

  let deducedStage = "stage2";
  if (isAfternoon) deducedStage = "stage1";
  else if (isNight) deducedStage = "stage3";

  return {
    isActionable: true,
    title: cleanTitle,
    category: isFood ? "Comida" : "Actividad",
    stage: deducedStage,
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

function renderWhosGoing() {
  const grid = document.getElementById("whosGoingGrid");
  if (!grid) return;
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

function normalizeStr(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function findPotentialMatch(inputEmail, inputName) {
  const normEmail = (inputEmail || "").toLowerCase().trim();
  const emailPrefix = normEmail.split("@")[0].replace(/[^a-z0-9]/g, "");
  const normName = normalizeStr(inputName);

  if (!emailPrefix && !normName) return null;

  // Buscar entre los participantes que aún NO tienen PIN configurado (personajes pendientes de reclamar)
  const unconfirmed = attendeesList.filter(u => !u.pinHash);

  for (const candidate of unconfirmed) {
    const candEmailNorm = candidate.email.toLowerCase();
    const candPrefix = candEmailNorm.split("@")[0].replace(/[^a-z0-9]/g, "");
    const candNameNorm = normalizeStr(candidate.name);

    // Coincidencia exacta de correo
    if (normEmail && candEmailNorm === normEmail) {
      return candidate;
    }

    // Coincidencia por prefijo del correo (ej: 'cesar.amigo' con 'cesar123@gmail.com')
    if (candPrefix.length >= 3 && emailPrefix.length >= 3) {
      if (candPrefix.includes(emailPrefix) || emailPrefix.includes(candPrefix)) {
        return candidate;
      }
    }

    // Coincidencia por nombre (ej: ingresa 'Cesar' o 'Noe' o 'Beto')
    if (normName.length >= 3 && candNameNorm.length >= 3) {
      if (candNameNorm.includes(normName) || normName.includes(candNameNorm)) {
        return candidate;
      }
    }
  }

  return null;
}

let pendingClaimedMatch = null;

function checkAuthDeduplication() {
  const emailInput = document.getElementById("authInputEmail");
  const nameInput = document.getElementById("authInputName");
  const banner = document.getElementById("claimMatchBanner");
  const bannerAvatar = document.getElementById("claimMatchAvatar");
  const bannerName = document.getElementById("claimMatchName");

  if (!emailInput || !nameInput || !banner) return;

  const emailVal = emailInput.value.trim().toLowerCase();
  const nameVal = nameInput.value.trim();

  // Si el correo ya pertenece exactamente a un usuario existente, no mostramos banner de "reclamar"
  const exact = attendeesList.find(u => u.email.toLowerCase() === emailVal);
  if (exact && exact.pinHash) {
    banner.style.display = "none";
    pendingClaimedMatch = null;
    return;
  }

  const match = findPotentialMatch(emailVal, nameVal);

  if (match && (!exact || !exact.pinHash)) {
    pendingClaimedMatch = match;
    bannerAvatar.innerHTML = renderRobotSVG(match.robot, null, null, true);
    bannerName.textContent = `¿Eres ${match.name}?`;
    banner.style.display = "flex";
  } else {
    pendingClaimedMatch = null;
    banner.style.display = "none";
  }
}

function openCarDetailModal(carId) {
  const car = carsList.find(c => c.id === carId);
  if (!car) return;

  const totalSeats = Number(car.seats) || 3;
  const passengers = Array.isArray(car.passengers) ? car.passengers : [];
  const takenPassengerSeats = passengers.length;
  const freePassengerSeats = Math.max(0, totalSeats - takenPassengerSeats);
  const isMine = currentUser && car.driverEmail.toLowerCase() === currentUser.email.toLowerCase();
  const amIPassenger = currentUser && passengers.some(p => p.email && p.email.toLowerCase() === currentUser.email.toLowerCase());

  // Nivel de llenado y semáforo de vibra correspondiente
  let vibeTier = "vibe-tier-low";
  let vibeStatusColor = "#0284C7";
  let vibeStatusText = `${freePassengerSeats} lugares libres`;

  if (freePassengerSeats === 0) {
    vibeTier = "vibe-tier-max";
    vibeStatusColor = "#7C3AED";
    vibeStatusText = "Auto completo • Fiesta total";
  } else if (takenPassengerSeats >= 2 || (takenPassengerSeats / totalSeats) >= 0.5) {
    vibeTier = "vibe-tier-high";
    vibeStatusColor = "#D97706";
    vibeStatusText = `${freePassengerSeats} libre${freePassengerSeats > 1 ? 's' : ''} • Casi lleno`;
  } else if (takenPassengerSeats >= 1) {
    vibeTier = "vibe-tier-mid";
    vibeStatusColor = "#059669";
    vibeStatusText = `${freePassengerSeats} libre${freePassengerSeats > 1 ? 's' : ''} • Buena vibra`;
  }

  // Título y subtítulo limpios (usando carácter de punto real · en lugar de entidad literal)
  document.getElementById("carDetailTitle").innerHTML = `${car.model} &bull; ${car.driver}`;
  document.getElementById("carDetailSubtitle").innerHTML = `Salida desde ${car.zone} &bull; ${car.time || 'Horario por acordar'}`;

  // Puntitos con el color del semáforo de la casilla
  let dotsHtml = `<span class="seat-dot driver-dot" title="Conductor: ${car.driver}"></span>`;
  for (let s = 0; s < totalSeats; s++) {
    if (s < takenPassengerSeats) {
      dotsHtml += `<span class="seat-dot dot-taken" style="background:${vibeStatusColor}; box-shadow:0 0 0 2px ${vibeStatusColor}33;"></span>`;
    } else {
      dotsHtml += `<span class="seat-dot dot-free" style="border-color:${vibeStatusColor};"></span>`;
    }
  }

  let passengersListHtml = `
    <div class="car-passenger-item car-passenger-driver">
      <div>
        <strong style="color:var(--ink);">${car.driver}</strong>
        <span style="font-size:0.75rem; color:var(--ink-secondary); display:block;">Conductor VIP &bull; ${car.driverEmail}</span>
      </div>
      <span class="avatar-vip-badge" style="position:static;">VIP</span>
    </div>
  `;

  if (passengers.length === 0) {
    passengersListHtml += `
      <div style="font-size:0.8rem; color:var(--ink-muted); padding:10px; text-align:center; border:1px dashed var(--border); border-radius:var(--radius-sm);">
        Aún no hay pasajeros registrados en este auto.
      </div>
    `;
  } else {
    passengers.forEach(p => {
      const isThisMe = currentUser && p.email && p.email.toLowerCase() === currentUser.email.toLowerCase();
      passengersListHtml += `
        <div class="car-passenger-item">
          <div>
            <strong>${p.name}${isThisMe ? ' (Tú)' : ''}</strong>
            <span style="font-size:0.72rem; color:var(--ink-muted); display:block;">Pasajero confirmado</span>
          </div>
          ${isThisMe ? `<button type="button" class="btn btn-secondary btn-sm" onclick="leaveCar(${car.id})">Bajarme</button>` : ''}
        </div>
      `;
    });
  }

  // Menú desplegable para unirse al viaje si hay espacio libre
  let joinDropdownHtml = "";
  if (freePassengerSeats > 0 && !isMine) {
    // Lista de candidatos: participantes que no sean el conductor de este auto ni pasajeros actuales de él
    const existingEmails = new Set(passengers.map(p => (p.email || "").toLowerCase()));
    existingEmails.add(car.driverEmail.toLowerCase());

    const availableAttendees = attendeesList.filter(u => !existingEmails.has(u.email.toLowerCase()));

    const optionsHtml = availableAttendees.map(u => {
      const isSelected = currentUser && currentUser.email.toLowerCase() === u.email.toLowerCase();
      return `<option value="${u.id}" ${isSelected ? 'selected' : ''}>${u.name} (${u.email})</option>`;
    }).join("");

    joinDropdownHtml = `
      <div class="car-join-select-box">
        <label for="selectJoinCarAttendee">Elegir quién se suma a este auto (${freePassengerSeats} disponible${freePassengerSeats > 1 ? 's' : ''}):</label>
        <div class="car-join-row">
          <select id="selectJoinCarAttendee" class="car-join-select">
            ${optionsHtml}
          </select>
          <button type="button" class="btn btn-pusio btn-sm" onclick="joinCarSelectedPerson(${car.id})">Unirse al viaje</button>
        </div>
      </div>
    `;
  }

  const detailBody = document.getElementById("carDetailBody");
  detailBody.innerHTML = `
    <div class="car-detail-info-block">
      <div class="car-detail-route-row">
        <span>Punto de partida:</span>
        <strong style="color:var(--ink);">${car.zone} (Mérida)</strong>
      </div>
      <div class="car-detail-route-row">
        <span>Hora de salida:</span>
        <strong style="color:var(--ink);">${car.time || 'Por definir'}</strong>
      </div>
      <div class="car-detail-route-row">
        <span>Capacidad y estado:</span>
        <strong style="color:${vibeStatusColor};">${vibeStatusText}</strong>
      </div>
      <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
        <span style="font-size:0.75rem; color:var(--ink-secondary);">Ocupación:</span>
        <div class="car-seats-dots" style="margin:0;">
          ${dotsHtml}
        </div>
      </div>
    </div>

    <h4 class="car-passengers-title">Quiénes viajan en este auto</h4>
    <div class="car-passengers-list">
      ${passengersListHtml}
    </div>

    <div class="car-action-buttons">
      ${
        isMine
          ? `<button type="button" class="btn btn-secondary" style="width:100%; border-color:var(--berry); color:var(--berry);" onclick="retireCar(${car.id})">Quitar mi auto</button>`
          : (
              amIPassenger
                ? `<button type="button" class="btn btn-secondary" style="width:100%;" onclick="leaveCar(${car.id})">Bajarme de este auto</button>`
                : (
                    freePassengerSeats > 0
                      ? joinDropdownHtml
                      : `<button type="button" class="btn btn-secondary" style="width:100%;" disabled>Auto lleno (sin lugares disponibles)</button>`
                  )
            )
      }
    </div>
  `;

  openModal("modalCarDetail");
}

function joinCarSelectedPerson(carId) {
  const selEl = document.getElementById("selectJoinCarAttendee");
  if (!selEl) return;
  const personId = Number(selEl.value);
  const person = attendeesList.find(u => u.id === personId);
  if (!person) return;

  const car = carsList.find(c => c.id === carId);
  if (!car) return;

  if (!Array.isArray(car.passengers)) car.passengers = [];
  const totalSeats = Number(car.seats) || 3;
  if (car.passengers.length >= totalSeats) {
    showToast("Este auto ya no tiene lugares disponibles");
    return;
  }

  // Quitar de cualquier otro auto
  carsList.forEach(c => {
    if (Array.isArray(c.passengers)) {
      c.passengers = c.passengers.filter(p => p.email && p.email.toLowerCase() !== person.email.toLowerCase());
    }
  });

  car.passengers.push({
    name: person.name,
    email: person.email
  });

  person.travelMode = "passenger";
  if (currentUser && currentUser.email.toLowerCase() === person.email.toLowerCase()) {
    currentUser.travelMode = "passenger";
  }

  saveState();
  renderAll();
  openCarDetailModal(car.id);
  showToast(`${person.name} se unió al viaje con ${car.driver}`);
}

function joinCarAsPassenger(carId) {
  if (!requireAuth()) return;
  const car = carsList.find(c => c.id === carId);
  if (!car) return;

  if (!Array.isArray(car.passengers)) car.passengers = [];
  const totalSeats = Number(car.seats) || 3;
  if (car.passengers.length >= totalSeats) {
    showToast("Este auto ya no tiene lugares disponibles");
    return;
  }

  // Quitar de cualquier otro auto
  carsList.forEach(c => {
    if (Array.isArray(c.passengers)) {
      c.passengers = c.passengers.filter(p => p.email && p.email.toLowerCase() !== currentUser.email.toLowerCase());
    }
  });

  car.passengers.push({
    name: currentUser.name,
    email: currentUser.email
  });

  currentUser.travelMode = "passenger";
  saveState();
  renderAll();
  openCarDetailModal(car.id);
  showToast(`Te sumaste al auto de ${car.driver}`);
}

function leaveCar(carId) {
  if (!currentUser) return;
  const car = carsList.find(c => c.id === carId);
  if (car && Array.isArray(car.passengers)) {
    car.passengers = car.passengers.filter(p => p.email && p.email.toLowerCase() !== currentUser.email.toLowerCase());
  }
  currentUser.travelMode = null;
  saveState();
  renderAll();
  openCarDetailModal(carId);
  showToast("Te has bajado del auto");
}

function retireCar(id) {
  if (!requireAuth()) return;
  const car = carsList.find(c => c.id === id);
  if (!car) return;

  const isMine = currentUser && (
    (car.driverEmail && car.driverEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
    (car.driver && car.driver.toLowerCase() === currentUser.name.toLowerCase())
  );
  if (!isMine) {
    showToast("Solo quien registró este auto puede retirarlo.");
    return;
  }

  const driverEmail = car.driverEmail || currentUser.email;
  carsList = carsList.filter(c => c.id !== id);

  // Actualizar conductor tanto en currentUser como en attendeesList
  const driver = attendeesList.find(u => u.email.toLowerCase() === driverEmail.toLowerCase());
  if (driver) {
    driver.puedo_dar_coche = 0;
    driver.travelMode = null;
  }
  if (currentUser && currentUser.email.toLowerCase() === driverEmail.toLowerCase()) {
    currentUser.puedo_dar_coche = 0;
    currentUser.travelMode = null;
  }

  saveState();
  closeModal("modalCarDetail");
  renderAll();
  showToast("Vehículo retirado y rango VIP cancelado");
}

function setupEventListeners() {
  document.querySelectorAll(".tab-trigger").forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });

  document.getElementById("btnOpenAuthModal").onclick = () => {
    if (currentUser) {
      renderMySummary();
      openModal("modalUserSummary");
      return;
    }
    document.getElementById("authErrorMsg").style.display = "none";
    checkAuthDeduplication();
    openModal("modalAuth");
  };

  // Escuchar tipeo en email y nombre para detectar coincidencias al instante
  const emailInput = document.getElementById("authInputEmail");
  const nameInput = document.getElementById("authInputName");
  if (emailInput) emailInput.addEventListener("input", checkAuthDeduplication);
  if (nameInput) nameInput.addEventListener("input", checkAuthDeduplication);

  // Botón para reclamar personaje coincidente
  const btnClaim = document.getElementById("btnClaimMatch");
  if (btnClaim) {
    btnClaim.onclick = () => {
      if (pendingClaimedMatch) {
        if (!nameInput.value.trim()) {
          nameInput.value = pendingClaimedMatch.name;
        }
        showToast(`Personaje vinculado: ${pendingClaimedMatch.name}. Elige tu apodo y PIN.`);
        nameInput.focus();
      }
    };
  }

  const btnOpenCar = document.getElementById("btnOpenCarModal");
  if (btnOpenCar) {
    btnOpenCar.onclick = () => {
      if (!requireAuth()) return;
      openModal("modalCar");
    };
  }

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
      if (nameVal && nameVal.trim()) {
        existing.name = nameVal.trim();
      }
      if (!existing.attendance || (!existing.attendanceSetByUser && existing.attendance !== "confirmed" && existing.attendance !== "declined")) {
        existing.attendance = "seen";
      }
      currentUser = existing;
    } else if (pendingClaimedMatch) {
      // Reclamar el perfil del participante existente (evitando duplicado)
      pendingClaimedMatch.email = emailVal;
      pendingClaimedMatch.name = nameVal;
      pendingClaimedMatch.pinHash = candidateHash;
      if (!pendingClaimedMatch.attendance || (!pendingClaimedMatch.attendanceSetByUser && pendingClaimedMatch.attendance !== "confirmed" && pendingClaimedMatch.attendance !== "declined")) {
        pendingClaimedMatch.attendance = "seen";
      }
      currentUser = pendingClaimedMatch;
      pendingClaimedMatch = null;
    } else {
      // Si no hay reclamo explícito, hacer un último chequeo de coincidencia por prefijo/nombre
      const autoMatch = findPotentialMatch(emailVal, nameVal);
      if (autoMatch) {
        autoMatch.email = emailVal;
        autoMatch.name = nameVal;
        autoMatch.pinHash = candidateHash;
        if (!autoMatch.attendance || (!autoMatch.attendanceSetByUser && autoMatch.attendance !== "confirmed" && autoMatch.attendance !== "declined")) {
          autoMatch.attendance = "seen";
        }
        currentUser = autoMatch;
      } else {
        const rndHue = Math.floor(Math.random() * 360);
        const newUser = {
          id: Date.now(),
          name: nameVal,
          email: emailVal,
          pinHash: candidateHash,
          attendance: "seen",
          attendanceSetByUser: false,
          travelMode: null,
          puedo_dar_coche: 0,
          robot: createBotConfig(rndHue, 0, 0, 0, 0, 0)
        };
        attendeesList.push(newUser);
        currentUser = newUser;
      }
    }

    errEl.style.display = "none";
    document.getElementById("authInputPin").value = "";
    document.getElementById("claimMatchBanner").style.display = "none";
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
      studioIsDirty = true;
    }
  });

  // Mezclar al azar con diseños Bottts reales
  document.getElementById("btnRandomRobot").onclick = () => {
    if (editingTarget !== "pusio" && !requireAuth()) return;
    const hue = Math.floor(Math.random() * 360);
    const newCfg = createBotConfig(
      hue,
      Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 14),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 7),
      Math.floor(Math.random() * 4)
    );
    if (editingTarget === "pusio") {
      pusioRobot = newCfg;
    } else {
      currentUser.robot = newCfg;
    }
    triggerCanvasPop();
    studioIsDirty = true;
    renderRobotStudio();
    showToast("Avatar mezclado con nuevas piezas");
  };

  document.getElementById("btnSaveRobotStudio").onclick = saveRobotStudioAction;

  const btnConfPassenger = document.getElementById("btnConfirmPassenger");
  if (btnConfPassenger) {
    btnConfPassenger.onclick = () => {
      if (!requireAuth()) return;
      currentUser.travelMode = "passenger";
      currentUser.puedo_dar_coche = 0;
      saveState();
      renderAll();
      showToast(`${currentUser.name} confirmado como pasajero`);
    };
  }

  document.getElementById("carForm").onsubmit = (e) => {
    e.preventDefault();
    if (!requireAuth()) return;

    // Evitar que el mismo usuario registre más de un vehículo
    carsList = carsList.filter(c => c.driverEmail.toLowerCase() !== currentUser.email.toLowerCase());

    const newCar = {
      id: Date.now(),
      driverEmail: currentUser.email,
      driver: currentUser.name,
      model: document.getElementById("carInputModel").value.trim(),
      seats: Number(document.getElementById("carInputSeats").value) || 3,
      zone: document.getElementById("carInputZone").value.trim(),
      time: document.getElementById("carInputTime").value.trim(),
      passengers: []
    };

    carsList.push(newCar);

    currentUser.puedo_dar_coche = 1;
    currentUser.travelMode = "driver";

    // Reflejar también en el objeto dentro de attendeesList
    const inList = attendeesList.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
    if (inList) {
      inList.puedo_dar_coche = 1;
      inList.travelMode = "driver";
    }

    saveState();
    closeModal("modalCar");
    document.getElementById("carForm").reset();
    renderAll();
    showToast(`Coche registrado. ¡Rango y brillo VIP activado para ${currentUser.name}!`);
  };

  document.querySelectorAll(".example-pill").forEach(btn => {
    btn.onclick = () => {
      const prompt = btn.dataset.prompt;
      if (prompt) handlePusioMessage(prompt);
    };
  });

  const pForm = document.getElementById("pusioForm");
  if (pForm) {
    pForm.onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById("pusioInput");
      const val = input ? input.value.trim() : "";
      if (val) {
        handlePusioMessage(val);
        input.value = "";
      }
    };
  }

  // Compositor principal con pus.io en la sección de planes y dinámicas
  const agendaForm = document.getElementById("agendaProposalForm");
  if (agendaForm) {
    agendaForm.onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById("agendaProposalInput");
      const val = input.value.trim();
      if (val) {
        handlePusioMessage(val);
        input.value = "";
      }
    };
  }

  // Chispas de ideas interactivas
  document.querySelectorAll(".spark-chip").forEach(chip => {
    chip.onclick = () => {
      const prompt = chip.dataset.prompt;
      if (prompt) {
        handlePusioMessage(prompt);
      }
    };
  });

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      closeModal(btn.getAttribute("data-close"));
    };
  });
}

// Delegación global de eventos para asegurar que cualquier botón con data-close o tachita funcione siempre
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest("[data-close]");
  if (closeBtn) {
    e.preventDefault();
    e.stopPropagation();
    const modalId = closeBtn.getAttribute("data-close");
    if (modalId === "modalRobotStudio") {
      requestCloseStudio();
    } else if (modalId) {
      closeModal(modalId);
    }
    return;
  }

  // Cierre al hacer clic en el backdrop / overlay del modal
  if (e.target.classList && e.target.classList.contains("modal-overlay")) {
    if (e.target.id === "modalRobotStudio") {
      requestCloseStudio();
    } else {
      closeModal(e.target.id);
    }
  }
});

// Cerrar modal activo al presionar la tecla Escape
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    const activeModals = Array.from(document.querySelectorAll(".modal-overlay:not(.hidden)"));
    const confirmModal = activeModals.find(m => m.id === "modalConfirmUnsavedStudio");
    if (confirmModal) {
      closeModal("modalConfirmUnsavedStudio");
      return;
    }
    const studioModal = activeModals.find(m => m.id === "modalRobotStudio");
    if (studioModal) {
      requestCloseStudio();
      return;
    }
    activeModals.forEach(m => {
      closeModal(m.id);
    });
  }
});

// ==========================================================================
// CONTROL DE PESTAÑAS MÓVILES (VISTA EJECUTIVA SIN SCROLL EN MÓVILES)
// ==========================================================================
let activeMobileTab = "tab-pusio";

function setupMobileTabs() {
  const tabs = document.querySelectorAll(".mobile-tab-btn");
  if (!tabs.length) return;

  function switchMobileTab(tabKey) {
    activeMobileTab = tabKey;

    // Actualizar clase en el body para control de visibilidad CSS
    document.body.classList.toggle("mobile-tab-is-pusio", tabKey === "tab-pusio");

    // Actualizar botones de pestaña
    tabs.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mobileTab === tabKey);
    });

    // Actualizar paneles correspondientes
    document.querySelectorAll("[data-mobile-pane]").forEach(pane => {
      const match = pane.getAttribute("data-mobile-pane") === tabKey;
      pane.classList.toggle("mobile-active", match);
    });

    // Si se selecciona la pestaña Planes, asegurar scroll hacia la sección de planes
    if (tabKey === "tab-agenda") {
      const agendaEl = document.getElementById("mainAgendaSection");
      if (agendaEl) agendaEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  tabs.forEach(btn => {
    btn.onclick = () => {
      switchMobileTab(btn.dataset.mobileTab);
    };
  });

  // Activar pestaña inicial si estamos en resolución móvil
  switchMobileTab("tab-pusio");
}

function showToast(msg, actionLabel = null, actionCallback = null, duration = 2600) {
  const toast = document.getElementById("toastNotice");
  if (!toast) return;

  clearTimeout(window._toastTimer);
  toast.innerHTML = "";

  const textSpan = document.createElement("span");
  textSpan.textContent = msg;
  toast.appendChild(textSpan);

  if (actionLabel && typeof actionCallback === "function") {
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "toast-action-btn";
    actionBtn.textContent = actionLabel;
    actionBtn.onclick = (e) => {
      e.stopPropagation();
      clearTimeout(window._toastTimer);
      toast.classList.remove("show");
      actionCallback();
    };
    toast.appendChild(actionBtn);
  }

  toast.classList.add("show");
  window._toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function syncModalBodyScrollLock() {
  const hasOpenModal = document.querySelector(".modal-overlay:not(.hidden)") !== null;
  document.body.style.overflow = hasOpenModal ? "hidden" : "";
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("hidden");
    const box = el.querySelector(".modal-box");
    if (box) box.scrollTop = 0;
  }
  syncModalBodyScrollLock();
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
  if (id === "modalRobotStudio") {
    editingTarget = "user";
    studioIsDirty = false;
    studioOriginalState = null;
  }
  syncModalBodyScrollLock();
}

function requestCloseStudio() {
  if (studioIsDirty) {
    openModal("modalConfirmUnsavedStudio");
    return;
  }
  closeModal("modalRobotStudio");
}

function saveRobotStudioAction() {
  if (editingTarget !== "pusio" && !requireAuth()) return;
  saveState();
  studioIsDirty = false;
  studioOriginalState = null;
  renderAll();
  if (editingTarget === "pusio") {
    showToast("Avatar de Pus.io guardado con éxito.");
  } else {
    showToast(`Diseño guardado en el perfil de ${currentUser.name}`);
  }
  closeModal("modalRobotStudio");
  closeModal("modalConfirmUnsavedStudio");
}

function confirmSaveAndCloseStudio() {
  saveRobotStudioAction();
}

function confirmDiscardAndCloseStudio() {
  if (studioOriginalState) {
    if (studioOriginalState.target === "pusio") {
      pusioRobot = studioOriginalState.robot;
    } else if (currentUser && studioOriginalState.target === "user") {
      currentUser.robot = studioOriginalState.robot;
      currentUser.name = studioOriginalState.name;
      if (studioOriginalState.attendance) {
        currentUser.attendance = studioOriginalState.attendance;
      }
    }
  }
  studioIsDirty = false;
  studioOriginalState = null;
  renderAll();
  closeModal("modalConfirmUnsavedStudio");
  closeModal("modalRobotStudio");
  showToast("Cambios descartados");
}

// ==========================================================================
// CONCURSO DE PERSONALIZACIÓN DE PUS.IO (VOTACIONES & RECOMPENSAS APRENDIDAS)
// ==========================================================================
function openPusioContestModal() {
  renderContestRewards();
  renderContestSubmissions();
  openModal("modalPusioContest");
}

function renderContestRewards() {
  const container = document.getElementById("contestRewardChips");
  if (!container) return;
  container.innerHTML = "";

  const ideas = pusioContest.rewardIdeas || [];
  ideas.forEach(idea => {
    const chip = document.createElement("div");
    chip.className = "contest-reward-chip";
    chip.innerHTML = `
      <span class="reward-chip-dot"></span>
      <span class="reward-chip-text">${idea}</span>
    `;
    container.appendChild(chip);
  });
}

function submitRewardIdea(e) {
  e.preventDefault();
  if (!requireAuth()) return;
  const input = document.getElementById("contestRewardInput");
  if (!input) return;
  const rawText = input.value.trim();
  if (!rawText) return;

  // Filtrar duplicados insensibles a mayúsculas
  const alreadyExists = pusioContest.rewardIdeas.some(
    item => item.toLowerCase() === rawText.toLowerCase()
  );

  if (alreadyExists) {
    showToast("Esa idea ya está entre las propuestas del premio.");
    input.value = "";
    return;
  }

  // Guardar la nueva propuesta del usuario
  pusioContest.rewardIdeas.unshift(rawText);

  // Aprendizaje activo: si el texto tiene ciertas palabras clave, inferir una variante jocosa
  const lower = rawText.toLowerCase();
  let generatedIdea = null;

  if (lower.includes("dormir") || lower.includes("cama") || lower.includes("cuarto")) {
    generatedIdea = "Apartar la mejor cama con aire acondicionado en Chelem";
  } else if (lower.includes("cerveza") || lower.includes("chela") || lower.includes("trago") || lower.includes("cubeta")) {
    generatedIdea = "Servicio de hielera VIP llevado directo a la alberca";
  } else if (lower.includes("música") || lower.includes("dj") || lower.includes("bocina") || lower.includes("playlist")) {
    generatedIdea = "Control absoluto del Bluetooth sin derecho a veto musical";
  } else if (lower.includes("smash") || lower.includes("juego") || lower.includes("switch")) {
    generatedIdea = "Elegir escenario y reglas en el combate estelar de Smash";
  }

  if (generatedIdea && !pusioContest.rewardIdeas.some(i => i.toLowerCase() === generatedIdea.toLowerCase())) {
    pusioContest.rewardIdeas.push(generatedIdea);
  }

  input.value = "";
  saveState();
  renderContestRewards();
  showToast("Tu propuesta de recompensa se registró con éxito.");
}

function submitCurrentPusioToContest() {
  if (!requireAuth()) return;

  const currentCfg = pusioRobot || DEFAULT_PUSIO_ROBOT;
  const userEmail = currentUser.email.toLowerCase();
  const userName = currentUser.name;

  // Verificar si ya postuló
  let existing = pusioContest.submissions.find(
    s => s.authorEmail.toLowerCase() === userEmail
  );

  if (existing) {
    existing.robot = JSON.parse(JSON.stringify(currentCfg));
    existing.authorName = userName;
    existing.updatedAt = new Date().toISOString();
    showToast("Tu propuesta de Pus.io ha sido actualizada en el concurso.");
  } else {
    const newSubmission = {
      id: Date.now(),
      authorEmail: userEmail,
      authorName: userName,
      robot: JSON.parse(JSON.stringify(currentCfg)),
      votesCount: 0,
      createdAt: new Date().toISOString()
    };
    pusioContest.submissions.push(newSubmission);
    showToast("¡Pus.io postulado al concurso con éxito!");
  }

  saveState();
  renderContestSubmissions();
}

function votePusioDesign(submissionId) {
  if (!requireAuth()) return;

  const userEmail = currentUser.email.toLowerCase();
  const previousVoteSubId = pusioContest.votes[userEmail];

  if (previousVoteSubId === submissionId) {
    showToast("Ya votaste por esta propuesta.");
    return;
  }

  // Quitar voto de la propuesta anterior si existía
  if (previousVoteSubId) {
    const prevSub = pusioContest.submissions.find(s => s.id === previousVoteSubId);
    if (prevSub && prevSub.votesCount > 0) {
      prevSub.votesCount--;
    }
  }

  // Sumar voto a la nueva propuesta
  const targetSub = pusioContest.submissions.find(s => s.id === submissionId);
  if (targetSub) {
    targetSub.votesCount = (targetSub.votesCount || 0) + 1;
    pusioContest.votes[userEmail] = submissionId;
  }

  // La propuesta con más votos actualiza el Pus.io oficial activo de la posada
  checkContestLeader();

  saveState();
  renderContestSubmissions();
  renderPusioMascot();
  showToast(`Tu voto para el diseño de ${targetSub.authorName} fue guardado.`);
}

function checkContestLeader() {
  if (!pusioContest.submissions || pusioContest.submissions.length === 0) return;

  const sorted = [...pusioContest.submissions].sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));
  const leader = sorted[0];

  if (leader && leader.votesCount > 0) {
    pusioRobot = JSON.parse(JSON.stringify(leader.robot));
  }
}

function renderContestSubmissions() {
  const grid = document.getElementById("contestSubmissionsGrid");
  const countBadge = document.getElementById("contestSubmissionsCount");
  if (!grid) return;

  const list = pusioContest.submissions || [];
  if (countBadge) {
    countBadge.textContent = `${list.length} propuesta${list.length === 1 ? '' : 's'}`;
  }

  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="contest-empty-box">
        <p>Aún no hay propuestas registradas. Personaliza tu versión de Pus.io y sé el primero en postularla.</p>
      </div>
    `;
    return;
  }

  // Ordenar por votos descendente
  const sorted = [...list].sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));
  const userVoteId = currentUser ? pusioContest.votes[(currentUser.email || "").toLowerCase()] : null;

  sorted.forEach((sub, rank) => {
    const isVotedByMe = userVoteId === sub.id;
    const isLeader = rank === 0 && sub.votesCount > 0;
    const isMySubmission = currentUser && currentUser.email.toLowerCase() === sub.authorEmail.toLowerCase();

    const card = document.createElement("div");
    card.className = `contest-card ${isLeader ? 'is-leader' : ''} ${isVotedByMe ? 'is-my-vote' : ''}`;

    const svgIcon = renderRobotSVG(sub.robot, null, null, true);

    card.innerHTML = `
      ${isLeader ? '<div class="contest-leader-ribbon">Líder Oficial</div>' : ''}
      <div class="contest-card-avatar">
        ${svgIcon}
      </div>
      <div class="contest-card-body">
        <span class="contest-card-author">Por ${sub.authorName}${isMySubmission ? ' (Tú)' : ''}</span>
        <span class="contest-votes-count">${sub.votesCount || 0} voto${(sub.votesCount || 0) === 1 ? '' : 's'}</span>
      </div>
      <button type="button" class="btn btn-sm ${isVotedByMe ? 'btn-pusio' : 'btn-secondary'}" onclick="votePusioDesign(${sub.id})">
        ${isVotedByMe ? 'Votado' : 'Votar'}
      </button>
    `;

    grid.appendChild(card);
  });
}

// Exponer explícitamente en el objeto window global para que onclick="" en el HTML siempre responda
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.deleteCollab = deleteCollab;
window.removePendingProposalItem = removePendingProposalItem;
window.discardPendingProposal = discardPendingProposal;
window.confirmPendingProposal = confirmPendingProposal;
window.togglePlanCollapse = togglePlanCollapse;
window.startEditSubItem = startEditSubItem;
window.cancelEditSubItem = cancelEditSubItem;
window.saveEditSubItem = saveEditSubItem;
window.deleteSubItem = deleteSubItem;
window.retireCar = retireCar;
window.leaveCar = leaveCar;
window.joinCarAsPassenger = joinCarAsPassenger;
window.joinCarSelectedPerson = joinCarSelectedPerson;
window.openCarDetailModal = openCarDetailModal;
window.selectUserForCustomization = selectUserForCustomization;
window.openPusioActionMenu = openPusioActionMenu;
window.selectPusioForCustomization = selectPusioForCustomization;
window.openPusioContestModal = openPusioContestModal;
window.requestCloseStudio = requestCloseStudio;
window.saveRobotStudioAction = saveRobotStudioAction;
window.confirmSaveAndCloseStudio = confirmSaveAndCloseStudio;
window.confirmDiscardAndCloseStudio = confirmDiscardAndCloseStudio;
window.setAttendanceStatus = setAttendanceStatus;
window.setStudioAttendance = setStudioAttendance;
window.submitRewardIdea = submitRewardIdea;
window.submitCurrentPusioToContest = submitCurrentPusioToContest;
window.votePusioDesign = votePusioDesign;

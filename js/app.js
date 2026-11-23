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
  face:      ["round01", "round02", "square01", "square02", "square03", "square04", "hexagon", "retroTv", "capsule", "diamond", "heartBot", "octagon"],
  eyes:      ["eva", "shade01", "robocop", "happy", "glow", "sensor", "roundFrame01", "roundFrame02", "bulging", "hearts", "dizzy", "frame1", "frame2", "round", "stars", "wink", "pixelShades", "sleepy", "angry", "laser", "spiral", "money", "cuteSparkle", "monocle"],
  mouth:     ["smile01", "smile02", "grill03", "bite", "diagram", "grill01", "grill02", "square01", "square02", "mustache", "tongue", "surprised", "whistle", "equalizer", "catSmile", "zigzag", "vampire", "kiss", "none"],
  top:       ["radar", "glowingBulb01", "horns", "lights", "pyramid", "antenna", "antennaCrooked", "bulb01", "glowingBulb02", "kingCrown", "propeller", "starAntenna", "catEars", "mohawk", "satellite", "none"],
  sides:     ["cables01", "cables02", "antenna01", "antenna02", "round", "square", "squareAssymetric", "headphones", "elfEars", "ornaments", "wings", "thrusters", "gears", "none"],
  texture:   ["none", "circuits", "dots", "camo01", "camo02", "grunge01", "grunge02", "dirty01", "dirty02", "snowflakes", "candyStripes", "starsTex", "sweater", "cyberGrid", "beachWaves"],
  accessory: ["none", "santaHat", "reindeerAntlers", "elfHat", "scarf", "santaBeard", "giftBow", "fairyLights", "starCrown", "treeGlasses", "holly", "snowmanHat", "partyGlasses", "rudolphNose", "angelHalo"],
  bg:        ["solid", "linear", "radial", "rings", "grid", "split", "snow", "sparkles", "sunburst", "bokeh", "confetti", "waves"]
};

const PART_LABELS = {
  face:      { title: "Diseños de Cabeza",    pri: "Color Principal",   sec: "Sombra y Detalle" },
  eyes:      { title: "Diseños de Ojos",      pri: "Mirada",            sec: "Marco y Gafas" },
  mouth:     { title: "Diseños de Boca",      pri: "Sonrisa",           sec: "Contorno" },
  top:       { title: "Detalle Superior",     pri: "Elemento Superior", sec: "Base" },
  sides:     { title: "Diseños Laterales",    pri: "Laterales",         sec: "Conectores" },
  texture:   { title: "Patrón y Acabado",     pri: "Color del Patrón",  sec: "Fondo del Patrón" },
  accessory: { title: "Accesorios y Navidad", pri: "Color Principal",   sec: "Detalle / Adorno" },
  bg:        { title: "Estilo de Fondo",      pri: "Fondo Primario",    sec: "Fondo Secundario" }
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
    face:      { shape: CATALOG_KEYS.face[fIdx % 6],       pri: { h: hue, s: 82, l: 52 }, sec: { h: (hue + 20) % 360, s: 75, l: 32 } },
    eyes:      { shape: CATALOG_KEYS.eyes[eIdx % 14],      pri: { h: (hue + 150) % 360, s: 95, l: 60 }, sec: { h: 215, s: 30, l: 15 } },
    mouth:     { shape: CATALOG_KEYS.mouth[mIdx % 9],      pri: { h: 165, s: 90, l: 62 }, sec: { h: 215, s: 28, l: 16 } },
    top:       { shape: CATALOG_KEYS.top[tIdx % 9],        pri: { h: (hue + 45) % 360, s: 88, l: 56 }, sec: { h: 42, s: 92, l: 58 } },
    sides:     { shape: CATALOG_KEYS.sides[sIdx % 7],      pri: { h: hue, s: 78, l: 48 }, sec: { h: 210, s: 32, l: 24 } },
    texture:   { shape: CATALOG_KEYS.texture[txIdx % 9],   pri: { h: (hue + 180) % 360, s: 80, l: 75 }, sec: { h: hue, s: 82, l: 52 } },
    accessory: { shape: "none",                            pri: { h: 355, s: 84, l: 50 }, sec: { h: 42, s: 88, l: 92 } },
    bg:        { shape: "linear",                          pri: { h: hue, s: 68, l: 92 }, sec: { h: (hue + 35) % 360, s: 65, l: 83 } }
  };
}

function ensureRobotParts(r) {
  if (!r) return createBotConfig(200, 0, 0, 0, 0, 0);
  if (!r.accessory) {
    r.accessory = { shape: "none", pri: { h: 355, s: 84, l: 50 }, sec: { h: 42, s: 88, l: 92 } };
  }
  return r;
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
  { id: 1795137186754, name: "Shalom",    email: "ayorasuasteandresmiguel@gmail.com",pinHash: null, attendance: "seen", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(51, 1, 3, 2, 1, 0, 0) },
  { id: 1795022352684, name: "Alpaquiña", email: "aldopantoja2002@gmail.com",       pinHash: null, attendance: "seen", travelMode: null, puedo_dar_coche: 0, robot: createBotConfig(166, 0, 1, 0, 3, 2, 0) }
];

// Tablero inicial completamente limpio y vacío para la versión final de producción
const DEFAULT_COLLABORATIONS = [];

// Sección de Adicionales & Básicos (calculados para 13 personas; sin vasos desechables)
const DEFAULT_ADDITIONALS = [
  { id: "add_botanas",   name: "Botanas / Papas / Totopos",   qtyHint: "~6–8 bolsas grandes (2 c/u)",            targetQty: 3, claimers: [] },
  { id: "add_refrescos", name: "Refrescos / Bebidas",         qtyHint: "~10–12 L (5–6 botellas de 2L)",          targetQty: 3, claimers: [] },
  { id: "add_hielo",     name: "Hielo (bolsas de 5 kg)",      qtyHint: "~6 bolsas / 30 kg para hieleras",        targetQty: 3, claimers: [] },
  { id: "add_agua",      name: "Agua natural",                qtyHint: "~20 L (1 garrafón + 1 paq. botellas)",   targetQty: 2, claimers: [] },
  { id: "add_platos",    name: "Platos desechables",          qtyHint: "~40–50 platos resistentes (2 paq.)",     targetQty: 2, claimers: [] },
  { id: "add_cubiertos", name: "Cubiertos y servilletas",     qtyHint: "~2 paq. servilletas + 30 cubiertos",     targetQty: 2, claimers: [] },
  { id: "add_salsas",    name: "Salsas, limones y sal",       qtyHint: "~1 kg limones + 2–3 salsas + sal",       targetQty: 1, claimers: [] },
  { id: "add_basura",    name: "Bolsas de basura",            qtyHint: "~1 rollo jumbo resistente",              targetQty: 1, claimers: [] },
  { id: "add_carbon",    name: "Carbón y encendedor",         qtyHint: "~6 kg (2 bolsas) + encendedor",          targetQty: 1, claimers: [] }
];

// Estimación de costo total en MXN para 13 personas por tipo de insumo
function estimateTotalCostMXNFor13(itemName) {
  const n = (itemName || "").toLowerCase();
  if (/carne|arrachera|rib|sirloin|bistec|pastor|cochinita|costilla/.test(n)) return 950;
  if (/pizza/.test(n)) return 780;
  if (/hamburguesa|carne molida/.test(n)) return 650;
  if (/ceviche|camar[oó]n|pescado|pulpo/.test(n)) return 720;
  if (/cerveza|chela|alcohol|ron|tequila|mezcal|vodka/.test(n)) return 600;
  if (/pollo|pechuga/.test(n)) return 480;
  if (/salchicha|chistorra|chorizo|tocino/.test(n)) return 280;
  if (/botana|papa|totopo|dorito|sabrita|cacahuate/.test(n)) return 260;
  if (/refresco|coca|soda|jugo/.test(n)) return 240;
  if (/queso/.test(n)) return 220;
  if (/hielo/.test(n)) return 180;
  if (/carb[oó]n/.test(n)) return 170;
  if (/verdura|lechuga|tomate|jitomate|cebolla|aguacate|cilantro|guacamole/.test(n)) return 180;
  if (/pan|bollo|medias noches|tortilla/.test(n)) return 160;
  if (/postre|pastel|brownie|galleta|helado/.test(n)) return 240;
  if (/plato|desechable/.test(n)) return 140;
  if (/agua|garraf[oó]n/.test(n)) return 130;
  if (/cubierto|servilleta/.test(n)) return 120;
  if (/salsa|lim[oó]n|catsup|mayonesa|mostaza|aderezo|sal/.test(n)) return 110;
  if (/basura/.test(n)) return 70;
  return 150;
}

// Estimación automática de cantidades sugeridas para 13 personas en consumibles
function estimateConsumableFor13(itemName) {
  const n = (itemName || "").toLowerCase();
  if (/carne|arrachera|rib|sirloin|bistec|pastor|cochinita|pollo|pechuga|costilla/.test(n)) return "~3–3.5 kg (13 pers.)";
  if (/hamburguesa|carne molida/.test(n)) return "~20–26 carnes / ~3 kg (13 pers.)";
  if (/pan|bollo|medias noches|bimbo/.test(n)) return "~20–24 pzas / 3 paq. (13 pers.)";
  if (/salchicha|chistorra|chorizo|tocino/.test(n)) return "~2–2.5 kg / 3–4 paq. (13 pers.)";
  if (/queso/.test(n)) return "~1–1.5 kg / 2–3 paq. (13 pers.)";
  if (/tortilla/.test(n)) return "~3 kg (13 pers.)";
  if (/totopo|botana|papa|dorito|sabrita|cacahuate/.test(n)) return "~6–8 bolsas grandes (13 pers.)";
  if (/refresco|coca|soda|jugo|agua|horchata|jamaica/.test(n)) return "~10–12 L (13 pers.)";
  if (/cerveza|chela|alcohol|ron|tequila|mezcal|vodka/.test(n)) return "~2–3 cartones / 2–3 botellas (13 pers.)";
  if (/hielo/.test(n)) return "~6 bolsas / 30 kg (13 pers.)";
  if (/ceviche|camar[oó]n|pescado|pulpo/.test(n)) return "~2.5–3 kg (13 pers.)";
  if (/verdura|lechuga|tomate|jitomate|cebolla|aguacate|cilantro|guacamole/.test(n)) return "~1.5–2 kg / 6–8 pzas (13 pers.)";
  if (/lim[oó]n/.test(n)) return "~1–1.5 kg (13 pers.)";
  if (/salsa|catsup|mayonesa|mostaza|aderezo|chile/.test(n)) return "~2–3 frascos/botellas (13 pers.)";
  if (/carb[oó]n/.test(n)) return "~6 kg / 2 bolsas (13 pers.)";
  if (/postre|pastel|brownie|galleta|helado/.test(n)) return "~15–20 porciones (13 pers.)";
  if (/plato|servilleta|cubierto/.test(n)) return "~40–50 pzas / 2 paq. (13 pers.)";
  return "";
}

// Recompensas iniciales sugeridas para el concurso de personalización de Pus.io (relevantes para la posada)
const DEFAULT_REWARD_IDEAS = [
  { id: "rew_cancion",   text: "Elegir la primera canción que sonará al llegar a Chelem", authorEmail: "", authorName: "Posada", votes: [] },
  { id: "rew_plato",     text: "El primer plato servido en la comida principal",            authorEmail: "", authorName: "Posada", votes: [] },
  { id: "rew_capitan",   text: "Título honorario de Capitán de Playa Chelem 2026",        authorEmail: "", authorName: "Posada", votes: [] },
  { id: "rew_limpieza",  text: "Exento de recoger basura o limpiar al final",             authorEmail: "", authorName: "Posada", votes: [] },
  { id: "rew_asiento",   text: "El mejor lugar con sombra y ventilador en la terraza",    authorEmail: "", authorName: "Posada", votes: [] }
];

let currentUser = null;
let activePart = "face";
let activeColorChannel = "pri"; // "pri" o "sec"
let attendeesList = [];
let carsList = [];
let collaborations = [];
let additionalsList = [];
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
  initSupabaseAuth();
  initChelemWeather();
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

  const r = ensureRobotParts(JSON.parse(JSON.stringify(robotCfg || createBotConfig(200, 0, 0, 0, 0, 0))));
  if (overridePart && overrideShape !== null) {
    if (!r[overridePart]) ensureRobotParts(r);
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
    } else if (r.bg.shape === "snow") {
      bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><g fill="${bgSec}" fill-opacity=".85"><circle cx="24" cy="24" r="4"/><circle cx="62" cy="16" r="2.5"/><circle cx="118" cy="22" r="3.5"/><circle cx="158" cy="34" r="4.5"/><circle cx="18" cy="78" r="3"/><circle cx="164" cy="86" r="3.5"/><circle cx="28" cy="144" r="4"/><circle cx="148" cy="148" r="3.5"/><circle cx="88" cy="164" r="3"/></g>`;
    } else if (r.bg.shape === "sparkles") {
      bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><g fill="${bgSec}"><path d="M26 18 L29 27 L38 30 L29 33 L26 42 L23 33 L14 30 L23 27 Z"/><path d="M150 20 L152 27 L159 29 L152 31 L150 38 L148 31 L141 29 L148 27 Z"/><path d="M22 136 L24 142 L30 144 L24 146 L22 152 L20 146 L14 144 L20 142 Z"/><path d="M154 134 L157 142 L165 145 L157 148 L154 156 L151 148 L143 145 L151 142 Z"/></g>`;
    } else if (r.bg.shape === "sunburst") {
      bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><g fill="${bgSec}" fill-opacity=".55"><polygon points="90,90 70,0 110,0"/><polygon points="90,90 180,70 180,110"/><polygon points="90,90 70,180 110,180"/><polygon points="90,90 0,70 0,110"/><polygon points="90,90 155,0 180,25"/><polygon points="90,90 0,25 25,0"/><polygon points="90,90 180,155 155,180"/><polygon points="90,90 25,180 0,155"/></g>`;
    } else if (r.bg.shape === "bokeh") {
      bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><g fill="${bgSec}"><circle cx="30" cy="34" r="22" fill-opacity=".35"/><circle cx="152" cy="40" r="26" fill-opacity=".3"/><circle cx="24" cy="146" r="24" fill-opacity=".3"/><circle cx="150" cy="148" r="20" fill-opacity=".4"/><circle cx="92" cy="24" r="14" fill-opacity=".28"/></g>`;
    } else if (r.bg.shape === "confetti") {
      bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><g fill="${bgSec}"><rect x="18" y="20" width="12" height="5" rx="2" transform="rotate(25 18 20)"/><rect x="144" y="24" width="12" height="5" rx="2" transform="rotate(-30 144 24)"/><rect x="22" y="142" width="12" height="5" rx="2" transform="rotate(-20 22 142)"/><rect x="148" y="146" width="12" height="5" rx="2" transform="rotate(35 148 146)"/><circle cx="52" cy="22" r="3.5"/><circle cx="126" cy="18" r="3.5"/><circle cx="162" cy="96" r="3.5"/><circle cx="16" cy="90" r="3.5"/></g>`;
    } else if (r.bg.shape === "waves") {
      bgSvg = `<rect width="180" height="180" fill="${bgPri}"/><path d="M0 124 Q45 104 90 124 T180 124 V180 H0 Z" fill="${bgSec}" fill-opacity=".55"/><path d="M0 148 Q45 130 90 148 T180 148 V180 H0 Z" fill="${bgSec}" fill-opacity=".85"/>`;
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

  // 8. Accesorios / Navidad (capa frontal)
  let accSvg = "";
  const accKey = r.accessory ? r.accessory.shape : "none";
  if (accKey && accKey !== "none" && lib.accessory && lib.accessory[accKey]) {
    accSvg = lib.accessory[accKey]
      .replace(/\{\{UID\}\}/g, uid)
      .replace(/\{\{PRI\}\}/g, hslStr(r.accessory.pri))
      .replace(/\{\{SEC\}\}/g, hslStr(r.accessory.sec));
  }

  return `<svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">${bgSvg}${sidesSvg}${topSvg}${faceSvg}${mouthSvg}${eyesSvg}${accSvg}</svg>`;
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

// ----------------- Estado Local & Nube (Supabase Sync + Auth) ----------------- //
const SUPABASE_URL = "https://zrxingfpnczypophqbai.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kRulPNGJbnmw-Gj8FG_ljg_RWMFbzL2";

const supabaseClient = (window.supabase && typeof window.supabase.createClient === "function")
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

let supabaseAuthUser = null;
let googleProviderToken = null;
let calendarSyncInFlight = false;

function getGoogleCalendarToken() {
  if (googleProviderToken) return googleProviderToken;
  try {
    const cached = sessionStorage.getItem("posada_google_calendar_token");
    if (cached) {
      googleProviderToken = cached;
      return cached;
    }
  } catch (e) {}
  return null;
}

function getCalendarSyncMeta() {
  try {
    const raw = localStorage.getItem("posada_gcal_sync_meta_v1");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveCalendarSyncMeta(meta) {
  try {
    localStorage.setItem("posada_gcal_sync_meta_v1", JSON.stringify(meta));
  } catch (e) {}
}

function buildUserSummaryData(user) {
  if (!user) return null;
  const emailLow = (user.email || "").toLowerCase();
  const driverCar = (carsList || []).find(c => (c.driverEmail || "").toLowerCase() === emailLow);
  const passengerCar = (carsList || []).find(c =>
    Array.isArray(c.passengers) && c.passengers.some(p => (p.email || "").toLowerCase() === emailLow)
  );
  let transport = "Sin auto asignado todavía";
  if (driverCar) {
    transport = `Conductor de ${driverCar.model} (${(driverCar.passengers || []).length}/${driverCar.seats} ocupados)`;
  } else if (passengerCar) {
    transport = `Pasajero en auto de ${passengerCar.driver} (${passengerCar.model})`;
  }

  const items = [];
  let myTotal = 0;

  (collaborations || []).forEach(c => {
    (c.items || []).forEach(it => {
      const claimers = getItemClaimers(it);
      if (claimers.some(cl => (cl.email || "").toLowerCase() === emailLow)) {
        const shareCount = Math.max(1, claimers.length);
        const myCost = Math.round(estimateTotalCostMXNFor13(it.name) / shareCount);
        myTotal += myCost;
        const others = claimers.filter(cl => (cl.email || "").toLowerCase() !== emailLow).map(cl => cl.name);
        const qtyHint = estimateConsumableFor13(it.name);
        items.push({
          name: it.name,
          context: c.title,
          qtyHint,
          others,
          myCost
        });
      }
    });
  });

  (additionalsList || []).forEach(addItem => {
    const claimers = getItemClaimers(addItem);
    if (claimers.some(cl => (cl.email || "").toLowerCase() === emailLow)) {
      const shareCount = Math.max(1, claimers.length);
      const divisor = Math.max(shareCount, Math.max(1, Number(addItem.targetQty) || 1));
      const myCost = Math.round(estimateTotalCostMXNFor13(addItem.name) / divisor);
      myTotal += myCost;
      const others = claimers.filter(cl => (cl.email || "").toLowerCase() !== emailLow).map(cl => cl.name);
      items.push({
        name: addItem.name,
        context: "Adicionales y básicos",
        qtyHint: addItem.qtyHint || "",
        others,
        myCost
      });
    }
  });

  return { transport, items, myTotal };
}

function buildUserSummaryPlainText(user) {
  const data = buildUserSummaryData(user);
  if (!data) return "";
  const attMap = {
    confirmed: "Confirmado",
    seen: "Visto",
    pending: "Pendiente",
    declined: "No voy"
  };
  const attLabel = attMap[user.attendance] || "Pendiente";
  const lines = [
    `Posada Chelem 2026 — Resumen de ${user.name}`,
    `Fecha: Sábado 19 de diciembre 2026 (Casa de Reyvell, Chelem)`,
    `Asistencia: ${attLabel}`,
    `Transporte: ${data.transport}`,
    `Recordatorio obligatorio: Llevar YETI (no habrá vasos desechables)`,
    ""
  ];
  if (data.items.length > 0) {
    lines.push(`Mis aportes (${data.items.length}) — Estimado: ~$${data.myTotal} MXN:`);
    data.items.forEach(it => {
      const shared = it.others.length > 0 ? ` [compartido con ${it.others.join(", ")}]` : "";
      const qty = it.qtyHint ? ` (${it.qtyHint})` : "";
      lines.push(`- ${it.name}${qty}${shared} (~$${it.myCost} MXN)`);
    });
  } else {
    lines.push("Aportes: Todavía sin insumos apartados. Entra al tablero para elegir uno.");
  }
  lines.push("");
  lines.push("Tablero en vivo: https://titorvc.github.io/posada-chelem-2026/");
  return lines.join("\n");
}

async function upsertGoogleCalendarEvent(token, posadaKey, eventBody) {
  const baseUrl = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
  const queryUrl = `${baseUrl}?privateExtendedProperty=${encodeURIComponent(`posadaKey=${posadaKey}`)}&maxResults=5`;
  const listRes = await fetch(queryUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (listRes.status === 401) {
    const err = new Error("TOKEN_EXPIRED");
    err.code = 401;
    throw err;
  }
  let existingId = null;
  if (listRes.ok) {
    const listJson = await listRes.json();
    const active = (listJson.items || []).find(ev => ev.status !== "cancelled");
    if (active) existingId = active.id;
  }

  const targetUrl = existingId ? `${baseUrl}/${encodeURIComponent(existingId)}` : baseUrl;
  const method = existingId ? "PATCH" : "POST";
  const writeRes = await fetch(targetUrl, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(eventBody)
  });
  if (writeRes.status === 401) {
    const err = new Error("TOKEN_EXPIRED");
    err.code = 401;
    throw err;
  }
  if (!writeRes.ok) {
    const errText = await writeRes.text().catch(() => "");
    throw new Error(`Calendar API HTTP ${writeRes.status}: ${errText.slice(0, 140)}`);
  }
  return writeRes.json();
}

async function syncPosadaToGoogleCalendar({ silent = false } = {}) {
  if (calendarSyncInFlight) return false;
  if (!currentUser) {
    if (!silent) openModal("modalAuth");
    return false;
  }

  const token = getGoogleCalendarToken();
  if (!token) {
    if (!silent) {
      showToast("Conecta tu cuenta de Google para activar recordatorios en Calendar.");
      handleGoogleSignIn();
    }
    return false;
  }

  calendarSyncInFlight = true;
  const btn = document.getElementById("btnSyncGoogleCalendar");
  const prevText = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Sincronizando con Google Calendar...";
  }

  try {
    const description = buildUserSummaryPlainText(currentUser);
    const tz = "America/Merida";

    // 1. Evento principal de la Posada (Sábado 19 Dic 2026 14:00 -> Domingo 20 Dic 2026 14:00)
    const mainEvent = {
      summary: "Posada Chelem 2026 — Casa de Reyvell",
      location: "Chelem, Yucatán, México",
      description,
      start: { dateTime: "2026-12-19T14:00:00-06:00", timeZone: tz },
      end: { dateTime: "2026-12-20T14:00:00-06:00", timeZone: tz },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 1440 },
          { method: "popup", minutes: 120 }
        ]
      },
      extendedProperties: {
        private: { posadaKey: "posada_chelem_2026_main" }
      }
    };
    await upsertGoogleCalendarEvent(token, "posada_chelem_2026_main", mainEvent);

    // 2. Recordatorio recurrente cada 5 días hasta la fecha de la Posada
    const now = new Date();
    const posadaCutoff = new Date("2026-12-19T00:00:00-06:00");
    if (now < posadaCutoff) {
      const firstRem = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const yyyy = firstRem.getFullYear();
      const mm = String(firstRem.getMonth() + 1).padStart(2, "0");
      const dd = String(firstRem.getDate()).padStart(2, "0");
      const reminderEvent = {
        summary: "Recordatorio Posada Chelem — Tus aportes",
        location: "https://titorvc.github.io/posada-chelem-2026/",
        description,
        start: { dateTime: `${yyyy}-${mm}-${dd}T10:00:00-06:00`, timeZone: tz },
        end: { dateTime: `${yyyy}-${mm}-${dd}T10:30:00-06:00`, timeZone: tz },
        recurrence: ["RRULE:FREQ=DAILY;INTERVAL=5;UNTIL=20261219T055959Z"],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 30 }
          ]
        },
        extendedProperties: {
          private: { posadaKey: "posada_chelem_2026_reminder" }
        }
      };
      await upsertGoogleCalendarEvent(token, "posada_chelem_2026_reminder", reminderEvent);
    }

    saveCalendarSyncMeta({
      email: currentUser.email,
      syncedAt: Date.now()
    });
    if (!silent) {
      showToast("Google Calendar actualizado: evento + recordatorio cada 5 días.");
    }
    renderMySummary();
    return true;
  } catch (err) {
    console.warn("Google Calendar sync error:", err);
    if (err && err.code === 401) {
      googleProviderToken = null;
      try { sessionStorage.removeItem("posada_google_calendar_token"); } catch (e) {}
      if (!silent) {
        showToast("Tu sesión de Google Calendar expiró. Vuelve a conectar con Google.");
      }
      renderMySummary();
    } else if (!silent) {
      showToast("No se pudo sincronizar Google Calendar. Puedes descargar el archivo .ics.");
    }
    return false;
  } finally {
    calendarSyncInFlight = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = prevText || "Sincronizar Google Calendar";
    }
  }
}

function downloadPosadaICS() {
  if (!currentUser) {
    openModal("modalAuth");
    return;
  }
  const desc = buildUserSummaryPlainText(currentUser).replace(/\n/g, "\\n");
  const nowStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const y = tomorrow.getFullYear();
  const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const d = String(tomorrow.getDate()).padStart(2, "0");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Posada Chelem 2026//El Pusio//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:posada-chelem-2026-main@pusio",
    `DTSTAMP:${nowStamp}`,
    "DTSTART:20261219T200000Z",
    "DTEND:20261220T200000Z",
    "SUMMARY:Posada Chelem 2026 — Casa de Reyvell",
    "LOCATION:Chelem\\, Yucatán\\, México",
    `DESCRIPTION:${desc}`,
    "END:VEVENT",
    "BEGIN:VEVENT",
    "UID:posada-chelem-2026-reminder@pusio",
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${y}${m}${d}T160000Z`,
    `DTEND:${y}${m}${d}T163000Z`,
    "RRULE:FREQ=DAILY;INTERVAL=5;UNTIL=20261219T055959Z",
    "SUMMARY:Recordatorio Posada Chelem — Tus aportes",
    `DESCRIPTION:${desc}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "posada-chelem-2026.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Archivo posada-chelem-2026.ics descargado.");
}

async function shareMySummaryWhatsApp() {
  if (!currentUser) {
    openModal("modalAuth");
    return;
  }
  const text = buildUserSummaryPlainText(currentUser);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

function wmoWeatherLabel(code) {
  const map = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina densa",
    51: "Llovizna ligera",
    53: "Llovizna",
    55: "Llovizna fuerte",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia fuerte",
    80: "Chubascos ligeros",
    81: "Chubascos",
    82: "Chubascos fuertes",
    95: "Tormenta eléctrica"
  };
  return map[code] || "Clima costero";
}

function renderChelemWeatherStrip(payload) {
  const bar = document.getElementById("chelemWeatherBar");
  if (!bar || !payload) return;

  const tempStr = typeof payload.temp === "number" ? `${Math.round(payload.temp)}°C` : "--";
  const condStr = payload.condition || "Clima costero";
  const windStr = typeof payload.wind === "number" ? `${Math.round(payload.wind)} km/h` : null;
  const rainStr = typeof payload.rainProb === "number" ? `${Math.round(payload.rainProb)}%` : null;
  const sunsetStr = payload.sunset || null;
  const waveStr = typeof payload.wave === "number" ? `${payload.wave.toFixed(1)} m` : null;

  const parts = [
    `<span class="weather-live-badge"><span class="weather-live-dot"></span>Chelem hoy: ${tempStr} &bull; ${condStr}</span>`
  ];
  if (windStr) parts.push(`<span class="weather-sep"></span><span class="weather-metric">Viento <strong>${windStr}</strong></span>`);
  if (waveStr) parts.push(`<span class="weather-sep"></span><span class="weather-metric">Oleaje <strong>${waveStr}</strong></span>`);
  if (rainStr) parts.push(`<span class="weather-sep"></span><span class="weather-metric">Lluvia <strong>${rainStr}</strong></span>`);
  if (sunsetStr) parts.push(`<span class="weather-sep"></span><span class="weather-metric">Atardecer <strong>${sunsetStr}</strong></span>`);

  bar.innerHTML = parts.join("");
  bar.classList.remove("hidden");
}

async function initChelemWeather() {
  const CACHE_KEY = "posada_chelem_weather_v1";
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached && cached.ts && Date.now() - cached.ts < 30 * 60 * 1000 && cached.data) {
        renderChelemWeatherStrip(cached.data);
        return;
      }
    }
  } catch (e) {}

  const weatherUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=21.2694&longitude=-89.7442" +
    "&current=temperature_2m,weather_code,wind_speed_10m" +
    "&daily=precipitation_probability_max,sunset&timezone=America%2FMerida&forecast_days=1";
  const marineUrl =
    "https://marine-api.open-meteo.com/v1/marine?latitude=21.2694&longitude=-89.7442" +
    "&current=wave_height&timezone=America%2FMerida";

  try {
    const [wRes, mRes] = await Promise.allSettled([
      fetch(weatherUrl).then(r => (r.ok ? r.json() : null)),
      fetch(marineUrl).then(r => (r.ok ? r.json() : null))
    ]);

    const wData = wRes.status === "fulfilled" ? wRes.value : null;
    const mData = mRes.status === "fulfilled" ? mRes.value : null;
    if (!wData || !wData.current) return;

    const sunsetRaw = wData.daily && Array.isArray(wData.daily.sunset) ? wData.daily.sunset[0] : "";
    const sunsetTime = sunsetRaw && sunsetRaw.includes("T") ? sunsetRaw.split("T")[1].slice(0, 5) : null;
    const rainProb = wData.daily && Array.isArray(wData.daily.precipitation_probability_max)
      ? wData.daily.precipitation_probability_max[0]
      : null;

    const payload = {
      temp: wData.current.temperature_2m,
      condition: wmoWeatherLabel(wData.current.weather_code),
      wind: wData.current.wind_speed_10m,
      rainProb,
      sunset: sunsetTime,
      wave: mData && mData.current ? mData.current.wave_height : null
    };

    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: payload }));
    } catch (e) {}
    renderChelemWeatherStrip(payload);
  } catch (err) {
    console.warn("Open-Meteo weather fetch warning:", err);
  }
}

async function handleGoogleSignIn() {
  const errEl = document.getElementById("authErrorMsg");
  const googleBtn = document.getElementById("btnGoogleLogin");
  if (errEl) errEl.style.display = "none";

  if (!supabaseClient) {
    if (errEl) {
      errEl.textContent = "No se pudo inicializar Supabase Auth. Recarga la página.";
      errEl.style.display = "block";
    }
    return;
  }

  if (googleBtn) googleBtn.disabled = true;
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        scopes: "https://www.googleapis.com/auth/calendar.events",
        queryParams: {
          access_type: "offline",
          prompt: "consent"
        }
      }
    });
    if (error) {
      if (errEl) {
        errEl.textContent = error.message || "No se pudo iniciar sesión con Google.";
        errEl.style.display = "block";
      }
      if (googleBtn) googleBtn.disabled = false;
    }
  } catch (err) {
    if (errEl) {
      errEl.textContent = "Error al conectar con Google OAuth.";
      errEl.style.display = "block";
    }
    if (googleBtn) googleBtn.disabled = false;
  }
}

function linkSupabaseUserToAttendee(authUser, preferredName = "", allowCreate = true) {
  if (!authUser || !authUser.email) return null;
  const emailVal = authUser.email.trim().toLowerCase();
  const authId = authUser.id;
  const metaName = normalizeAttendeeName(
    preferredName ||
    (authUser.user_metadata && (authUser.user_metadata.name || authUser.user_metadata.full_name)) ||
    ""
  );

  // 1. Coincidencia exacta por Supabase Auth UUID (conserva la cuenta siempre)
  let existing = attendeesList.find(u => u.authUserId && u.authUserId === authId);

  // 2. Coincidencia exacta por correo (migra cuentas previas sin duplicar)
  if (!existing) {
    existing = attendeesList.find(u => u.email && u.email.toLowerCase() === emailVal);
  }

  // 3. Reclamo explícito o coincidencia inteligente con personaje pre-cargado
  if (!existing && pendingClaimedMatch) {
    existing = pendingClaimedMatch;
    pendingClaimedMatch = null;
  }
  if (!existing) {
    existing = findPotentialMatch(emailVal, metaName);
  }

  if (existing) {
    let mutated = false;
    if (existing.authUserId !== authId) {
      existing.authUserId = authId;
      mutated = true;
    }
    if (!existing.email || existing.email.toLowerCase() !== emailVal) {
      existing.email = emailVal;
      mutated = true;
    }
    if (!existing.attendance || (!existing.attendanceSetByUser && existing.attendance !== "confirmed" && existing.attendance !== "declined")) {
      existing.attendance = "seen";
      mutated = true;
    }
    currentUser = existing;
    setSavedSessionEmail(existing.email);
    if (mutated) saveState(true);
    return existing;
  }

  if (!allowCreate) return null;

  // 4. Solo si realmente no existe ningún perfil previo, crear uno nuevo vinculado al authUserId
  const fallbackName = metaName || normalizeAttendeeName(emailVal.split("@")[0]) || "Invitado";
  const rndHue = Math.floor(Math.random() * 360);
  const newUser = {
    id: Date.now(),
    authUserId: authId,
    name: fallbackName,
    email: emailVal,
    attendance: "seen",
    attendanceSetByUser: false,
    travelMode: null,
    puedo_dar_coche: 0,
    robot: createBotConfig(rndHue, 0, 0, 0, 0, 0)
  };
  attendeesList.push(newUser);
  currentUser = newUser;
  setSavedSessionEmail(newUser.email);
  saveState(true);
  return newUser;
}

async function initSupabaseAuth() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (!error && data && data.session && data.session.user) {
      supabaseAuthUser = data.session.user;
      if (data.session.provider_token) {
        googleProviderToken = data.session.provider_token;
        try { sessionStorage.setItem("posada_google_calendar_token", googleProviderToken); } catch (e) {}
      }
      await syncFetchFromCloud();
      const pendingName = localStorage.getItem("posada_pending_signup_name") || "";
      linkSupabaseUserToAttendee(supabaseAuthUser, pendingName, true);
      if (pendingName) localStorage.removeItem("posada_pending_signup_name");
      renderAll();
    }
  } catch (err) {
    console.warn("Supabase Auth getSession error:", err);
  }

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (session && session.user) {
      supabaseAuthUser = session.user;
      if (session.provider_token) {
        googleProviderToken = session.provider_token;
        try { sessionStorage.setItem("posada_google_calendar_token", googleProviderToken); } catch (e) {}
      }
      if (event === "SIGNED_IN") {
        await syncFetchFromCloud();
        const pendingName = localStorage.getItem("posada_pending_signup_name") || "";
        linkSupabaseUserToAttendee(supabaseAuthUser, pendingName, true);
        if (pendingName) localStorage.removeItem("posada_pending_signup_name");
        renderAll();
        if (session.provider_token && currentUser) {
          const alreadyAutoSynced = sessionStorage.getItem("posada_gcal_autosynced") === "1";
          if (!alreadyAutoSynced) {
            try { sessionStorage.setItem("posada_gcal_autosynced", "1"); } catch (e) {}
            syncPosadaToGoogleCalendar({ silent: true });
          }
        }
      }
    } else if (event === "SIGNED_OUT") {
      supabaseAuthUser = null;
      googleProviderToken = null;
      currentUser = null;
      try { sessionStorage.removeItem("posada_google_calendar_token"); } catch (e) {}
      setSavedSessionEmail("");
      renderAll();
    }
  });
}

async function handleSignOut() {
  if (supabaseClient) {
    try {
      await supabaseClient.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }
  }
  supabaseAuthUser = null;
  googleProviderToken = null;
  currentUser = null;
  try { sessionStorage.removeItem("posada_google_calendar_token"); } catch (e) {}
  setSavedSessionEmail("");
  closeModal("modalUserSummary");
  renderAll();
  showToast("Sesión cerrada");
}

let syncDebounceTimer = null;
let lastLocalMutationAt = 0;
let pendingCloudPush = false;

function getSavedSessionEmail() {
  try {
    const ls = localStorage.getItem("posada_active_email_v10");
    if (ls && ls.trim()) return ls.trim();
  } catch (e) {}
  try {
    const match = document.cookie.match(/(?:^|;\s*)posada_session_email=([^;]+)/);
    if (match && match[1]) return decodeURIComponent(match[1]).trim();
  } catch (e) {}
  return null;
}

function setSavedSessionEmail(email) {
  const clean = (email || "").trim();
  try {
    if (clean) localStorage.setItem("posada_active_email_v10", clean);
    else localStorage.removeItem("posada_active_email_v10");
  } catch (e) {}
  try {
    if (clean) {
      document.cookie = `posada_session_email=${encodeURIComponent(clean)}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      document.cookie = "posada_session_email=; path=/; max-age=0; SameSite=Lax";
    }
  } catch (e) {}
}

// Perfiles redundantes eliminados (conservando Otis, Alpaquiña y Shalom)
const REMOVED_ATTENDEE_IDS = new Set([8, 11, 13, 1795019785482]);
const REMOVED_ATTENDEE_EMAILS = new Set([
  "cplus.lat@gmail.com",
  "aldo.amigo@posadachelem.com",
  "andres.amigo@posadachelem.com",
  "ayorasuasteandresmiguel@gmai.com"
]);
const REMOVED_ATTENDEE_NAMES = new Set(["beto", "aldo", "andrés", "andres"]);

const MAX_USERNAME_LEN = 11;

function normalizeAttendeeName(rawName) {
  return (rawName || "").trim().slice(0, MAX_USERNAME_LEN);
}

function sanitizeAttendeeNames() {
  if (!Array.isArray(attendeesList)) return false;
  let changed = false;
  attendeesList.forEach(u => {
    if (!u || typeof u.name !== "string") return;
    const trimmed = u.name.trim();
    if (trimmed.length > MAX_USERNAME_LEN) {
      u.name = "Shory";
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem("posada_attendees_v10", JSON.stringify(attendeesList));
  }
  return changed;
}

function filterRemovedAttendees(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(u => {
    if (!u) return false;
    const idNum = Number(u.id);
    const email = (u.email || "").trim().toLowerCase();
    const name = (u.name || "").trim().toLowerCase();
    if (REMOVED_ATTENDEE_IDS.has(idNum)) return false;
    if (REMOVED_ATTENDEE_EMAILS.has(email)) return false;
    if (REMOVED_ATTENDEE_NAMES.has(name)) return false;
    return true;
  });
}

// Reglas para detectar insumos que pertenecen a Adicionales & Básicos y sacarlos de Comida/Actividades
const ADDITIONAL_ITEM_RULES = [
  { regex: /botana|papa|totopo|dorito|sabrita|cacahuate/i, targetId: "add_botanas" },
  { regex: /refresco|coca|soda|bebida/i, targetId: "add_refrescos" },
  { regex: /\bhielo/i, targetId: "add_hielo" },
  { regex: /agua\s*(natural|embotellada|garraf[oó]n)?|garraf[oó]n/i, targetId: "add_agua" },
  { regex: /plato|desechable/i, targetId: "add_platos" },
  { regex: /vaso\s*desechable|vasos/i, targetId: null }, // Sin vasos desechables (se lleva Yeti)
  { regex: /cubierto|servilleta|tenedor|cuchillo/i, targetId: "add_cubiertos" },
  { regex: /bolsa.*basura|basura/i, targetId: "add_basura" },
  { regex: /carb[oó]n|encendedor|ocote/i, targetId: "add_carbon" }
];

function stripAdditionalsFromCollabs() {
  if (!Array.isArray(collaborations) || collaborations.length === 0) return false;
  let changed = false;

  collaborations.forEach(collab => {
    if (!Array.isArray(collab.items)) return;
    const kept = [];
    collab.items.forEach(item => {
      const name = (item && item.name) ? item.name.trim() : "";
      const matchedRule = ADDITIONAL_ITEM_RULES.find(r => r.regex.test(name));
      if (matchedRule) {
        changed = true;
        if (matchedRule.targetId) {
          const targetAdd = (additionalsList || []).find(a => a.id === matchedRule.targetId);
          const itemClaimers = getItemClaimers(item);
          if (targetAdd && itemClaimers.length > 0) {
            const existing = getItemClaimers(targetAdd);
            itemClaimers.forEach(cl => {
              const dup = existing.some(e =>
                (e.email && cl.email && e.email.toLowerCase() === cl.email.toLowerCase()) ||
                (e.name && cl.name && e.name.toLowerCase() === cl.name.toLowerCase())
              );
              if (!dup) existing.push(cl);
            });
            syncItemClaimFields(targetAdd, existing);
          }
        }
      } else {
        kept.push(item);
      }
    });
    collab.items = kept;
  });

  if (changed) {
    localStorage.setItem("posada_collabs_v10", JSON.stringify(collaborations));
    localStorage.setItem("posada_additionals_v10", JSON.stringify(additionalsList));
  }
  return changed;
}

async function syncFetchFromCloud() {
  const fetchStartedAt = Date.now();
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posada_sync?key=eq.global_state&select=data`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      cache: "no-store"
    });
    if (!res.ok) return;
    // Si el usuario hizo un cambio local mientras esta descarga estaba en vuelo, NO sobrescribir
    if (lastLocalMutationAt > fetchStartedAt || pendingCloudPush) {
      return;
    }
    const rows = await res.json();
    if (rows && rows.length > 0 && rows[0].data) {
      const cloud = rows[0].data;
      let needsCloudCleanup = false;

      // Fusionar lista de participantes conservando los datos más recientes
      if (Array.isArray(cloud.attendees) && cloud.attendees.length > 0) {
        const cleanedAttendees = filterRemovedAttendees(cloud.attendees);
        if (cleanedAttendees.length !== cloud.attendees.length) {
          needsCloudCleanup = true;
        }
        attendeesList = cleanedAttendees.map(u => ({
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

      if (Array.isArray(cloud.additionals) && cloud.additionals.length > 0) {
        additionalsList = cloud.additionals;
        localStorage.setItem("posada_additionals_v10", JSON.stringify(additionalsList));
      }

      if (cloud.pusioRobot) {
        pusioRobot = cloud.pusioRobot;
        localStorage.setItem("posada_pusio_robot_v10", JSON.stringify(pusioRobot));
      }

      if (cloud.pusioContest) {
        pusioContest = cloud.pusioContest;
        localStorage.setItem("posada_pusio_contest_v10", JSON.stringify(pusioContest));
      }

      // Re-vincular sesión activa del usuario local (prioridad: Supabase Auth UUID -> correo guardado)
      if (supabaseAuthUser && supabaseAuthUser.id) {
        const byAuthId = attendeesList.find(u => u.authUserId === supabaseAuthUser.id);
        const byEmail = supabaseAuthUser.email
          ? attendeesList.find(u => u.email && u.email.toLowerCase() === supabaseAuthUser.email.toLowerCase())
          : null;
        currentUser = byAuthId || byEmail || currentUser;
      } else {
        const savedEmail = getSavedSessionEmail();
        if (savedEmail) {
          currentUser = attendeesList.find(u => u.email && u.email.toLowerCase() === savedEmail.toLowerCase()) || currentUser;
        }
      }

      if (stripAdditionalsFromCollabs()) {
        needsCloudCleanup = true;
      }
      if (sanitizeAttendeeNames()) {
        needsCloudCleanup = true;
      }

      renderAll();
      if (needsCloudCleanup) {
        syncPushToCloud(true);
      }
    }
  } catch (err) {
    console.warn("Supabase fetch warning:", err);
  }
}

async function flushCloudPushNow(isUnload = false) {
  clearTimeout(syncDebounceTimer);
  pendingCloudPush = false;
  try {
    const payload = {
      key: "global_state",
      data: {
        attendees: attendeesList,
        cars: carsList,
        collabs: collaborations,
        additionals: additionalsList,
        pusioRobot: pusioRobot,
        pusioContest: pusioContest,
        lastUpdated: Date.now()
      }
    };

    const bodyStr = JSON.stringify(payload);
    const fetchOpts = {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
      },
      body: bodyStr
    };
    if (isUnload && bodyStr.length < 60000) {
      fetchOpts.keepalive = true;
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/posada_sync`, fetchOpts);
    if (!res.ok) {
      console.warn("Supabase push HTTP error:", res.status);
    }
  } catch (err) {
    console.warn("Supabase push warning:", err);
  }
}

async function syncPushToCloud(immediate = false) {
  pendingCloudPush = true;
  clearTimeout(syncDebounceTimer);
  if (immediate) {
    await flushCloudPushNow(false);
    return;
  }
  syncDebounceTimer = setTimeout(() => {
    flushCloudPushNow(false);
  }, 120);
}

window.addEventListener("pagehide", () => {
  if (pendingCloudPush) flushCloudPushNow(true);
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && pendingCloudPush) {
    flushCloudPushNow(true);
  }
});

function loadState() {
  const savedAttendees = localStorage.getItem("posada_attendees_v10");
  if (savedAttendees) {
    try {
      const parsed = filterRemovedAttendees(JSON.parse(savedAttendees));
      if (Array.isArray(parsed) && parsed.length > 0) {
        attendeesList = parsed.map(u => ({
          ...u,
          attendance: u.attendance || (u.pinHash ? "seen" : "unanswered")
        }));
        localStorage.setItem("posada_attendees_v10", JSON.stringify(attendeesList));
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

  const savedAdditionals = localStorage.getItem("posada_additionals_v10");
  if (savedAdditionals) {
    try {
      const parsedAdd = JSON.parse(savedAdditionals);
      additionalsList = Array.isArray(parsedAdd) && parsedAdd.length > 0
        ? parsedAdd
        : JSON.parse(JSON.stringify(DEFAULT_ADDITIONALS));
    } catch (e) {
      additionalsList = JSON.parse(JSON.stringify(DEFAULT_ADDITIONALS));
    }
  } else {
    additionalsList = JSON.parse(JSON.stringify(DEFAULT_ADDITIONALS));
  }

  const savedSessionEmail = getSavedSessionEmail();
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

  stripAdditionalsFromCollabs();
  sanitizeAttendeeNames();

  // Cargar estado actualizado desde la nube Supabase de inmediato
  syncFetchFromCloud();
}

function saveState(immediateCloud = false) {
  lastLocalMutationAt = Date.now();
  localStorage.setItem("posada_attendees_v10", JSON.stringify(attendeesList));
  localStorage.setItem("posada_cars_v10", JSON.stringify(carsList));
  localStorage.setItem("posada_collabs_v10", JSON.stringify(collaborations));
  localStorage.setItem("posada_additionals_v10", JSON.stringify(additionalsList));
  if (currentUser) {
    setSavedSessionEmail(currentUser.email);
  }
  if (pusioRobot) {
    localStorage.setItem("posada_pusio_robot_v10", JSON.stringify(pusioRobot));
  }
  localStorage.setItem("posada_pusio_contest_v10", JSON.stringify(pusioContest));

  // Sincronizar hacia Supabase (inmediato en login o debounce corto con keepalive)
  syncPushToCloud(immediateCloud);
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
  renderEquityBoard();
  renderAgendaBoards();
  renderAdditionalsSection();
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

    let myCollabItems = [];
    let totalPosadaEstCost = 0;
    let myTotalEstCost = 0;

    collaborations.forEach(c => {
      (c.items || []).forEach(it => {
        const claimers = getItemClaimers(it);
        const itemCost = estimateTotalCostMXNFor13(it.name);
        totalPosadaEstCost += itemCost;
        const isMine = claimers.some(cl => (cl.email || "").toLowerCase() === currentUser.email.toLowerCase());
        if (isMine) {
          const shareCount = Math.max(1, claimers.length);
          const myShareCost = Math.round(itemCost / shareCount);
          myTotalEstCost += myShareCost;
          const others = claimers
            .filter(cl => (cl.email || "").toLowerCase() !== currentUser.email.toLowerCase())
            .map(cl => cl.name);
          const qtyHint = estimateConsumableFor13(it.name);
          myCollabItems.push({
            itemName: it.name,
            planTitle: c.title,
            category: c.category,
            qtyHint,
            others,
            shareCount,
            myShareCost
          });
        }
      });
    });

    let myAdditionalItems = [];
    (additionalsList || []).forEach(addItem => {
      const claimers = getItemClaimers(addItem);
      const itemCost = estimateTotalCostMXNFor13(addItem.name);
      totalPosadaEstCost += itemCost;
      const isMine = claimers.some(cl => (cl.email || "").toLowerCase() === currentUser.email.toLowerCase());
      if (isMine) {
        const shareCount = Math.max(1, claimers.length);
        const targetQty = Math.max(1, Number(addItem.targetQty) || 1);
        const divisor = Math.max(shareCount, targetQty);
        const myShareCost = Math.round(itemCost / divisor);
        myTotalEstCost += myShareCost;
        const others = claimers
          .filter(cl => (cl.email || "").toLowerCase() !== currentUser.email.toLowerCase())
          .map(cl => cl.name);
        myAdditionalItems.push({
          name: addItem.name,
          qtyHint: addItem.qtyHint || estimateConsumableFor13(addItem.name) || "",
          others,
          shareCount,
          myShareCost
        });
      }
    });

    const activeAttendeesCount = Math.max(1, (attendeesList || []).filter(u => u.attendance !== "declined").length);
    const fairAvgCost = Math.round(totalPosadaEstCost / activeAttendeesCount);
    let costBalanceLabel = "Equilibrado";
    let costBalanceClass = "cost-balanced";
    if (myTotalEstCost === 0) {
      costBalanceLabel = "Sin gasto asignado aún";
      costBalanceClass = "cost-low";
    } else if (myTotalEstCost < fairAvgCost * 0.75) {
      costBalanceLabel = "Debajo del promedio (puedes sumarte a otro)";
      costBalanceClass = "cost-low";
    } else if (myTotalEstCost > fairAvgCost * 1.25) {
      costBalanceLabel = "Arriba del promedio (comparte un insumo)";
      costBalanceClass = "cost-high";
    }

    const claimedItemsCount = myCollabItems.length + myAdditionalItems.length;
    const totalAttendeesConfirmed = attendeesList.filter(u => u.attendance === "confirmed").length;
    const totalCarsActive = carsList.length;

    const myItemsListHtml = claimedItemsCount > 0
      ? `
        <div class="summary-checklist-block">
          <div class="summary-checklist-title">Mis aportes (${claimedItemsCount})</div>
          <ul class="summary-checklist-ul">
            ${myCollabItems.map(x => {
              const isFoodCat = (x.category || "").toLowerCase().includes("comida") || (x.category || "").toLowerCase().includes("bebida");
              const catClass = isFoodCat ? "is-cat-food" : "is-cat-activity";
              const catBadge = isFoodCat ? "Comida" : "Actividad";
              const sharedHtml = x.others.length > 0
                ? `<span class="summary-shared-pill">Compartido con ${x.others.join(", ")} (entre ${x.shareCount})</span>`
                : `<span class="summary-solo-pill">Individual</span>`;
              return `
              <li class="summary-checklist-li ${catClass}">
                <span class="summary-check-dot"></span>
                <div class="summary-check-text">
                  <div class="summary-item-top-line">
                    <strong>${x.itemName}</strong>
                    <span class="summary-cost-pill">~$${x.myShareCost} MXN</span>
                  </div>
                  <span><em class="summary-cat-tag">${catBadge}</em> &bull; ${x.planTitle}</span>
                  ${x.qtyHint ? `<span class="summary-qty-line">Cantidad sugerida: ${x.qtyHint}${x.shareCount > 1 ? ` (dividido entre ${x.shareCount})` : ''}</span>` : ''}
                  <div style="margin-top:3px;">${sharedHtml}</div>
                </div>
              </li>
            `;
            }).join("")}
            ${myAdditionalItems.map(x => {
              const sharedHtml = x.others.length > 0
                ? `<span class="summary-shared-pill">Compartido con ${x.others.join(", ")} (entre ${x.shareCount})</span>`
                : `<span class="summary-solo-pill">Individual</span>`;
              return `
              <li class="summary-checklist-li is-cat-additional">
                <span class="summary-check-dot"></span>
                <div class="summary-check-text">
                  <div class="summary-item-top-line">
                    <strong>${x.name}</strong>
                    <span class="summary-cost-pill">~$${x.myShareCost} MXN</span>
                  </div>
                  <span><em class="summary-cat-tag">Adicional</em>${x.qtyHint ? ` &bull; ${x.qtyHint}` : ""}</span>
                  <div style="margin-top:3px;">${sharedHtml}</div>
                </div>
              </li>
            `;
            }).join("")}
          </ul>
        </div>
      `
      : `
        <div class="summary-checklist-empty">
          Todav&iacute;a no apartas ning&uacute;n insumo. Baja al tablero y pulsa <em>&ldquo;Yo lo llevo&rdquo;</em>.
        </div>
      `;

    return `
      <div class="my-summary-user-box modal-user-box-layout summary-v2-layout">
        <!-- Cabecera compacta: Avatar, nombre y asistencia -->
        <div class="summary-v2-top">
          <div class="user-summary-avatar-wrap" onclick="closeModal('modalUserSummary'); selectUserForCustomization(${currentUser.id})" title="Clic para editar tu muñequito">
            ${renderRobotSVG(currentUser.robot, null, null, true)}
            <span class="user-summary-edit-badge" title="Editar diseño">Editar</span>
          </div>
          <div class="user-summary-meta" style="flex:1; min-width:0;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <h3 class="user-summary-name" style="margin:0;">${currentUser.name}</h3>
              <span class="attendance-badge ${statusBadgeClass}">${statusBadgeLabel}</span>
              ${isVIP ? '<span class="avatar-vip-badge" style="position:static; display:inline-block;">VIP</span>' : ''}
            </div>
            <div style="font-size:0.78rem; color:var(--ink-secondary); margin-top:4px;">
              ${totalAttendeesConfirmed} confirmados &bull; ${totalCarsActive} autos &bull; ${userPlans.length} plan${userPlans.length === 1 ? '' : 'es'} propuestos
            </div>
          </div>
        </div>

        <!-- Recordatorio Yeti destacado -->
        <div class="my-summary-stat-tile yeti-reminder-tile">
          <span class="stat-tile-label">Recordatorio obligatorio</span>
          <strong class="stat-tile-value">🧊 LLEVAR YETI (no habr&aacute; vasos desechables)</strong>
        </div>

        <!-- Transporte -->
        <div class="my-summary-stat-tile">
          <span class="stat-tile-label">Tu Transporte</span>
          <strong class="stat-tile-value">${transportSummary}</strong>
        </div>

        <!-- Gasto equitativo estimado -->
        <div class="my-summary-stat-tile summary-cost-tile ${costBalanceClass}">
          <span class="stat-tile-label">Gasto equitativo estimado</span>
          <strong class="stat-tile-value">Tu parte: ~$${myTotalEstCost} MXN &bull; Promedio grupo: ~$${fairAvgCost} MXN</strong>
          <span class="summary-cost-balance-note">${costBalanceLabel}</span>
        </div>

        <!-- Checklist explícito de qué lleva / hace -->
        ${myItemsListHtml}

        <!-- Integraciones: Google Calendar (cada 5 días), .ics y WhatsApp -->
        ${(() => {
          const hasGcalToken = Boolean(getGoogleCalendarToken());
          const syncMeta = getCalendarSyncMeta();
          const isSyncedForUser = syncMeta && syncMeta.email && syncMeta.email.toLowerCase() === (currentUser.email || "").toLowerCase();
          const statusLabel = isSyncedForUser
            ? `Sincronizado (${new Date(syncMeta.syncedAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })})`
            : (hasGcalToken ? "Google listo" : "Sin conectar");
          const calBtnLabel = hasGcalToken
            ? "Actualizar recordatorios cada 5 días (Google Calendar)"
            : "Conectar Google Calendar (recordatorios cada 5 días)";
          return `
            <div class="summary-integrations-box">
              <div class="summary-integrations-head">
                <span class="summary-integrations-title">Calendario y compartir</span>
                <span class="cal-status-pill ${isSyncedForUser ? "is-synced" : ""}">${statusLabel}</span>
              </div>
              <button type="button" id="btnSyncGoogleCalendar" class="btn-cal-primary" onclick="syncPosadaToGoogleCalendar({ silent: false })">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>${calBtnLabel}</span>
              </button>
              <div class="summary-integrations-row">
                <button type="button" class="btn-integration-secondary" onclick="downloadPosadaICS()">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Descargar .ics</span>
                </button>
                <button type="button" class="btn-integration-secondary btn-whatsapp-share" onclick="shareMySummaryWhatsApp()">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  <span>Enviar a WhatsApp</span>
                </button>
              </div>
            </div>
          `;
        })()}

        <!-- Acciones rápidas de confirmación -->
        <div class="my-summary-action-col" style="width:100%;">
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
          <button type="button" class="btn btn-sm btn-logout-subtle" onclick="handleSignOut()">
            Cerrar sesión
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
      statusEl.textContent = "Ver mi resumen";
      statusEl.style.display = "block";
    }

    // Anillo estilo "historia" con los colores del fondo del personaje
    const bgPri = (currentUser.robot && currentUser.robot.bg && currentUser.robot.bg.pri) || { h: 198, s: 75, l: 55 };
    const bgSec = (currentUser.robot && currentUser.robot.bg && currentUser.robot.bg.sec) || { h: 230, s: 70, l: 50 };
    const hasSeenSummary = localStorage.getItem("posada_summary_seen_v1") === "1";

    const c1 = hasSeenSummary
      ? `hsl(${bgPri.h}, ${Math.max(18, Math.round((bgPri.s || 65) * 0.42))}%, ${Math.min(62, Math.max(42, bgPri.l || 55))}%)`
      : `hsl(${bgPri.h}, ${Math.min(95, Math.max(72, bgPri.s || 80))}%, 50%)`;
    const c2 = hasSeenSummary
      ? `hsl(${bgSec.h}, ${Math.max(18, Math.round((bgSec.s || 65) * 0.42))}%, ${Math.min(62, Math.max(42, bgSec.l || 50))}%)`
      : `hsl(${bgSec.h}, ${Math.min(95, Math.max(72, bgSec.s || 80))}%, 46%)`;

    avatarWrap.style.setProperty("--story-c1", c1);
    avatarWrap.style.setProperty("--story-c2", c2);
    avatarWrap.classList.add("has-story-ring");
    avatarWrap.classList.toggle("is-unseen-story", !hasSeenSummary);
    avatarWrap.classList.toggle("is-seen-story", hasSeenSummary);
  } else {
    avatarWrap.innerHTML = renderRobotSVG(createBotConfig(198, 0, 0, 0, 0, 0));
    avatarWrap.classList.remove("has-story-ring", "is-unseen-story", "is-seen-story");
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
  const suggestionsDeck = document.querySelector(".pusio-suggestions-deck");
  if (!slot) return;

  if (!pendingPlanProposal) {
    slot.innerHTML = "";
    if (suggestionsDeck) {
      suggestionsDeck.classList.remove("is-hidden-by-plan");
    }
    return;
  }

  if (suggestionsDeck) {
    suggestionsDeck.classList.add("is-hidden-by-plan");
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
    const maxCars = 4;
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
    return ensureRobotParts(pusioRobot);
  }
  if (currentUser) return ensureRobotParts(currentUser.robot);
  return ensureRobotParts(attendeesList[1].robot);
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
  renderEquityBoard();
  renderAgendaBoards();
  renderAdditionalsSection();
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
  renderEquityBoard();
  renderAgendaBoards();
  renderAdditionalsSection();
}

function getItemClaimers(item) {
  if (!item) return [];
  if (Array.isArray(item.claimers) && item.claimers.length > 0) {
    return item.claimers.filter(c => c && (c.name || c.email));
  }
  if (item.claimedBy) {
    return [{ name: item.claimedBy, email: item.claimedByEmail || "" }];
  }
  return [];
}

function syncItemClaimFields(item, claimers) {
  const clean = Array.isArray(claimers) ? claimers.filter(c => c && (c.name || c.email)) : [];
  item.claimers = clean;
  if (clean.length > 0) {
    item.claimedBy = clean[0].name;
    item.claimedByEmail = clean[0].email || null;
  } else {
    item.claimedBy = null;
    item.claimedByEmail = null;
  }
}

function calculateCollabTraction(collab) {
  const total = collab.items.length || 1;
  const claimed = collab.items.filter(i => getItemClaimers(i).length > 0).length;
  // Prioridad matemática: mayor porcentaje de cobertura y mayor cantidad de asignados
  return (claimed / total) * 100 + (claimed * 10);
}

function renderEquityBoard() {
  const grid = document.getElementById("equityMembersGrid");
  const pctEl = document.getElementById("equityGlobalPct");
  const metaEl = document.getElementById("equityGlobalMeta");
  const fillEl = document.getElementById("equityGlobalFill");
  if (!grid) return;

  const countsByEmail = {};
  let totalSlots = 0;
  let filledSlots = 0;

  (collaborations || []).forEach(c => {
    (c.items || []).forEach(it => {
      totalSlots += 1;
      const claimers = getItemClaimers(it);
      if (claimers.length > 0) filledSlots += 1;
      claimers.forEach(cl => {
        const key = (cl.email || cl.name || "").toLowerCase();
        if (key) countsByEmail[key] = (countsByEmail[key] || 0) + 1;
      });
    });
  });

  (additionalsList || []).forEach(addItem => {
    const qty = Math.max(1, Number(addItem.targetQty) || 1);
    const claimers = getItemClaimers(addItem);
    totalSlots += qty;
    filledSlots += Math.min(claimers.length, qty);
    claimers.forEach(cl => {
      const key = (cl.email || cl.name || "").toLowerCase();
      if (key) countsByEmail[key] = (countsByEmail[key] || 0) + 1;
    });
  });

  const pct = totalSlots > 0 ? Math.min(100, Math.round((filledSlots / totalSlots) * 100)) : 0;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (metaEl) metaEl.textContent = "completado";
  if (fillEl) fillEl.style.width = `${pct}%`;

  const activeAttendees = (attendeesList || []).filter(u => u.attendance !== "declined");
  const membersWithScore = activeAttendees.map(u => {
    const eKey = (u.email || "").toLowerCase();
    const nKey = (u.name || "").toLowerCase();
    const count = countsByEmail[eKey] || countsByEmail[nKey] || 0;
    return { user: u, count };
  }).sort((a, b) => b.count - a.count || a.user.name.localeCompare(b.user.name));

  const maxCount = membersWithScore.reduce((m, x) => Math.max(m, x.count), 0);
  const scaleMax = Math.max(3, maxCount);

  grid.innerHTML = membersWithScore.map(({ user, count }) => {
    const isMe = currentUser && currentUser.email.toLowerCase() === (user.email || "").toLowerCase();
    const ratio = count === 0 ? 0 : Math.min(100, Math.max(18, Math.round((count / scaleMax) * 100)));

    let badgeText = "Observador";
    let tierClass = "eq-tier-none";

    if (count > 0 && count === maxCount && maxCount >= 2) {
      badgeText = "Líder";
      tierClass = "eq-tier-leader";
    } else if (ratio >= 75) {
      badgeText = "Pilar";
      tierClass = "eq-tier-pilar";
    } else if (ratio >= 45) {
      badgeText = "Impulsor";
      tierClass = "eq-tier-impulsor";
    } else if (count > 0) {
      badgeText = "Colaborador";
      tierClass = "eq-tier-colab";
    }

    const miniSvg = renderRobotSVG(user.robot, null, null, true);

    return `
      <div class="equity-member-card ${tierClass} ${isMe ? 'is-me' : ''}">
        <div class="equity-member-top">
          <span class="equity-member-avatar">${miniSvg}</span>
          <div class="equity-member-info">
            <span class="equity-member-name">${user.name}${isMe ? ' (Tú)' : ''}</span>
            <span class="equity-member-badge">${badgeText}</span>
          </div>
        </div>
        <div class="equity-member-bar">
          <div class="equity-member-bar-fill" style="width:${ratio}%;"></div>
        </div>
      </div>
    `;
  }).join("");
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

function renderAdditionalsSection() {
  const listEl = document.getElementById("additionalsBoardContainer");
  const statsEl = document.getElementById("additionalsProgressStats");
  const fillEl = document.getElementById("additionalsProgressFill");
  if (!listEl) return;

  const list = Array.isArray(additionalsList) ? additionalsList : [];
  let totalNeeded = 0;
  let totalCovered = 0;
  list.forEach(item => {
    const qty = Math.max(1, Number(item.targetQty) || 1);
    const count = getItemClaimers(item).length;
    totalNeeded += qty;
    totalCovered += Math.min(count, qty);
  });

  const allMet = totalNeeded > 0 && totalCovered >= totalNeeded;
  const pct = totalNeeded > 0 ? Math.min(100, Math.round((totalCovered / totalNeeded) * 100)) : 0;

  const readyCount = list.filter(it => getItemClaimers(it).length >= Math.max(1, Number(it.targetQty) || 1)).length;
  if (statsEl) {
    statsEl.textContent = `${readyCount} de ${list.length} básicos listos`;
  }
  if (fillEl) {
    fillEl.style.width = `${pct}%`;
  }

  listEl.innerHTML = "";
  list.forEach(item => {
    const claimers = getItemClaimers(item);
    const targetQty = Math.max(1, Number(item.targetQty) || 1);
    const isMet = claimers.length >= targetQty;
    const isMine = Boolean(
      currentUser &&
      claimers.some(c =>
        (c.email && c.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (c.name && c.name.toLowerCase() === currentUser.name.toLowerCase())
      )
    );
    const canJoinExtra = allMet && isMet && !isMine;
    const claimersText = claimers.map(c => c.name).join(" + ");
    const qtyHint = item.qtyHint || estimateConsumableFor13(item.name) || "";

    const row = document.createElement("div");
    row.className = `additional-row ${isMet ? "is-met" : (claimers.length > 0 ? "is-partial" : "")}`;

    let actionHtml = "";
    if (isMine) {
      actionHtml = `
        <button type="button" class="task-assignee is-mine-claim ${claimers.length > 1 ? "is-shared" : ""}" onclick="toggleClaimAdditional('${item.id}')" title="Clic para quitarte de este adicional">
          <span>${claimersText}</span>
        </button>
      `;
    } else if (!isMet) {
      actionHtml = `
        <div class="task-assignee-wrap">
          ${claimers.length > 0 ? `<span class="additional-claimers-mini">${claimersText}</span>` : ""}
          <button type="button" class="claim-btn" onclick="toggleClaimAdditional('${item.id}')">Yo lo llevo</button>
        </div>
      `;
    } else {
      actionHtml = `
        <div class="task-assignee-wrap">
          <button type="button" class="task-assignee ${claimers.length > 1 ? "is-shared" : ""}" onclick="toggleClaimAdditional('${item.id}')" title="${canJoinExtra ? 'Todos los adicionales están cubiertos: clic para sumarte.' : 'Cupo completo. Cubre primero los adicionales faltantes.'}">
            <span>${claimersText}</span>
          </button>
          ${canJoinExtra ? `<button type="button" class="task-join-btn" onclick="toggleClaimAdditional('${item.id}')">+ Sumarme</button>` : ""}
        </div>
      `;
    }

    row.innerHTML = `
      <div class="additional-row-info">
        <div class="additional-title-line">
          <span class="additional-name">${item.name}</span>
          <span class="additional-qty-badge ${isMet ? "met" : ""}">${claimers.length}/${targetQty}</span>
        </div>
        ${qtyHint ? `<span class="portion-hint-badge">${qtyHint}</span>` : ""}
      </div>
      <div class="additional-row-action">
        ${actionHtml}
      </div>
    `;
    listEl.appendChild(row);
  });
}

function toggleClaimAdditional(addId) {
  if (!requireAuth()) return;
  const item = additionalsList.find(a => String(a.id) === String(addId));
  if (!item) return;

  const claimers = getItemClaimers(item);
  const targetQty = Math.max(1, Number(item.targetQty) || 1);
  const myEmail = (currentUser.email || "").toLowerCase();
  const myName = (currentUser.name || "").toLowerCase();
  const existingIdx = claimers.findIndex(c =>
    (c.email && c.email.toLowerCase() === myEmail) ||
    (c.name && c.name.toLowerCase() === myName)
  );

  if (existingIdx !== -1) {
    claimers.splice(existingIdx, 1);
    syncItemClaimFields(item, claimers);
    showToast(`Liberaste: ${item.name}`);
  } else if (claimers.length < targetQty) {
    claimers.push({ name: currentUser.name, email: currentUser.email });
    syncItemClaimFields(item, claimers);
    showToast(`${currentUser.name} lleva: ${item.name}`);
  } else {
    const allMet = additionalsList.every(a => getItemClaimers(a).length >= Math.max(1, Number(a.targetQty) || 1));
    if (!allMet) {
      showToast("Primero cubre los adicionales faltantes antes de sumarte a uno ya completo.");
      return;
    }
    claimers.push({ name: currentUser.name, email: currentUser.email });
    syncItemClaimFields(item, claimers);
    showToast(`${currentUser.name} se sumó a: ${item.name}`);
  }

  saveState();
  renderAll();
}

function addCustomAdditional(e) {
  e.preventDefault();
  if (!requireAuth()) return;
  const nameInput = document.getElementById("newAdditionalName");
  const qtySelect = document.getElementById("newAdditionalQty");
  const val = nameInput ? nameInput.value.trim() : "";
  if (!val) return;

  const targetQty = qtySelect ? Math.max(1, Number(qtySelect.value) || 1) : 1;
  const formatted = val.charAt(0).toUpperCase() + val.slice(1);
  additionalsList.push({
    id: "add_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: formatted,
    qtyHint: estimateConsumableFor13(formatted) || `Meta: ${targetQty} pers. (13 invitados)`,
    targetQty,
    claimers: []
  });

  if (nameInput) nameInput.value = "";
  saveState();
  renderAll();
  showToast(`Adicional agregado: ${formatted}`);
}

function getCollabVibeTier(claimed, total) {
  if (total === 0 || claimed === 0) return { tier: "vibe-tier-low", label: "Sin comenzar" };
  const ratio = claimed / total;
  if (ratio >= 1) return { tier: "vibe-tier-gold", label: "Top" };
  if (ratio >= 0.65) return { tier: "vibe-tier-purple", label: "Excelente" };
  if (ratio >= 0.35) return { tier: "vibe-tier-blue", label: "Buena" };
  return { tier: "vibe-tier-green", label: "Iniciada" };
}

function isAdminUser() {
  if (!currentUser) return false;
  const email = (currentUser.email || "").trim().toLowerCase();
  const name = (currentUser.name || "").trim().toLowerCase();
  return (
    email === "titorvc08@gmail.com" ||
    email === "roberto.vargas99@outlook.com" ||
    name.includes("tito") ||
    Number(currentUser.id) === 2
  );
}

let editingSubItem = null;
let movingSubItemState = null;

function openMoveSubItemModal(collabId, itemId) {
  if (!requireAuth()) return;
  const sourceCollab = collaborations.find(c => c.id === collabId);
  if (!sourceCollab) return;
  if (!canManagePlan(sourceCollab)) {
    showToast("Solo el creador o Tito (Admin) pueden mover este elemento.");
    return;
  }
  const item = sourceCollab.items.find(i => String(i.id) === String(itemId));
  if (!item) return;

  movingSubItemState = { collabId, itemId, mode: "existing" };

  const labelEl = document.getElementById("moveSubItemLabel");
  if (labelEl) {
    labelEl.innerHTML = `Mover <strong>"${item.name}"</strong> desde <em>${sourceCollab.title}</em>`;
  }

  const selectEl = document.getElementById("moveTargetCollabSelect");
  const otherCollabs = collaborations.filter(c => c.id !== collabId);
  if (selectEl) {
    if (otherCollabs.length > 0) {
      selectEl.innerHTML = otherCollabs
        .map(c => `<option value="${c.id}">${c.title} (${c.category})</option>`)
        .join("");
    } else {
      selectEl.innerHTML = `<option value="">No hay otras actividades aún</option>`;
    }
  }

  const titleInput = document.getElementById("moveNewCollabTitle");
  if (titleInput) titleInput.value = "";

  const catSelect = document.getElementById("moveNewCollabCategory");
  if (catSelect) {
    const isFood = (sourceCollab.category || "").toLowerCase().includes("comida") || (sourceCollab.category || "").toLowerCase().includes("bebida");
    catSelect.value = isFood ? "Comida y Bebida" : "Dinámica y Juegos";
  }

  toggleMoveSubItemMode(otherCollabs.length > 0 ? "existing" : "new");
  openModal("modalMoveSubItem");
}

function toggleMoveSubItemMode(mode) {
  if (movingSubItemState) movingSubItemState.mode = mode;

  const existingBtn = document.getElementById("moveModeExistingBtn");
  const newBtn = document.getElementById("moveModeNewBtn");
  const addBtn = document.getElementById("moveModeAdditionalBtn");
  const existingSec = document.getElementById("moveExistingSection");
  const newSec = document.getElementById("moveNewSection");
  const addSec = document.getElementById("moveAdditionalSection");

  if (existingBtn) existingBtn.classList.toggle("active", mode === "existing");
  if (newBtn) newBtn.classList.toggle("active", mode === "new");
  if (addBtn) addBtn.classList.toggle("active", mode === "additional");
  if (existingSec) existingSec.classList.toggle("hidden", mode !== "existing");
  if (newSec) newSec.classList.toggle("hidden", mode !== "new");
  if (addSec) addSec.classList.toggle("hidden", mode !== "additional");
}

function confirmMoveSubItem(e) {
  e.preventDefault();
  if (!movingSubItemState) return;

  const { collabId, itemId, mode } = movingSubItemState;
  const sourceCollab = collaborations.find(c => c.id === collabId);
  if (!sourceCollab) return;

  const itemIdx = sourceCollab.items.findIndex(i => String(i.id) === String(itemId));
  if (itemIdx === -1) return;

  if (mode === "existing") {
    const selectEl = document.getElementById("moveTargetCollabSelect");
    const targetId = selectEl ? Number(selectEl.value) : null;
    const targetCollab = collaborations.find(c => c.id === targetId);
    if (!targetCollab) {
      showToast("Selecciona una actividad destino o crea una nueva.");
      return;
    }

    const [movedItem] = sourceCollab.items.splice(itemIdx, 1);
    targetCollab.items.push(movedItem);
    expandedPlanIds.add(targetCollab.id);

    saveState();
    renderAll();
    closeModal("modalMoveSubItem");
    movingSubItemState = null;
    showToast(`Movido "${movedItem.name}" a ${targetCollab.title}`);
  } else if (mode === "additional") {
    const qtySelect = document.getElementById("moveAdditionalTargetQty");
    const targetQty = qtySelect ? Math.max(1, Number(qtySelect.value) || 2) : 2;
    const [movedItem] = sourceCollab.items.splice(itemIdx, 1);
    const existingClaimers = getItemClaimers(movedItem);

    additionalsList.push({
      id: "add_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: movedItem.name,
      qtyHint: estimateConsumableFor13(movedItem.name) || `Meta: ${targetQty} pers. (13 invitados)`,
      targetQty,
      claimers: existingClaimers
    });

    saveState();
    renderAll();
    closeModal("modalMoveSubItem");
    movingSubItemState = null;
    showToast(`"${movedItem.name}" transferido a Adicionales`);
  } else {
    const titleInput = document.getElementById("moveNewCollabTitle");
    const catSelect = document.getElementById("moveNewCollabCategory");
    const stageSelect = document.getElementById("moveNewCollabStage");

    const newTitle = titleInput ? titleInput.value.trim() : "";
    if (!newTitle) {
      showToast("Escribe un nombre para la nueva actividad.");
      if (titleInput) titleInput.focus();
      return;
    }

    const [movedItem] = sourceCollab.items.splice(itemIdx, 1);
    const newCollab = {
      id: Date.now(),
      title: newTitle.charAt(0).toUpperCase() + newTitle.slice(1),
      category: catSelect ? catSelect.value : "Comida y Bebida",
      stage: stageSelect ? stageSelect.value : "stage2",
      author: currentUser ? currentUser.name : "Anfitrión",
      authorEmail: currentUser ? currentUser.email : "",
      items: [movedItem]
    };

    collaborations.unshift(newCollab);
    expandedPlanIds.add(newCollab.id);

    saveState();
    renderAll();
    closeModal("modalMoveSubItem");
    movingSubItemState = null;
    showToast(`Creada "${newCollab.title}" con "${movedItem.name}"`);
  }
}

function canManagePlan(collab) {
  if (!currentUser || !collab) return false;
  if (isAdminUser()) return true;
  const isAuthor = (
    (collab.authorEmail && collab.authorEmail.toLowerCase() === (currentUser.email || "").toLowerCase()) ||
    (collab.author && collab.author.toLowerCase() === (currentUser.name || "").toLowerCase())
  );
  return Boolean(isAuthor);
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
  const claimedCount = collab.items.filter(i => getItemClaimers(i).length > 0).length;
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
    const claimers = getItemClaimers(item);
    const isClaimed = claimers.length > 0;
    const isMineClaim = Boolean(
      currentUser &&
      claimers.some(c =>
        (c.email && c.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (c.name && c.name.toLowerCase() === currentUser.name.toLowerCase())
      )
    );
    const canJoinShared = isComplete && isClaimed && !isMineClaim;
    const firstClaimer = claimers[0] || null;
    const ownerObj = firstClaimer
      ? attendeesList.find(u => u.email.toLowerCase() === (firstClaimer.email || "").toLowerCase())
      : null;
    const miniSvg = ownerObj ? renderRobotSVG(ownerObj.robot, null, null, true) : "";
    const claimersLabel = claimers.map(c => c.name).join(" + ");
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
          <button type="button" class="subitem-btn-icon move" onclick="openMoveSubItemModal(${collab.id}, '${item.id}')" title="Mover a otra actividad o crear una nueva">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          </button>
          <button type="button" class="subitem-btn-icon edit" onclick="startEditSubItem(${collab.id}, '${item.id}')" title="Modificar este elemento">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button type="button" class="subitem-btn-icon delete" onclick="deleteSubItem(${collab.id}, '${item.id}')" title="Eliminar este elemento">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      ` : "";

      const assigneeTooltip = isMineClaim
        ? `Asignado a ${claimersLabel}. Clic para salirte de este insumo.`
        : (canJoinShared
            ? `Asignado a ${claimersLabel}. Todos los insumos están cubiertos: clic para sumarte.`
            : `Asignado a ${claimersLabel}. Cubre primero los insumos libres para poder sumarte.`);

      const portionHint = isFood ? estimateConsumableFor13(item.name) : "";

      itemsHtml += `
        <div class="task-row ${isClaimed ? 'claimed' : ''}">
          <div class="task-info-wrap">
            <div class="task-name-block">
              <span class="task-name">${item.name}</span>
              ${portionHint ? `<span class="portion-hint-badge">${portionHint}</span>` : ''}
            </div>
            ${manageControls}
          </div>
          ${
            isClaimed
              ? `<div class="task-assignee-wrap">
                   <button type="button" class="task-assignee ${claimers.length > 1 ? 'is-shared' : ''} ${isMineClaim ? 'is-mine-claim' : ''}" onclick="toggleClaimItem(${collab.id}, '${item.id}')" title="${assigneeTooltip}">
                     <span class="task-assignee-icon">${miniSvg}</span>
                     <span>${claimersLabel}</span>
                   </button>
                   ${canJoinShared ? `<button type="button" class="task-join-btn" onclick="toggleClaimItem(${collab.id}, '${item.id}')" title="Todos los insumos están cubiertos. ¡Súmate para compartir este!">+ Sumarme</button>` : ''}
                 </div>`
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
    stage1: "Sábado Tarde (Llegada)",
    stage2: "Sábado Noche (Cena & Juegos)",
    stage3: "Domingo Mañana / Mediodía"
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

  const deleteVotes = Array.isArray(collab.deleteVotes) ? collab.deleteVotes : [];
  const activeCount = Math.max(1, (attendeesList || []).filter(u => u.attendance !== "declined").length);
  const majorityNeeded = Math.floor(activeCount / 2) + 1;
  const hasVotedDelete = Boolean(
    currentUser &&
    deleteVotes.some(e => e.toLowerCase() === (currentUser.email || "").toLowerCase())
  );
  const showVoteDeleteBar = !canManage;

  card.innerHTML = `
    ${isMine ? `<button type="button" class="plan-delete-corner-btn" onclick="event.stopPropagation(); deleteCollab('${collab.id}')" title="Eliminar este plan">&times;</button>` : ''}
    
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
        <div class="plan-footer-actions-row">
          <button type="button" class="ai-grow-trigger" onclick="toggleGrowPlan(${collab.id})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            <span>${isGrowing ? 'Ocultar sugerencias pus.io' : 'Desarrollar esta idea con <strong>pus.io</strong>'}</span>
          </button>
          ${
            canManage
              ? `<button type="button" class="vote-delete-plan-btn" onclick="deleteCollab('${collab.id}')" title="Eliminar esta actividad definitivamente">
                   Eliminar actividad
                 </button>`
              : `<button type="button" class="vote-delete-plan-btn ${hasVotedDelete ? 'voted' : ''}" onclick="voteDeleteCollab('${collab.id}')" title="Si se alcanza mayoría (${majorityNeeded} votos), esta actividad se elimina automáticamente">
                   ${deleteVotes.length > 0 ? `Eliminar (${deleteVotes.length}/${majorityNeeded})` : 'Solicitar eliminar'}
                 </button>`
          }
        </div>
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

let draggedTimelineCollabId = null;

function handleTimelineDragStart(e, collabId) {
  draggedTimelineCollabId = collabId;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(collabId));
  }
  if (e.currentTarget) {
    e.currentTarget.classList.add("is-dragging");
  }
}

function handleTimelineDragEnd(e) {
  if (e.currentTarget) {
    e.currentTarget.classList.remove("is-dragging");
  }
  document.querySelectorAll(".timeline-stage-card.is-drop-target").forEach(el => el.classList.remove("is-drop-target"));
  draggedTimelineCollabId = null;
}

function handleTimelineDragOver(e) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  if (e.currentTarget) e.currentTarget.classList.add("is-drop-target");
}

function handleTimelineDragLeave(e) {
  if (e.currentTarget && !e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove("is-drop-target");
  }
}

function handleTimelineDrop(e, targetStage) {
  e.preventDefault();
  if (e.currentTarget) e.currentTarget.classList.remove("is-drop-target");
  const rawId = draggedTimelineCollabId || (e.dataTransfer ? Number(e.dataTransfer.getData("text/plain")) : null);
  if (!rawId) return;
  changeCollabStageQuick(rawId, targetStage);
}

function changeCollabStageQuick(collabId, newStage) {
  const collab = collaborations.find(c => String(c.id) === String(collabId));
  if (!collab) return;
  collab.stage = newStage;
  collab.stageOrder = Date.now();
  saveState(true);
  renderAll();
  const labels = {
    stage1: "Sábado Tarde",
    stage2: "Sábado Noche",
    stage3: "Domingo Mañana / Mediodía"
  };
  showToast(`"${collab.title}" movido a ${labels[newStage] || newStage}`);
}

function renderDynamicTimeline() {
  const s1 = document.getElementById("timelineStage1");
  const s2 = document.getElementById("timelineStage2");
  const s3 = document.getElementById("timelineStage3");

  if (!s1 || !s2 || !s3) return;

  s1.innerHTML = "";
  s2.innerHTML = "";
  s3.innerHTML = "";

  const buckets = { stage1: [], stage2: [], stage3: [] };

  collaborations.forEach((collab, idx) => {
    let targetStage = collab.stage || null;
    const lower = (collab.title + " " + collab.category).toLowerCase();

    if (!targetStage) {
      if (lower.includes("desayuno") || lower.includes("chilaquil") || lower.includes("café") || lower.includes("domingo") || lower.includes("despedida") || lower.includes("salida")) {
        targetStage = "stage3";
      } else if (lower.includes("ceviche") || lower.includes("bienvenida") || lower.includes("llegada") || lower.includes("playa") || lower.includes("voleibol") || lower.includes("tarde")) {
        targetStage = "stage1";
      } else {
        targetStage = "stage2";
      }
    }
    if (!buckets[targetStage]) targetStage = "stage2";
    buckets[targetStage].push({ collab, order: collab.stageOrder || idx });
  });

  const containers = { stage1: s1, stage2: s2, stage3: s3 };
  const emptyHints = {
    stage1: "Arrastra aquí actividades para el Sábado por la tarde",
    stage2: "Arrastra aquí planes para el Sábado por la noche",
    stage3: "Arrastra aquí desayuno o planes del Domingo"
  };

  Object.keys(buckets).forEach(stageKey => {
    const list = buckets[stageKey].sort((a, b) => a.order - b.order);
    const container = containers[stageKey];
    if (list.length === 0) {
      container.innerHTML = `<div class="empty-stage-hint">${emptyHints[stageKey]}</div>`;
      return;
    }

    list.forEach(({ collab }) => {
      const items = collab.items || [];
      const claimedCount = items.filter(i => getItemClaimers(i).length > 0).length;
      const totalCount = items.length;
      const isComplete = totalCount > 0 && claimedCount === totalCount;
      const isPromoted = claimedCount > 0;
      const statusLabel = isComplete ? "Listo" : (isPromoted ? "En marcha" : "Por empezar");

      const row = document.createElement("div");
      row.className = `timeline-plan-row timeline-draggable-card ${isComplete ? 'is-complete' : (isPromoted ? 'is-promoted' : '')}`;
      row.draggable = true;
      row.ondragstart = (ev) => handleTimelineDragStart(ev, collab.id);
      row.ondragend = (ev) => handleTimelineDragEnd(ev);

      row.innerHTML = `
        <div class="timeline-drag-handle" title="Mantén presionado y arrastra para mover de horario">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="3.5" r="1.4"/><circle cx="11" cy="3.5" r="1.4"/>
            <circle cx="5" cy="8" r="1.4"/><circle cx="11" cy="8" r="1.4"/>
            <circle cx="5" cy="12.5" r="1.4"/><circle cx="11" cy="12.5" r="1.4"/>
          </svg>
        </div>
        <div class="timeline-plan-info">
          <span class="timeline-plan-title">${collab.title}</span>
          <span class="timeline-plan-meta">${collab.category} &bull; ${collab.author}</span>
        </div>
        <div class="timeline-plan-controls">
          <span class="timeline-plan-pill ${isComplete ? 'complete-badge' : (isPromoted ? 'promoted-badge' : '')}">${statusLabel}</span>
          <select class="timeline-stage-quick-select" aria-label="Cambiar horario" title="Mover a otro horario" onchange="changeCollabStageQuick(${collab.id}, this.value)">
            <option value="stage1" ${stageKey === 'stage1' ? 'selected' : ''}>Sáb. Tarde</option>
            <option value="stage2" ${stageKey === 'stage2' ? 'selected' : ''}>Sáb. Noche</option>
            <option value="stage3" ${stageKey === 'stage3' ? 'selected' : ''}>Dom. Mañana</option>
          </select>
        </div>
      `;
      container.appendChild(row);
    });
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

  const claimers = getItemClaimers(item);
  const myEmail = (currentUser.email || "").toLowerCase();
  const myName = (currentUser.name || "").toLowerCase();
  const existingIdx = claimers.findIndex(c =>
    (c.email && c.email.toLowerCase() === myEmail) ||
    (c.name && c.name.toLowerCase() === myName)
  );

  if (existingIdx !== -1) {
    claimers.splice(existingIdx, 1);
    syncItemClaimFields(item, claimers);
    showToast(`Liberaste: ${item.name}`);
  } else if (claimers.length === 0) {
    claimers.push({ name: currentUser.name, email: currentUser.email });
    syncItemClaimFields(item, claimers);
    showToast(`${currentUser.name} se encarga de: ${item.name}`);
  } else {
    const allCovered = collab.items.every(i => getItemClaimers(i).length > 0);
    if (!allCovered) {
      showToast("Primero cubre los insumos disponibles de esta actividad antes de sumarte a uno ya tomado.");
      return;
    }
    claimers.push({ name: currentUser.name, email: currentUser.email });
    syncItemClaimFields(item, claimers);
    showToast(`${currentUser.name} se sumó a: ${item.name}`);
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
  const targetIdx = collaborations.findIndex(c => String(c.id) === String(collabId));
  if (targetIdx === -1) return;
  const targetPlan = collaborations[targetIdx];

  if (!isAdminUser() && !canManagePlan(targetPlan)) {
    showToast("Solo quien propuso esta idea o Tito (Admin) puede eliminarla directamente.");
    return;
  }

  const removedPlan = collaborations[targetIdx];
  collaborations.splice(targetIdx, 1);
  saveState(true);
  renderAll();

  lastDeletedPlanCache = {
    plan: removedPlan,
    index: targetIdx
  };

  showToast("Actividad eliminada", "Deshacer", () => {
    if (!lastDeletedPlanCache) return;
    const { plan, index } = lastDeletedPlanCache;
    const insertAt = Math.min(index, collaborations.length);
    collaborations.splice(insertAt, 0, plan);
    lastDeletedPlanCache = null;
    saveState(true);
    renderAll();
    showToast("Actividad restaurada");
  }, 7000);
}

function voteDeleteCollab(collabId) {
  if (!requireAuth()) return;
  const targetIdx = collaborations.findIndex(c => String(c.id) === String(collabId));
  if (targetIdx === -1) return;
  const collab = collaborations[targetIdx];

  if (!Array.isArray(collab.deleteVotes)) {
    collab.deleteVotes = [];
  }

  const myEmail = (currentUser.email || "").toLowerCase();
  const existingIdx = collab.deleteVotes.findIndex(e => e.toLowerCase() === myEmail);

  if (existingIdx !== -1) {
    collab.deleteVotes.splice(existingIdx, 1);
    saveState(true);
    renderAll();
    showToast("Retiraste tu voto para eliminar esta actividad.");
    return;
  }

  collab.deleteVotes.push(myEmail);
  const activeCount = Math.max(1, (attendeesList || []).filter(u => u.attendance !== "declined").length);
  const majorityNeeded = Math.floor(activeCount / 2) + 1;

  if (collab.deleteVotes.length >= majorityNeeded) {
    collaborations.splice(targetIdx, 1);
    saveState(true);
    renderAll();
    showToast(`"${collab.title}" eliminada por mayoría de votos (${majorityNeeded}/${activeCount}).`);
  } else {
    saveState(true);
    renderAll();
    showToast(`Solicitud registrada (${collab.deleteVotes.length}/${majorityNeeded} votos para eliminar).`);
  }
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

  if (!emailInput || !banner) return;

  const emailVal = emailInput.value.trim().toLowerCase();
  const nameVal = nameInput ? nameInput.value.trim() : "";

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
      localStorage.setItem("posada_summary_seen_v1", "1");
      renderSessionHeader();
      openModal("modalUserSummary");
      return;
    }
    const errEl = document.getElementById("authErrorMsg");
    const okEl = document.getElementById("authSuccessMsg");
    if (errEl) errEl.style.display = "none";
    if (okEl) okEl.style.display = "none";
    checkAuthDeduplication();
    openModal("modalAuth");
  };

  // Escuchar tipeo en email para detectar coincidencias con personajes existentes
  const emailInput = document.getElementById("authInputEmail");
  if (emailInput) emailInput.addEventListener("input", checkAuthDeduplication);

  // Botón para confirmar personaje coincidente
  const btnClaim = document.getElementById("btnClaimMatch");
  if (btnClaim) {
    btnClaim.onclick = () => {
      if (pendingClaimedMatch) {
        showToast(`Personaje seleccionado: ${pendingClaimedMatch.name}. Ingresa tu contraseña para entrar.`);
        const pinInput = document.getElementById("authInputPin");
        if (pinInput) pinInput.focus();
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

  document.getElementById("secureAuthForm").onsubmit = async (e) => {
    e.preventDefault();
    const emailVal = document.getElementById("authInputEmail").value.trim().toLowerCase();
    const passwordVal = document.getElementById("authInputPin").value;
    const errEl = document.getElementById("authErrorMsg");
    const okEl = document.getElementById("authSuccessMsg");
    const submitBtn = document.getElementById("btnAuthSubmit");

    errEl.style.display = "none";
    if (okEl) okEl.style.display = "none";

    if (!emailVal || passwordVal.length < 6) {
      errEl.textContent = "Ingresa un correo válido y una contraseña de al menos 6 caracteres.";
      errEl.style.display = "block";
      return;
    }
    if (!supabaseClient) {
      errEl.textContent = "No se pudo inicializar Supabase Auth. Recarga la página e intenta de nuevo.";
      errEl.style.display = "block";
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.textContent : "Iniciar sesión";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Iniciando sesión...";
    }

    try {
      // Sincronizar primero con la nube para tener siempre la lista real de cuentas existentes
      await syncFetchFromCloud();

      // 1. Intentar iniciar sesión con Supabase Auth
      const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: emailVal,
        password: passwordVal
      });

      if (!signInError && signInData && signInData.user) {
        supabaseAuthUser = signInData.user;
        linkSupabaseUserToAttendee(supabaseAuthUser, "", true);
      } else {
        const msg = ((signInError && signInError.message) || "").toLowerCase();

        if (msg.includes("email not confirmed")) {
          errEl.textContent = "Tu correo aún no está confirmado. Revisa tu bandeja de entrada o spam.";
          errEl.style.display = "block";
          return;
        }

        // 2. Si es la primera vez que entra con Supabase Auth, activar su acceso y vincular su cuenta existente
        if (msg.includes("invalid login credentials")) {
          const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
            email: emailVal,
            password: passwordVal
          });

          if (signUpError) {
            const upMsg = (signUpError.message || "").toLowerCase();
            if (upMsg.includes("already registered") || upMsg.includes("already exists")) {
              errEl.textContent = "Contraseña incorrecta para este correo.";
            } else {
              errEl.textContent = signUpError.message || "Correo o contraseña incorrectos.";
            }
            errEl.style.display = "block";
            return;
          }

          if (!signUpData.session) {
            if (okEl) {
              okEl.textContent = "¡Acceso activado! Revisa tu correo para confirmar tu cuenta y luego vuelve a iniciar sesión aquí.";
              okEl.style.display = "block";
            }
            document.getElementById("authInputPin").value = "";
            return;
          }

          supabaseAuthUser = signUpData.user;
          linkSupabaseUserToAttendee(supabaseAuthUser, "", true);
        } else {
          errEl.textContent = (signInError && signInError.message) || "Error al iniciar sesión.";
          errEl.style.display = "block";
          return;
        }
      }

      document.getElementById("authInputPin").value = "";
      document.getElementById("claimMatchBanner").style.display = "none";
      renderAll();
      closeModal("modalAuth");
      showToast(`Sesión iniciada: ${currentUser ? currentUser.name : emailVal}`);
    } catch (err) {
      errEl.textContent = "Error de conexión con Supabase Auth. Intenta de nuevo.";
      errEl.style.display = "block";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
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

function normalizeRewardIdeas() {
  if (!pusioContest || !Array.isArray(pusioContest.rewardIdeas)) {
    pusioContest.rewardIdeas = JSON.parse(JSON.stringify(DEFAULT_REWARD_IDEAS));
    return;
  }
  const irrelevantRegex = /smash|mario\s*kart|pel[ií]cula|switch|combate estelar/i;
  const cleaned = [];
  const seenTexts = new Set();

  pusioContest.rewardIdeas.forEach((raw, idx) => {
    const obj = typeof raw === "string"
      ? { id: `rew_legacy_${idx}_${raw.length}`, text: raw.trim(), authorEmail: "", authorName: "Posada", votes: [] }
      : {
          id: raw.id || `rew_${idx}_${Date.now()}`,
          text: (raw.text || "").trim(),
          authorEmail: raw.authorEmail || "",
          authorName: raw.authorName || "Posada",
          votes: Array.isArray(raw.votes) ? raw.votes : []
        };
    if (!obj.text || irrelevantRegex.test(obj.text)) return;
    const key = obj.text.toLowerCase();
    if (seenTexts.has(key)) return;
    seenTexts.add(key);
    cleaned.push(obj);
  });

  if (cleaned.length < 3) {
    DEFAULT_REWARD_IDEAS.forEach(def => {
      if (!seenTexts.has(def.text.toLowerCase())) {
        seenTexts.add(def.text.toLowerCase());
        cleaned.push({ ...def, votes: [] });
      }
    });
  }

  pusioContest.rewardIdeas = cleaned;
}

function renderContestRewards() {
  const container = document.getElementById("contestRewardChips");
  if (!container) return;
  normalizeRewardIdeas();
  container.innerHTML = "";

  const myEmail = currentUser ? (currentUser.email || "").toLowerCase() : "";
  const admin = isAdminUser();
  const sorted = [...pusioContest.rewardIdeas].sort((a, b) => (b.votes || []).length - (a.votes || []).length);

  sorted.forEach(idea => {
    const votes = Array.isArray(idea.votes) ? idea.votes : [];
    const hasVoted = Boolean(myEmail && votes.some(v => v.toLowerCase() === myEmail));
    const isOwner = Boolean(myEmail && idea.authorEmail && idea.authorEmail.toLowerCase() === myEmail);
    const canDelete = Boolean(admin || isOwner);

    const chip = document.createElement("div");
    chip.className = `contest-reward-chip ${hasVoted ? 'is-voted' : ''}`;
    chip.innerHTML = `
      <span class="reward-chip-dot"></span>
      <span class="reward-chip-text">${idea.text}</span>
      <div class="reward-chip-actions">
        <button type="button" class="reward-vote-btn ${hasVoted ? 'active' : ''}" onclick="voteRewardIdea('${idea.id}')" title="Votar por este premio">
          &#128077; ${votes.length}
        </button>
        ${canDelete ? `<button type="button" class="reward-del-btn" onclick="deleteRewardIdea('${idea.id}')" title="Eliminar premio">&times;</button>` : ''}
      </div>
    `;
    container.appendChild(chip);
  });
}

function voteRewardIdea(rewardId) {
  if (!requireAuth()) return;
  normalizeRewardIdeas();
  const target = pusioContest.rewardIdeas.find(r => String(r.id) === String(rewardId));
  if (!target) return;

  const myEmail = (currentUser.email || "").toLowerCase();
  const idx = target.votes.findIndex(v => v.toLowerCase() === myEmail);
  if (idx !== -1) {
    target.votes.splice(idx, 1);
    showToast("Voto retirado del premio");
  } else {
    target.votes.push(myEmail);
    showToast("Voto registrado para este premio");
  }

  saveState(true);
  renderContestRewards();
}

function deleteRewardIdea(rewardId) {
  if (!requireAuth()) return;
  normalizeRewardIdeas();
  const idx = pusioContest.rewardIdeas.findIndex(r => String(r.id) === String(rewardId));
  if (idx === -1) return;

  const target = pusioContest.rewardIdeas[idx];
  const myEmail = (currentUser.email || "").toLowerCase();
  const isOwner = target.authorEmail && target.authorEmail.toLowerCase() === myEmail;
  if (!isAdminUser() && !isOwner) {
    showToast("Solo quien sugirió este premio o Tito (Admin) puede eliminarlo.");
    return;
  }

  pusioContest.rewardIdeas.splice(idx, 1);
  saveState(true);
  renderContestRewards();
  showToast("Premio eliminado");
}

function submitRewardIdea(e) {
  e.preventDefault();
  if (!requireAuth()) return;
  normalizeRewardIdeas();
  const input = document.getElementById("contestRewardInput");
  if (!input) return;
  const rawText = input.value.trim();
  if (!rawText) return;

  const alreadyExists = pusioContest.rewardIdeas.some(
    item => item.text.toLowerCase() === rawText.toLowerCase()
  );

  if (alreadyExists) {
    showToast("Esa idea ya está entre las propuestas del premio.");
    input.value = "";
    return;
  }

  pusioContest.rewardIdeas.unshift({
    id: "rew_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    text: rawText.charAt(0).toUpperCase() + rawText.slice(1),
    authorEmail: currentUser.email || "",
    authorName: currentUser.name || "Invitado",
    votes: [(currentUser.email || "").toLowerCase()]
  });

  input.value = "";
  saveState(true);
  renderContestRewards();
  showToast("Premio sugerido y votado");
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

function deleteContestSubmission(subId) {
  if (!requireAuth()) return;
  const list = pusioContest.submissions || [];
  const idx = list.findIndex(s => String(s.id) === String(subId));
  if (idx === -1) return;

  const target = list[idx];
  const isOwner = (target.authorEmail || "").toLowerCase() === (currentUser.email || "").toLowerCase();
  const isAdmin = (currentUser.email || "").toLowerCase() === "titorvc08@gmail.com" || (currentUser.name || "").toLowerCase() === "tito";
  if (!isOwner && !isAdmin) {
    showToast("Solo el autor o Tito (Admin) pueden eliminar este diseño.");
    return;
  }

  list.splice(idx, 1);
  if (pusioContest.votes) {
    Object.keys(pusioContest.votes).forEach(voterEmail => {
      if (String(pusioContest.votes[voterEmail]) === String(subId)) {
        delete pusioContest.votes[voterEmail];
      }
    });
  }

  checkContestLeader();
  saveState(true);
  renderContestSubmissions();
  showToast("Diseño eliminado del concurso");
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
    const isAdmin = currentUser && ((currentUser.email || "").toLowerCase() === "titorvc08@gmail.com" || (currentUser.name || "").toLowerCase() === "tito");
    const canDeleteSub = Boolean(isMySubmission || isAdmin);

    const card = document.createElement("div");
    card.className = `contest-card ${isLeader ? 'is-leader' : ''} ${isVotedByMe ? 'is-my-vote' : ''}`;

    const svgIcon = renderRobotSVG(sub.robot, null, null, true);

    card.innerHTML = `
      ${isLeader ? '<div class="contest-leader-ribbon">Líder Oficial</div>' : ''}
      ${canDeleteSub ? `<button type="button" class="contest-delete-btn" onclick="deleteContestSubmission(${sub.id})" title="Eliminar mi diseño">&times;</button>` : ''}
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
window.voteDeleteCollab = voteDeleteCollab;
window.voteRewardIdea = voteRewardIdea;
window.deleteRewardIdea = deleteRewardIdea;
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
window.deleteContestSubmission = deleteContestSubmission;
window.handleTimelineDragStart = handleTimelineDragStart;
window.handleTimelineDragEnd = handleTimelineDragEnd;
window.handleTimelineDragOver = handleTimelineDragOver;
window.handleTimelineDragLeave = handleTimelineDragLeave;
window.handleTimelineDrop = handleTimelineDrop;
window.changeCollabStageQuick = changeCollabStageQuick;
window.requestCloseStudio = requestCloseStudio;
window.saveRobotStudioAction = saveRobotStudioAction;
window.confirmSaveAndCloseStudio = confirmSaveAndCloseStudio;
window.confirmDiscardAndCloseStudio = confirmDiscardAndCloseStudio;
window.setAttendanceStatus = setAttendanceStatus;
window.setStudioAttendance = setStudioAttendance;
window.submitRewardIdea = submitRewardIdea;
window.submitCurrentPusioToContest = submitCurrentPusioToContest;
window.votePusioDesign = votePusioDesign;

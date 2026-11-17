/**
 * POSADA CHELEM 2026 — MOTOR SVG MODULAR POR PIEZA (HSL PRIMARIO/SECUNDARIO),
 * AUTENTICACIÓN ÚNICA CON PIN/CLAVE Y TABLERO DE PLANES Y PROPUESTAS
 * Cero Emojis
 */

const EVENT_DATE = new Date("2026-12-19T15:00:00-06:00").getTime();

// Nombres de las categorías anatómicas del robot
const PART_META = {
  head:  { label: "Cabeza y Chasis", priLabel: "Color principal (Cabeza)", secLabel: "Borde y panel (Cabeza)", count: 8 },
  eyes:  { label: "Ojos y Visor",    priLabel: "Luz / Pupila (Ojos)",      secLabel: "Marco / Visor (Ojos)",   count: 8 },
  mouth: { label: "Boca y Vocoder",  priLabel: "Luz / Dientes (Boca)",     secLabel: "Base de boca",           count: 8 },
  top:   { label: "Antena Superior", priLabel: "Punta / Foco (Antena)",    secLabel: "Base / Mástil (Antena)", count: 8 },
  ears:  { label: "Laterales",       priLabel: "Color principal (Lateral)",secLabel: "Detalle (Lateral)",      count: 8 },
  bg:    { label: "Fondo y Patrón",  priLabel: "Color de fondo 1",         secLabel: "Color de patrón / fondo 2", count: 6 }
};

function makeDefaultRobot(hueBase, eyeShape, headShape, mouthShape, topShape) {
  return {
    head:  { shape: headShape % 8,  pri: { h: hueBase, s: 78, l: 54 }, sec: { h: (hueBase + 15) % 360, s: 70, l: 34 } },
    eyes:  { shape: eyeShape % 8,   pri: { h: (hueBase + 160) % 360, s: 95, l: 62 }, sec: { h: 220, s: 28, l: 16 } },
    mouth: { shape: mouthShape % 8, pri: { h: 48, s: 95, l: 62 }, sec: { h: 220, s: 28, l: 18 } },
    top:   { shape: topShape % 8,   pri: { h: (hueBase + 120) % 360, s: 90, l: 58 }, sec: { h: 42, s: 88, l: 52 } },
    ears:  { shape: (headShape + 1) % 8, pri: { h: 42, s: 90, l: 55 }, sec: { h: hueBase, s: 65, l: 38 } },
    bg:    { shape: 1,              pri: { h: hueBase, s: 70, l: 92 }, sec: { h: (hueBase + 35) % 360, s: 65, l: 82 } }
  };
}

const DEFAULT_ATTENDEES = [
  { id: 1, name: "Reyvell",   email: "reyvelljk87@gmail.com",          pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: makeDefaultRobot(38,  1, 0, 0, 1) },
  { id: 2, name: "Roberto",   email: "titorvc08@gmail.com",            pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: makeDefaultRobot(198, 0, 1, 1, 0) },
  { id: 3, name: "Daniel",    email: "danielitoestabonito16@gmail.com",pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: makeDefaultRobot(158, 3, 2, 2, 2) },
  { id: 4, name: "Pinzón",    email: "mendoza.lpinzon@gmail.com",      pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: makeDefaultRobot(352, 5, 3, 0, 3) },
  { id: 5, name: "Alejandro", email: "alejandroaltamiranopuc@gmail.com",pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: makeDefaultRobot(268, 2, 4, 4, 4) },
  { id: 6, name: "Erik",      email: "joserikb@gmail.com",             pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: makeDefaultRobot(24,  4, 5, 3, 5) },
  { id: 7, name: "Iván",      email: "ivan.raygosa@gmail.com",         pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: makeDefaultRobot(182, 6, 1, 1, 1) },
  { id: 8, name: "Francisco", email: "fjvc091002@gmail.com",           pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: makeDefaultRobot(330, 1, 6, 5, 6) },
  { id: 9, name: "Carlos",    email: "cplus.lat@gmail.com",            pinHash: null, travelMode: null, puedo_dar_coche: 0, robot: makeDefaultRobot(215, 7, 7, 2, 0) }
];

let currentUser = null;
let activePart = "head";
let attendeesList = [];
let carsList = [];
let collaborations = [];

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  loadState();
  renderAll();
  setupEventListeners();
  setupHueWheelInteractions();
});

// ----------------- Utilidades de Color HSL ----------------- //
function hslStr(c) {
  if (!c) return "hsl(200, 80%, 50%)";
  return `hsl(${Math.round(c.h)}, ${Math.round(c.s)}%, ${Math.round(c.l)}%)`;
}

// Hash simple determinístico para proteger el PIN de cada correo
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
// RENDERIZADOR MODULAR SVG DEL ROBOT (CADA PIEZA CON COLOR PRIMARIO Y SECUNDARIO)
// ==========================================================================
function renderRobotSVG(robotCfg, overridePart = null, overrideShape = null) {
  const r = JSON.parse(JSON.stringify(robotCfg || makeDefaultRobot(200, 0, 0, 0, 0)));
  if (overridePart !== null && overrideShape !== null) {
    r[overridePart].shape = overrideShape;
  }

  const bgPri = hslStr(r.bg.pri);
  const bgSec = hslStr(r.bg.sec);
  const headPri = hslStr(r.head.pri);
  const headSec = hslStr(r.head.sec);
  const eyePri = hslStr(r.eyes.pri);
  const eyeSec = hslStr(r.eyes.sec);
  const mouthPri = hslStr(r.mouth.pri);
  const mouthSec = hslStr(r.mouth.sec);
  const topPri = hslStr(r.top.pri);
  const topSec = hslStr(r.top.sec);
  const earPri = hslStr(r.ears.pri);
  const earSec = hslStr(r.ears.sec);

  const uid = "r" + Math.floor(Math.random() * 1000000);

  // 1. Capa de Fondo
  let bgLayer = `<rect width="160" height="160" fill="${bgPri}"/>`;
  if (r.bg.shape === 1) {
    bgLayer = `
      <defs><linearGradient id="g_${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgPri}"/><stop offset="100%" stop-color="${bgSec}"/>
      </linearGradient></defs>
      <rect width="160" height="160" fill="url(#g_${uid})"/>`;
  } else if (r.bg.shape === 2) {
    bgLayer = `<rect width="160" height="160" fill="${bgPri}"/><circle cx="80" cy="85" r="62" fill="${bgSec}"/>`;
  } else if (r.bg.shape === 3) {
    bgLayer = `<rect width="160" height="160" fill="${bgPri}"/><circle cx="80" cy="85" r="66" fill="none" stroke="${bgSec}" stroke-width="10"/><circle cx="80" cy="85" r="46" fill="none" stroke="${bgSec}" stroke-width="6"/>`;
  } else if (r.bg.shape === 4) {
    bgLayer = `<rect width="160" height="160" fill="${bgPri}"/><path d="M0 40 H160 M0 80 H160 M0 120 H160 M40 0 V160 M80 0 V160 M120 0 V160" stroke="${bgSec}" stroke-width="2"/>`;
  } else if (r.bg.shape === 5) {
    bgLayer = `<rect width="160" height="160" fill="${bgPri}"/><polygon points="0,160 160,0 160,160" fill="${bgSec}"/>`;
  }

  // 2. Capa de Laterales / Orejas
  let earsLayer = "";
  switch (r.ears.shape % 8) {
    case 0: // Audífonos
      earsLayer = `<rect x="14" y="68" width="16" height="38" rx="8" fill="${earPri}" stroke="#141517" stroke-width="3"/><rect x="130" y="68" width="16" height="38" rx="8" fill="${earPri}" stroke="#141517" stroke-width="3"/><rect x="18" y="75" width="6" height="24" rx="3" fill="${earSec}"/><rect x="136" y="75" width="6" height="24" rx="3" fill="${earSec}"/>`;
      break;
    case 1: // Bobinas
      earsLayer = `<rect x="12" y="72" width="18" height="10" rx="4" fill="${earPri}" stroke="#141517" stroke-width="2.5"/><rect x="12" y="88" width="18" height="10" rx="4" fill="${earSec}" stroke="#141517" stroke-width="2.5"/><rect x="130" y="72" width="18" height="10" rx="4" fill="${earPri}" stroke="#141517" stroke-width="2.5"/><rect x="130" y="88" width="18" height="10" rx="4" fill="${earSec}" stroke="#141517" stroke-width="2.5"/>`;
      break;
    case 2: // Cables curvos
      earsLayer = `<path d="M28 72 C8 72, 8 104, 28 104" fill="none" stroke="${earPri}" stroke-width="6" stroke-linecap="round"/><path d="M132 72 C152 72, 152 104, 132 104" fill="none" stroke="${earPri}" stroke-width="6" stroke-linecap="round"/><circle cx="14" cy="88" r="5" fill="${earSec}" stroke="#141517" stroke-width="2"/><circle cx="146" cy="88" r="5" fill="${earSec}" stroke="#141517" stroke-width="2"/>`;
      break;
    case 3: // Aletas mecha
      earsLayer = `<polygon points="28,65 8,55 14,105 28,100" fill="${earPri}" stroke="#141517" stroke-width="3"/><polygon points="132,65 152,55 146,105 132,100" fill="${earPri}" stroke="#141517" stroke-width="3"/><circle cx="18" cy="82" r="4" fill="${earSec}"/><circle cx="142" cy="82" r="4" fill="${earSec}"/>`;
      break;
    case 4: // Pernos industriales
      earsLayer = `<rect x="16" y="78" width="14" height="18" fill="${earSec}" stroke="#141517" stroke-width="3"/><circle cx="14" cy="87" r="7" fill="${earPri}" stroke="#141517" stroke-width="3"/><rect x="130" y="78" width="14" height="18" fill="${earSec}" stroke="#141517" stroke-width="3"/><circle cx="146" cy="87" r="7" fill="${earPri}" stroke="#141517" stroke-width="3"/>`;
      break;
    case 5: // Antenas laterales
      earsLayer = `<line x1="20" y1="88" x2="20" y2="50" stroke="${earSec}" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="48" r="6" fill="${earPri}" stroke="#141517" stroke-width="2.5"/><line x1="140" y1="88" x2="140" y2="50" stroke="${earSec}" stroke-width="4" stroke-linecap="round"/><circle cx="140" cy="48" r="6" fill="${earPri}" stroke="#141517" stroke-width="2.5"/>`;
      break;
    case 6: // Bloques dobles
      earsLayer = `<rect x="15" y="64" width="14" height="44" rx="3" fill="${earSec}" stroke="#141517" stroke-width="3"/><rect x="19" y="72" width="6" height="28" fill="${earPri}"/><rect x="131" y="64" width="14" height="44" rx="3" fill="${earSec}" stroke="#141517" stroke-width="3"/><rect x="135" y="72" width="6" height="28" fill="${earPri}"/>`;
      break;
    case 7: // Sin laterales
      earsLayer = "";
      break;
  }

  // 3. Capa de Antena / Parte Superior
  let topLayer = "";
  switch (r.top.shape % 8) {
    case 0: // Antena clásica con esfera
      topLayer = `<rect x="74" y="20" width="12" height="26" rx="4" fill="${topSec}" stroke="#141517" stroke-width="3"/><circle cx="80" cy="18" r="10" fill="${topPri}" stroke="#141517" stroke-width="3"/>`;
      break;
    case 1: // Radar parabólico
      topLayer = `<rect x="76" y="26" width="8" height="20" fill="${topSec}" stroke="#141517" stroke-width="3"/><path d="M56 26 A24 20 0 0 1 104 26 Z" fill="${topPri}" stroke="#141517" stroke-width="3"/><circle cx="80" cy="14" r="5" fill="${topSec}" stroke="#141517" stroke-width="2.5"/>`;
      break;
    case 2: // Cuernos cyber
      topLayer = `<path d="M46 46 L34 18 L64 42 Z" fill="${topPri}" stroke="#141517" stroke-width="3" stroke-linejoin="round"/><path d="M114 46 L126 18 L96 42 Z" fill="${topPri}" stroke="#141517" stroke-width="3" stroke-linejoin="round"/><circle cx="80" cy="38" r="6" fill="${topSec}" stroke="#141517" stroke-width="2.5"/>`;
      break;
    case 3: // Bombilla brillante
      topLayer = `<rect x="68" y="34" width="24" height="10" rx="3" fill="${topSec}" stroke="#141517" stroke-width="3"/><path d="M64 34 C60 14, 100 14, 96 34 Z" fill="${topPri}" stroke="#141517" stroke-width="3"/>`;
      break;
    case 4: // Doble antena
      topLayer = `<line x1="58" y1="44" x2="48" y2="18" stroke="${topSec}" stroke-width="4" stroke-linecap="round"/><circle cx="48" cy="18" r="7" fill="${topPri}" stroke="#141517" stroke-width="2.5"/><line x1="102" y1="44" x2="112" y2="18" stroke="${topSec}" stroke-width="4" stroke-linecap="round"/><circle cx="112" cy="18" r="7" fill="${topPri}" stroke="#141517" stroke-width="2.5"/>`;
      break;
    case 5: // Pirámide / Cresta
      topLayer = `<polygon points="52,44 80,14 108,44" fill="${topPri}" stroke="#141517" stroke-width="3" stroke-linejoin="round"/><polygon points="66,44 80,24 94,44" fill="${topSec}"/>`;
      break;
    case 6: // Sirena triple
      topLayer = `<rect x="48" y="30" width="64" height="14" rx="7" fill="${topSec}" stroke="#141517" stroke-width="3"/><circle cx="62" cy="37" r="4.5" fill="${topPri}"/><circle cx="80" cy="37" r="4.5" fill="#FFFFFF"/><circle cx="98" cy="37" r="4.5" fill="${topPri}"/>`;
      break;
    case 7: // Sin antena
      topLayer = "";
      break;
  }

  // 4. Capa de Cabeza / Chasis (Primario = Cuerpo, Secundario = Panel/Bisel)
  let headLayer = "";
  switch (r.head.shape % 8) {
    case 0: // Redondeada moderna
      headLayer = `<rect x="26" y="42" width="108" height="92" rx="26" fill="${headPri}" stroke="#141517" stroke-width="3.5"/><rect x="34" y="50" width="92" height="76" rx="20" fill="none" stroke="${headSec}" stroke-width="4"/>`;
      break;
    case 1: // Cuadrada Retro con remaches
      headLayer = `<rect x="26" y="42" width="108" height="92" rx="10" fill="${headPri}" stroke="#141517" stroke-width="3.5"/><rect x="34" y="48" width="92" height="12" rx="4" fill="${headSec}"/><circle cx="35" cy="124" r="3" fill="${headSec}"/><circle cx="125" cy="124" r="3" fill="${headSec}"/>`;
      break;
    case 2: // Cápsula / Domo
      headLayer = `<path d="M28 84 C28 36, 132 36, 132 84 L132 122 C132 132, 28 132, 28 122 Z" fill="${headPri}" stroke="#141517" stroke-width="3.5"/><path d="M38 118 L122 118" stroke="${headSec}" stroke-width="6" stroke-linecap="round"/>`;
      break;
    case 3: // Octagonal / Blindado
      headLayer = `<polygon points="44,42 116,42 134,60 134,116 116,134 44,134 26,116 26,60" fill="${headPri}" stroke="#141517" stroke-width="3.5" stroke-linejoin="round"/><polygon points="50,50 110,50 124,64 124,110 110,124 50,124 36,110 36,64" fill="none" stroke="${headSec}" stroke-width="3.5"/>`;
      break;
    case 4: // TV Clásica con marco interno
      headLayer = `<rect x="24" y="42" width="112" height="92" rx="18" fill="${headSec}" stroke="#141517" stroke-width="3.5"/><rect x="33" y="50" width="94" height="76" rx="12" fill="${headPri}" stroke="#141517" stroke-width="2.5"/>`;
      break;
    case 5: // Compacto ancho
      headLayer = `<rect x="22" y="48" width="116" height="82" rx="28" fill="${headPri}" stroke="#141517" stroke-width="3.5"/><path d="M44 56 H116" stroke="${headSec}" stroke-width="5" stroke-linecap="round"/>`;
      break;
    case 6: // Trapezoidal Mecha
      headLayer = `<polygon points="36,42 124,42 136,132 24,132" fill="${headPri}" stroke="#141517" stroke-width="3.5" stroke-linejoin="round"/><rect x="44" y="49" width="72" height="8" rx="4" fill="${headSec}"/>`;
      break;
    case 7: // Cilíndrico con franja
      headLayer = `<rect x="30" y="40" width="100" height="96" rx="22" fill="${headPri}" stroke="#141517" stroke-width="3.5"/><rect x="30" y="114" width="100" height="14" fill="${headSec}"/>`;
      break;
  }

  // 5. Capa de Ojos / Visor (Primario = Luz/Pupila, Secundario = Marco/Fondo de visor)
  let eyesLayer = "";
  switch (r.eyes.shape % 8) {
    case 0: // Visor Eva con dos ojos luminosos
      eyesLayer = `<rect x="38" y="62" width="84" height="30" rx="15" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><ellipse cx="60" cy="77" rx="10" ry="7" fill="${eyePri}"/><ellipse cx="100" cy="77" rx="10" ry="7" fill="${eyePri}"/>`;
      break;
    case 1: // Lentes de sol playeros
      eyesLayer = `<path d="M32 68 H128" stroke="#141517" stroke-width="4"/><rect x="38" y="62" width="38" height="26" rx="6" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><rect x="84" y="62" width="38" height="26" rx="6" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><line x1="44" y1="68" x2="56" y2="82" stroke="${eyePri}" stroke-width="4" stroke-linecap="round"/><line x1="90" y1="68" x2="102" y2="82" stroke="${eyePri}" stroke-width="4" stroke-linecap="round"/>`;
      break;
    case 2: // Ojos redondos dobles con anillos
      eyesLayer = `<circle cx="58" cy="76" r="15" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><circle cx="58" cy="76" r="8" fill="${eyePri}"/><circle cx="55" cy="73" r="2.5" fill="#FFFFFF"/><circle cx="102" cy="76" r="15" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><circle cx="102" cy="76" r="8" fill="${eyePri}"/><circle cx="99" cy="73" r="2.5" fill="#FFFFFF"/>`;
      break;
    case 3: // Arco feliz
      eyesLayer = `<rect x="38" y="62" width="84" height="30" rx="12" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><path d="M50 82 Q60 66 70 82" fill="none" stroke="${eyePri}" stroke-width="5" stroke-linecap="round"/><path d="M90 82 Q100 66 110 82" fill="none" stroke="${eyePri}" stroke-width="5" stroke-linecap="round"/>`;
      break;
    case 4: // Visor Robocop láser
      eyesLayer = `<rect x="34" y="66" width="92" height="20" rx="6" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><rect x="42" y="72" width="76" height="8" rx="4" fill="${eyePri}"/>`;
      break;
    case 5: // Cíclope central grande
      eyesLayer = `<rect x="44" y="60" width="72" height="32" rx="16" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><circle cx="80" cy="76" r="12" fill="${eyePri}" stroke="#141517" stroke-width="2"/><circle cx="76" cy="72" r="3.5" fill="#FFFFFF"/>`;
      break;
    case 6: // Pantallas cuadradas independientes
      eyesLayer = `<rect x="42" y="62" width="32" height="28" rx="6" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><rect x="50" y="68" width="16" height="16" rx="3" fill="${eyePri}"/><rect x="86" y="62" width="32" height="28" rx="6" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><rect x="94" y="68" width="16" height="16" rx="3" fill="${eyePri}"/>`;
      break;
    case 7: // Ojos guiño / estrella
      eyesLayer = `<rect x="38" y="62" width="84" height="30" rx="14" fill="${eyeSec}" stroke="#141517" stroke-width="3"/><circle cx="58" cy="77" r="8" fill="${eyePri}"/><path d="M92 77 H110 M101 68 V86" stroke="${eyePri}" stroke-width="4.5" stroke-linecap="round"/>`;
      break;
  }

  // 6. Capa de Boca / Expresión (Primario = Luz/Dientes, Secundario = Fondo de boca)
  let mouthLayer = "";
  switch (r.mouth.shape % 8) {
    case 0: // Sonrisa limpia
      mouthLayer = `<path d="M58 106 Q80 122 102 106" fill="none" stroke="${mouthSec}" stroke-width="6" stroke-linecap="round"/><path d="M60 106 Q80 120 100 106" fill="none" stroke="${mouthPri}" stroke-width="3" stroke-linecap="round"/>`;
      break;
    case 1: // Vocoder / Ecualizador luminoso
      mouthLayer = `<rect x="48" y="100" width="64" height="20" rx="8" fill="${mouthSec}" stroke="#141517" stroke-width="2.5"/><rect x="56" y="106" width="6" height="8" rx="2" fill="${mouthPri}"/><rect x="66" y="103" width="6" height="14" rx="2" fill="${mouthPri}"/><rect x="77" y="105" width="6" height="10" rx="2" fill="${mouthPri}"/><rect x="88" y="103" width="6" height="14" rx="2" fill="${mouthPri}"/><rect x="98" y="106" width="6" height="8" rx="2" fill="${mouthPri}"/>`;
      break;
    case 2: // Gran sonrisa con dientes
      mouthLayer = `<path d="M52 102 H108 A12 12 0 0 1 96 120 H64 A12 12 0 0 1 52 102 Z" fill="${mouthPri}" stroke="#141517" stroke-width="3"/><line x1="70" y1="102" x2="70" y2="120" stroke="${mouthSec}" stroke-width="2.5"/><line x1="90" y1="102" x2="90" y2="120" stroke="${mouthSec}" stroke-width="2.5"/>`;
      break;
    case 3: // Onda de sintetizador
      mouthLayer = `<rect x="48" y="100" width="64" height="18" rx="6" fill="${mouthSec}" stroke="#141517" stroke-width="2.5"/><path d="M54 109 L64 103 L74 115 L86 103 L96 115 L106 109" fill="none" stroke="${mouthPri}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      break;
    case 4: // Rejilla clásica
      mouthLayer = `<rect x="52" y="102" width="56" height="16" rx="4" fill="${mouthPri}" stroke="#141517" stroke-width="2.5"/><line x1="66" y1="102" x2="66" y2="118" stroke="${mouthSec}" stroke-width="3"/><line x1="80" y1="102" x2="80" y2="118" stroke="${mouthSec}" stroke-width="3"/><line x1="94" y1="102" x2="94" y2="118" stroke="${mouthSec}" stroke-width="3"/>`;
      break;
    case 5: // Cápsula LED minimal
      mouthLayer = `<rect x="62" y="105" width="36" height="10" rx="5" fill="${mouthPri}" stroke="${mouthSec}" stroke-width="3"/>`;
      break;
    case 6: // Sonrisa pícara lateral
      mouthLayer = `<path d="M56 110 Q82 118 104 102" fill="none" stroke="#141517" stroke-width="4" stroke-linecap="round"/><polygon points="90,106 102,103 98,116" fill="${mouthPri}" stroke="#141517" stroke-width="2"/>`;
      break;
    case 7: // Tres luces de estado
      mouthLayer = `<circle cx="64" cy="110" r="5" fill="${mouthPri}" stroke="${mouthSec}" stroke-width="2.5"/><circle cx="80" cy="110" r="5" fill="${mouthPri}" stroke="${mouthSec}" stroke-width="2.5"/><circle cx="96" cy="110" r="5" fill="${mouthPri}" stroke="${mouthSec}" stroke-width="2.5"/>`;
      break;
  }

  return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">${bgLayer}${earsLayer}${topLayer}${headLayer}${eyesLayer}${mouthLayer}</svg>`;
}

// ----------------- Contador Regresivo ----------------- //
function initCountdown() {
  const el = document.getElementById("factsCountdown");

  function update() {
    const now = new Date().getTime();
    const diff = EVENT_DATE - now;
    if (diff <= 0 || !el) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    el.textContent = `Faltan ${d} días, ${h} hrs, ${m} min`;
  }

  update();
  setInterval(update, 15000);
}

// ----------------- Estado Local (v7 con PIN y Robot Modular HSL) ----------------- //
function loadState() {
  const savedAttendees = localStorage.getItem("posada_attendees_v7");
  attendeesList = savedAttendees ? JSON.parse(savedAttendees) : DEFAULT_ATTENDEES;

  const savedCars = localStorage.getItem("posada_cars_v7");
  carsList = savedCars ? JSON.parse(savedCars) : [];

  const savedCollabs = localStorage.getItem("posada_collabs_v7");
  collaborations = savedCollabs ? JSON.parse(savedCollabs) : [];

  const savedSessionEmail = localStorage.getItem("posada_active_email_v7");
  if (savedSessionEmail) {
    currentUser = attendeesList.find(u => u.email.toLowerCase() === savedSessionEmail.toLowerCase()) || null;
  }
}

function saveState() {
  localStorage.setItem("posada_attendees_v7", JSON.stringify(attendeesList));
  localStorage.setItem("posada_cars_v7", JSON.stringify(carsList));
  localStorage.setItem("posada_collabs_v7", JSON.stringify(collaborations));
  if (currentUser) {
    localStorage.setItem("posada_active_email_v7", currentUser.email);
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
  renderFactsDashboard();
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
    avatarWrap.innerHTML = renderRobotSVG(makeDefaultRobot(190, 0, 0, 0, 0));
    nameEl.textContent = "Iniciar sesión";
    statusEl.textContent = "Toca para identificarte";
  }
}

function renderFactsDashboard() {
  const attCountEl = document.getElementById("factAttendeesCount");
  const progCountEl = document.getElementById("factProgressCount");
  const progSubEl = document.getElementById("factProgressSub");

  if (attCountEl) attCountEl.textContent = `${attendeesList.length} amigos`;
  if (progCountEl) {
    progCountEl.innerHTML = `${collaborations.length} ${collaborations.length === 1 ? 'plan' : 'planes'} &bull; ${carsList.length} ${carsList.length === 1 ? 'auto' : 'autos'}`;
  }
  if (progSubEl) {
    const totalTasks = collaborations.reduce((acc, c) => acc + c.items.length, 0);
    const coveredTasks = collaborations.reduce((acc, c) => acc + c.items.filter(i => i.claimedBy).length, 0);
    progSubEl.textContent = totalTasks > 0 ? `${coveredTasks} de ${totalTasks} insumos cubiertos` : "Sin pendientes aún";
  }
}

// ----------------- 1. PESTAÑA: PLANES Y PROPUESTAS ----------------- //
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
          Entra al chat con <strong>pus.io</strong> y escribe cualquier comida o actividad que quieras armar (por ejemplo: <em>"Quiero comer nachos de pastor"</em>) para desglosar los insumos y dividirnos entre varios.
        </p>
        <button type="button" class="btn btn-pusio" onclick="switchTab('tabPusio')">Ir a proponer con pus.io</button>
      </div>
    `;
    return;
  }

  const list = document.createElement("div");
  list.className = "collab-list";

  collaborations.forEach(collab => {
    const claimedCount = collab.items.filter(i => i.claimedBy).length;
    const totalCount = collab.items.length;

    const card = document.createElement("div");
    card.className = "collab-card";

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

    card.innerHTML = `
      <div class="collab-card-head">
        <div>
          <span class="collab-cat-badge">${collab.category}</span>
          <h3 class="collab-title">${collab.title}</h3>
          <div class="collab-author">Propuesto por ${collab.author}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="collab-progress-pill">${claimedCount}/${totalCount} cubiertos</span>
          <button type="button" class="modal-close-btn" style="width:26px; height:26px; font-size:0.9rem;" onclick="deleteCollab(${collab.id})" title="Eliminar">&times;</button>
        </div>
      </div>

      <div class="checklist-items">
        ${itemsHtml}
      </div>

      <form class="add-subitem-row" onsubmit="addCustomSubItem(event, ${collab.id})">
        <input type="text" class="add-subitem-input" placeholder="+ Agregar otro insumo a este plan..." required>
        <button type="submit" class="btn btn-sm">Sumar</button>
      </form>
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

// ----------------- 2. PESTAÑA: PUS.IO DESGLOSADOR ----------------- //
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

// ==========================================================================
// 3. PESTAÑA: ESTUDIO COMPLETO DE ROBOT (POR APARTADO + CÍRCULOS DE HUES)
// ==========================================================================
function getEditingRobot() {
  if (currentUser) return currentUser.robot;
  return attendeesList[1].robot;
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
    nameInput.placeholder = currentUser ? "Tu nombre..." : "Inicia sesión para editar tu nombre";
  }
  if (hintEl) {
    hintEl.textContent = currentUser
      ? `Personalizando el perfil verificado de ${currentUser.name} (${currentUser.email})`
      : "Inicia sesión arriba para guardar los cambios en tu perfil personal.";
  }

  const meta = PART_META[activePart];
  document.getElementById("activePartTitle").textContent = `Diseños de ${meta.label}`;
  document.getElementById("primaryColorLabel").textContent = meta.priLabel;
  document.getElementById("secondaryColorLabel").textContent = meta.secLabel;

  // Renderizar miniaturas de formas de la pieza activa
  const shapesGrid = document.getElementById("shapesGrid");
  shapesGrid.innerHTML = "";
  for (let i = 0; i < meta.count; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `shape-tile ${r[activePart].shape === i ? 'selected' : ''}`;
    btn.innerHTML = renderRobotSVG(r, activePart, i);
    btn.onclick = () => {
      if (!requireAuth()) return;
      r[activePart].shape = i;
      triggerCanvasPop();
      saveState();
      renderAll();
    };
    shapesGrid.appendChild(btn);
  }

  // Sincronizar controles HSL Primario y Secundario de la pieza activa
  syncHslControls("Pri", r[activePart].pri);
  syncHslControls("Sec", r[activePart].sec);
}

function syncHslControls(prefix, hslObj) {
  const isPri = prefix === "Pri";
  const dot = document.getElementById(isPri ? "primaryColorDot" : "secondaryColorDot");
  const inner = document.getElementById(isPri ? "primaryHueInner" : "secondaryHueInner");

  const cStr = hslStr(hslObj);
  if (dot) dot.style.backgroundColor = cStr;
  if (inner) inner.style.backgroundColor = cStr;

  document.getElementById(`val${prefix}H`).textContent = `${Math.round(hslObj.h)}°`;
  document.getElementById(`val${prefix}S`).textContent = `${Math.round(hslObj.s)}%`;
  document.getElementById(`val${prefix}L`).textContent = `${Math.round(hslObj.l)}%`;

  const sH = document.getElementById(`slider${prefix}H`);
  const sS = document.getElementById(`slider${prefix}S`);
  const sL = document.getElementById(`slider${prefix}L`);

  if (sH) sH.value = hslObj.h;
  if (sS) {
    sS.value = hslObj.s;
    sS.style.background = `linear-gradient(90deg, hsl(${hslObj.h}, 0%, ${hslObj.l}%), hsl(${hslObj.h}, 100%, ${hslObj.l}%))`;
  }
  if (sL) {
    sL.value = hslObj.l;
    sL.style.background = `linear-gradient(90deg, hsl(${hslObj.h}, ${hslObj.s}%, 15%), hsl(${hslObj.h}, ${hslObj.s}%, 50%), hsl(${hslObj.h}, ${hslObj.s}%, 90%))`;
  }
}

function setupHueWheelInteractions() {
  bindHueWheel("primaryHueWheel", "pri");
  bindHueWheel("secondaryHueWheel", "sec");

  ["Pri", "Sec"].forEach(prefix => {
    const key = prefix.toLowerCase();
    ["H", "S", "L"].forEach(channel => {
      const slider = document.getElementById(`slider${prefix}${channel}`);
      if (slider) {
        slider.addEventListener("input", (e) => {
          if (!requireAuth()) return;
          const r = getEditingRobot();
          r[activePart][key][channel.toLowerCase()] = Number(e.target.value);
          saveState();
          renderRobotStudio();
          renderSessionHeader();
          renderWhosGoing();
        });
      }
    });
  });
}

function bindHueWheel(elementId, colorSlot) {
  const wheel = document.getElementById(elementId);
  if (!wheel) return;

  let dragging = false;

  function pickHueFromEvent(e) {
    if (!requireAuth()) return;
    const rect = wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let angle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const r = getEditingRobot();
    r[activePart][colorSlot].h = Math.round(angle) % 360;
    saveState();
    renderRobotStudio();
    renderSessionHeader();
    renderWhosGoing();
  }

  wheel.addEventListener("mousedown", (e) => { dragging = true; pickHueFromEvent(e); });
  window.addEventListener("mousemove", (e) => { if (dragging) pickHueFromEvent(e); });
  window.addEventListener("mouseup", () => { dragging = false; });

  wheel.addEventListener("touchstart", (e) => { e.preventDefault(); pickHueFromEvent(e); }, { passive: false });
  wheel.addEventListener("touchmove", (e) => { e.preventDefault(); pickHueFromEvent(e); }, { passive: false });
}

function triggerCanvasPop() {
  const wrap = document.getElementById("studioCanvasWrap");
  if (!wrap) return;
  wrap.classList.remove("pop");
  void wrap.offsetWidth;
  wrap.classList.add("pop");
  setTimeout(() => wrap.classList.remove("pop"), 260);
}

// ----------------- 4. PESTAÑA: ¿QUIÉNES VAMOS? (SIN SUPLANTACIÓN) ----------------- //
function renderWhosGoing() {
  const grid = document.getElementById("whosGoingGrid");
  grid.innerHTML = "";

  attendeesList.forEach(person => {
    const isMe = currentUser && currentUser.email.toLowerCase() === person.email.toLowerCase();
    const isVIP = person.puedo_dar_coche === 1;

    let statusLabel = "Confirmado";
    if (isVIP) statusLabel = "Conductor VIP";
    else if (person.travelMode === "passenger") statusLabel = "Pasajero";

    const tile = document.createElement("div");
    tile.className = `friend-tile ${isMe ? 'is-me' : ''}`;

    tile.innerHTML = `
      <div class="friend-tile-avatar">
        ${renderRobotSVG(person.robot)}
      </div>
      <div>
        <div class="friend-tile-name">${person.name}</div>
        <span class="friend-tile-tag">${isMe ? 'Tu perfil activo' : statusLabel}</span>
      </div>
    `;

    grid.appendChild(tile);
  });
}

// ----------------- 5. PESTAÑA: TRANSPORTE ----------------- //
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
              ? `<button type="button" class="btn btn-sm" onclick="retireCar(${car.id})">Retirar</button>`
              : `<button type="button" class="btn btn-ocean btn-sm" onclick="showToast('Lugar solicitado con ${car.driver}')">Pedir lugar</button>`
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

// ----------------- Event Listeners & Login Único con PIN ----------------- //
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

  // Autenticación única protegida por PIN / Contraseña secreta
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
      // Si ya tiene un PIN registrado, verificar que coincida exactamente
      if (existing.pinHash && existing.pinHash !== candidateHash) {
        errEl.textContent = "Clave o PIN incorrecto para este correo. Nadie puede entrar a una cuenta ajena.";
        errEl.style.display = "block";
        return;
      }
      // Si aún no tenía PIN reclamado, queda bloqueado con su nuevo PIN
      existing.pinHash = candidateHash;
      existing.name = nameVal;
      currentUser = existing;
    } else {
      const newUser = {
        id: Date.now(),
        name: nameVal,
        email: emailVal,
        pinHash: candidateHash,
        travelMode: null,
        puedo_dar_coche: 0,
        robot: makeDefaultRobot(Math.floor(Math.random() * 360), 0, 0, 0, 0)
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
  document.querySelectorAll("#anatomyTabs .anatomy-tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll("#anatomyTabs .anatomy-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activePart = btn.dataset.part;
      renderRobotStudio();
    };
  });

  // Edición de nombre en estudio
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

  // Robot al azar
  document.getElementById("btnRandomRobot").onclick = () => {
    if (!requireAuth()) return;
    const r = currentUser.robot;
    Object.keys(PART_META).forEach(part => {
      r[part].shape = Math.floor(Math.random() * PART_META[part].count);
      r[part].pri = { h: Math.floor(Math.random() * 360), s: 65 + Math.floor(Math.random() * 30), l: 45 + Math.floor(Math.random() * 35) };
      r[part].sec = { h: Math.floor(Math.random() * 360), s: 60 + Math.floor(Math.random() * 35), l: 25 + Math.floor(Math.random() * 45) };
    });
    triggerCanvasPop();
    saveState();
    renderAll();
    showToast("Colores y piezas mezclados al azar");
  };

  document.getElementById("btnSaveRobotStudio").onclick = () => {
    if (!requireAuth()) return;
    saveState();
    renderAll();
    showToast(`Robot guardado en el perfil de ${currentUser.name}`);
  };

  // Confirmar pasajero
  document.getElementById("btnConfirmPassenger").onclick = () => {
    if (!requireAuth()) return;
    currentUser.travelMode = "passenger";
    currentUser.puedo_dar_coche = 0;
    saveState();
    renderAll();
    showToast(`${currentUser.name} confirmado como pasajero`);
  };

  // Registrar coche
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

  // Ejemplos rápidos de pus.io
  document.querySelectorAll(".example-pill").forEach(btn => {
    btn.onclick = () => {
      const prompt = btn.dataset.prompt;
      if (prompt) handlePusioMessage(prompt);
    };
  });

  // Formulario pus.io
  document.getElementById("pusioForm").onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("pusioInput");
    const val = input.value.trim();
    if (val) {
      handlePusioMessage(val);
      input.value = "";
    }
  };

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

/**
 * POSADA CHELEM 2026 — SISTEMA COLABORATIVO & SESIÓN GOOGLE 1-TOQUE
 * - Inicio de sesión con un toque por correo Gmail + registro de nombre
 * - Navegación ligera por pestañas (ideal para móvil y escritorio)
 * - Sin planes ni votos predefinidos de relleno: inicia limpio
 * - Asistente pus.io que desglosa cualquier comida/actividad en insumos divisibles
 * - Taller visual nativo de robot en modal (sin prompts)
 * - Cero emojis
 */

const EVENT_DATE = new Date("2026-12-19T15:00:00-06:00").getTime();

// Catálogo nativo de piezas de DiceBear Bottts v7
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

const CHASSIS_HEX_LIST = [
  "039be5", "e53935", "00897b", "ffb300", "fb8c00",
  "8e24aa", "00acc1", "d81b60", "43a047", "3949ab",
  "1e88e5", "f4511e", "5e35b1", "7cb342", "fdd835",
  "546e7a", "6d4c41"
];

const PEDESTAL_BG_LIST = [
  "#E3F2FD", "#FFE8EA", "#E0F8F0", "#FFF4E0", "#EFEFFD",
  "#F2EFE6", "#E0F7FA", "#FCE4EC"
];

// Cuentas verificadas del grupo (sin autos ni planes pre-cargados)
const DEFAULT_ATTENDEES = [
  {
    id: 1, name: "Reyvell", email: "reyvelljk87@gmail.com", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "ffb300", bgColor: "#FFF4E0", eyes: "shade01", face: "round01", mouth: "smile02", top: "radar", sides: "round", texture: "none", flip: false }
  },
  {
    id: 2, name: "Roberto", email: "titorvc08@gmail.com", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "039be5", bgColor: "#E3F2FD", eyes: "eva", face: "square01", mouth: "smile01", top: "glowingBulb01", sides: "cables01", texture: "circuits", flip: false }
  },
  {
    id: 3, name: "Daniel", email: "danielitoestabonito16@gmail.com", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "00897b", bgColor: "#E0F8F0", eyes: "happy", face: "round02", mouth: "grill03", top: "lights", sides: "antenna01", texture: "none", flip: false }
  },
  {
    id: 4, name: "Pinzón", email: "mendoza.lpinzon@gmail.com", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "e53935", bgColor: "#FFE8EA", eyes: "robocop", face: "square02", mouth: "smile01", top: "horns", sides: "cables02", texture: "none", flip: false }
  },
  {
    id: 5, name: "Alejandro", email: "alejandroaltamiranopuc@gmail.com", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "8e24aa", bgColor: "#EFEFFD", eyes: "glow", face: "round01", mouth: "diagram", top: "pyramid", sides: "round", texture: "dots", flip: false }
  },
  {
    id: 6, name: "Erik", email: "joserikb@gmail.com", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "fb8c00", bgColor: "#FFF4E0", eyes: "sensor", face: "square03", mouth: "grill01", top: "antenna", sides: "cables01", texture: "none", flip: false }
  },
  {
    id: 7, name: "Iván", email: "ivan.raygosa@gmail.com", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "00acc1", bgColor: "#E0F7FA", eyes: "roundFrame01", face: "square01", mouth: "smile02", top: "radar", sides: "antenna02", texture: "circuits", flip: false }
  },
  {
    id: 8, name: "Francisco", email: "fjvc091002@gmail.com", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "d81b60", bgColor: "#FCE4EC", eyes: "frame1", face: "round02", mouth: "bite", top: "antennaCrooked", sides: "round", texture: "none", flip: false }
  },
  {
    id: 9, name: "Carlos", email: "cplus.lat@gmail.com", travelMode: null, puedo_dar_coche: 0,
    config: { baseColor: "546e7a", bgColor: "#F2EFE6", eyes: "roundFrame02", face: "square04", mouth: "square01", top: "bulb01", sides: "square", texture: "dots", flip: false }
  }
];

let currentUser = null;
let activeCategory = "eyes";
let attendeesList = [];
let carsList = [];
let collaborations = []; // Inicia 100% vacío, sin modelos ni votos falsos

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  loadState();
  initSwatches();
  renderAll();
  setupEventListeners();
});

// ----------------- Construcción de URL SVG de Robot ----------------- //
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

  return `https://api.dicebear.com/7.x/bottts/svg?${params.toString()}`;
}

// ----------------- Contador Compacto ----------------- //
function initCountdown() {
  const elDays = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMins = document.getElementById("cdMins");

  function update() {
    const now = new Date().getTime();
    const diff = EVENT_DATE - now;
    if (diff <= 0) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    elDays.textContent = String(d);
    elHours.textContent = String(h).padStart(2, "0");
    elMins.textContent = String(m).padStart(2, "0");
  }

  update();
  setInterval(update, 15000);
}

// ----------------- Estado Local (v6 Limpio & Colaborativo) ----------------- //
function loadState() {
  const savedAttendees = localStorage.getItem("posada_attendees_v6");
  attendeesList = savedAttendees ? JSON.parse(savedAttendees) : DEFAULT_ATTENDEES;

  const savedCars = localStorage.getItem("posada_cars_v6");
  carsList = savedCars ? JSON.parse(savedCars) : [];

  const savedCollabs = localStorage.getItem("posada_collabs_v6");
  collaborations = savedCollabs ? JSON.parse(savedCollabs) : [];

  const savedUser = localStorage.getItem("posada_user_v6");
  if (savedUser) {
    const parsed = JSON.parse(savedUser);
    currentUser = attendeesList.find(u => u.email.toLowerCase() === parsed.email.toLowerCase()) || attendeesList[1];
  } else {
    currentUser = attendeesList[1]; // Roberto por defecto, cambiable en 1 toque
  }
}

function saveState() {
  localStorage.setItem("posada_attendees_v6", JSON.stringify(attendeesList));
  localStorage.setItem("posada_cars_v6", JSON.stringify(carsList));
  localStorage.setItem("posada_collabs_v6", JSON.stringify(collaborations));
  if (currentUser) {
    localStorage.setItem("posada_user_v6", JSON.stringify(currentUser));
  }
}

// ----------------- Navegación por Pestañas ----------------- //
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
  renderCollabBoard();
  renderWhosGoing();
  renderTransportSection();
  renderGoogleQuickAccounts();
  syncWorkshopModal();
}

function renderSessionHeader() {
  if (!currentUser) return;
  document.getElementById("navUserAvatar").src = buildRobotUrl(currentUser.config);
  document.getElementById("navUserName").textContent = currentUser.name;
  document.getElementById("navUserEmail").textContent = currentUser.email;
}

// ----------------- 1. PESTAÑA: PENDIENTES Y COLABORACIONES ----------------- //
function renderCollabBoard() {
  const container = document.getElementById("collabBoardContainer");
  const badgeCount = document.getElementById("badgePendientesCount");

  // Contar total de pendientes
  const totalTasks = collaborations.reduce((acc, c) => acc + c.items.length, 0);
  if (badgeCount) badgeCount.textContent = String(collaborations.length);

  container.innerHTML = "";

  if (collaborations.length === 0) {
    container.innerHTML = `
      <div class="empty-board">
        <h3 class="empty-board-title">Aún no hay pendientes registrados</h3>
        <p class="empty-board-desc">
          Todavía no se ha definido comida ni actividades. Entra al chat con <strong>pus.io</strong> y escribe qué te gustaría comer o hacer (por ejemplo: <em>"Quiero comer nachos de pastor"</em>) para que arme la lista y nos dividamos qué llevar.
        </p>
        <button type="button" class="btn btn-pine" onclick="switchTab('tabPusio')">Proponer primera idea en pus.io</button>
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
      const isClaimedByMe = currentUser && item.claimedByEmail === currentUser.email;

      itemsHtml += `
        <div class="task-row ${isClaimed ? 'claimed' : ''}">
          <span class="task-name">${item.name}</span>
          ${
            isClaimed
              ? `<button type="button" class="task-assignee" onclick="toggleClaimItem(${collab.id}, '${item.id}')" title="${isClaimedByMe ? 'Toca para soltar este pendiente' : 'Asignado a ' + item.claimedBy}">
                   <img src="${item.claimedByAvatar}" alt="${item.claimedBy}">
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
          <button type="button" class="modal-close-btn" style="width:26px; height:26px; font-size:0.9rem;" onclick="deleteCollab(${collab.id})" title="Eliminar esta actividad">&times;</button>
        </div>
      </div>

      <div class="checklist-items">
        ${itemsHtml}
      </div>

      <form class="add-subitem-row" onsubmit="addCustomSubItem(event, ${collab.id})">
        <input type="text" class="add-subitem-input" placeholder="+ Agregar otro insumo o pendiente a esta lista..." required>
        <button type="submit" class="btn btn-sm">Sumar</button>
      </form>
    `;

    list.appendChild(card);
  });

  container.appendChild(list);
}

function toggleClaimItem(collabId, itemId) {
  if (!currentUser) {
    openModal("modalAuth");
    return;
  }

  const collab = collaborations.find(c => c.id === collabId);
  if (!collab) return;
  const item = collab.items.find(i => String(i.id) === String(itemId));
  if (!item) return;

  if (item.claimedBy) {
    // Si ya lo tenía el usuario actual (o quiere liberarlo)
    if (item.claimedByEmail === currentUser.email) {
      item.claimedBy = null;
      item.claimedByEmail = null;
      item.claimedByAvatar = null;
      showToast(`Liberaste: ${item.name}`);
    } else {
      // Permitir reasignar si otro lo toma
      item.claimedBy = currentUser.name;
      item.claimedByEmail = currentUser.email;
      item.claimedByAvatar = buildRobotUrl(currentUser.config);
      showToast(`Te anotaste con: ${item.name}`);
    }
  } else {
    item.claimedBy = currentUser.name;
    item.claimedByEmail = currentUser.email;
    item.claimedByAvatar = buildRobotUrl(currentUser.config);
    showToast(`${currentUser.name} lleva: ${item.name}`);
  }

  saveState();
  renderCollabBoard();
}

function addCustomSubItem(e, collabId) {
  e.preventDefault();
  const input = e.target.querySelector("input");
  const val = input.value.trim();
  if (!val) return;

  const collab = collaborations.find(c => c.id === collabId);
  if (!collab) return;

  collab.items.push({
    id: "item_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: val.charAt(0).toUpperCase() + val.slice(1),
    claimedBy: null,
    claimedByEmail: null,
    claimedByAvatar: null
  });

  input.value = "";
  saveState();
  renderCollabBoard();
  showToast(`Insumo agregado a ${collab.title}`);
}

function deleteCollab(collabId) {
  collaborations = collaborations.filter(c => c.id !== collabId);
  saveState();
  renderCollabBoard();
  showToast("Actividad eliminada");
}

// ----------------- 2. PESTAÑA: MOTOR IA PUS.IO (DESGLOSADOR COLABORATIVO) ----------------- //
function handlePusioMessage(rawText) {
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
      author: currentUser ? currentUser.name : "Amigo",
      items: plan.items.map((name, idx) => ({
        id: `t_${Date.now()}_${idx}`,
        name: name,
        claimedBy: null,
        claimedByEmail: null,
        claimedByAvatar: null
      }))
    };

    collaborations.unshift(newCollab);
    saveState();
    renderCollabBoard();

    const itemNames = plan.items.join(", ");
    appendChatMsg(
      `Listo, ${currentUser ? currentUser.name : ''}. Creé "${plan.title}" en la pestaña de Pendientes y lo dividí en: ${itemNames}. Ya pueden tocar cada insumo para repartírselo.`,
      "bot"
    );

    showToast(`Agregado a Pendientes: ${plan.title}`);
  }, 300);
}

// Motor inteligente que desglosa cualquier comida, bebida o actividad en pendientes divisibles
function decomposeProposalIntoTasks(text) {
  const lower = text.toLowerCase();

  // Si es una duda general de fecha/lugar
  if ((lower.startsWith("cuándo") || lower.startsWith("cuando") || lower.startsWith("dónde") || lower.startsWith("donde")) && text.includes("?")) {
    return {
      isActionable: false,
      reply: "La posada es el sábado 19 de diciembre de 2026 en la casa de Reyvell en Chelem. Dime qué te gustaría comer o hacer y armo la lista de pendientes."
    };
  }

  // Recetario y desglosador colaborativo por contexto
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
        "Queso líquido / queso para fundir",
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
        "Aderezos (catsup, mostaza, mayonesa) y papas",
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
        "Chorizo, queso para asar y cebollitas",
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
        "Jugo de limón (1 kg de limones)",
        "Pepino, cebolla morada, cilantro y chile",
        "Tostadas y galletas saladas",
        "Aguacates y salsa marisquera"
      ]
    };
  }

  if (lower.includes("pizza")) {
    return {
      isActionable: true,
      title: "Pizzas para la noche",
      category: "Comida colaborativa",
      items: [
        "Pizzas de pepperoni / carnes frías",
        "Pizzas especiales / hawaiana",
        "Refrescos grandes",
        "Aderezos y servilletas"
      ]
    };
  }

  if (lower.includes("smash") || lower.includes("mario kart") || lower.includes("switch") || lower.includes("torneo") || lower.includes("videojuego")) {
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

  if (lower.includes("hielera") || lower.includes("bebida") || lower.includes("cerveza") || lower.includes("pomo") || lower.includes("hielo") || lower.includes("refresco")) {
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

  if (lower.includes("película") || lower.includes("cine") || lower.includes("proyector")) {
    return {
      isActionable: true,
      title: "Cine nocturno en la terraza",
      category: "Actividad",
      items: [
        "Proyector y cable HDMI",
        "Bocina Bluetooth potente",
        "Laptop con las películas listas",
        "Palomitas y dulces para compartir"
      ]
    };
  }

  // Cualquier otra propuesta abierta: limpiamos el título y generamos pendientes colaborativos
  let cleanTitle = text
    .replace(/^(quiero comer|quiero hacer|quiero|propongo|sugiero|hay que|vamos a|hacer|armar|llevar)\s+/i, "")
    .trim();

  cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
  if (cleanTitle.endsWith(".")) cleanTitle = cleanTitle.slice(0, -1);

  const isFood = lower.includes("comer") || lower.includes("cena") || lower.includes("almuerzo") || lower.includes("botana") || lower.includes("postre");

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
          "Snacks o bebidas durante la dinámica"
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

// ----------------- 3. PESTAÑA: ¿QUIÉNES VAMOS? ----------------- //
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
    tile.title = "Toca para activar o personalizar";

    tile.innerHTML = `
      <div class="friend-tile-avatar" style="background-color: ${person.config.bgColor || '#E3F2FD'};">
        <img src="${buildRobotUrl(person.config)}" alt="${person.name}">
      </div>
      <div>
        <div class="friend-tile-name">${person.name}</div>
        <span class="friend-tile-tag">${statusLabel}</span>
      </div>
    `;

    tile.onclick = () => {
      currentUser = person;
      saveState();
      renderAll();
      openModal("modalWorkshop");
    };

    grid.appendChild(tile);
  });
}

// ----------------- 4. PESTAÑA: TRANSPORTE ----------------- //
function renderTransportSection() {
  const container = document.getElementById("carsContainer");
  container.innerHTML = "";

  if (carsList.length === 0) return;

  const list = document.createElement("div");
  list.className = "collab-list";

  carsList.forEach(car => {
    const isMine = currentUser && car.driverEmail === currentUser.email;
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
  carsList = carsList.filter(c => c.id !== id);
  if (currentUser) currentUser.puedo_dar_coche = 0;
  saveState();
  renderAll();
  showToast("Coche retirado");
}

// ----------------- MODAL 1: INICIO DE SESIÓN GOOGLE 1-TOQUE ----------------- //
function renderGoogleQuickAccounts() {
  const container = document.getElementById("googleQuickList");
  if (!container) return;
  container.innerHTML = "";

  attendeesList.forEach(u => {
    const isMe = currentUser && currentUser.email.toLowerCase() === u.email.toLowerCase();
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `google-account-btn ${isMe ? 'active-acc' : ''}`;

    btn.innerHTML = `
      <div class="acc-left">
        <img class="acc-avatar" src="${buildRobotUrl(u.config)}" style="background:${u.config.bgColor};" alt="${u.name}">
        <div>
          <span class="acc-name">${u.name}</span>
          <span class="acc-mail">${u.email}</span>
        </div>
      </div>
      <span style="font-family:var(--font-mono); font-size:0.68rem; font-weight:700;">${isMe ? 'ACTIVA' : 'ENTRAR'}</span>
    `;

    btn.onclick = () => {
      currentUser = u;
      document.getElementById("authInputName").value = u.name;
      document.getElementById("authInputEmail").value = u.email;
      saveState();
      renderAll();
      closeModal("modalAuth");
      showToast(`Sesión iniciada como ${u.name}`);
    };

    container.appendChild(btn);
  });

  if (currentUser) {
    document.getElementById("authInputName").value = currentUser.name;
    document.getElementById("authInputEmail").value = currentUser.email;
  }
}

// ----------------- MODAL 2: TALLER VISUAL NATIVO DE ROBOT ----------------- //
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
      saveState();
      syncWorkshopModal();
      renderSessionHeader();
      renderWhosGoing();
    };
    chassisWrap.appendChild(btn);
  });

  const customColor = document.createElement("input");
  customColor.type = "color";
  customColor.className = "custom-color-picker";
  customColor.value = "#039be5";
  customColor.addEventListener("input", (e) => {
    if (!currentUser) return;
    currentUser.config.baseColor = e.target.value.replace("#", "");
    saveState();
    syncWorkshopModal();
    renderSessionHeader();
    renderWhosGoing();
  });
  chassisWrap.appendChild(customColor);

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
      saveState();
      syncWorkshopModal();
      renderWhosGoing();
    };
    bgWrap.appendChild(btn);
  });
}

function syncWorkshopModal() {
  if (!currentUser) return;
  const cfg = currentUser.config;

  const previewImg = document.getElementById("avatarPreviewTarget");
  const pedestal = document.getElementById("robotPedestal");
  const nameInput = document.getElementById("workshopNameInput");

  if (previewImg) previewImg.src = buildRobotUrl(cfg);
  if (pedestal) pedestal.style.backgroundColor = cfg.bgColor || "#E3F2FD";
  if (nameInput && document.activeElement !== nameInput) {
    nameInput.value = currentUser.name;
  }

  document.querySelectorAll("#chassisColorSwatches .color-swatch").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.hex === cfg.baseColor);
  });

  document.querySelectorAll("#bgColorSwatches .color-swatch").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.bg === cfg.bgColor);
  });

  renderVisualCatalogGrid();
}

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
      tile.innerHTML = `<span class="tile-none-box">Nada</span>`;
    } else {
      const thumbUrl = buildRobotUrl(cfg, activeCategory, partVal);
      tile.innerHTML = `<img src="${thumbUrl}" alt="${partVal}" loading="lazy">`;
    }

    tile.onclick = () => {
      cfg[activeCategory] = partVal;
      saveState();
      syncWorkshopModal();
      renderSessionHeader();
      renderWhosGoing();
    };

    grid.appendChild(tile);
  });
}

// ----------------- Event Listeners ----------------- //
function setupEventListeners() {
  // Pestañas principales
  document.querySelectorAll(".tab-trigger").forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
  });

  // Modales
  document.getElementById("btnOpenAuthModal").onclick = () => {
    renderGoogleQuickAccounts();
    openModal("modalAuth");
  };

  document.getElementById("btnOpenWorkshopModal").onclick = () => {
    syncWorkshopModal();
    openModal("modalWorkshop");
  };

  document.getElementById("btnOpenCarModal").onclick = () => openModal("modalCar");

  // Registro / edición por nombre y correo Google
  document.getElementById("customAuthForm").onsubmit = (e) => {
    e.preventDefault();
    const nameVal = document.getElementById("authInputName").value.trim();
    const emailVal = document.getElementById("authInputEmail").value.trim().toLowerCase();
    if (!nameVal || !emailVal) return;

    let existing = attendeesList.find(u => u.email.toLowerCase() === emailVal);
    if (existing) {
      existing.name = nameVal;
      currentUser = existing;
    } else {
      const newUser = {
        id: Date.now(),
        name: nameVal,
        email: emailVal,
        travelMode: null,
        puedo_dar_coche: 0,
        config: {
          baseColor: CHASSIS_HEX_LIST[attendeesList.length % CHASSIS_HEX_LIST.length],
          bgColor: PEDESTAL_BG_LIST[attendeesList.length % PEDESTAL_BG_LIST.length],
          eyes: "eva", face: "round01", mouth: "smile01", top: "radar", sides: "round", texture: "none", flip: false
        }
      };
      attendeesList.push(newUser);
      currentUser = newUser;
    }

    saveState();
    renderAll();
    closeModal("modalAuth");
    showToast(`Guardado: ${currentUser.name} (${currentUser.email})`);
  };

  // Pestañas del taller de robot
  document.querySelectorAll("#workshopTabs .part-tab-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll("#workshopTabs .part-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.cat;
      renderVisualCatalogGrid();
    };
  });

  // Nombre en el taller
  document.getElementById("workshopNameInput").addEventListener("input", (e) => {
    if (!currentUser) return;
    const v = e.target.value.trim();
    if (v) {
      currentUser.name = v;
      saveState();
      renderSessionHeader();
      renderWhosGoing();
    }
  });

  document.getElementById("btnRandomRobot").onclick = () => {
    if (!currentUser) return;
    const cfg = currentUser.config;
    cfg.baseColor = CHASSIS_HEX_LIST[Math.floor(Math.random() * CHASSIS_HEX_LIST.length)];
    cfg.bgColor = PEDESTAL_BG_LIST[Math.floor(Math.random() * PEDESTAL_BG_LIST.length)];
    Object.keys(NATIVE_PARTS).forEach(k => {
      const list = NATIVE_PARTS[k];
      cfg[k] = list[Math.floor(Math.random() * list.length)];
    });
    saveState();
    syncWorkshopModal();
    renderSessionHeader();
    renderWhosGoing();
  };

  document.getElementById("btnFlipRobot").onclick = () => {
    if (!currentUser) return;
    currentUser.config.flip = !currentUser.config.flip;
    saveState();
    syncWorkshopModal();
    renderSessionHeader();
    renderWhosGoing();
  };

  document.getElementById("btnSaveWorkshop").onclick = () => {
    closeModal("modalWorkshop");
    showToast(`Robot guardado para ${currentUser ? currentUser.name : ''}`);
  };

  // Confirmar pasajero
  document.getElementById("btnConfirmPassenger").onclick = () => {
    if (!currentUser) return;
    currentUser.travelMode = "passenger";
    currentUser.puedo_dar_coche = 0;
    saveState();
    renderAll();
    showToast(`${currentUser.name} confirmado como pasajero`);
  };

  // Registrar coche
  document.getElementById("carForm").onsubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

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

  // Chat pus.io
  document.getElementById("pusioForm").onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("pusioInput");
    const val = input.value.trim();
    if (val) {
      handlePusioMessage(val);
      input.value = "";
    }
  };

  // Cerrar modales
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

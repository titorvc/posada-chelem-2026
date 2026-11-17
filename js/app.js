/**
 * POSADA CHELEM 2026 // EL PUSIO
 * Frontend Controller & Asistente Integrador pus.io
 * Estilo Jitter: Cero emojis, tipografía limpia, integración reactiva de propuestas
 */

// Fecha del evento: Sábado 19 de Diciembre 2026
const EVENT_DATE = new Date("2026-12-19T15:00:00-06:00").getTime();

// Lista oficial: ¿Quiénes vamos? (Sin parejas, sin Daniel ofreciendo coche aún)
const DEFAULT_ATTENDEES = [
  { id: 1, name: "Reyvell", role: "Anfitrión", email: "reyvelljk87@gmail.com", avatar_seed: "reyvell-host", puedo_dar_coche: 0 },
  { id: 2, name: "Titor", role: "Organizador", email: "titorvc08@gmail.com", avatar_seed: "titor-cyber", puedo_dar_coche: 0 },
  { id: 3, name: "Danielito", role: "Amigo", email: "danielitoestabonito16@gmail.com", avatar_seed: "danielito-bot", puedo_dar_coche: 0 },
  { id: 4, name: "Pinzón", role: "Amigo", email: "mendoza.lpinzon@gmail.com", avatar_seed: "pinzon-wave", puedo_dar_coche: 0 },
  { id: 5, name: "FJVC", role: "Amigo", email: "fjvc091002@gmail.com", avatar_seed: "fjvc-retro", puedo_dar_coche: 0 },
  { id: 6, name: "Alex Altamirano", role: "Amigo", email: "alejandroaltamiranopuc@gmail.com", avatar_seed: "alex-neo", puedo_dar_coche: 0 },
  { id: 7, name: "Erik B.", role: "Amigo", email: "joserikb@gmail.com", avatar_seed: "erik-synth", puedo_dar_coche: 0 },
  { id: 8, name: "Iván Raygosa", role: "Amigo", email: "ivan.raygosa@gmail.com", avatar_seed: "ivan-core", puedo_dar_coche: 0 },
  { id: 9, name: "CPlus", role: "Amigo", email: "cplus.lat@gmail.com", avatar_seed: "cplus-glitch", puedo_dar_coche: 0 }
];

// Opciones iniciales para el plan (no definitivo)
const DEFAULT_PLAN_OPTIONS = [
  {
    id: 1,
    tag: "Torneo",
    tagClass: "berry",
    title: "Torneo de Super Smash Bros Ultimate",
    desc: "Retas en pantalla gigante o proyector en la sala. Partidas 1v1 y modalidad libre.",
    votes: 3
  },
  {
    id: 2,
    tag: "Comida",
    tagClass: "amber",
    title: "Asado en la terraza",
    desc: "Parrillada al atardecer frente al mar en Chelem con hamburguesas y cortes al gusto.",
    votes: 4
  }
];

// Estado local
let currentUser = null;
let attendeesList = [];
let carsList = [];
let planOptions = [];
let userVotes = new Set();

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  loadState();
  renderAll();
  setupEventListeners();
});

// ----------------- Contador de Tiempo ----------------- //
function initCountdown() {
  const elDays = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMins = document.getElementById("cdMins");
  const elSecs = document.getElementById("cdSecs");

  function update() {
    const now = new Date().getTime();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMins.textContent = "00";
      elSecs.textContent = "00";
      return;
    }

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

// ----------------- Carga y Guardado de Estado ----------------- //
function loadState() {
  const savedAttendees = localStorage.getItem("posada_attendees_v2");
  attendeesList = savedAttendees ? JSON.parse(savedAttendees) : DEFAULT_ATTENDEES;

  const savedCars = localStorage.getItem("posada_cars_v2");
  carsList = savedCars ? JSON.parse(savedCars) : [];

  const savedOptions = localStorage.getItem("posada_options_v2");
  planOptions = savedOptions ? JSON.parse(savedOptions) : DEFAULT_PLAN_OPTIONS;

  const savedVotes = localStorage.getItem("posada_votes_v2");
  if (savedVotes) userVotes = new Set(JSON.parse(savedVotes));

  const savedUser = localStorage.getItem("posada_current_user_v2");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  } else {
    currentUser = attendeesList.find(u => u.name === "Titor") || attendeesList[0];
    localStorage.setItem("posada_current_user_v2", JSON.stringify(currentUser));
  }
}

function saveState() {
  localStorage.setItem("posada_attendees_v2", JSON.stringify(attendeesList));
  localStorage.setItem("posada_cars_v2", JSON.stringify(carsList));
  localStorage.setItem("posada_options_v2", JSON.stringify(planOptions));
  localStorage.setItem("posada_votes_v2", JSON.stringify(Array.from(userVotes)));
  if (currentUser) {
    localStorage.setItem("posada_current_user_v2", JSON.stringify(currentUser));
  }
}

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
}

// ----------------- Renderizado ----------------- //
function renderAll() {
  renderUserNav();
  renderWhosGoing();
  renderCars();
  renderPlanOptions();
}

function renderUserNav() {
  const avatarEl = document.getElementById("navUserAvatar");
  const nameEl = document.getElementById("navUserName");
  if (currentUser) {
    avatarEl.src = getAvatarUrl(currentUser.avatar_seed || currentUser.name);
    nameEl.textContent = currentUser.name;
  }
}

function renderWhosGoing() {
  const grid = document.getElementById("whosGoingGrid");
  grid.innerHTML = "";

  attendeesList.forEach(person => {
    const card = document.createElement("div");
    card.className = "person-card";

    const isVIP = person.puedo_dar_coche === 1;

    card.innerHTML = `
      <img class="person-avatar" src="${getAvatarUrl(person.avatar_seed || person.name)}" alt="${person.name}">
      <div class="person-info">
        <div class="person-name">${person.name}</div>
        <div class="person-badge ${isVIP ? 'vip' : ''}">
          ${isVIP ? 'Conductor VIP' : 'Confirmado'}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderCars() {
  const container = document.getElementById("carsContainer");
  container.innerHTML = "";

  if (carsList.length === 0) {
    container.innerHTML = `
      <div class="carpool-empty">
        <div class="carpool-empty-title">Aún no hay autos registrados</div>
        <p class="carpool-empty-desc">
          Si dispones de auto para el traslado Mérida a Chelem, puedes ofrecerlo aquí y gozar de los privilegios de conductor.
        </p>
        <button class="btn btn-secondary btn-sm" id="btnOpenCarModalInner">Registrar auto</button>
      </div>
    `;
    const innerBtn = document.getElementById("btnOpenCarModalInner");
    if (innerBtn) innerBtn.onclick = () => openModal("modalCar");
    return;
  }

  const grid = document.createElement("div");
  grid.className = "options-grid";
  carsList.forEach(car => {
    const isMyCar = currentUser && car.driver === currentUser.name;
    const card = document.createElement("div");
    card.className = "option-card";
    card.innerHTML = `
      <div>
        <div class="option-meta">
          <span class="option-tag teal">Auto disponible</span>
          <span style="font-size:0.75rem; color:var(--text-tertiary);">${car.seats} lugares</span>
        </div>
        <div class="option-title">${car.driver} — ${car.model}</div>
        <div class="option-desc">
          Salida: ${car.zone} (${car.time})<br>
          ${car.notes ? `Nota: ${car.notes}` : ''}
        </div>
      </div>
      <div class="option-action">
        ${
          isMyCar
            ? `<button class="btn btn-secondary btn-sm" style="color:var(--accent-berry);" onclick="retireCar(${car.id})">Retirar auto</button>`
            : `<button class="btn btn-secondary btn-sm" onclick="alert('Lugar solicitado. Coordinar directamente con ${car.driver}.')">Pedir lugar</button>`
        }
      </div>
    `;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

function renderPlanOptions() {
  const grid = document.getElementById("optionsGrid");
  grid.innerHTML = "";

  planOptions.forEach(opt => {
    const voted = userVotes.has(opt.id);
    const card = document.createElement("div");
    card.className = "option-card";
    card.innerHTML = `
      <div>
        <div class="option-meta">
          <span class="option-tag ${opt.tagClass || 'teal'}">${opt.tag}</span>
          <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:600;">${opt.votes} ${opt.votes === 1 ? 'voto' : 'votos'}</span>
        </div>
        <h3 class="option-title">${opt.title}</h3>
        <p class="option-desc">${opt.desc}</p>
      </div>
      <div class="option-action">
        <button class="vote-action-btn ${voted ? 'active' : ''}" onclick="toggleVote(${opt.id})">
          ${voted ? 'Votado' : 'Votar'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ----------------- Votación y Manejo de Autos ----------------- //
function toggleVote(id) {
  const opt = planOptions.find(o => o.id === id);
  if (!opt) return;

  if (userVotes.has(id)) {
    userVotes.delete(id);
    opt.votes = Math.max(0, opt.votes - 1);
  } else {
    userVotes.add(id);
    opt.votes += 1;
  }
  saveState();
  renderPlanOptions();
}

function retireCar(id) {
  carsList = carsList.filter(c => c.id !== id);
  if (currentUser) {
    currentUser.puedo_dar_coche = 0;
    const person = attendeesList.find(u => u.name === currentUser.name);
    if (person) person.puedo_dar_coche = 0;
  }
  saveState();
  renderAll();
}

// ----------------- Generador de Avatares (DiceBear Bottts) ----------------- //
function previewRobotAvatar() {
  const input = document.getElementById("avatarPromptField");
  const img = document.getElementById("avatarPreviewTarget");
  const val = input.value.trim() || (currentUser ? currentUser.name : "robot-chelem");
  img.src = getAvatarUrl(val);
}

function saveRobotAvatar() {
  const input = document.getElementById("avatarPromptField");
  const val = input.value.trim();
  if (!val || !currentUser) return;

  currentUser.avatar_seed = val;
  const person = attendeesList.find(u => u.name === currentUser.name);
  if (person) person.avatar_seed = val;

  saveState();
  renderAll();
  alert(`Robot guardado para ${currentUser.name}`);
}

// ----------------- pus.io: Asistente que Integra Sugerencias ----------------- //
function handlePusioInteraction(message) {
  const text = message.trim();
  if (!text) return;

  addChatMessage(text, "user");

  // Análisis de intención para saber si es una sugerencia / propuesta
  setTimeout(() => {
    const isSuggestion = detectSuggestion(text);
    if (isSuggestion.detected) {
      // Integrar directamente a la página
      const newOption = {
        id: Date.now(),
        tag: isSuggestion.category,
        tagClass: isSuggestion.tagClass,
        title: isSuggestion.title,
        desc: isSuggestion.desc,
        votes: 1
      };

      planOptions.push(newOption);
      userVotes.add(newOption.id);
      saveState();
      renderPlanOptions();

      // Respuesta de pus.io
      const botResponse = `Entendido. He integrado "${isSuggestion.title}" en la sección de opciones del plan con 1 voto inicial para que todos puedan revisarla.`;
      addChatMessage(botResponse, "bot");

      // Scroll suave a las opciones
      const targetSec = document.getElementById("planSection");
      if (targetSec) targetSec.scrollIntoView({ behavior: "smooth" });
    } else {
      // Respuesta conversacional útil
      const reply = generateGeneralReply(text);
      addChatMessage(reply, "bot");
    }
  }, 400);
}

function detectSuggestion(text) {
  const lower = text.toLowerCase();
  const triggerWords = ["propongo", "sugiero", "sugerencia", "llevar", "hacer", "jugar", "podríamos", "comprar", "plan", "película", "peli", "bocina", "cerveza", "botana", "música", "torneo"];
  
  const hasTrigger = triggerWords.some(w => lower.includes(w));

  if (!hasTrigger && text.length < 15) {
    return { detected: false };
  }

  // Extraer categoría y título limpio
  let category = "Propuesta";
  let tagClass = "teal";

  if (lower.includes("comida") || lower.includes("asado") || lower.includes("carne") || lower.includes("hamburguesa") || lower.includes("botana")) {
    category = "Comida";
    tagClass = "amber";
  } else if (lower.includes("película") || lower.includes("cine") || lower.includes("serie") || lower.includes("ver")) {
    category = "Cine";
    tagClass = "teal";
  } else if (lower.includes("juego") || lower.includes("torneo") || lower.includes("smash") || lower.includes("retas")) {
    category = "Actividad";
    tagClass = "berry";
  } else if (lower.includes("bebida") || lower.includes("cerveza") || lower.includes("hielo") || lower.includes("tragos")) {
    category = "Bebidas";
    tagClass = "amber";
  }

  // Formatear título conciso
  let cleanedTitle = text;
  cleanedTitle = cleanedTitle.replace(/^(propongo|sugiero que|podríamos|hay que|sugerencia:?)\s*/i, "");
  cleanedTitle = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);
  if (cleanedTitle.length > 55) {
    cleanedTitle = cleanedTitle.slice(0, 52) + "...";
  }

  return {
    detected: true,
    category: category,
    tagClass: tagClass,
    title: cleanedTitle,
    desc: `Propuesto por ${currentUser ? currentUser.name : 'un amigo'} mediante pus.io.`
  };
}

function generateGeneralReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes("fecha") || lower.includes("cuándo") || lower.includes("hora")) {
    return "La fecha es el sábado 19 de diciembre de 2026 en la casa de Reyvell en Chelem.";
  }
  if (lower.includes("auto") || lower.includes("coche") || lower.includes("carro") || lower.includes("aventón")) {
    return "Puedes registrar tu auto en la sección de rutas. Los conductores quedan exentos del pago de gasolina y tienen beneficios para la posada.";
  }
  if (lower.includes("asistentes") || lower.includes("quién") || lower.includes("quienes")) {
    return "En la sección '¿Quiénes vamos?' está la lista con los 9 amigos confirmados.";
  }
  return "Si tienes alguna propuesta de comida, bebida, juegos o música, escríbela aquí y la integraré directamente a la lista de opciones de la página.";
}

function addChatMessage(text, sender) {
  const area = document.getElementById("pusioChatArea");
  const bubble = document.createElement("div");
  bubble.className = `msg-bubble ${sender}`;
  bubble.textContent = text;
  area.appendChild(bubble);
  area.scrollTop = area.scrollHeight;
}

// ----------------- Event Listeners & Modales ----------------- //
function setupEventListeners() {
  // Cambiar usuario modal
  document.getElementById("btnUserChip").onclick = () => openModal("modalSwitchUser");
  document.getElementById("btnOpenCarModal").onclick = () => openModal("modalCar");

  // Botón para pedir a pus.io que integre propuesta
  document.getElementById("btnAskPusio").onclick = () => {
    const chatInput = document.getElementById("pusioInput");
    chatInput.focus();
    chatInput.placeholder = "Escribe tu propuesta aquí (ej. Propongo llevar proyector para cine)...";
  };

  // Close buttons
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.onclick = () => closeModal(btn.getAttribute("data-close"));
  });

  // Prompt input en tiempo real
  const promptInput = document.getElementById("avatarPromptField");
  if (promptInput) {
    promptInput.addEventListener("input", previewRobotAvatar);
  }

  // Switch user buttons
  renderSwitchUserList();

  // Car form submit
  document.getElementById("carForm").onsubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const newCar = {
      id: Date.now(),
      driver: currentUser.name,
      model: document.getElementById("carInputModel").value.trim(),
      seats: document.getElementById("carInputSeats").value,
      zone: document.getElementById("carInputZone").value.trim(),
      time: document.getElementById("carInputTime").value.trim(),
      notes: document.getElementById("carInputNotes").value.trim()
    };

    carsList.push(newCar);
    currentUser.puedo_dar_coche = 1;
    const person = attendeesList.find(u => u.name === currentUser.name);
    if (person) person.puedo_dar_coche = 1;

    saveState();
    closeModal("modalCar");
    document.getElementById("carForm").reset();
    renderAll();
  };

  // Chat submit
  document.getElementById("pusioForm").onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("pusioInput");
    const val = input.value.trim();
    if (val) {
      handlePusioInteraction(val);
      input.value = "";
    }
  };
}

function renderSwitchUserList() {
  const container = document.getElementById("userSwitchOptions");
  container.innerHTML = "";

  attendeesList.forEach(u => {
    const btn = document.createElement("button");
    btn.className = "btn btn-secondary";
    btn.style.width = "100%";
    btn.style.justifyContent = "flex-start";
    btn.style.marginBottom = "8px";
    btn.innerHTML = `
      <img src="${getAvatarUrl(u.avatar_seed || u.name)}" style="width:26px; height:26px; border-radius:50%;">
      <span>${u.name}</span>
    `;
    btn.onclick = () => {
      currentUser = u;
      saveState();
      renderAll();
      closeModal("modalSwitchUser");
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

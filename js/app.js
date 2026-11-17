/**
 * POSADA CHELEM 2026
 * Controlador Dinámico, Estudio de Identidad & Asistente Integrador pus.io
 * Estética Editorial Clara con Tipografía Serifa Moderna • Cero Emojis
 */

const EVENT_DATE = new Date("2026-12-19T15:00:00-06:00").getTime();

// Lista limpia de amigos confirmados (nombres naturales, editables con 1 clic)
const DEFAULT_ATTENDEES = [
  { id: 1, name: "Reyvell", email: "reyvelljk87@gmail.com", avatar_seed: "reyvell-host", puedo_dar_coche: 0 },
  { id: 2, name: "Roberto", email: "titorvc08@gmail.com", avatar_seed: "roberto-cyber", puedo_dar_coche: 0 },
  { id: 3, name: "Daniel", email: "danielitoestabonito16@gmail.com", avatar_seed: "daniel-wave", puedo_dar_coche: 0 },
  { id: 4, name: "Pinzón", email: "mendoza.lpinzon@gmail.com", avatar_seed: "pinzon-bot", puedo_dar_coche: 0 },
  { id: 5, name: "Alejandro", email: "alejandroaltamiranopuc@gmail.com", avatar_seed: "alejandro-neo", puedo_dar_coche: 0 },
  { id: 6, name: "Erik", email: "joserikb@gmail.com", avatar_seed: "erik-synth", puedo_dar_coche: 0 },
  { id: 7, name: "Iván", email: "ivan.raygosa@gmail.com", avatar_seed: "ivan-core", puedo_dar_coche: 0 },
  { id: 8, name: "Francisco", email: "fjvc091002@gmail.com", avatar_seed: "francisco-retro", puedo_dar_coche: 0 },
  { id: 9, name: "Carlos", email: "cplus.lat@gmail.com", avatar_seed: "carlos-droid", puedo_dar_coche: 0 }
];

// Opciones iniciales abiertas a votación
const DEFAULT_PLAN_OPTIONS = [
  {
    id: 1,
    tag: "Torneo",
    tagClass: "berry",
    title: "Torneo de Super Smash Bros Ultimate",
    desc: "Retas en pantalla grande o proyector en la sala. Eliminatorias 1v1 y partidas abiertas entre todos.",
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

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  loadState();
  renderAll();
  setupEventListeners();
  initScrollReveal();
});

// ----------------- Animación Scroll Reveal ----------------- //
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => observer.observe(el));
}

// ----------------- Notificación Toast ----------------- //
function showToast(msg) {
  const toast = document.getElementById("toastNotice");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
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

// ----------------- Estado Local (v3 limpio) ----------------- //
function loadState() {
  const savedAttendees = localStorage.getItem("posada_attendees_v3");
  attendeesList = savedAttendees ? JSON.parse(savedAttendees) : DEFAULT_ATTENDEES;

  const savedCars = localStorage.getItem("posada_cars_v3");
  carsList = savedCars ? JSON.parse(savedCars) : [];

  const savedOptions = localStorage.getItem("posada_options_v3");
  planOptions = savedOptions ? JSON.parse(savedOptions) : DEFAULT_PLAN_OPTIONS;

  const savedVotes = localStorage.getItem("posada_votes_v3");
  if (savedVotes) userVotes = new Set(JSON.parse(savedVotes));

  const savedUser = localStorage.getItem("posada_current_user_v3");
  if (savedUser) {
    const parsed = JSON.parse(savedUser);
    currentUser = attendeesList.find(u => u.id === parsed.id) || attendeesList[1];
  } else {
    currentUser = attendeesList.find(u => u.name === "Roberto") || attendeesList[0];
    localStorage.setItem("posada_current_user_v3", JSON.stringify(currentUser));
  }
}

function saveState() {
  localStorage.setItem("posada_attendees_v3", JSON.stringify(attendeesList));
  localStorage.setItem("posada_cars_v3", JSON.stringify(carsList));
  localStorage.setItem("posada_options_v3", JSON.stringify(planOptions));
  localStorage.setItem("posada_votes_v3", JSON.stringify(Array.from(userVotes)));
  if (currentUser) {
    localStorage.setItem("posada_current_user_v3", JSON.stringify(currentUser));
  }
}

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
}

// ----------------- Renderizado General ----------------- //
function renderAll() {
  renderUserNav();
  renderWhosGoing();
  renderCars();
  renderPlanOptions();
  syncStudioFields();
  renderSwitchUserList();
}

function renderUserNav() {
  const avatarEl = document.getElementById("navUserAvatar");
  const nameEl = document.getElementById("navUserName");
  if (currentUser) {
    avatarEl.src = getAvatarUrl(currentUser.avatar_seed || currentUser.name);
    nameEl.textContent = currentUser.name;
  }
}

function syncStudioFields() {
  if (!currentUser) return;
  const studioName = document.getElementById("studioCurrentName");
  const nameInput = document.getElementById("nameEditField");
  const promptInput = document.getElementById("avatarPromptField");
  const previewImg = document.getElementById("avatarPreviewTarget");

  if (studioName) studioName.textContent = currentUser.name;
  if (nameInput) nameInput.value = currentUser.name;
  if (promptInput) promptInput.value = currentUser.avatar_seed || currentUser.name;
  if (previewImg) previewImg.src = getAvatarUrl(currentUser.avatar_seed || currentUser.name);
}

function renderWhosGoing() {
  const grid = document.getElementById("whosGoingGrid");
  grid.innerHTML = "";

  attendeesList.forEach(person => {
    const isCurrent = currentUser && currentUser.id === person.id;
    const isVIP = person.puedo_dar_coche === 1;

    const card = document.createElement("div");
    card.className = `person-card ${isCurrent ? 'is-current' : ''}`;
    card.title = "Haz clic para seleccionar este perfil o personalizar su nombre y robot";

    card.innerHTML = `
      <div class="person-avatar-box">
        <img class="person-avatar" src="${getAvatarUrl(person.avatar_seed || person.name)}" alt="${person.name}">
      </div>
      <div class="person-info">
        <div class="person-name">${person.name}</div>
        <div class="person-meta">
          <span class="status-pill ${isVIP ? 'status-vip' : 'status-confirmed'}">
            ${isVIP ? 'Conductor VIP' : 'Confirmado'}
          </span>
          <span class="edit-hint">${isCurrent ? 'Tu perfil' : 'Seleccionar'}</span>
        </div>
      </div>
    `;

    card.onclick = () => {
      currentUser = person;
      saveState();
      renderAll();
      showToast(`Perfil activo: ${person.name}`);
      const studio = document.getElementById("avatarSection");
      if (studio) studio.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    grid.appendChild(card);
  });
}

function renderCars() {
  const container = document.getElementById("carsContainer");
  container.innerHTML = "";

  if (carsList.length === 0) {
    container.innerHTML = `
      <div class="carpool-empty-state">
        <span class="empty-kicker">Disponibilidad abierta</span>
        <h3 class="empty-headline">Ningún coche registrado por ahora</h3>
        <p class="empty-copy">
          La lista de transporte se irá armando conforme confirmemos quién puede llevar auto a Chelem. Si decides llevar el tuyo, activas automáticamente los privilegios de conductor.
        </p>
        <button class="btn btn-outline" id="btnOpenCarModalInner">Ofrecer mi coche</button>
      </div>
    `;
    const innerBtn = document.getElementById("btnOpenCarModalInner");
    if (innerBtn) innerBtn.onclick = () => openModal("modalCar");
    return;
  }

  const listWrap = document.createElement("div");
  listWrap.style.display = "flex";
  listWrap.style.flexDirection = "column";
  listWrap.style.gap = "16px";

  carsList.forEach(car => {
    const isMyCar = currentUser && car.driverId === currentUser.id;
    const item = document.createElement("div");
    item.style.background = "var(--bg-page)";
    item.style.border = "1px solid var(--border-light)";
    item.style.borderRadius = "var(--radius-md)";
    item.style.padding = "22px";

    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
        <h4 style="font-family:var(--font-serif); font-size:1.75rem; font-weight:400;">${car.driver} &mdash; ${car.model}</h4>
        <span class="cat-pill teal">${car.seats} lugares libres</span>
      </div>
      <p style="font-size:0.92rem; color:var(--ink-500); margin-bottom:16px;">
        Salida desde <strong>${car.zone}</strong> a las <strong>${car.time}</strong>
        ${car.notes ? `<br>Nota: ${car.notes}` : ''}
      </p>
      <div style="display:flex; justify-content:flex-end;">
        ${
          isMyCar
            ? `<button class="btn btn-outline btn-sm" onclick="retireCar(${car.id})">Retirar mi coche</button>`
            : `<button class="btn btn-dark btn-sm" onclick="requestSeat('${car.driver}')">Apartar lugar</button>`
        }
      </div>
    `;
    listWrap.appendChild(item);
  });

  container.appendChild(listWrap);
}

function requestSeat(driverName) {
  showToast(`Solicitud enviada para ir con ${driverName}`);
}

function renderPlanOptions(newlyAddedId = null) {
  const grid = document.getElementById("optionsGrid");
  grid.innerHTML = "";

  const maxVotes = Math.max(5, ...planOptions.map(o => o.votes));

  planOptions.forEach(opt => {
    const voted = userVotes.has(opt.id);
    const pct = Math.min(100, Math.round((opt.votes / maxVotes) * 100));

    const card = document.createElement("div");
    card.className = `option-card ${opt.id === newlyAddedId ? 'just-added' : ''}`;

    card.innerHTML = `
      <div>
        <div class="option-top">
          <span class="cat-pill ${opt.tagClass || 'teal'}">${opt.tag}</span>
          <span class="vote-counter-big">${opt.votes} ${opt.votes === 1 ? 'voto' : 'votos'}</span>
        </div>
        <h3 class="option-title">${opt.title}</h3>
        <p class="option-desc">${opt.desc}</p>
      </div>
      <div>
        <div class="vote-bar-track">
          <div class="vote-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="option-footer">
          <span style="font-family:var(--font-mono); font-size:0.74rem; color:var(--ink-400);">
            ${voted ? 'Respaldado por ti' : 'Opción abierta'}
          </span>
          <button class="vote-btn ${voted ? 'active' : ''}" onclick="toggleVote(${opt.id})">
            ${voted ? 'Votado' : 'Votar opción'}
          </button>
        </div>
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
    showToast(`Voto retirado de: ${opt.title}`);
  } else {
    userVotes.add(id);
    opt.votes += 1;
    showToast(`Voto sumado a: ${opt.title}`);
  }
  saveState();
  renderPlanOptions();
}

function retireCar(id) {
  carsList = carsList.filter(c => c.id !== id);
  if (currentUser) {
    currentUser.puedo_dar_coche = 0;
    const person = attendeesList.find(u => u.id === currentUser.id);
    if (person) person.puedo_dar_coche = 0;
  }
  saveState();
  renderAll();
  showToast("Tu coche fue retirado de la lista");
}

// ----------------- Estudio de Robot y Nombre ----------------- //
function previewRobotAvatar() {
  const input = document.getElementById("avatarPromptField");
  const img = document.getElementById("avatarPreviewTarget");
  const val = input.value.trim() || (currentUser ? currentUser.name : "chelem-bot");
  img.src = getAvatarUrl(val);
}

function saveProfileAndAvatar() {
  if (!currentUser) return;
  const nameInput = document.getElementById("nameEditField");
  const promptInput = document.getElementById("avatarPromptField");

  const newName = nameInput.value.trim();
  const newSeed = promptInput.value.trim();

  if (newName) {
    currentUser.name = newName;
  }
  if (newSeed) {
    currentUser.avatar_seed = newSeed;
  }

  const person = attendeesList.find(u => u.id === currentUser.id);
  if (person) {
    if (newName) person.name = newName;
    if (newSeed) person.avatar_seed = newSeed;
  }

  saveState();
  renderAll();
  showToast(`Perfil actualizado: ${currentUser.name}`);
}

// ----------------- pus.io: Integrador Automático de Sugerencias ----------------- //
function handlePusioInteraction(message) {
  const text = message.trim();
  if (!text) return;

  addChatMessage(text, "user");

  setTimeout(() => {
    const parsed = parseSuggestionForPage(text);
    if (parsed.isProposal) {
      const newOption = {
        id: Date.now(),
        tag: parsed.category,
        tagClass: parsed.tagClass,
        title: parsed.title,
        desc: parsed.desc,
        votes: 1
      };

      planOptions.push(newOption);
      userVotes.add(newOption.id);
      saveState();
      renderPlanOptions(newOption.id);

      const botReply = `Listo, ${currentUser ? currentUser.name : ''}. He integrado "${parsed.title}" como una nueva tarjeta en la sección de opciones del plan para que todos la voten.`;
      addChatMessage(botReply, "bot");
      showToast(`Propuesta integrada: ${parsed.title}`);
    } else {
      const reply = generateConversationalReply(text);
      addChatMessage(reply, "bot");
    }
  }, 350);
}

function parseSuggestionForPage(text) {
  const lower = text.toLowerCase();
  const questionStarters = ["cuándo", "cuando", "a qué hora", "donde", "dónde", "quiénes", "quienes"];
  const isPureQuestion = questionStarters.some(q => lower.startsWith(q)) && text.includes("?");

  if (isPureQuestion) {
    return { isProposal: false };
  }

  if (text.length < 4) {
    return { isProposal: false };
  }

  let category = "Propuesta";
  let tagClass = "teal";

  if (lower.includes("comida") || lower.includes("asado") || lower.includes("carne") || lower.includes("ceviche") || lower.includes("hamburguesa") || lower.includes("botana") || lower.includes("cenar") || lower.includes("pizza") || lower.includes("tacos")) {
    category = "Comida";
    tagClass = "amber";
  } else if (lower.includes("película") || lower.includes("cine") || lower.includes("serie") || lower.includes("proyectar")) {
    category = "Cine";
    tagClass = "teal";
  } else if (lower.includes("juego") || lower.includes("torneo") || lower.includes("smash") || lower.includes("mario") || lower.includes("reta") || lower.includes("cartas") || lower.includes("poker")) {
    category = "Dinámica";
    tagClass = "berry";
  } else if (lower.includes("bebida") || lower.includes("cerveza") || lower.includes("hielera") || lower.includes("hielo") || lower.includes("refresco") || lower.includes("trago")) {
    category = "Bebidas";
    tagClass = "pine";
  }

  let cleanedTitle = text
    .replace(/^(propongo|sugiero que|sugiero|podríamos|hay que|idea:|sugerencia:|llevar|armar)\s+/i, "")
    .trim();

  cleanedTitle = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);
  if (cleanedTitle.endsWith(".")) cleanedTitle = cleanedTitle.slice(0, -1);

  return {
    isProposal: true,
    category: category,
    tagClass: tagClass,
    title: cleanedTitle,
    desc: `Propuesta integrada por ${currentUser ? currentUser.name : 'un amigo'} a través del asistente pus.io.`
  };
}

function generateConversationalReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes("fecha") || lower.includes("cuándo") || lower.includes("cuando") || lower.includes("hora")) {
    return "La posada es el sábado 19 de diciembre de 2026 en la casa de Reyvell en Chelem.";
  }
  if (lower.includes("donde") || lower.includes("dónde")) {
    return "La sede es la casa de playa de Reyvell en Chelem, Yucatán.";
  }
  return "Escribe cualquier idea de actividad, comida, bebida o juego y la añadiré automáticamente a las tarjetas de votación de la página.";
}

function addChatMessage(text, sender) {
  const area = document.getElementById("pusioChatArea");
  const bubble = document.createElement("div");
  bubble.className = `msg-bubble ${sender}`;
  bubble.textContent = text;
  area.appendChild(bubble);
  area.scrollTop = area.scrollHeight;
}

// ----------------- Event Listeners ----------------- //
function setupEventListeners() {
  document.getElementById("btnUserChip").onclick = () => openModal("modalSwitchUser");
  document.getElementById("btnOpenCarModal").onclick = () => openModal("modalCar");

  document.getElementById("btnAskPusio").onclick = () => {
    const section = document.getElementById("pusioSection");
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const chatInput = document.getElementById("pusioInput");
      if (chatInput) chatInput.focus();
    }, 450);
  };

  // Chips rápidos de pus.io
  document.querySelectorAll(".quick-chip").forEach(chip => {
    chip.onclick = () => {
      const ideaText = chip.getAttribute("data-idea");
      if (ideaText) handlePusioInteraction(ideaText);
    };
  });

  // Botones de estilos rápidos de robot
  document.querySelectorAll(".preset-btn[data-prompt]").forEach(btn => {
    btn.onclick = () => {
      const preset = btn.getAttribute("data-prompt");
      const promptInput = document.getElementById("avatarPromptField");
      if (promptInput && currentUser) {
        promptInput.value = `${currentUser.name.toLowerCase()}-${preset}`;
        previewRobotAvatar();
      }
    };
  });

  // Botón de robot aleatorio
  const randomBtn = document.getElementById("btnRandomRobot");
  if (randomBtn) {
    randomBtn.onclick = () => {
      const randomSeed = `bot-chelem-${Math.floor(1000 + Math.random() * 9000)}`;
      const promptInput = document.getElementById("avatarPromptField");
      if (promptInput) {
        promptInput.value = randomSeed;
        previewRobotAvatar();
      }
    };
  }

  // Cerrar modales
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.onclick = () => closeModal(btn.getAttribute("data-close"));
  });

  // Vista previa en tiempo real al escribir prompt
  const promptInput = document.getElementById("avatarPromptField");
  if (promptInput) {
    promptInput.addEventListener("input", previewRobotAvatar);
  }

  // Formulario de auto
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
    const person = attendeesList.find(u => u.id === currentUser.id);
    if (person) person.puedo_dar_coche = 1;

    saveState();
    closeModal("modalCar");
    document.getElementById("carForm").reset();
    renderAll();
    showToast(`Coche registrado y privilegios VIP activados para ${currentUser.name}`);
  };

  // Formulario de pus.io
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
  if (!container) return;
  container.innerHTML = "";

  attendeesList.forEach(u => {
    const isMe = currentUser && currentUser.id === u.id;
    const btn = document.createElement("button");
    btn.className = isMe ? "btn btn-dark" : "btn btn-outline";
    btn.style.width = "100%";
    btn.style.justifyContent = "space-between";
    btn.style.marginBottom = "8px";
    btn.innerHTML = `
      <span style="display:flex; align-items:center; gap:12px;">
        <img src="${getAvatarUrl(u.avatar_seed || u.name)}" style="width:28px; height:28px; border-radius:50%; background:var(--bg-Cream);">
        <span style="font-family:var(--font-serif); font-size:1.35rem; font-weight:400;">${u.name}</span>
      </span>
      <span style="font-family:var(--font-mono); font-size:0.72rem; opacity:0.7;">${isMe ? 'ACTIVO' : 'ELEGIR'}</span>
    `;
    btn.onclick = () => {
      currentUser = u;
      saveState();
      renderAll();
      closeModal("modalSwitchUser");
      showToast(`Hola, ${u.name}`);
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

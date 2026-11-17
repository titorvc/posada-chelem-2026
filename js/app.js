/**
 * POSADA CHELEM 2026 // EL PUSIO
 * Frontend Serverless Controller & Pus.io AI Assistant
 */

// Fecha del evento: Sábado 19 de Diciembre 2026
const EVENT_DATE = new Date("2026-12-19T15:00:00-06:00").getTime();

// Banda inicial (solo los amigos reales, sin parejas)
const DEFAULT_BANDA = [
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

// Opciones iniciales de plan (no definitivo)
const DEFAULT_IDEAS = [
  {
    id: 1,
    category: "Torneo",
    badgeClass: "badge-smash",
    title: "🎮 Torneo de Super Smash Bros Ultimate",
    desc: "Retas en pantalla gigante / proyector en la sala o terraza. Bracket 1v1 y partidas caóticas de 8 jugadores.",
    votes: 3
  },
  {
    id: 2,
    category: "Comida",
    badgeClass: "badge-asado",
    title: "🥩 Asado Playero & Hamburguesas al Carbón",
    desc: "Parrillada al atardecer frente al mar en la terraza de Chelem con carne asada, chorizo y opciones al gusto.",
    votes: 4
  }
];

// Estado local
let currentUser = null;
let bandaList = [];
let carsList = [];
let ideasList = [];
let userVotes = new Set();

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  loadState();
  renderAll();
  setupEventListeners();
});

// ----------------- Contador ----------------- //
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

// ----------------- Estado y Persistencia ----------------- //
function loadState() {
  // Cargar banda
  const savedBanda = localStorage.getItem("chelem_banda");
  bandaList = savedBanda ? JSON.parse(savedBanda) : DEFAULT_BANDA;

  // Cargar autos (inicia vacío)
  const savedCars = localStorage.getItem("chelem_cars");
  carsList = savedCars ? JSON.parse(savedCars) : [];

  // Cargar ideas
  const savedIdeas = localStorage.getItem("chelem_ideas");
  ideasList = savedIdeas ? JSON.parse(savedIdeas) : DEFAULT_IDEAS;

  // Cargar votos del usuario
  const savedVotes = localStorage.getItem("chelem_votes");
  if (savedVotes) userVotes = new Set(JSON.parse(savedVotes));

  // Cargar usuario actual (o por defecto Titor)
  const savedUser = localStorage.getItem("chelem_user");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  } else {
    currentUser = bandaList.find(u => u.name === "Titor") || bandaList[0];
    localStorage.setItem("chelem_user", JSON.stringify(currentUser));
  }
}

function saveState() {
  localStorage.setItem("chelem_banda", JSON.stringify(bandaList));
  localStorage.setItem("chelem_cars", JSON.stringify(carsList));
  localStorage.setItem("chelem_ideas", JSON.stringify(ideasList));
  localStorage.setItem("chelem_votes", JSON.stringify(Array.from(userVotes)));
  if (currentUser) {
    localStorage.setItem("chelem_user", JSON.stringify(currentUser));
  }
}

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
}

// ----------------- Renderizado ----------------- //
function renderAll() {
  renderUserNav();
  renderBanda();
  renderCars();
  renderIdeas();
}

function renderUserNav() {
  const avatarEl = document.getElementById("navUserAvatar");
  const nameEl = document.getElementById("navUserName");
  if (currentUser) {
    avatarEl.src = getAvatarUrl(currentUser.avatar_seed || currentUser.name);
    nameEl.textContent = currentUser.name;
  }
}

function renderBanda() {
  const grid = document.getElementById("bandaGrid");
  grid.innerHTML = "";

  bandaList.forEach(amigo => {
    const card = document.createElement("div");
    card.className = "banda-card";

    const isVIPDriver = amigo.puedo_dar_coche === 1;

    card.innerHTML = `
      <div class="banda-avatar-wrap">
        <img class="banda-avatar" src="${getAvatarUrl(amigo.avatar_seed || amigo.name)}" alt="${amigo.name}">
      </div>
      <div class="banda-name">${amigo.name}</div>
      <div style="margin-top:6px;">
        ${
          isVIPDriver 
            ? `<span class="banda-tag tag-vip-driver" title="Privilegios activos: Gasolina libre, voto de oro, siembra en Smash">🚗 Conductor VIP ★</span>`
            : `<span class="banda-tag tag-confirmed">✓ Confirmado</span>`
        }
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
      <div class="carpool-empty-box">
        <div class="carpool-empty-icon">🚗🏖️</div>
        <div class="carpool-empty-title">Aún no hay autos registrados</div>
        <p class="carpool-empty-text">
          El plan se está armando poco a poco. Si puedes llevar tu coche para el viaje Mérida ⇄ Chelem, regístralo aquí y aprovecha los privilegios oficiales.
        </p>
        <button class="btn btn-primary" id="btnOpenCarModalInside">+ Ofrecer mi coche</button>
      </div>
    `;
    const btn = document.getElementById("btnOpenCarModalInside");
    if (btn) btn.onclick = () => openModal("modalCar");
    return;
  }

  // Si hay autos registrados
  const grid = document.createElement("div");
  grid.className = "ideas-grid";
  carsList.forEach(c => {
    const isMyCar = currentUser && c.driver === currentUser.name;
    const card = document.createElement("div");
    card.className = "idea-card";
    card.innerHTML = `
      <div>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <img src="${getAvatarUrl(c.driver)}" style="width:40px; height:40px; border-radius:50%; background:#1b263b;">
          <div>
            <div style="font-family:var(--font-title); font-weight:700;">${c.driver}</div>
            <div style="font-size:0.8rem; color:var(--chelem-teal);">${c.model}</div>
          </div>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">
          📍 Salida: <strong>${c.zone}</strong> (${c.time})<br>
          💺 Lugares disponibles: <strong>${c.seats}</strong>
        </p>
        ${c.notes ? `<p style="font-size:0.8rem; color:var(--text-dim); font-style:italic;">"${c.notes}"</p>` : ''}
      </div>
      <div class="idea-footer" style="margin-top:14px;">
        ${
          isMyCar 
            ? `<button class="btn btn-secondary btn-sm" style="color:var(--berry-festive);" onclick="retireMyCar(${c.id})">✕ Retirar auto</button>`
            : `<button class="btn btn-primary btn-sm" onclick="alert('¡Apartado! Coordinando con ${c.driver}.')">Pedir aventón</button>`
        }
      </div>
    `;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

function renderIdeas() {
  const grid = document.getElementById("ideasGrid");
  grid.innerHTML = "";

  ideasList.forEach(idea => {
    const hasVoted = userVotes.has(idea.id);
    const card = document.createElement("div");
    card.className = "idea-card";
    card.innerHTML = `
      <div>
        <span class="idea-badge ${idea.badgeClass || 'badge-smash'}">${idea.category}</span>
        <h4 class="idea-title">${idea.title}</h4>
        <p class="idea-desc">${idea.desc}</p>
      </div>
      <div class="idea-footer">
        <span style="font-size:0.85rem; color:var(--text-dim); font-weight:600;">${idea.votes} ${idea.votes === 1 ? 'voto' : 'votos'}</span>
        <button class="vote-btn ${hasVoted ? 'voted' : ''}" onclick="toggleVoteIdea(${idea.id})">
          ${hasVoted ? '❤️ Votado' : '🤍 Votar opción'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ----------------- Votación y Acciones ----------------- //
function toggleVoteIdea(id) {
  const idea = ideasList.find(i => i.id === id);
  if (!idea) return;

  if (userVotes.has(id)) {
    userVotes.delete(id);
    idea.votes = Math.max(0, idea.votes - 1);
  } else {
    userVotes.add(id);
    idea.votes += 1;
  }
  saveState();
  renderIdeas();
}

function retireMyCar(carId) {
  carsList = carsList.filter(c => c.id !== carId);
  if (currentUser) {
    currentUser.puedo_dar_coche = 0;
    const amigo = bandaList.find(u => u.name === currentUser.name);
    if (amigo) amigo.puedo_dar_coche = 0;
  }
  saveState();
  renderAll();
}

// ----------------- Customizador de Avatar Robot ----------------- //
function updateAvatarPreview() {
  const promptInput = document.getElementById("avatarPromptInput");
  const previewImg = document.getElementById("avatarPreviewImg");
  const val = promptInput.value.trim() || (currentUser ? currentUser.name : "robot-pusio");
  previewImg.src = getAvatarUrl(val);
}

function applyCustomAvatar() {
  const promptInput = document.getElementById("avatarPromptInput");
  const val = promptInput.value.trim();
  if (!val || !currentUser) return;

  currentUser.avatar_seed = val;
  const amigo = bandaList.find(u => u.name === currentUser.name);
  if (amigo) amigo.avatar_seed = val;

  saveState();
  renderAll();
  closeModal("modalAvatar");
  alert(`¡Robotito actualizado para ${currentUser.name}!`);
}

// ----------------- Event Listeners & Modals ----------------- //
function setupEventListeners() {
  // Modal openers
  document.getElementById("btnChangeUser").onclick = () => openModal("modalSwitchUser");
  document.getElementById("btnOpenCarModal").onclick = () => openModal("modalCar");
  document.getElementById("btnOpenIdeaModal").onclick = () => openModal("modalIdea");
  document.getElementById("btnOpenAvatarModal").onclick = () => {
    document.getElementById("avatarPromptInput").value = currentUser ? (currentUser.avatar_seed || currentUser.name) : "";
    updateAvatarPreview();
    openModal("modalAvatar");
  };

  // Close modals
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.onclick = () => closeModal(btn.getAttribute("data-close"));
  });

  // Avatar prompt input real-time preview
  const avatarInput = document.getElementById("avatarPromptInput");
  if (avatarInput) {
    avatarInput.addEventListener("input", updateAvatarPreview);
  }

  // Quick switch user buttons
  renderSwitchUserButtons();

  // Car form submit
  document.getElementById("carForm").onsubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const newCar = {
      id: Date.now(),
      driver: currentUser.name,
      model: document.getElementById("inputCarModel").value.trim(),
      seats: document.getElementById("inputCarSeats").value,
      zone: document.getElementById("inputCarZone").value.trim(),
      time: document.getElementById("inputCarTime").value.trim(),
      notes: document.getElementById("inputCarNotes").value.trim()
    };

    carsList.push(newCar);
    currentUser.puedo_dar_coche = 1;
    const amigo = bandaList.find(u => u.name === currentUser.name);
    if (amigo) amigo.puedo_dar_coche = 1;

    saveState();
    closeModal("modalCar");
    document.getElementById("carForm").reset();
    renderAll();
  };

  // Idea form submit
  document.getElementById("ideaForm").onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById("inputIdeaTitle").value.trim();
    const desc = document.getElementById("inputIdeaDesc").value.trim();
    const cat = document.getElementById("inputIdeaCat").value;

    if (!title) return;

    const newIdea = {
      id: Date.now(),
      category: cat,
      badgeClass: cat === "Comida" ? "badge-asado" : cat === "Cine" ? "badge-cine" : "badge-smash",
      title: title,
      desc: desc || "Propuesta añadida por un amigo para disfrutar en Chelem.",
      votes: 1
    };

    ideasList.push(newIdea);
    userVotes.add(newIdea.id);
    saveState();
    closeModal("modalIdea");
    document.getElementById("ideaForm").reset();
    renderIdeas();
  };

  // Chat submit
  document.getElementById("chatForm").onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();
    if (!msg) return;

    addChatBubble(msg, "user");
    input.value = "";

    // Respuesta divertida e ingeniosa de Pus.io
    setTimeout(() => {
      const reply = generatePusioReply(msg);
      addChatBubble(reply, "bot");
    }, 450);
  };
}

function renderSwitchUserButtons() {
  const container = document.getElementById("userSwitchList");
  container.innerHTML = "";

  bandaList.forEach(u => {
    const btn = document.createElement("button");
    btn.className = "btn btn-secondary";
    btn.style.width = "100%";
    btn.style.justifyContent = "flex-start";
    btn.style.marginBottom = "8px";
    btn.innerHTML = `
      <img src="${getAvatarUrl(u.avatar_seed || u.name)}" style="width:28px; height:28px; border-radius:50%;">
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

function addChatBubble(text, sender) {
  const box = document.getElementById("chatMessages");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  box.appendChild(bubble);
  box.scrollTop = box.scrollHeight;
}

function generatePusioReply(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes("smash")) {
    return "¡Las retas de Smash son casi obligatorias! En la terraza de Chelem con proyector se arman épicas. Ya voté por esa opción.";
  }
  if (lower.includes("asado") || lower.includes("carne") || lower.includes("hamburguesa")) {
    return "El asado al carbón frente al mar de Chelem nunca falla. La brisa marina con una smash burger en mano es el plan perfecto.";
  }
  if (lower.includes("coche") || lower.includes("auto") || lower.includes("carro") || lower.includes("carpool")) {
    return "Quien lleve su auto a Chelem goza del estatuto de Conductor VIP: gasolina libre pagada por los pasajeros, voto de oro en pelis y siembra en Smash.";
  }
  if (lower.includes("fecha") || lower.includes("cuándo") || lower.includes("dia")) {
    return "La fecha oficial es el sábado 19 de diciembre de 2026 en la casa de Reyvell en Chelem Puerto.";
  }
  return `¡Qué pasó ${currentUser ? currentUser.name : 'amigo'}! Aquí Pus.io. Todo el plan lo estamos armando poco a poco entre todos. Si tienes una propuesta, agrégala arriba en la sección del plan.`;
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

/**
 * POSADA 2026 // EL PUSIO EN CHELEM
 * Frontend Reactive Controller & Pus.io AI Client
 */

// Event date: Dec 19, 2026 15:00:00 (Mérida / Chelem local time)
const EVENT_DATE = new Date("2026-12-19T15:00:00-06:00").getTime();

// State
let currentUser = null;
let attendeesList = [];
let carsList = [];
let ideasList = [];
let moviesList = [];

// DOM Elements
const userProfileEl = document.getElementById("userProfile");
const loginPromptEl = document.getElementById("loginPrompt");
const userAvatarEl = document.getElementById("userAvatar");
const userNameEl = document.getElementById("userName");
const userEmailEl = document.getElementById("userEmail");
const btnSwitchUser = document.getElementById("btnSwitchUser");
const btnOpenLoginModal = document.getElementById("btnOpenLoginModal");

// Modals
const modalLogin = document.getElementById("modalLogin");
const modalCar = document.getElementById("modalCar");
const modalIdea = document.getElementById("modalIdea");
const modalMovie = document.getElementById("modalMovie");

// Initial Startup
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initAuth();
  loadAllData();
  setupEventListeners();
});

// ----------------- Countdown Timer ----------------- //
function initCountdown() {
  const elDays = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMins = document.getElementById("cdMins");
  const elSecs = document.getElementById("cdSecs");

  function update() {
    const now = new Date().getTime();
    const distance = EVENT_DATE - now;

    if (distance < 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMins.textContent = "00";
      elSecs.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    elDays.textContent = String(days).padStart(2, "0");
    elHours.textContent = String(hours).padStart(2, "0");
    elMins.textContent = String(mins).padStart(2, "0");
    elSecs.textContent = String(secs).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ----------------- Auth & Session ----------------- //
function initAuth() {
  const savedUser = localStorage.getItem("pusio_user");
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      renderUserSession();
    } catch (e) {
      localStorage.removeItem("pusio_user");
    }
  } else {
    // Default auto-login to Roberto (Titor) for convenience
    loginWithEmail("titorvc08@gmail.com", "Roberto Vargas (Titor)");
  }
}

function renderUserSession() {
  if (currentUser) {
    userAvatarEl.src = currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`;
    userNameEl.textContent = currentUser.alias || currentUser.name || "Pusio Member";
    userEmailEl.textContent = currentUser.email;

    userProfileEl.classList.remove("hidden");
    loginPromptEl.classList.add("hidden");
  } else {
    userProfileEl.classList.add("hidden");
    loginPromptEl.classList.remove("hidden");
  }
}

async function loginWithEmail(email, name = null) {
  try {
    const res = await fetch("/api/session/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name })
    });
    const data = await res.json();
    if (data.status === "ok") {
      currentUser = data.user;
      localStorage.setItem("pusio_user", JSON.stringify(currentUser));
      renderUserSession();
      closeModal("modalLogin");
      loadAllData();
    }
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
  }
}

// ----------------- Data Fetching ----------------- //
async function loadAllData() {
  await Promise.all([
    fetchStatus(),
    fetchAttendees(),
    fetchCars(),
    fetchIdeas(),
    fetchMovies()
  ]);
}

async function fetchStatus() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();
    if (data.status === "online" && data.metrics) {
      document.getElementById("metricAttendees").textContent = data.metrics.attendees_registered;
      document.getElementById("metricCars").textContent = data.metrics.cars_offered;
      document.getElementById("metricIdeas").textContent = data.metrics.ideas_proposed;
      document.getElementById("metricVotes").textContent = data.metrics.total_votes_cast;
    }
  } catch (e) {
    console.error("Error cargando status:", e);
  }
}

async function fetchAttendees() {
  try {
    const res = await fetch("/api/attendees");
    attendeesList = await res.json();
    renderAttendees();
    renderQuickLoginList();
  } catch (e) {
    console.error("Error cargando asistentes:", e);
  }
}

function renderAttendees() {
  const tbody = document.getElementById("attendeesTableBody");
  tbody.innerHTML = "";

  attendeesList.forEach(a => {
    const tr = document.createElement("tr");
    const isCouple = a.modalidad && a.modalidad.toLowerCase().includes("pareja");
    const canGiveHouse = a.puedo_dar_casa === 1;
    const canGiveCar = a.puedo_dar_coche === 1;

    tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${a.avatar_url}" style="width:28px; height:28px; border-radius:50%; border:1px solid #262c38;">
          <div>
            <strong>${a.alias || a.name}</strong>
            ${canGiveCar ? '<span style="color:var(--accent-gold); font-size:0.75rem; font-weight:700; margin-left:6px;">★ VIP</span>' : ''}
          </div>
        </div>
      </td>
      <td style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">${a.email}</td>
      <td>
        <span class="pill-status ${isCouple ? 'pill-gold' : ''}">
          ${isCouple ? '👥 Parejas' : '👤 Solo io'}
        </span>
      </td>
      <td>
        <span class="pill-status ${canGiveHouse ? 'pill-green' : ''}">
          ${canGiveHouse ? '🏠 Sí, puedo dar casa' : '✕ No puedo dar casa'}
        </span>
      </td>
      <td>
        <span class="pill-status ${canGiveCar ? 'pill-vip' : 'pill-subtle'}" title="${canGiveCar ? 'Privilegios VIP activos: Sin cuota de gasolina, voto de oro en cine, siembra en Smash' : 'Pasajero'}">
          ${canGiveCar ? '🚗 Conductor VIP ★' : '👤 Pasajero'}
        </span>
      </td>
      <td><span class="tag tag-mono">[CONFIRMADO]</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderQuickLoginList() {
  const container = document.getElementById("quickUsersList");
  container.innerHTML = "";

  attendeesList.forEach(u => {
    const btn = document.createElement("button");
    btn.className = "quick-user-btn";
    btn.innerHTML = `
      <img src="${u.avatar_url}">
      <span>${u.alias || u.name}</span>
    `;
    btn.onclick = () => loginWithEmail(u.email, u.name);
    container.appendChild(btn);
  });
}

// ----------------- Carpools ----------------- //
async function fetchCars() {
  try {
    const res = await fetch("/api/cars");
    carsList = await res.json();
    renderCars();
  } catch (e) {
    console.error("Error cargando autos:", e);
  }
}

function renderCars() {
  const grid = document.getElementById("carsGrid");
  grid.innerHTML = "";

  if (carsList.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted); font-family:var(--font-mono);">No hay autos registrados todavía. ¡Sé el primero en ofrecer aventón!</p>`;
    return;
  }

  carsList.forEach(c => {
    const userInThisCar = currentUser && c.passengers.some(p => p.passenger_email.toLowerCase() === currentUser.email.toLowerCase());
    const isDriver = currentUser && c.driver_email.toLowerCase() === currentUser.email.toLowerCase();

    // Seat dots
    let dotsHtml = "";
    for (let i = 0; i < c.total_seats; i++) {
      const occupied = i < c.passengers.length;
      dotsHtml += `<div class="seat-dot ${occupied ? 'occupied' : 'empty'}" title="${occupied ? 'Lugar ocupado' : 'Lugar libre'}"></div>`;
    }

    // Passengers chips
    const passChips = c.passengers.length > 0
      ? c.passengers.map(p => `<span class="passenger-chip">${p.passenger_name}</span>`).join(" ")
      : `<span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-dim);">Sin pasajeros aún</span>`;

    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <div>
        <div class="car-header">
          <div class="car-driver-wrap">
            <img class="car-driver-avatar" src="https://api.dicebear.com/7.x/bottts/svg?seed=${c.driver_email}" alt="${c.driver_name}">
            <div>
              <div class="car-driver-name">${c.driver_name}</div>
              <div class="car-model">${c.car_model}</div>
            </div>
          </div>
          <span class="car-seats-badge">[${c.available_seats} LIBRES / ${c.total_seats}]</span>
        </div>

        <div class="car-route-info">
          <div class="route-row">
            <span class="route-label">PUNTO DE SALIDA:</span>
            <span class="route-val">${c.departure_zone}</span>
          </div>
          <div class="route-row">
            <span class="route-label">HORA ESTIMADA:</span>
            <span class="route-val">${c.departure_time}</span>
          </div>
          <div class="route-row">
            <span class="route-label">ESPACIO EN CAJUELA:</span>
            <span class="route-val">${c.has_trunk_space ? '✓ Sí (Hieleras/Maletas)' : '✕ Limitado'}</span>
          </div>
          ${c.notes ? `<div class="route-row"><span class="route-label">NOTAS:</span><span class="route-val" style="font-size:0.8rem;">${c.notes}</span></div>` : ''}
        </div>

        <div class="car-passengers-box">
          <div class="passengers-label">
            <span>PASAJEROS REGISTRADOS:</span>
            <div class="seats-dots">${dotsHtml}</div>
          </div>
          <div class="passengers-list">${passChips}</div>
        </div>
      </div>

      <div style="margin-top:16px;">
        ${
          isDriver 
            ? `<div style="display:flex; gap:8px;">
                 <button class="btn btn-outline btn-sm" style="flex:1;" disabled>Eres el Chofer</button>
                 <button class="btn btn-outline btn-sm" style="color:var(--accent-primary); border-color:rgba(255,62,62,0.4);" onclick="retireCar(${c.id})" title="Retirar este vehículo">✕ Retirar auto</button>
               </div>`
            : userInThisCar
              ? `<button class="btn btn-accent btn-block btn-sm" onclick="leaveCar(${c.id})">✕ Bajarme de este auto</button>`
              : c.available_seats > 0
                ? `<button class="btn btn-primary btn-block btn-sm" onclick="joinCar(${c.id})">+ Subirme a este auto</button>`
                : `<button class="btn btn-outline btn-block btn-sm" disabled>Coche Lleno</button>`
        }
      </div>
    `;
    grid.appendChild(card);
  });
}

async function joinCar(carId) {
  if (!currentUser) return openModal("modalLogin");
  try {
    const res = await fetch(`/api/cars/${carId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: currentUser.email })
    });
    const data = await res.json();
    if (res.ok) {
      fetchCars();
      fetchStatus();
    } else {
      alert(data.detail || "No se pudo unir al auto.");
    }
  } catch (e) {
    console.error(e);
  }
}

async function leaveCar(carId) {
  if (!currentUser) return;
  try {
    await fetch(`/api/cars/${carId}/leave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: currentUser.email })
    });
    fetchCars();
    fetchStatus();
  } catch (e) {
    console.error(e);
  }
}

async function retireCar(carId) {
  if (!currentUser) return;
  if (!confirm("¿Seguro que deseas retirar este auto del carpool?")) return;
  try {
    const res = await fetch(`/api/cars/${carId}`, {
      method: "DELETE"
    });
    if (res.ok) {
      // Refresh current user session as puedo_dar_coche might change
      const userRes = await fetch("/api/attendees");
      attendeesList = await userRes.json();
      const me = attendeesList.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (me) {
        currentUser = me;
        localStorage.setItem("pusio_user", JSON.stringify(currentUser));
      }
      fetchCars();
      fetchAttendees();
      fetchStatus();
    }
  } catch (e) {
    console.error(e);
  }
}

// ----------------- Ideas & Smash ----------------- //
async function fetchIdeas() {
  try {
    const res = await fetch("/api/ideas");
    ideasList = await res.json();
    renderIdeas();
  } catch (e) {
    console.error("Error cargando ideas:", e);
  }
}

function renderIdeas() {
  const grid = document.getElementById("ideasGrid");
  grid.innerHTML = "";

  ideasList.forEach(idea => {
    const isSmash = idea.title.toLowerCase().includes("smash");
    const hasVoted = currentUser && idea.voters.includes(currentUser.email);

    const card = document.createElement("div");
    card.className = `idea-card ${isSmash ? 'featured-smash' : ''}`;
    card.innerHTML = `
      ${isSmash ? `<div class="smash-badge">★ EVENTO PRINCIPAL ★</div>` : ''}
      <div>
        <div class="idea-category">[${idea.category}]</div>
        <h4 class="idea-title">${idea.title}</h4>
        <p class="idea-desc">${idea.description}</p>

        <div class="idea-details-box">
          ${idea.materials_needed ? `<div class="detail-line"><strong>Materiales / Equipo:</strong> ${idea.materials_needed}</div>` : ''}
          ${idea.budget_estimate ? `<div class="detail-line"><strong>Presupuesto / Aporte:</strong> ${idea.budget_estimate}</div>` : ''}
        </div>
      </div>

      <div class="idea-footer">
        <span class="idea-author">Por: <strong>${idea.author_name}</strong></span>
        <button class="btn-vote ${hasVoted ? 'voted' : ''}" onclick="voteIdea(${idea.id})">
          <span>${hasVoted ? '✓ Votado' : '▲ Votar'}</span>
          <span>(${idea.votes_count})</span>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function voteIdea(ideaId) {
  if (!currentUser) return openModal("modalLogin");
  try {
    const res = await fetch(`/api/ideas/${ideaId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: currentUser.email })
    });
    if (res.ok) {
      fetchIdeas();
      fetchStatus();
    }
  } catch (e) {
    console.error(e);
  }
}

// ----------------- Movies ----------------- //
async function fetchMovies() {
  try {
    const res = await fetch("/api/movies");
    moviesList = await res.json();
    renderMovies();
  } catch (e) {
    console.error("Error cargando películas:", e);
  }
}

function renderMovies() {
  const grid = document.getElementById("moviesGrid");
  grid.innerHTML = "";

  moviesList.forEach(m => {
    const hasVoted = currentUser && m.voters.includes(currentUser.email);

    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <div>
        <div class="movie-year-badge">[AÑO: ${m.year} // DURACIÓN: ${m.duration || 'N/A'}]</div>
        <h4 class="movie-title">${m.title}</h4>
        <div class="movie-genre">${m.genre || 'Cine General'}</div>
        <p class="movie-synopsis">${m.synopsis}</p>
        ${m.curator_note ? `<div class="curator-note">"${m.curator_note}"</div>` : ''}
      </div>

      <div class="idea-footer">
        <span class="idea-author">Propuesta por: <strong>${m.proposed_by_name}</strong></span>
        <button class="btn-vote ${hasVoted ? 'voted' : ''}" onclick="voteMovie(${m.id})">
          <span>${hasVoted ? '✓ Votado' : '▲ Votar'}</span>
          <span>(${m.votes_count})</span>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function voteMovie(movieId) {
  if (!currentUser) return openModal("modalLogin");
  try {
    const res = await fetch(`/api/movies/${movieId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: currentUser.email })
    });
    if (res.ok) {
      fetchMovies();
      fetchStatus();
    }
  } catch (e) {
    console.error(e);
  }
}

// ----------------- Chat with Pus.io ----------------- //
async function sendChatMessage(message) {
  const container = document.getElementById("chatMessages");
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.innerHTML = `
    <div class="bubble-sender">[${currentUser ? (currentUser.alias || currentUser.name) : 'TÚ'}]</div>
    <div class="bubble-content">${escapeHTML(message)}</div>
  `;
  container.appendChild(userBubble);
  container.scrollTop = container.scrollHeight;

  // Typing indicator
  const botTyping = document.createElement("div");
  botTyping.className = "chat-bubble bot";
  botTyping.id = "botTypingBubble";
  botTyping.innerHTML = `<div class="bubble-sender">[PUS.IO]</div><div class="bubble-content"><em>Pus.io está pensando...</em></div>`;
  container.appendChild(botTyping);
  container.scrollTop = container.scrollHeight;

  try {
    const res = await fetch("/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        user_name: currentUser ? (currentUser.alias || currentUser.name) : "Amigo del Pusio",
        user_email: currentUser ? currentUser.email : ""
      })
    });
    const data = await res.json();
    const typingEl = document.getElementById("botTypingBubble");
    if (typingEl) typingEl.remove();

    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.innerHTML = `
      <div class="bubble-sender">[PUS.IO]</div>
      <div class="bubble-content">${escapeHTML(data.reply || "¡Todo listo en Chelem!")}</div>
    `;
    container.appendChild(botBubble);
    container.scrollTop = container.scrollHeight;
  } catch (e) {
    console.error(e);
    const typingEl = document.getElementById("botTypingBubble");
    if (typingEl) typingEl.remove();
  }
}

// ----------------- Event Listeners & Modals ----------------- //
function setupEventListeners() {
  // Login modal
  btnOpenLoginModal.onclick = () => openModal("modalLogin");
  btnSwitchUser.onclick = () => openModal("modalLogin");

  // Preferences modal
  const btnOpenPreferences = document.getElementById("btnOpenPreferences");
  if (btnOpenPreferences) {
    btnOpenPreferences.onclick = () => {
      if (!currentUser) return openModal("modalLogin");
      document.getElementById("prefModalidad").value = currentUser.modalidad || "Solo io";
      document.getElementById("prefAportaCasa").checked = currentUser.puedo_dar_casa === 1;
      document.getElementById("prefAportaCoche").checked = currentUser.puedo_dar_coche === 1;
      openModal("modalPreferences");
    };
  }

  // Car modal
  document.getElementById("btnOpenCarModal").onclick = () => {
    if (!currentUser) return openModal("modalLogin");
    openModal("modalCar");
  };

  // Idea modal
  document.getElementById("btnOpenIdeaModal").onclick = () => {
    if (!currentUser) return openModal("modalLogin");
    openModal("modalIdea");
  };

  // Movie modal
  document.getElementById("btnOpenMovieModal").onclick = () => {
    if (!currentUser) return openModal("modalLogin");
    openModal("modalMovie");
  };

  // Close modals
  document.querySelectorAll("[data-close]").forEach(el => {
    el.onclick = () => closeModal(el.getAttribute("data-close"));
  });

  // Preferences submit
  const prefForm = document.getElementById("preferencesForm");
  if (prefForm) {
    prefForm.onsubmit = async (e) => {
      e.preventDefault();
      if (!currentUser) return;

      const payload = {
        modalidad: document.getElementById("prefModalidad").value,
        puedo_dar_casa: document.getElementById("prefAportaCasa").checked ? 1 : 0,
        puedo_dar_coche: document.getElementById("prefAportaCoche").checked ? 1 : 0
      };

      try {
        const res = await fetch(`/api/users/${encodeURIComponent(currentUser.email)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          currentUser = data.user;
          localStorage.setItem("pusio_user", JSON.stringify(currentUser));
          renderUserSession();
          closeModal("modalPreferences");
          fetchAttendees();
          fetchCars();
          fetchStatus();
        }
      } catch (err) {
        console.error("Error al actualizar preferencias:", err);
      }
    };
  }

  // Custom login submit
  document.getElementById("customLoginForm").onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("inputCustomEmail").value.trim();
    const name = document.getElementById("inputCustomName").value.trim();
    if (email) loginWithEmail(email, name);
  };

  // Car submit
  document.getElementById("carForm").onsubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const payload = {
      driver_email: currentUser.email,
      car_model: document.getElementById("carModel").value.trim(),
      total_seats: parseInt(document.getElementById("carSeats").value),
      departure_zone: document.getElementById("carDepartureZone").value.trim(),
      departure_time: document.getElementById("carDepartureTime").value.trim(),
      has_trunk_space: document.getElementById("carTrunk").checked ? 1 : 0,
      notes: document.getElementById("carNotes").value.trim()
    };

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        closeModal("modalCar");
        document.getElementById("carForm").reset();
        fetchCars();
        fetchStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Idea submit
  document.getElementById("ideaForm").onsubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const payload = {
      title: document.getElementById("ideaTitle").value.trim(),
      category: document.getElementById("ideaCategory").value,
      description: document.getElementById("ideaNotes").value.trim(),
      author_email: currentUser.email,
      author_name: currentUser.alias || currentUser.name,
      enhance_with_ai: document.getElementById("ideaEnhanceAI").checked
    };

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        closeModal("modalIdea");
        document.getElementById("ideaForm").reset();
        fetchIdeas();
        fetchStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Movie submit
  document.getElementById("movieForm").onsubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const payload = {
      title: document.getElementById("movieTitle").value.trim(),
      proposed_by_email: currentUser.email,
      proposed_by_name: currentUser.alias || currentUser.name,
      enrich_with_ai: document.getElementById("movieEnrichAI").checked
    };

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        closeModal("modalMovie");
        document.getElementById("movieForm").reset();
        fetchMovies();
        fetchStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Chat submit
  document.getElementById("chatForm").onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("chatInput");
    const val = input.value.trim();
    if (val) {
      sendChatMessage(val);
      input.value = "";
    }
  };

  // Quick prompt chips
  document.querySelectorAll(".prompt-chip").forEach(chip => {
    chip.onclick = () => {
      const prompt = chip.getAttribute("data-prompt");
      if (prompt) sendChatMessage(prompt);
    };
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

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

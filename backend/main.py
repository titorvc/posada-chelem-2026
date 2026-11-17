import os
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Request, Response, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, EmailStr

from database import get_connection, init_db
from initial_data import seed_database
import ai_agent

# Ensure DB is created & seeded on start
init_db()
seed_database()

app = FastAPI(
    title="Posada Chelem 2026 // Hub de Planeación & Agente IA",
    description="Plataforma interactiva con estética tipográfica late 2026 para organizar la posada de amigos en Chelem.",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Models ----------------- #
class LoginRequest(BaseModel):
    email: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None

class CarCreateRequest(BaseModel):
    driver_email: str
    car_model: str
    total_seats: int
    departure_zone: str
    departure_time: str
    has_trunk_space: int = 1
    notes: Optional[str] = None

class IdeaCreateRequest(BaseModel):
    title: str
    category: str = "Juegos & Torneos"
    description: Optional[str] = None
    materials_needed: Optional[str] = None
    budget_estimate: Optional[str] = None
    author_email: str
    author_name: Optional[str] = None
    enhance_with_ai: bool = False

class MovieCreateRequest(BaseModel):
    title: str
    year: Optional[int] = None
    genre: Optional[str] = None
    duration: Optional[str] = None
    synopsis: Optional[str] = None
    curator_note: Optional[str] = None
    proposed_by_email: str
    proposed_by_name: Optional[str] = None
    enrich_with_ai: bool = True

class VoteRequest(BaseModel):
    user_email: str

class UserUpdateRequest(BaseModel):
    modalidad: Optional[str] = None
    puedo_dar_casa: Optional[int] = None
    puedo_dar_coche: Optional[int] = None

class EnhanceIdeaRequest(BaseModel):
    title: str
    user_notes: Optional[str] = ""
    category: Optional[str] = "General"

class ChatRequest(BaseModel):
    message: str
    user_name: Optional[str] = "Amigo"
    user_email: Optional[str] = ""

# ----------------- Helper Functions ----------------- #
def get_user_by_email(email: str):
    conn = get_connection()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),)).fetchone()
    conn.close()
    return dict(user) if user else None

def ensure_user(email: str, name: Optional[str] = None, avatar_url: Optional[str] = None):
    clean_email = email.strip().lower()
    conn = get_connection()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (clean_email,)).fetchone()
    if not user:
        now = datetime.now().isoformat()
        resolved_name = name or clean_email.split("@")[0].title()
        resolved_avatar = avatar_url or f"https://api.dicebear.com/7.x/bottts/svg?seed={clean_email}"
        conn.execute("""
        INSERT INTO users (email, name, alias, avatar_url, modalidad, puedo_dar_casa, puedo_dar_coche, created_at)
        VALUES (?, ?, ?, ?, 'Solo io', 0, 0, ?)
        """, (clean_email, resolved_name, resolved_name, resolved_avatar, now))
        conn.commit()
        user = conn.execute("SELECT * FROM users WHERE email = ?", (clean_email,)).fetchone()
    conn.close()
    return dict(user)

# ----------------- Endpoints ----------------- #
@app.get("/api/status")
def get_status():
    conn = get_connection()
    event = conn.execute("SELECT * FROM event_info WHERE id = 1").fetchone()
    users_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    cars_count = conn.execute("SELECT COUNT(*) FROM cars").fetchone()[0]
    ideas_count = conn.execute("SELECT COUNT(*) FROM ideas").fetchone()[0]
    movies_count = conn.execute("SELECT COUNT(*) FROM movies").fetchone()[0]
    votes_count = conn.execute("SELECT COUNT(*) FROM votes").fetchone()[0]
    conn.close()

    return {
        "status": "online",
        "event": dict(event) if event else {
            "title": "Posada Chelem 2026",
            "location": "Casa de Reyvell, Chelem",
            "event_date": "2026-12-19"
        },
        "metrics": {
            "attendees_registered": users_count,
            "cars_offered": cars_count,
            "ideas_proposed": ideas_count,
            "movies_curated": movies_count,
            "total_votes_cast": votes_count
        }
    }

# Auth / Session
@app.post("/api/session/login")
def login(req: LoginRequest):
    if not req.email:
        raise HTTPException(status_code=400, detail="El correo electrónico es requerido.")
    user = ensure_user(req.email, req.name, req.avatar_url)
    return {"status": "ok", "user": user}

@app.get("/api/attendees")
def list_attendees():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM users ORDER BY id ASC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.put("/api/users/{email}")
def update_user_profile(email: str, req: UserUpdateRequest):
    clean_email = email.strip().lower()
    conn = get_connection()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (clean_email,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    updates = []
    params = []
    if req.modalidad is not None:
        updates.append("modalidad = ?")
        params.append(req.modalidad)
    if req.puedo_dar_casa is not None:
        updates.append("puedo_dar_casa = ?")
        params.append(req.puedo_dar_casa)
    if req.puedo_dar_coche is not None:
        updates.append("puedo_dar_coche = ?")
        params.append(req.puedo_dar_coche)

    if updates:
        params.append(clean_email)
        conn.execute(f"UPDATE users SET {', '.join(updates)} WHERE email = ?", tuple(params))
        conn.commit()

    updated = conn.execute("SELECT * FROM users WHERE email = ?", (clean_email,)).fetchone()
    conn.close()
    return {"status": "ok", "user": dict(updated)}

@app.get("/api/driver-privileges")
def get_driver_privileges():
    return [
        {
            "id": "gas",
            "icon": "⛽",
            "title": "Exención Total de Gasolina y Cuota de Transporte",
            "desc": "Tus pasajeros absorben el gasto de combustible y viáticos del viaje Mérida ⇄ Chelem."
        },
        {
            "id": "cine",
            "icon": "🎬",
            "title": "Voto de Oro en la Cartelera de Cine",
            "desc": "Tu selección de película tiene prioridad resolutiva en caso de empate en la votación."
        },
        {
            "id": "smash",
            "icon": "🎮",
            "title": "Siembra Preferencial en Smash Bros",
            "desc": "Eliges tu posición o descanso inicial en el bracket oficial del Torneo de Super Smash Bros."
        },
        {
            "id": "vip_badge",
            "icon": "⭐",
            "title": "Insignia Conductor VIP Oficial",
            "desc": "Distintivo visual dorado en tu ficha comunitaria reconociendo tu aporte logístico."
        }
    ]

# Carpool / Equipos en coche
@app.get("/api/cars")
def list_cars():
    conn = get_connection()
    cars = conn.execute("SELECT * FROM cars ORDER BY id DESC").fetchall()
    result = []
    for c in cars:
        car_dict = dict(c)
        passengers = conn.execute("""
            SELECT passenger_email, passenger_name, joined_at 
            FROM car_passengers 
            WHERE car_id = ? 
            ORDER BY id ASC
        """, (car_dict["id"],)).fetchall()
        car_dict["passengers"] = [dict(p) for p in passengers]
        car_dict["available_seats"] = max(0, car_dict["total_seats"] - len(passengers))
        result.append(car_dict)
    conn.close()
    return result

@app.post("/api/cars")
def create_car(req: CarCreateRequest):
    driver = ensure_user(req.driver_email)
    now = datetime.now().isoformat()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO cars (driver_email, driver_name, car_model, total_seats, departure_zone, departure_time, has_trunk_space, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        driver["email"],
        driver["name"],
        req.car_model,
        req.total_seats,
        req.departure_zone,
        req.departure_time,
        req.has_trunk_space,
        req.notes,
        now
    ))
    new_id = cursor.lastrowid
    cursor.execute("UPDATE users SET puedo_dar_coche = 1 WHERE email = ?", (driver["email"],))
    conn.commit()
    conn.close()
    return {"status": "ok", "car_id": new_id, "message": "¡Vehículo registrado exitosamente!"}

@app.delete("/api/cars/{car_id}")
def delete_car(car_id: int):
    conn = get_connection()
    car = conn.execute("SELECT * FROM cars WHERE id = ?", (car_id,)).fetchone()
    if not car:
        conn.close()
        raise HTTPException(status_code=404, detail="Vehículo no encontrado.")
    driver_email = car["driver_email"]
    conn.execute("DELETE FROM cars WHERE id = ?", (car_id,))
    remaining = conn.execute("SELECT COUNT(*) FROM cars WHERE driver_email = ?", (driver_email,)).fetchone()[0]
    if remaining == 0:
        conn.execute("UPDATE users SET puedo_dar_coche = 0 WHERE email = ?", (driver_email,))
    conn.commit()
    conn.close()
    return {"status": "ok", "message": "Vehículo retirado."}

@app.post("/api/cars/{car_id}/join")
def join_car(car_id: int, req: VoteRequest):
    user = ensure_user(req.user_email)
    conn = get_connection()
    car = conn.execute("SELECT * FROM cars WHERE id = ?", (car_id,)).fetchone()
    if not car:
        conn.close()
        raise HTTPException(status_code=404, detail="Vehículo no encontrado.")

    passengers_count = conn.execute("SELECT COUNT(*) FROM car_passengers WHERE car_id = ?", (car_id,)).fetchone()[0]
    if passengers_count >= car["total_seats"]:
        conn.close()
        raise HTTPException(status_code=400, detail="Este vehículo ya tiene todos los lugares ocupados.")

    now = datetime.now().isoformat()
    try:
        conn.execute("""
            INSERT INTO car_passengers (car_id, passenger_email, passenger_name, joined_at)
            VALUES (?, ?, ?, ?)
        """, (car_id, user["email"], user["name"], now))
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail="Ya estás registrado en este vehículo.")

    conn.close()
    return {"status": "ok", "message": f"¡Te has subido al auto de {car['driver_name']}!"}

@app.post("/api/cars/{car_id}/leave")
def leave_car(car_id: int, req: VoteRequest):
    clean_email = req.user_email.strip().lower()
    conn = get_connection()
    conn.execute("DELETE FROM car_passengers WHERE car_id = ? AND passenger_email = ?", (car_id, clean_email))
    conn.commit()
    conn.close()
    return {"status": "ok", "message": "Te has bajado del vehículo."}

# Ideas & Dinámicas
@app.get("/api/ideas")
def list_ideas():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM ideas ORDER BY id DESC").fetchall()
    result = []
    for r in rows:
        idea = dict(r)
        voters = conn.execute("SELECT user_email FROM votes WHERE item_type = 'idea' AND item_id = ?", (idea["id"],)).fetchall()
        idea["voters"] = [v[0] for v in voters]
        idea["votes_count"] = len(idea["voters"])
        result.append(idea)
    conn.close()
    # Sort by votes descending
    result.sort(key=lambda x: x["votes_count"], reverse=True)
    return result

@app.post("/api/ideas")
def create_idea(req: IdeaCreateRequest):
    author = ensure_user(req.author_email, req.author_name)
    now = datetime.now().isoformat()

    title = req.title.strip()
    category = req.category
    description = req.description or ""
    materials = req.materials_needed or ""
    budget = req.budget_estimate or ""

    if req.enhance_with_ai or not description:
        ai_data = ai_agent.enhance_idea_with_ai(title, description, category)
        title = ai_data.get("title", title)
        category = ai_data.get("category", category)
        description = ai_data.get("description", description)
        materials = ai_data.get("materials_needed", materials)
        budget = ai_data.get("budget_estimate", budget)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO ideas (category, title, description, materials_needed, budget_estimate, author_email, author_name, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (category, title, description, materials, budget, author["email"], author["name"], now))
    new_id = cursor.lastrowid

    # Auto-vote by author
    cursor.execute("INSERT OR IGNORE INTO votes (item_type, item_id, user_email, voted_at) VALUES ('idea', ?, ?, ?)", (new_id, author["email"], now))
    conn.commit()
    conn.close()

    return {"status": "ok", "idea_id": new_id, "message": "¡Idea registrada exitosamente!"}

@app.post("/api/ideas/{idea_id}/vote")
def vote_idea(idea_id: int, req: VoteRequest):
    user = ensure_user(req.user_email)
    conn = get_connection()
    now = datetime.now().isoformat()
    existing = conn.execute("SELECT id FROM votes WHERE item_type = 'idea' AND item_id = ? AND user_email = ?", (idea_id, user["email"])).fetchone()
    if existing:
        conn.execute("DELETE FROM votes WHERE id = ?", (existing[0],))
        action = "removed"
    else:
        conn.execute("INSERT INTO votes (item_type, item_id, user_email, voted_at) VALUES ('idea', ?, ?, ?)", (idea_id, user["email"], now))
        action = "added"
    conn.commit()

    total_votes = conn.execute("SELECT COUNT(*) FROM votes WHERE item_type = 'idea' AND item_id = ?", (idea_id,)).fetchone()[0]
    conn.close()
    return {"status": "ok", "action": action, "total_votes": total_votes}

# Movies / Cine en Chelem
@app.get("/api/movies")
def list_movies():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM movies ORDER BY id DESC").fetchall()
    result = []
    for r in rows:
        movie = dict(r)
        voters = conn.execute("SELECT user_email FROM votes WHERE item_type = 'movie' AND item_id = ?", (movie["id"],)).fetchall()
        movie["voters"] = [v[0] for v in voters]
        movie["votes_count"] = len(movie["voters"])
        result.append(movie)
    conn.close()
    result.sort(key=lambda x: x["votes_count"], reverse=True)
    return result

@app.post("/api/movies")
def create_movie(req: MovieCreateRequest):
    proposer = ensure_user(req.proposed_by_email, req.proposed_by_name)
    now = datetime.now().isoformat()

    title = req.title.strip()
    year = req.year
    genre = req.genre
    duration = req.duration
    synopsis = req.synopsis or ""
    curator_note = req.curator_note or ""

    if req.enrich_with_ai or not synopsis:
        ai_data = ai_agent.enrich_movie_with_ai(title)
        title = ai_data.get("title", title)
        year = ai_data.get("year", year or 2024)
        genre = ai_data.get("genre", genre or "Cine")
        duration = ai_data.get("duration", duration or "1h 45m")
        synopsis = ai_data.get("synopsis", synopsis)
        curator_note = ai_data.get("curator_note", curator_note)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO movies (title, year, genre, duration, synopsis, curator_note, proposed_by_email, proposed_by_name, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (title, year, genre, duration, synopsis, curator_note, proposer["email"], proposer["name"], now))
    new_id = cursor.lastrowid

    # Auto-vote by author
    cursor.execute("INSERT OR IGNORE INTO votes (item_type, item_id, user_email, voted_at) VALUES ('movie', ?, ?, ?)", (new_id, proposer["email"], now))
    conn.commit()
    conn.close()

    return {"status": "ok", "movie_id": new_id, "message": "¡Película agregada a la cartelera!"}

@app.post("/api/movies/{movie_id}/vote")
def vote_movie(movie_id: int, req: VoteRequest):
    user = ensure_user(req.user_email)
    conn = get_connection()
    now = datetime.now().isoformat()
    existing = conn.execute("SELECT id FROM votes WHERE item_type = 'movie' AND item_id = ? AND user_email = ?", (movie_id, user["email"])).fetchone()
    if existing:
        conn.execute("DELETE FROM votes WHERE id = ?", (existing[0],))
        action = "removed"
    else:
        conn.execute("INSERT INTO votes (item_type, item_id, user_email, voted_at) VALUES ('movie', ?, ?, ?)", (movie_id, user["email"], now))
        action = "added"
    conn.commit()

    total_votes = conn.execute("SELECT COUNT(*) FROM votes WHERE item_type = 'movie' AND item_id = ?", (movie_id,)).fetchone()[0]
    conn.close()
    return {"status": "ok", "action": action, "total_votes": total_votes}

# Agent Endpoints
@app.post("/api/agent/enhance-idea")
def api_enhance_idea(req: EnhanceIdeaRequest):
    result = ai_agent.enhance_idea_with_ai(req.title, req.user_notes or "", req.category or "General")
    return {"status": "ok", "data": result}

@app.post("/api/agent/chat")
def api_chat(req: ChatRequest):
    result = ai_agent.chat_with_agent(req.message, req.user_name or "Amigo", req.user_email or "")
    
    # Log to chat_log
    conn = get_connection()
    now = datetime.now().isoformat()
    conn.execute("""
        INSERT INTO chat_log (user_email, user_name, message, agent_reply, action_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (req.user_email or "anon@posada.local", req.user_name or "Amigo", req.message, result.get("reply", ""), str(result.get("suggested_action")), now))
    conn.commit()
    conn.close()

    return {"status": "ok", "reply": result.get("reply"), "suggested_action": result.get("suggested_action")}

# Mount Static Files & Frontend
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
def serve_index():
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"status": "Backend running. Frontend folder pending initialization."}

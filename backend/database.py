import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "posada.db")

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Metadata / Settings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS event_info (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        event_date TEXT NOT NULL,
        host_name TEXT NOT NULL,
        description TEXT
    );
    """)

    # Attendees / Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        alias TEXT,
        avatar_url TEXT,
        modalidad TEXT DEFAULT 'Solo io',
        puedo_dar_casa INTEGER DEFAULT 1,
        puedo_dar_coche INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)

    # Migration for puedo_dar_coche if upgrading existing database
    cursor.execute("PRAGMA table_info(users);")
    cols = [row["name"] for row in cursor.fetchall()]
    if "puedo_dar_coche" not in cols:
        cursor.execute("ALTER TABLE users ADD COLUMN puedo_dar_coche INTEGER DEFAULT 0;")

    # Carpools (Equipos en coche)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        driver_email TEXT NOT NULL,
        driver_name TEXT NOT NULL,
        car_model TEXT NOT NULL,
        total_seats INTEGER NOT NULL DEFAULT 4,
        departure_zone TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        has_trunk_space INTEGER DEFAULT 1,
        notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(driver_email) REFERENCES users(email) ON DELETE CASCADE
    );
    """)

    # Passengers inside carpool
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS car_passengers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        car_id INTEGER NOT NULL,
        passenger_email TEXT NOT NULL,
        passenger_name TEXT NOT NULL,
        joined_at TEXT NOT NULL,
        UNIQUE(car_id, passenger_email),
        FOREIGN KEY(car_id) REFERENCES cars(id) ON DELETE CASCADE
    );
    """)

    # Ideas & Dynamics
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        materials_needed TEXT,
        budget_estimate TEXT,
        author_email TEXT NOT NULL,
        author_name TEXT NOT NULL,
        status TEXT DEFAULT 'propuesta',
        created_at TEXT NOT NULL
    );
    """)

    # Movies (Cine en Chelem)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INTEGER,
        genre TEXT,
        duration TEXT,
        synopsis TEXT NOT NULL,
        curator_note TEXT,
        proposed_by_email TEXT NOT NULL,
        proposed_by_name TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    # Universal Votes (ideas or movies)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_type TEXT NOT NULL,
        item_id INTEGER NOT NULL,
        user_email TEXT NOT NULL,
        voted_at TEXT NOT NULL,
        UNIQUE(item_type, item_id, user_email)
    );
    """)

    # AI Chat Log
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        user_name TEXT NOT NULL,
        message TEXT NOT NULL,
        agent_reply TEXT NOT NULL,
        action_type TEXT,
        created_at TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized at:", DB_PATH)

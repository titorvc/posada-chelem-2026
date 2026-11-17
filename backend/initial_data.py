from datetime import datetime
from database import get_connection, init_db

INITIAL_USERS = [
    {
        "email": "reyvelljk87@gmail.com",
        "name": "Reyvell (Anfitrión)",
        "alias": "Reyvell",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=reyvell",
        "modalidad": "Solo io",
        "puedo_dar_casa": 1,
        "puedo_dar_coche": 0
    },
    {
        "email": "titorvc08@gmail.com",
        "name": "Roberto Vargas (Titor)",
        "alias": "Titor",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=titor",
        "modalidad": "Solo io",
        "puedo_dar_casa": 1,
        "puedo_dar_coche": 0
    },
    {
        "email": "danielitoestabonito16@gmail.com",
        "name": "Danielito",
        "alias": "Danielito",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=danielito",
        "modalidad": "Solo io",
        "puedo_dar_casa": 1,
        "puedo_dar_coche": 1
    },
    {
        "email": "mendoza.lpinzon@gmail.com",
        "name": "Pinzón",
        "alias": "Pinzón",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=pinzon",
        "modalidad": "Parejas",
        "puedo_dar_casa": 1,
        "puedo_dar_coche": 0
    },
    {
        "email": "fjvc091002@gmail.com",
        "name": "FJVC",
        "alias": "FJVC",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=fjvc",
        "modalidad": "Parejas",
        "puedo_dar_casa": 1,
        "puedo_dar_coche": 0
    },
    {
        "email": "alejandroaltamiranopuc@gmail.com",
        "name": "Alejandro Altamirano",
        "alias": "Alex Altamirano",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=alex",
        "modalidad": "Solo io",
        "puedo_dar_casa": 1,
        "puedo_dar_coche": 0
    },
    {
        "email": "joserikb@gmail.com",
        "name": "Erik B.",
        "alias": "Erik",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=erik",
        "modalidad": "Solo io",
        "puedo_dar_casa": 1,
        "puedo_dar_coche": 0
    },
    {
        "email": "ivan.raygosa@gmail.com",
        "name": "Iván Raygosa",
        "alias": "Iván",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=ivan",
        "modalidad": "Parejas",
        "puedo_dar_casa": 0,
        "puedo_dar_coche": 0
    },
    {
        "email": "cplus.lat@gmail.com",
        "name": "CPlus",
        "alias": "CPlus",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=cplus",
        "modalidad": "Parejas",
        "puedo_dar_casa": 1,
        "puedo_dar_coche": 0
    }
]

INITIAL_IDEAS = [
    {
        "category": "Juegos & Torneos",
        "title": "Torneo Magistral de Super Smash Bros Ultimate en Chelem",
        "description": "Gran torneo nocturno en pantalla grande/proyector en la sala o terraza. Modalidad 1v1 sin ítems en escenarios competitivos, con bracket de eliminación doble y revanchas libres de 8 jugadores en modo caótico.",
        "materials_needed": "1 Nintendo Switch con dock, 4-8 controles (GameCube / Pro Controller), proyector o pantalla HDMI, cable de corriente y extensión ruda.",
        "budget_estimate": "$200 MXN para el trofeo o premio simbólico (ej. botella o snack de la victoria)",
        "author_email": "titorvc08@gmail.com",
        "author_name": "Titor"
    },
    {
        "category": "Comida",
        "title": "Asado Playero & Hamburguesas Smash al Carbón",
        "description": "Parrillada al atardecer frente a la brisa en la terraza de Chelem: carne marinada, chorizo argentino, cebollitas asadas y opción de hamburguesas con queso fundido.",
        "materials_needed": "Carbón (2 bolsas), iniciador de fuego, pinzas de asador, carne para asar, panes de hamburguesa, aderezos y desechables biodegradables.",
        "budget_estimate": "~$150 - $200 MXN por persona (cooperación transparente)",
        "author_email": "reyvelljk87@gmail.com",
        "author_name": "Reyvell"
    },
    {
        "category": "Bebidas",
        "title": "Hieleras Comunitarias & Barra Libre Playera",
        "description": "Dos hieleras gigantes rotuladas: una para cervezas/refrescos y otra exclusivamente con hielo limpio para cócteles y preparados rápidos.",
        "materials_needed": "2 hieleras grandes, 4 bolsas de hielo, vasos de plástico reusable, mezcladores (mineral, toronja, jugo de arándano).",
        "budget_estimate": "Cada quien aporta su six/botella favorita + cooperación de $30 MXN para hielo",
        "author_email": "mendoza.lpinzon@gmail.com",
        "author_name": "Pinzón"
    },
    {
        "category": "Juegos & Dinámicas",
        "title": "Intercambio de Tazas o Regalos Absurdos / Chuscos",
        "description": "Dinámica rápida de elefante blanco / robo de regalos con tope de precio bajo donde el objetivo es regalar cosas cómicas, útiles o memes.",
        "materials_needed": "1 regalo envuelto por participante (valor $100 - $150 MXN máx).",
        "budget_estimate": "$100 - $150 MXN por participante",
        "author_email": "danielitoestabonito16@gmail.com",
        "author_name": "Danielito"
    }
]

INITIAL_MOVIES = [
    {
        "title": "Die Hard (Duro de Matar)",
        "year": 1988,
        "genre": "Acción / Clásico Navideño",
        "duration": "2h 12m",
        "synopsis": "John McClane se enfrenta a un grupo de terroristas en el Nakatomi Plaza en plena víspera navideña. La cúspide del cine de acción de los 80.",
        "curator_note": "Es la película navideña no tradicional por excelencia. Perfecta para ver con botanas y chelas.",
        "proposed_by_email": "titorvc08@gmail.com",
        "proposed_by_name": "Titor"
    },
    {
        "title": "The Grinch (El Grinch)",
        "year": 2000,
        "genre": "Comedia Fantástica",
        "duration": "1h 44m",
        "synopsis": "Jim Carrey en una interpretación legendaria como la criatura verde que odia la Navidad en Villa Quién.",
        "curator_note": "Cine cómico lleno de frases citables para reír en grupo.",
        "proposed_by_email": "reyvelljk87@gmail.com",
        "proposed_by_name": "Reyvell"
    },
    {
        "title": "Krampus: Maldita Navidad",
        "year": 2015,
        "genre": "Terror / Comedia Negra",
        "duration": "1h 38m",
        "synopsis": "Cuando una familia disfuncional pierde el espíritu navideño, desatan la ira del antiguo demonio del folclore europeo.",
        "curator_note": "Ideal para la madrugada en la playa: terror ligero con efectos prácticos geniales.",
        "proposed_by_email": "fjvc091002@gmail.com",
        "proposed_by_name": "FJVC"
    },
    {
        "title": "Superbad",
        "year": 2007,
        "genre": "Comedia de Culto",
        "duration": "1h 53m",
        "synopsis": "Dos amigos inseparables de preparatoria intentan conseguir alcohol para una fiesta legendaria antes de graduarse.",
        "curator_note": "McLovin y el humor de los 2000 que todo el grupo conoce de memoria.",
        "proposed_by_email": "danielitoestabonito16@gmail.com",
        "proposed_by_name": "Danielito"
    }
]

INITIAL_CARS = [
    {
        "driver_email": "danielitoestabonito16@gmail.com",
        "driver_name": "Danielito",
        "car_model": "Compacto",
        "total_seats": 3,
        "departure_zone": "Zona Poniente / Caucel",
        "departure_time": "15:30 hrs (Sábado 19)",
        "has_trunk_space": 1,
        "notes": "Música indie y electrónica en el camino. Puedo pasar por quien esté sobre la ruta."
    }
]

def seed_database():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    # Event Info
    cursor.execute("SELECT COUNT(*) FROM event_info")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO event_info (id, title, location, event_date, host_name, description)
        VALUES (1, 'Posada 2026 // Chelem Beach Party', 'Casa de Reyvell, Chelem Puerto, Yucatán', '2026-12-19', 'Reyvell', 'Reunión anual de amigos en la playa: Torneo de Smash, cine frente al mar, carne asada, dinámicas y amanecer playero.')
        """)

    # Seed Users
    now = datetime.now().isoformat()
    for u in INITIAL_USERS:
        cursor.execute("""
        INSERT INTO users (email, name, alias, avatar_url, modalidad, puedo_dar_casa, puedo_dar_coche, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
            puedo_dar_coche = excluded.puedo_dar_coche,
            puedo_dar_casa = excluded.puedo_dar_casa
        """, (u["email"], u["name"], u["alias"], u["avatar_url"], u["modalidad"], u["puedo_dar_casa"], u.get("puedo_dar_coche", 0), now))

    # Seed Ideas
    cursor.execute("SELECT COUNT(*) FROM ideas")
    if cursor.fetchone()[0] == 0:
        for idea in INITIAL_IDEAS:
            cursor.execute("""
            INSERT INTO ideas (category, title, description, materials_needed, budget_estimate, author_email, author_name, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (idea["category"], idea["title"], idea["description"], idea["materials_needed"], idea["budget_estimate"], idea["author_email"], idea["author_name"], now))

    # Seed Movies
    cursor.execute("SELECT COUNT(*) FROM movies")
    if cursor.fetchone()[0] == 0:
        for m in INITIAL_MOVIES:
            cursor.execute("""
            INSERT INTO movies (title, year, genre, duration, synopsis, curator_note, proposed_by_email, proposed_by_name, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (m["title"], m["year"], m["genre"], m["duration"], m["synopsis"], m["curator_note"], m["proposed_by_email"], m["proposed_by_name"], now))

    # Seed Initial Cars
    cursor.execute("SELECT COUNT(*) FROM cars")
    if cursor.fetchone()[0] == 0:
        for car in INITIAL_CARS:
            cursor.execute("""
            INSERT INTO cars (driver_email, driver_name, car_model, total_seats, departure_zone, departure_time, has_trunk_space, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (car["driver_email"], car["driver_name"], car["car_model"], car["total_seats"], car["departure_zone"], car["departure_time"], car["has_trunk_space"], car["notes"], now))

    # Add initial votes to make it alive
    cursor.execute("SELECT COUNT(*) FROM votes")
    if cursor.fetchone()[0] == 0:
        # Votes for Smash tournament (everyone loves it)
        cursor.execute("SELECT id FROM ideas WHERE title LIKE '%Smash%' LIMIT 1")
        smash_row = cursor.fetchone()
        if smash_row:
            for voter in ["titorvc08@gmail.com", "reyvelljk87@gmail.com", "danielitoestabonito16@gmail.com", "mendoza.lpinzon@gmail.com", "fjvc091002@gmail.com"]:
                cursor.execute("INSERT OR IGNORE INTO votes (item_type, item_id, user_email, voted_at) VALUES ('idea', ?, ?, ?)", (smash_row[0], voter, now))
        
        # Votes for Die Hard
        cursor.execute("SELECT id FROM movies WHERE title LIKE '%Die Hard%' LIMIT 1")
        diehard_row = cursor.fetchone()
        if diehard_row:
            for voter in ["titorvc08@gmail.com", "reyvelljk87@gmail.com", "danielitoestabonito16@gmail.com"]:
                cursor.execute("INSERT OR IGNORE INTO votes (item_type, item_id, user_email, voted_at) VALUES ('movie', ?, ?, ?)", (diehard_row[0], voter, now))

    conn.commit()
    conn.close()
    print("Database successfully seeded.")

if __name__ == "__main__":
    seed_database()

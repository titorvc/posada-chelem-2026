import sys
import os
import time
import unittest

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

from fastapi.testclient import TestClient
from main import app
from database import get_connection, init_db
from initial_data import seed_database

class TestPosadaBackendHeadless(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        seed_database()
        cls.client = TestClient(app)

    def test_01_status_endpoint(self):
        t0 = time.perf_counter()
        res = self.client.get("/api/status")
        elapsed = (time.perf_counter() - t0) * 1000
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("Chelem", data["event"]["location"])
        self.assertGreaterEqual(data["metrics"]["attendees_registered"], 9)
        self.assertGreaterEqual(data["metrics"]["ideas_proposed"], 4)
        self.assertGreaterEqual(data["metrics"]["movies_curated"], 4)
        print(f"[OK] Status check completed in {elapsed:.2f}ms: {data['metrics']}")

    def test_02_login_and_user_creation(self):
        # Test login existing user
        res = self.client.post("/api/session/login", json={
            "email": "titorvc08@gmail.com",
            "name": "Roberto Vargas"
        })
        self.assertEqual(res.status_code, 200)
        user = res.json()["user"]
        self.assertEqual(user["email"], "titorvc08@gmail.com")

        # Test new user auto-creation
        res2 = self.client.post("/api/session/login", json={
            "email": "nuevo_amigo@gmail.com",
            "name": "Amigo Nuevo"
        })
        self.assertEqual(res2.status_code, 200)
        user2 = res2.json()["user"]
        self.assertEqual(user2["email"], "nuevo_amigo@gmail.com")
        print("[OK] User authentication / session resolution verified.")

    def test_03_carpool_lifecycle(self):
        # 1. List cars
        res = self.client.get("/api/cars")
        self.assertEqual(res.status_code, 200)
        cars = res.json()
        self.assertGreaterEqual(len(cars), 1)
        target_car = cars[0]
        car_id = target_car["id"]

        # 2. Join car
        join_res = self.client.post(f"/api/cars/{car_id}/join", json={
            "user_email": "ivan.raygosa@gmail.com"
        })
        self.assertEqual(join_res.status_code, 200)

        # 3. Verify passenger is in car
        res_after = self.client.get("/api/cars")
        updated_car = [c for c in res_after.json() if c["id"] == car_id][0]
        passengers = [p["passenger_email"] for p in updated_car["passengers"]]
        self.assertIn("ivan.raygosa@gmail.com", passengers)

        # 4. Leave car
        leave_res = self.client.post(f"/api/cars/{car_id}/leave", json={
            "user_email": "ivan.raygosa@gmail.com"
        })
        self.assertEqual(leave_res.status_code, 200)
        print("[OK] Carpool creation, passenger join and leave validated.")

    def test_04_ideas_and_voting(self):
        # 1. Create new idea with AI enhancement
        t0 = time.perf_counter()
        res = self.client.post("/api/ideas", json={
            "title": "Torneo Relámpago de Futbolito de Mesa",
            "category": "Juegos & Torneos",
            "author_email": "reyvelljk87@gmail.com",
            "enhance_with_ai": True
        })
        elapsed = (time.perf_counter() - t0) * 1000
        self.assertEqual(res.status_code, 200)
        new_idea_id = res.json()["idea_id"]

        # 2. Vote for the idea
        vote_res = self.client.post(f"/api/ideas/{new_idea_id}/vote", json={
            "user_email": "mendoza.lpinzon@gmail.com"
        })
        self.assertEqual(vote_res.status_code, 200)
        self.assertEqual(vote_res.json()["action"], "added")

        # 3. Toggle vote off
        vote_toggle = self.client.post(f"/api/ideas/{new_idea_id}/vote", json={
            "user_email": "mendoza.lpinzon@gmail.com"
        })
        self.assertEqual(vote_toggle.status_code, 200)
        self.assertEqual(vote_toggle.json()["action"], "removed")
        print(f"[OK] Idea creation & AI enhancement executed in {elapsed:.2f}ms.")

    def test_05_movie_lifecycle(self):
        # Create movie proposal
        res = self.client.post("/api/movies", json={
            "title": "Mad Max: Fury Road",
            "proposed_by_email": "titorvc08@gmail.com",
            "enrich_with_ai": True
        })
        self.assertEqual(res.status_code, 200)
        movie_id = res.json()["movie_id"]

        # Vote for movie
        vote_res = self.client.post(f"/api/movies/{movie_id}/vote", json={
            "user_email": "fjvc091002@gmail.com"
        })
        self.assertEqual(vote_res.status_code, 200)

        # Verify movies list
        movies_res = self.client.get("/api/movies")
        movie_titles = [m["title"] for m in movies_res.json()]
        self.assertTrue(any("Mad Max" in t for t in movie_titles))
        print("[OK] Movie curation and voting validated.")

    def test_06_ai_agent_chat(self):
        t0 = time.perf_counter()
        chat_res = self.client.post("/api/agent/chat", json={
            "message": "¿Qué onda Anfitrión? ¿A qué hora nos vamos en caravana a Chelem?",
            "user_name": "Titor",
            "user_email": "titorvc08@gmail.com"
        })
        elapsed = (time.perf_counter() - t0) * 1000
        self.assertEqual(chat_res.status_code, 200)
        reply = chat_res.json()["reply"]
        self.assertTrue(len(reply) > 20)
        print(f"[OK] AI Agent responded in {elapsed:.2f}ms: '{reply[:60]}...'")

    def test_07_frontend_assets_served(self):
        r_home = self.client.get("/")
        self.assertEqual(r_home.status_code, 200)
        self.assertIn("El pusio", r_home.text)
        self.assertIn("Chelem", r_home.text)

        r_css = self.client.get("/css/style.css")
        self.assertEqual(r_css.status_code, 200)
        self.assertIn("POSADA CHELEM", r_css.text)

        r_js = self.client.get("/js/app.js")
        self.assertEqual(r_js.status_code, 200)
        self.assertIn("pus.io", r_js.text.lower())
        print("[OK] Frontend HTML, CSS and JS assets verified via headless HTTP.")

    def test_08_driver_privileges_and_user_preferences(self):
        # 1. Verify privileges endpoint
        priv_res = self.client.get("/api/driver-privileges")
        self.assertEqual(priv_res.status_code, 200)
        privs = priv_res.json()
        self.assertEqual(len(privs), 4)
        priv_titles = [p["title"] for p in privs]
        # Ensure 'asiento de honor reservado en el asado playero' is NOT present
        self.assertFalse(any("asiento de honor" in t.lower() for t in priv_titles))
        self.assertTrue(any("gasolina" in t.lower() for t in priv_titles))

        # 2. Update user profile to puedo_dar_coche = 1
        put_res = self.client.put("/api/users/fjvc091002@gmail.com", json={
            "modalidad": "Parejas",
            "puedo_dar_casa": 1,
            "puedo_dar_coche": 1
        })
        self.assertEqual(put_res.status_code, 200)
        self.assertEqual(put_res.json()["user"]["puedo_dar_coche"], 1)

        # 3. Verify in attendees list
        att_res = self.client.get("/api/attendees")
        fjvc = [u for u in att_res.json() if u["email"] == "fjvc091002@gmail.com"][0]
        self.assertEqual(fjvc["puedo_dar_coche"], 1)

        # 4. Turn off puedo_dar_coche
        put_res2 = self.client.put("/api/users/fjvc091002@gmail.com", json={
            "puedo_dar_coche": 0
        })
        self.assertEqual(put_res2.status_code, 200)
        self.assertEqual(put_res2.json()["user"]["puedo_dar_coche"], 0)
        print("[OK] Driver privileges and user preferences toggling validated successfully.")

if __name__ == "__main__":
    unittest.main()

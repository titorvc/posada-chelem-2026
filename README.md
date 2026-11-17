# ★ POSADA 2026 // EL PUSIO EN CHELEM ★

> **Sede Oficial:** Casa de Reyvell, Chelem Puerto, Yucatán  
> **Fecha Canónica:** Sábado 19 de Diciembre de 2026  
> **Anfitrión IA:** Pus.io en línea

Hub interactivo y plataforma web con estética neo-grotesque / editorial late-2026 para organizar la posada anual del grupo de amigos **"El Pusio"** en las playas de Chelem.

---

## 🌴 Características Principales

1. **⏱️ Countdown & Quórum en Tiempo Real:**
   - Contador regresivo hacia el 19 de diciembre de 2026.
   - Padrón de asistentes con modalidad (*Solo io* / *Parejas*), disponibilidad de casa y rol de transporte.

2. **🚗 Rutas a Chelem & Carpools con Privilegios VIP:**
   - Coordinación de salidas desde Mérida (Altabrisa, Caucel, Periférico).
   - Reserva interactiva de asientos y espacio de cajuela.
   - **Estatuto Oficial de Privilegios para Conductores:** Quien aporte su vehículo queda exento del gasto de gasolina/viáticos del trayecto, cuenta con voto de oro para desempates en el cine, siembra preferencial en el torneo de Smash Bros y el distintivo dorada *Conductor VIP*.

3. **🎮 Ideas Comunitarias & Torneo de Super Smash Bros Ultimate:**
   - Propuestas de asado, hieleras comunitarias e intercambios.
   - Pulido automático de propuestas con el agente IA (desglose de insumos y presupuesto estimado en MXN).
   - Sistema de votaciones directas.

4. **🎬 Cartelera de Cine en Chelem:**
   - Selección curada de clásicos (*Die Hard*, *El Grinch*, *Krampus*, *Superbad*) con sinopsis y votación comunitaria.

5. **🤖 Asistente Virtual Integrado (Pus.io):**
   - Chatbot con el cotorreo característico del grupo, diseñado para estructurar la logística y resolver dudas de la posada.

---

## 🛠️ Stack Tecnológico

* **Backend:** FastAPI, Python 3.12+, Uvicorn.
* **Base de Datos:** SQLite 3 en modo `WAL` (`posada.db`).
* **Inteligencia Artificial:** Google Gemini API (`gemini-2.5-flash`) con motor de fallback heurístico local.
* **Frontend:** HTML5 semántico, CSS moderno de alto contraste (Neo-Grotesque tipográfico), JavaScript Vanilla reactivo.
* **Pruebas:** Suite de validación headless (`unittest` / `TestClient`).

---

## 🚀 Puesta en Marcha Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/titorvc/posada-chelem-2026.git
cd posada-chelem-2026
```

### 2. Instalar dependencias
```bash
pip install fastapi uvicorn pydantic google-genai httpx
```

### 3. Iniciar el servidor
```bash
chmod +x run.sh
./run.sh
```
Abre en tu navegador: [http://localhost:8000](http://localhost:8000)

---

## 🧪 Pruebas Headless
Para validar el estado de la API, base de datos y endpoints:
```bash
python3 tests/test_backend_headless.py
```

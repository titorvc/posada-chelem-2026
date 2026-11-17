import os
import json
import logging
from typing import Dict, Any, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PosadaAIAgent")

# Try to initialize google.genai Client
client = None
try:
    from google import genai
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        client = genai.Client(api_key=api_key)
        logger.info("Gemini Client successfully initialized with GEMINI_API_KEY.")
    else:
        logger.warning("GEMINI_API_KEY not found in environment; running in resilient heuristic mode.")
except Exception as e:
    logger.warning(f"google.genai Client could not be initialized: {e}. Fallback engine active.")

SYSTEM_INSTRUCTION = """
Eres "Pus.io", el chatbot y anfitrión oficial con IA del grupo de amigos "El pusio" para su Posada 2026 en Chelem, Yucatán (en la casa de playa de Reyvell, 19 de diciembre de 2026).
Tu tono es de confianza absoluta, ingenioso, con la vibra del grupo (cotorreo sano, referencias a retas de videojuegos, anécdotas entre amigos, frases mexicanas naturales sin exagerar), pero a la vez eres un organizador implacable y resolutivo.
Tus responsabilidades:
1. Tomar cualquier idea o sugerencia del grupo (comida, pomo, juegos como el Torneo de Smash Bros, películas, carpool) y convertirla en una propuesta sólida con lista de materiales y presupuesto transparente en MXN.
2. Coordinar el carpool para que nadie se quede a pie en Mérida y todos lleguen a Chelem.
3. Moderar con humor las votaciones de películas y dinámicas.
Firma o refiérete a ti mismo como 'Pus.io'.
"""

def enhance_idea_with_ai(title: str, user_notes: str, category: str = "General") -> Dict[str, Any]:
    """
    Enriches a raw idea into a structured event activity proposal.
    """
    prompt = f"""
Actúa como organizador de la Posada en Chelem 2026.
Un amigo propuso esta idea:
Título: {title}
Detalles/Notas: {user_notes}
Categoría tentativa: {category}

Devuelve un JSON estrictamente válido con las siguientes claves:
{{
  "title": "Título conciso y llamativo",
  "category": "Juegos & Torneos | Comida | Bebidas | Cine & Películas | Música & Fiesta | Logística",
  "description": "Explicación detallada y divertida de la dinámica o propuesta (2-3 oraciones)",
  "materials_needed": "Lista clara de qué objetos, equipo o insumos se deben llevar a la casa de Chelem",
  "budget_estimate": "Estimación de costo en MXN por persona o grupal (ej. '$150 MXN por persona' o 'Gratis / Traer de casa')"
}}
Responde ÚNICAMENTE con el bloque JSON.
"""
    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            return data
        except Exception as e:
            logger.warning(f"Gemini API call failed ({e}); falling back to heuristic generator.")

    # Heuristic fallback generator for seamless offline / zero-network operation
    cat_lower = (category or "").lower()
    title_lower = title.lower()

    if "smash" in title_lower or "juego" in title_lower or "torneo" in title_lower:
        resolved_category = "Juegos & Torneos"
        desc = f"Dinámica competitiva y recreativa para la posada: {title}. Diseñada para que todos participen por turnos con ambiente de fiesta."
        materials = "Consola Nintendo Switch / Controles adicionales, pantalla HDMI o proyector, regleta de corriente, marcador para bracket."
        budget = "$100 - $200 MXN para botanas o premio simbólico al campeón."
    elif "comida" in cat_lower or "carne" in title_lower or "taco" in title_lower or "asado" in title_lower:
        resolved_category = "Comida"
        desc = f"Plan gastronómico para la posada en Chelem: {title}. Pensado para disfrutar en la terraza con la brisa marina."
        materials = "Carbón, iniciador, pinzas de asador, platos y cubiertos biodegradables, servilletas y salsas caseras."
        budget = "~$150 - $250 MXN por persona en cooperación grupal."
    elif "bebida" in cat_lower or "chela" in title_lower or "vino" in title_lower or "trago" in title_lower:
        resolved_category = "Bebidas"
        desc = f"Barra y abastecimiento de líquidos: {title}. Mantener las bebidas frías y accesibles toda la noche."
        materials = "Hielera con hielo limpio, vasos reutilizables, mezcladores (refrescos, agua mineral, cítricos) y destapador."
        budget = "Cada quien aporta su consumo personal + $30 MXN para bolsas de hielo comunitarias."
    elif "pelicula" in cat_lower or "cine" in title_lower or "movie" in title_lower:
        resolved_category = "Cine & Películas"
        desc = f"Proyección cinematográfica en la sala o terraza: {title}. Sesión relajada con palomitas y botanas."
        materials = "Proyector / pantalla, cable HDMI o laptop con la película descargada, bocina para buen audio, cobijas o cojines."
        budget = "$50 MXN por persona para palomitas y botanas de cine."
    else:
        resolved_category = category if category and category != "General" else "Logística & Ambiente"
        desc = f"Propuesta para sumar a la posada de Chelem: {title}. {user_notes or 'Una excelente idea para complementar la experiencia del grupo.'}"
        materials = "Insumos necesarios acordados en el chat del grupo."
        budget = "A coordinar entre los participantes interesados."

    return {
        "title": title.strip(),
        "category": resolved_category,
        "description": desc,
        "materials_needed": materials,
        "budget_estimate": budget
    }

def enrich_movie_with_ai(title: str) -> Dict[str, Any]:
    """
    Enriches a movie title with year, genre, duration, synopsis and curator note.
    """
    prompt = f"""
Actúa como curador de cine para la Posada 2026 en la playa (Chelem).
Película: {title}

Devuelve un JSON estrictamente válido con las claves:
{{
  "title": "{title}",
  "year": 2020,
  "genre": "Género principal",
  "duration": "1h 45m",
  "synopsis": "Sinopsis breve y atractiva (máximo 2 oraciones)",
  "curator_note": "Por qué es perfecta para ver en grupo en la posada playera"
}}
Responde ÚNICAMENTE con el bloque JSON.
"""
    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            logger.warning(f"Gemini API call failed for movie ({e}); using heuristic.")

    # Heuristic fallback
    return {
        "title": title.title(),
        "year": 2022,
        "genre": "Cine para Grupo / Comedia / Aventura",
        "duration": "1h 50m",
        "synopsis": f"Una gran elección cinematográfica ({title}) con ritmo atrapante y momentos memorables para disfrutar entre amigos.",
        "curator_note": "Aprobada por la curaduría: engancha desde el primer minuto y genera conversación y risas en grupo."
    }

def chat_with_agent(message: str, user_name: str = "Amigo", user_email: str = "") -> Dict[str, Any]:
    """
    Handles interactive conversational queries from friends, with intent detection.
    """
    prompt = f"""
{SYSTEM_INSTRUCTION}

El usuario '{user_name}' ({user_email}) te dice en el chat de la posada:
"{message}"

Responde amistosamente como el Anfitrión IA (máximo 3 párrafos cortos, tono relajado y entusiasta).
Si detectas que está proponiendo claramente una idea nueva para la posada o una película, incluye un objeto 'suggested_action' en el JSON:
{{
  "reply": "Tu mensaje para {user_name}",
  "suggested_action": {{
      "action": "create_idea" | "create_movie" | "join_carpool" | null,
      "payload": {{ ... }}
  }}
}}
Responde ÚNICAMENTE en JSON.
"""
    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            logger.warning(f"Gemini chat failed ({e}); using heuristic response.")

    msg_lower = message.lower()
    suggested_action = None

    if "pelicula" in msg_lower or "peli" in msg_lower or "ver " in msg_lower:
        reply = f"¡Qué onda {user_name}! Habla Pus.io. Ese cine nocturno en Chelem con la brisa de la playa va a estar legendario. Ya tenemos Die Hard, El Grinch y Krampus en la cartelera. ¿Te late agregar otra propuesta para que el Pusio vote?"
    elif "smash" in msg_lower or "torneo" in msg_lower:
        reply = f"¡Ese Torneo de Smash Bros en Chelem es evento canónico del Pusio, {user_name}! Ya va ganando en votos. Regla clara: 3 stocks, 7 minutos, sin ítems y quien pierda en primera ronda coopera con botanas extra. ¡Afilen esos combos!"
    elif "coche" in msg_lower or "auto" in msg_lower or "aventón" in msg_lower or "viaje" in msg_lower:
        reply = f"¡Ojo ahí, {user_name}! Como dice Pus.io: en este grupo nadie se queda a pie. En la sección de Carpool puedes ver los autos de Titor y Danielito o registrar el tuyo para armar la caravana desde Mérida."
    elif "comer" in msg_lower or "carne" in msg_lower or "asado" in msg_lower:
        reply = f"¡Asado playero confirmado, {user_name}! Reyvell pone la terraza en Chelem y el Pusio pone el hambre. Ya está presupuestada la carne marinada y hamburguesas Smash al carbón. ¡Vota por la idea en el tablero!"
    else:
        reply = f"¡Qué pasó {user_name}! Aquí Pus.io al servicio de la Posada 2026. Tu propuesta suena con toda la actitud. Si quieres la subo directamente como dinámica o la afinamos con materiales y presupuesto. ¿Cómo la ves?"

    return {
        "reply": reply,
        "suggested_action": suggested_action
    }

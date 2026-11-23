#!/usr/bin/env python3
"""
Envía correos HTML personalizados de recordatorio para Posada Chelem 2026
leyendo el estado en vivo desde Supabase (posada_sync) y el clima de Chelem (Open-Meteo).

Uso:
  # 1. Prueba local sin enviar (genera vista previa HTML):
  python3 scripts/send_posada_reminders.py --test-email titorvc08@gmail.com --dry-run

  # 2. Enviar correo de prueba a UN solo destinatario:
  GMAIL_USER="titorvc08@gmail.com" GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx" \
    python3 scripts/send_posada_reminders.py --test-email titorvc08@gmail.com

  # 3. Envío automático a todos los invitados reales (usado por GitHub Actions cada 5 días):
  GMAIL_USER="titorvc08@gmail.com" GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx" \
    python3 scripts/send_posada_reminders.py --send-all
"""

import argparse
import datetime
import html
import json
import os
import re
import smtplib
import ssl
import sys
import urllib.request
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SUPABASE_URL = "https://zrxingfpnczypophqbai.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_kRulPNGJbnmw-Gj8FG_ljg_RWMFbzL2"
SITE_URL = "https://titorvc.github.io/posada-chelem-2026/"
EVENT_DATE = datetime.date(2026, 12, 19)

WMO_LABELS = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    51: "Llovizna ligera",
    53: "Llovizna",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia fuerte",
    80: "Chubascos ligeros",
    81: "Chubascos",
    95: "Tormenta eléctrica",
}


def fetch_json(url: str, headers: dict | None = None, timeout: int = 12):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_posada_state() -> dict:
    url = f"{SUPABASE_URL}/rest/v1/posada_sync?key=eq.global_state&select=data"
    rows = fetch_json(
        url,
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        },
    )
    if not rows or not rows[0].get("data"):
        raise RuntimeError("No se encontró global_state en Supabase posada_sync.")
    return rows[0]["data"]


def fetch_chelem_weather() -> dict | None:
    try:
        w_url = (
            "https://api.open-meteo.com/v1/forecast?latitude=21.2694&longitude=-89.7442"
            "&current=temperature_2m,weather_code,wind_speed_10m"
            "&daily=precipitation_probability_max,sunset&timezone=America%2FMerida&forecast_days=1"
        )
        w = fetch_json(w_url, timeout=8)
        cur = w.get("current") or {}
        daily = w.get("daily") or {}
        sunset_raw = (daily.get("sunset") or [""])[0]
        sunset = sunset_raw.split("T")[1][:5] if "T" in sunset_raw else ""
        rain = (daily.get("precipitation_probability_max") or [None])[0]
        return {
            "temp": round(cur["temperature_2m"]) if cur.get("temperature_2m") is not None else None,
            "cond": WMO_LABELS.get(cur.get("weather_code"), "Clima costero"),
            "wind": round(cur["wind_speed_10m"]) if cur.get("wind_speed_10m") is not None else None,
            "rain": round(rain) if rain is not None else None,
            "sunset": sunset,
        }
    except Exception:
        return None


def estimate_cost_mxn(item_name: str) -> int:
    n = (item_name or "").lower()
    if re.search(r"carne|arrachera|rib|sirloin|bistec|pastor|cochinita|costilla", n):
        return 950
    if re.search(r"pizza", n):
        return 780
    if re.search(r"hamburguesa|carne molida", n):
        return 650
    if re.search(r"hot\s*dog|salchicha", n):
        return 420
    if re.search(r"ceviche|camar[oó]n|pescado|marisco", n):
        return 750
    if re.search(r"pollo|alita|nugget", n):
        return 520
    if re.search(r"alcohol|cerveza|chela|tequila|ron|vodka|mezcal|whisky|vino", n):
        return 700
    if re.search(r"refresco|coca|soda|bebida", n):
        return 260
    if re.search(r"botana|papa|totopo|dorito|sabrita|cacahuate", n):
        return 300
    if re.search(r"hielo", n):
        return 180
    if re.search(r"agua|garraf", n):
        return 130
    if re.search(r"carb[oó]n|le[ñn]a", n):
        return 170
    if re.search(r"plato|cubierto|servilleta", n):
        return 140
    if re.search(r"salsa|lim[oó]n|sal", n):
        return 120
    if re.search(r"basura|bolsa", n):
        return 80
    if re.search(r"tortilla|pan|bollo", n):
        return 150
    if re.search(r"queso|jam[oó]n|tocino", n):
        return 240
    return 220


def get_claimers(item: dict) -> list[dict]:
    claimers = item.get("claimers")
    if isinstance(claimers, list) and len(claimers) > 0:
        return [c for c in claimers if isinstance(c, dict) and (c.get("name") or c.get("email"))]
    if item.get("claimedBy"):
        return [{"name": item.get("claimedBy"), "email": item.get("claimedByEmail") or ""}]
    return []


def compute_global_stats(state: dict) -> dict:
    attendees = state.get("attendees") or []
    cars = state.get("cars") or []
    collabs = state.get("collabs") or []
    additionals = state.get("additionals") or []

    confirmed = sum(1 for a in attendees if a.get("attendance") == "confirmed")
    active = [a for a in attendees if a.get("attendance") != "declined"]
    seats = sum(max(0, int(c.get("seats") or 0)) for c in cars)

    total_slots = 0
    filled_slots = 0
    total_est_cost = 0

    for c in collabs:
        for it in c.get("items") or []:
            total_slots += 1
            total_est_cost += estimate_cost_mxn(it.get("name") or "")
            if len(get_claimers(it)) > 0:
                filled_slots += 1

    for add in additionals:
        qty = max(1, int(add.get("targetQty") or 1))
        total_slots += qty
        total_est_cost += estimate_cost_mxn(add.get("name") or "")
        filled_slots += min(len(get_claimers(add)), qty)

    pct = min(100, round((filled_slots / total_slots) * 100)) if total_slots > 0 else 0
    avg_cost = round(total_est_cost / max(1, len(active)))
    missing_basics = [
        add.get("name")
        for add in additionals
        if len(get_claimers(add)) < max(1, int(add.get("targetQty") or 1))
    ]

    return {
        "total_attendees": len(attendees),
        "confirmed": confirmed,
        "seats": seats,
        "progress_pct": pct,
        "avg_cost": avg_cost,
        "missing_slots": max(0, total_slots - filled_slots),
        "missing_basics": missing_basics,
    }


def compute_member_summary(user: dict, state: dict) -> dict:
    email_low = (user.get("email") or "").strip().lower()
    name_low = (user.get("name") or "").strip().lower()
    cars = state.get("cars") or []
    collabs = state.get("collabs") or []
    additionals = state.get("additionals") or []

    def matches(cl: dict) -> bool:
        ce = (cl.get("email") or "").strip().lower()
        cn = (cl.get("name") or "").strip().lower()
        return (bool(ce) and ce == email_low) or (not ce and bool(cn) and cn == name_low)

    driver_car = next((c for c in cars if (c.get("driverEmail") or "").strip().lower() == email_low), None)
    passenger_car = next(
        (
            c
            for c in cars
            if any((p.get("email") or "").strip().lower() == email_low for p in (c.get("passengers") or []))
        ),
        None,
    )
    if driver_car:
        pcount = len(driver_car.get("passengers") or [])
        transport = f"Conductor VIP · {driver_car.get('model', 'Auto')} ({pcount}/{driver_car.get('seats', 4)} ocupados)"
    elif passenger_car:
        transport = f"Pasajero en auto de {passenger_car.get('driver', 'Conductor')} ({passenger_car.get('model', 'Auto')})"
    else:
        transport = "Sin auto asignado todavía"

    items = []
    my_total = 0

    for c in collabs:
        cat = (c.get("category") or "").lower()
        is_food = "comida" in cat or "bebida" in cat
        kind_label = "Comida & Bebida" if is_food else "Juego / Dinámica"
        accent = "#c2410c" if is_food else "#6d28d9"
        for it in c.get("items") or []:
            claimers = get_claimers(it)
            if any(matches(cl) for cl in claimers):
                share = max(1, len(claimers))
                cost = round(estimate_cost_mxn(it.get("name") or "") / share)
                my_total += cost
                others = [cl.get("name") for cl in claimers if not matches(cl) and cl.get("name")]
                items.append(
                    {
                        "name": it.get("name") or "Insumo",
                        "context": c.get("title") or kind_label,
                        "kind_label": kind_label,
                        "accent": accent,
                        "cost": cost,
                        "others": others,
                    }
                )

    for add in additionals:
        claimers = get_claimers(add)
        if any(matches(cl) for cl in claimers):
            share = max(1, len(claimers))
            qty = max(1, int(add.get("targetQty") or 1))
            cost = round(estimate_cost_mxn(add.get("name") or "") / max(share, qty))
            my_total += cost
            others = [cl.get("name") for cl in claimers if not matches(cl) and cl.get("name")]
            items.append(
                {
                    "name": add.get("name") or "Básico",
                    "context": add.get("qtyHint") or "Adicionales & Básicos",
                    "kind_label": "Adicional / Básico",
                    "accent": "#008f7a",
                    "cost": cost,
                    "others": others,
                }
            )

    att_map = {
        "confirmed": ("Confirmado", "#008f7a", "#e6f5f2"),
        "seen": ("Visto", "#2563eb", "#eff6ff"),
        "pending": ("Pendiente", "#b45309", "#fef3c7"),
        "declined": ("No voy", "#dc2626", "#fef2f2"),
    }
    att_label, att_fg, att_bg = att_map.get(user.get("attendance") or "pending", att_map["pending"])

    return {
        "transport": transport,
        "items": items,
        "my_total": my_total,
        "att_label": att_label,
        "att_fg": att_fg,
        "att_bg": att_bg,
    }


def build_email_content(user: dict, state: dict, stats: dict, weather: dict | None, is_test: bool = False):
    name = user.get("name") or "Invitado"
    summary = compute_member_summary(user, state)
    today = datetime.date.today()
    days_left = max(0, (EVENT_DATE - today).days)

    prefix = "[PRUEBA] " if is_test else ""
    subject = f"{prefix}Posada Chelem 2026 — Faltan {days_left} días · Resumen de {name}"

    weather_html = ""
    weather_txt = ""
    if weather and weather.get("temp") is not None:
        w_parts = [f"{weather['temp']}°C · {weather['cond']}"]
        if weather.get("wind") is not None:
            w_parts.append(f"Viento {weather['wind']} km/h")
        if weather.get("rain") is not None:
            w_parts.append(f"Lluvia {weather['rain']}%")
        if weather.get("sunset"):
            w_parts.append(f"Atardecer {weather['sunset']}")
        w_line = "  |  ".join(w_parts)
        weather_txt = f"Clima en Chelem hoy: {w_line}\n"
        weather_html = f"""
        <div style="margin:16px 0 0; padding:10px 14px; background:#f0fdfa; border:1px solid #ccebe6; border-radius:10px; font-size:13px; color:#115e59;">
          <strong>Chelem hoy:</strong> {html.escape(w_line)}
        </div>
        """

    if summary["items"]:
        items_html = "".join(
            f"""
            <tr>
              <td style="padding:10px 12px; border-bottom:1px solid #eceae4;">
                <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:{it['accent']};">
                  {html.escape(it['kind_label'])}
                </div>
                <div style="font-size:14px; font-weight:700; color:#111214; margin-top:2px;">
                  {html.escape(it['name'])}
                </div>
                <div style="font-size:12px; color:#5b6068; margin-top:2px;">
                  {html.escape(it['context'])}
                  {(' · Compartido con ' + html.escape(', '.join(it['others']))) if it['others'] else ' · Aporte individual'}
                </div>
              </td>
              <td align="right" style="padding:10px 12px; border-bottom:1px solid #eceae4; white-space:nowrap; font-family:monospace; font-size:13px; font-weight:700; color:#111214;">
                ~${it['cost']} MXN
              </td>
            </tr>
            """
            for it in summary["items"]
        )
        items_block_html = f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background:#ffffff; border:1px solid #e5e2da; border-radius:12px; overflow:hidden;">
          {items_html}
        </table>
        """
        items_txt = "\n".join(
            f"  - {it['name']} ({it['context']}) ~${it['cost']} MXN"
            + (f" [con {', '.join(it['others'])}]" if it["others"] else "")
            for it in summary["items"]
        )
    else:
        missing_preview = ", ".join(stats["missing_basics"][:4]) or "comida, juegos o básicos"
        items_block_html = f"""
        <div style="padding:14px 16px; background:#fff7ed; border:1px dashed #fdba74; border-radius:12px; font-size:13px; color:#9a3412;">
          <strong>Todavía no apartas ningún insumo.</strong><br/>
          Aún faltan por cubrir: {html.escape(missing_preview)}. Entra al tablero y pulsa <em>&ldquo;Yo lo llevo&rdquo;</em>.
        </div>
        """
        items_txt = f"  (Todavía sin insumos apartados. Faltan por cubrir: {missing_preview})"

    html_body = f"""<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background:#faf9f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#111214;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6; padding:24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px; background:#ffffff; border:1px solid #e5e2da; border-radius:18px; overflow:hidden;">
          <!-- Cabecera -->
          <tr>
            <td style="padding:26px 26px 20px; background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%); color:#ffffff;">
              <div style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#5eead4;">
                EL PUSIO 2026 &bull; RECORDATORIO DE POSADA
              </div>
              <h1 style="margin:8px 0 6px; font-size:26px; font-weight:800; line-height:1.15; color:#ffffff;">
                Hola {html.escape(name)}, faltan {days_left} días
              </h1>
              <p style="margin:0; font-size:14px; color:#cbd5e1;">
                Casa de Reyvell, Chelem &bull; Sábado 19 de Diciembre 2026
              </p>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td style="padding:22px 26px;">
              <!-- Estado & KPIs -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding:10px 12px; background:#faf9f6; border:1px solid #e5e2da; border-radius:10px;">
                    <span style="font-size:11px; color:#6b7280; text-transform:uppercase; font-weight:700;">Tu asistencia</span><br/>
                    <span style="display:inline-block; margin-top:4px; padding:2px 9px; border-radius:999px; font-size:12px; font-weight:700; color:{summary['att_fg']}; background:{summary['att_bg']};">
                      {html.escape(summary['att_label'])}
                    </span>
                  </td>
                  <td width="10"></td>
                  <td style="padding:10px 12px; background:#faf9f6; border:1px solid #e5e2da; border-radius:10px;">
                    <span style="font-size:11px; color:#6b7280; text-transform:uppercase; font-weight:700;">Avance grupal</span><br/>
                    <strong style="display:inline-block; margin-top:4px; font-size:14px; color:#008f7a;">
                      {stats['progress_pct']}% &bull; {stats['confirmed']}/{stats['total_attendees']} confirmados
                    </strong>
                  </td>
                </tr>
              </table>

              <!-- Transporte y Gasto -->
              <div style="padding:12px 14px; background:#faf9f6; border:1px solid #e5e2da; border-radius:12px; margin-bottom:16px; font-size:13px; line-height:1.5;">
                <div><strong>Transporte:</strong> {html.escape(summary['transport'])}</div>
                <div><strong>Gasto estimado:</strong> ~${summary['my_total']} MXN <span style="color:#6b7280;">(promedio grupo: ~${stats['avg_cost']} MXN)</span></div>
                <div style="margin-top:6px; color:#0f766e;"><strong>Recordatorio obligatorio:</strong> Llevar YETI (no habrá vasos desechables).</div>
              </div>

              <!-- Lista de aportes -->
              <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#5b6068; margin-bottom:8px;">
                Tus aportes actuales ({len(summary['items'])})
              </div>
              {items_block_html}

              {weather_html}

              <!-- CTA -->
              <div style="text-align:center; margin-top:22px;">
                <a href="{SITE_URL}" style="display:inline-block; padding:12px 24px; background:#008f7a; color:#ffffff; text-decoration:none; border-radius:10px; font-size:14px; font-weight:700;">
                  Abrir tablero de Posada Chelem 2026
                </a>
              </div>
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="padding:14px 26px; background:#faf9f6; border-top:1px solid #eceae4; font-size:11px; color:#6b7280; text-align:center;">
              Enviado automáticamente por <strong>El pusio 2026</strong> cada 5 días hasta el 19 de diciembre.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    plain_body = (
        f"Posada Chelem 2026 — Resumen de {name}\n"
        f"Faltan {days_left} días (Sábado 19 de Diciembre 2026 · Casa de Reyvell)\n\n"
        f"Asistencia: {summary['att_label']}\n"
        f"Avance grupal: {stats['progress_pct']}% ({stats['confirmed']}/{stats['total_attendees']} confirmados)\n"
        f"Transporte: {summary['transport']}\n"
        f"Gasto estimado: ~${summary['my_total']} MXN (promedio grupo: ~${stats['avg_cost']} MXN)\n"
        f"Recordatorio obligatorio: Llevar YETI (no habrá vasos desechables).\n\n"
        f"Tus aportes ({len(summary['items'])}):\n{items_txt}\n\n"
        f"{weather_txt}"
        f"Tablero en vivo: {SITE_URL}\n"
    )
    return subject, plain_body, html_body


def send_via_gmail_smtp(sender: str, app_password: str, recipient: str, subject: str, plain_body: str, html_body: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"El pusio 2026 <{sender}>"
    msg["To"] = recipient
    msg.attach(MIMEText(plain_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context, timeout=20) as server:
        server.login(sender, app_password.replace(" ", ""))
        server.sendmail(sender, [recipient], msg.as_string())


def main():
    parser = argparse.ArgumentParser(description="Envía recordatorios HTML de Posada Chelem 2026 vía Gmail SMTP.")
    parser.add_argument("--test-email", help="Envía un único correo de prueba a esta dirección.")
    parser.add_argument("--send-all", action="store_true", help="Envía a todos los asistentes reales (no declinados).")
    parser.add_argument("--dry-run", action="store_true", help="No envía correos; guarda una vista previa HTML en /tmp.")
    args = parser.parse_args()

    if not args.test_email and not args.send_all:
        parser.error("Debes pasar --test-email <correo> o --send-all")

    today = datetime.date.today()
    if args.send_all and today > EVENT_DATE:
        print(f"La posada ({EVENT_DATE}) ya pasó. No se envían más recordatorios.")
        return

    state = fetch_posada_state()
    stats = compute_global_stats(state)
    weather = fetch_chelem_weather()
    attendees = state.get("attendees") or []

    if args.test_email:
        target_email = args.test_email.strip().lower()
        user = next(
            (a for a in attendees if (a.get("email") or "").strip().lower() == target_email),
            {"name": target_email.split("@")[0].capitalize(), "email": target_email, "attendance": "confirmed"},
        )
        recipients = [(target_email, user, True)]
    else:
        recipients = []
        for a in attendees:
            em = (a.get("email") or "").strip().lower()
            if not em or "@" not in em or em.endswith("@posadachelem.com"):
                continue
            if a.get("attendance") == "declined":
                continue
            recipients.append((em, a, False))

    if args.dry_run:
        for em, user, is_test in recipients[:1]:
            subject, plain, html_out = build_email_content(user, state, stats, weather, is_test=is_test)
            preview_path = "/tmp/posada_email_preview.html"
            with open(preview_path, "w", encoding="utf-8") as f:
                f.write(html_out)
            print(f"[DRY-RUN] Destinatario: {em}")
            print(f"[DRY-RUN] Asunto: {subject}")
            print(f"[DRY-RUN] Vista previa guardada en: {preview_path}")
        return

    sender = (os.environ.get("GMAIL_USER") or "titorvc08@gmail.com").strip()
    app_password = (os.environ.get("GMAIL_APP_PASSWORD") or "").strip()
    if not app_password:
        print("ERROR: Falta la variable de entorno GMAIL_APP_PASSWORD.", file=sys.stderr)
        sys.exit(1)

    sent = 0
    for em, user, is_test in recipients:
        subject, plain, html_out = build_email_content(user, state, stats, weather, is_test=is_test)
        send_via_gmail_smtp(sender, app_password, em, subject, plain, html_out)
        print(f"OK -> {em} ({subject})")
        sent += 1

    print(f"Total enviados: {sent}")


if __name__ == "__main__":
    main()

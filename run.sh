#!/usr/bin/env bash
# Script de inicio para Posada Chelem 2026 // El Pusio
cd "$(dirname "$0")/backend" || exit 1
export PYTHONUNBUFFERED=1

echo "=========================================================="
echo " ★ POSADA 2026 // EL PUSIO EN CHELEM (CASA DE REYVELL) ★"
echo " Asistente IA: Pus.io en línea"
echo " Servidor web iniciando en: http://localhost:8000"
echo "=========================================================="

python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

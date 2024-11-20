#!/bin/bash

# Lectura de variables de entorno
if [ ! -f .env ]; then
    echo "Archivo .env no encontrado!"
    exit 1
fi
source .env

# Matar procesos de puerto
echo "Cerrando aplicaciones utilizando puerto ${API_PORT}"

API_PROCESO_EJECUCION=$(lsof -t -i:"${API_PORT}")
if [ -n "${API_PROCESO_EJECUCION}" ]; then
    echo "PID proceso a cerrar: ${API_PROCESO_EJECUCION}"
    kill "${API_PROCESO_EJECUCION}" || kill -9 "${API_PROCESO_EJECUCION}"
else
    echo "Procesos no encontrados en puerto ${API_PORT}"
fi

# Cierre tmux session existente
echo "Cerrando session existente ${API_SCREEN_NAME}"
if tmux has-session -t "${API_SCREEN_NAME}" 2>/dev/null; then
    tmux send-keys -t "${API_SCREEN_NAME}" C-c
    tmux send-keys -t "${API_SCREEN_NAME}" "exit" C-m
    tmux kill-session -t "${API_SCREEN_NAME}"
else
    echo "Session ${API_SCREEN_NAME} no existe."
fi

# Crear nueva tmux session
echo "Levantando nueva session"
echo "Nombre: ${API_SCREEN_NAME}"
echo "Entorno: ${ENVIRONMENT}"
echo ""

# Creación de la screen y ejecución de comandos
tmux new-session -d -s "${API_SCREEN_NAME}"

# ejecutar estos comandos dentro de screen
tmux send-keys -t "${API_SCREEN_NAME}" "source venv/bin/activate" C-m
tmux send-keys -t "${API_SCREEN_NAME}" "pip install -r requirements" C-m
tmux send-keys -t "${API_SCREEN_NAME}" "cd src/" C-m
tmux send-keys -t "${API_SCREEN_NAME}" "gunicorn main:app -c config.py" C-m

echo "Fin del script"
echo ""

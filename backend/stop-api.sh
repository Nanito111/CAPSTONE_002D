#!/bin/bash

# Lectura de variables de entorno
if [ ! -f .env ]; then
    echo "Archivo .env no fue encontrado!"
    exit 1
fi
source .env

# Cierre de aplicaciones existentes
echo "Cerrando aplicaciones utilizando puerto ${API_PORT}"

API_PROCESO_EJECUCION=$(lsof -t -i:"${API_PORT}")
if [ -n "${API_PROCESO_EJECUCION}" ]; then
    echo "PID proceso a cerrar: ${API_PROCESO_EJECUCION}"
    kill -9 "${API_PROCESO_EJECUCION}"
else
    echo "Procesos no encontrados en puerto ${API_PORT}"
fi

# Cierre de screen existente
if tmux has-session -t "${API_SCREEN_NAME}" 2>/dev/null; then
    echo "Cerrando screen existente ${API_SCREEN_NAME}"
    tmux send-keys -t "${API_SCREEN_NAME}" C-c
    tmux send-keys -t "${API_SCREEN_NAME}" "exit" C-m
    tmux kill-session -t "${API_SCREEN_NAME}"
else
    echo "Session ${API_SCREEN_NAME} no existe."
fi

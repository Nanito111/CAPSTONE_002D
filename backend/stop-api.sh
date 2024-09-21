#!/bin/bash

# Lectura de variables de entorno
source .env

# Cierre screen existente

echo "Cerrando aplicaciones utilizando puerto "${API_PORT}
#kill -9 $(lsof -t -i:${API_PORT})
API_PROCESO_EJECUCION=$(lsof -t -i:${API_PORT})
echo "PID proceso a cerrar: "${API_PROCESO_EJECUCION}
kill -9 ${API_PROCESO_EJECUCION}

echo "Cerrando screen existente "${API_SCREEN_NAME}
tmux send-keys -t ${API_SCREEN_NAME} C-c
tmux send-keys -t ${API_SCREEN_NAME} "exit" C-m
tmux kill-session -t ${API_SCREEN_NAME}

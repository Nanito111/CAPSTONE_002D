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

# Generación nueva screen
echo "Levantando nueva screen"
echo "Screen: "${API_SCREEN_NAME}
echo "Entorno: "${ENVIRONMENT}
echo ""

# Creación de la screen y ejecución de comandos
tmux new -s ${API_SCREEN_NAME}

# ejecutar estos comandos dentro de screen
tmux send-keys -t ${API_SCREEN_NAME} "git fetch --all" C-m
tmux send-keys -t ${API_SCREEN_NAME} "source venv/bin/activate" C-m
tmux send-keys -t ${API_SCREEN_NAME} "pip install -r requirements" C-m
tmux send-keys -t ${API_SCREEN_NAME} "cd src/" C-m
tmux send-keys -t ${API_SCREEN_NAME} "gunicorn main:app -c config.py" C-m

echo "Fin del script"
echo ""

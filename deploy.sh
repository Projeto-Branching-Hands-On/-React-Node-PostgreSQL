#!/bin/bash

# Configurações
SERVER_USER=${SERVER_USER:-ubuntu}
SERVER_IP=${SERVER_IP:-192.168.0.100}
APP_DIR=${APP_DIR:-/var/www/greenlife}

echo "🔐 Conectando ao servidor $SERVER_USER@$SERVER_IP..."
ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
  cd $APP_DIR
  echo "📦 Atualizando containers..."
  docker compose pull
  docker compose down
  docker compose up -d --build
  echo "🧱 Executando migrações..."
  docker exec -t backend npx prisma migrate deploy || echo "Nenhuma migração a aplicar"
  echo "✅ Deploy completo!"
ENDSSH
name: CI-CD Deploy

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Login no Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build e Push das imagens Docker
        run: |
          docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/greenlife-backend:latest backend
          docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/greenlife-frontend:latest frontend
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/greenlife-backend:latest
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/greenlife-frontend:latest

      - name: Preparar chave SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

      - name: Deploy remoto via SSH
        run: |
          chmod +x ./deploy.sh
          ./deploy.sh
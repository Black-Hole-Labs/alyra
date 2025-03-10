# frontend/Dockerfile

# Stage 1: Сборка Angular-приложения
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Собираем приложение в production-режиме
RUN npx ng build --configuration production

# Stage 2: Раздача статики через Nginx
FROM nginx:alpine
# Замените "your-app-name" на имя папки, которая создаётся в dist (см. angular.json)
COPY --from=builder /app/dist/black-hole/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

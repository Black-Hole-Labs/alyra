# Production Dockerfile для Render
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package файлы
COPY backend/package*.json ./

# Устанавливаем зависимости для сборки
RUN npm ci --silent

# Копируем исходный код
COPY backend/ ./

# Собираем приложение с ограничением памяти
ENV NODE_OPTIONS="--max-old-space-size=256"
RUN npm run build:backend

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Устанавливаем только необходимые пакеты
RUN apk add --no-cache dumb-init

# Копируем package файлы
COPY backend/package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production --silent && \
    npm cache clean --force && \
    rm -rf /root/.npm

# Копируем собранное приложение
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Копируем необходимые конфигурационные файлы
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/apps/backend/tsconfig.app.json ./

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Меняем владельца файлов
RUN chown -R nestjs:nodejs /app
USER nestjs

# Открываем порт
EXPOSE 3000

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=256"

# Используем dumb-init для правильного завершения процессов
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start:backend"] 
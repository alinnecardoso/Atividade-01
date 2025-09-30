FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Instala somente dependências de produção
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
# A URL do Mongo pode ser sobrescrita pelo docker-compose
ENV MONGO_URL=mongodb://localhost:27017/FatecVotorantim
CMD ["npm", "start"]


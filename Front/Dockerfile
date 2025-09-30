FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 19000 19001 19002 19006

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true

CMD ["npx", "expo", "start", "--web", "--non-interactive", "--clear"]

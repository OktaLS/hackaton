FROM node:16-alpine

WORKDIR /app

# Installer ffmpeg via apk (disponible sur Alpine)
RUN apk add --no-cache ffmpeg

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD ["npm", "start"]

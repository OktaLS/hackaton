FROM node:18

WORKDIR /app

# Définir les flags de compilation pour permettre des conversions permissives
ENV CXXFLAGS="-fpermissive"
# Définir la variable PYTHON pour node-gyp
ENV PYTHON=/usr/bin/python3

# Mettre à jour et installer les dépendances système
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    unzip \
    python3 \
    python3-dev \
    make \
    g++ \
 && rm -rf /var/lib/apt/lists/*

# Télécharger et extraire le modèle Vosk pour le français
RUN wget -O model-fr.zip "https://alphacephei.com/vosk/models/vosk-model-small-fr-0.22.zip" \
    && unzip model-fr.zip -d . \
    && mv vosk-model-small-fr-0.22 model-fr \
    && rm model-fr.zip

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD ["npm", "start"]

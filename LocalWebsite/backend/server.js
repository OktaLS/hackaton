const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
// Pour simplifier, la traduction est simulée (sans appel réel à un service externe)
const fetch = require('node-fetch');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

let messages = [];

// Endpoint pour stocker un message
app.post('/api/messages', (req, res) => {
    const message = req.body;
    messages.push(message);
    res.json({ success: true });
});

// Endpoint pour récupérer les messages avec traduction simulée si demandé
app.get('/api/messages', async (req, res) => {
    const targetLanguage = req.query.targetLanguage;
    if (targetLanguage) {
        const translatedMessages = messages.map(msg => ({
            ...msg,
            content: msg.content + ` (translated to ${targetLanguage})`
        }));
        res.json(translatedMessages);
    } else {
        res.json(messages);
    }
});

// Socket.IO : réception des "pilot-vocal" et diffusion aux autres
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');
    socket.on('pilot-vocal', (audioChunk) => {
        // Diffuse l'audio à tous sauf à l'émetteur (le pilote)
        socket.broadcast.emit('pilot-vocal', audioChunk);
    });
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Backend server écoute sur le port ${PORT}`);
});

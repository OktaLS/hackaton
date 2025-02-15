const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];

// Endpoint pour stocker un message
app.post('/api/messages', (req, res) => {
    const message = req.body;
    messages.push(message);
    res.json({ success: true });
});

// Endpoint pour récupérer les messages avec filtrage par seat et traduction simulée si demandé
app.get('/api/messages', async (req, res) => {
    const targetLanguage = req.query.targetLanguage;
    const seat = req.query.seat;
    let filteredMessages = messages;
    
    if (seat) {
        filteredMessages = messages.filter(msg => {
            if (msg.role === 'customer') {
                return msg.seat == seat;
            } else {
                // Les messages du staff ou du pilot possèdent le champ targetSeat
                return msg.targetSeat == seat;
            }
        });
    }
    
    if (targetLanguage) {
        filteredMessages = filteredMessages.map(msg => ({
            ...msg,
            content: msg.content + ` (translated to ${targetLanguage})`
        }));
    }
    
    res.json(filteredMessages);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server écoute sur le port ${PORT}`);
});

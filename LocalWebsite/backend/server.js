const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];

// Fonction de traduction locale (très simplifiée)
function localTranslate(text, targetLanguage) {
    if (!targetLanguage || targetLanguage === "en") return text;
    // Simulation de traduction : préfixe le texte avec une indication de langue
    return "TR(" + targetLanguage + "): " + text;
}

// Endpoint pour stocker un message
app.post('/api/messages', (req, res) => {
    const message = req.body;
    messages.push(message);
    res.json({ success: true });
});

// Endpoint pour récupérer les messages avec filtrage par seat et traduction locale
app.get('/api/messages', async (req, res) => {
    const targetLanguage = req.query.targetLanguage;
    const seat = req.query.seat;
    let filteredMessages = messages;
    
    if (seat) {
        filteredMessages = messages.filter(msg => {
            if (msg.role === 'customer') {
                return msg.seat == seat;
            } else if (msg.role === 'pilot') {
                // Tous les messages du pilote sont globaux
                return true;
            } else {
                // Pour les messages du staff, filtrer par targetSeat
                return msg.targetSeat == seat;
            }
        });
    }
    
    if (targetLanguage) {
        filteredMessages = filteredMessages.map(msg => ({
            ...msg,
            content: localTranslate(msg.content, targetLanguage)
        }));
    }
    
    res.json(filteredMessages);
});

// Endpoint pour la transcription audio (simulation locale)
// On attend des données audio de type 'audio/webm'
app.post('/api/transcribe', express.raw({ type: 'audio/webm', limit: '10mb' }), (req, res) => {
    // Simulation de transcription : on renvoie un texte fixe avec un timestamp
    res.json({ transcription: "Transcription simulée " + new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server écoute sur le port ${PORT}`);
});

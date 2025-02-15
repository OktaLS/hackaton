const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const vosk = require('vosk');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
app.use(cors());
app.use(express.json());
// Pour recevoir des données audio brutes de type 'audio/webm'
app.use(express.raw({ type: 'audio/webm', limit: '20mb' }));

let messages = [];

// Configuration de Vosk
vosk.setLogLevel(0);
const MODEL_PATH = path.join(__dirname, 'model-fr'); // Le dossier contenant le modèle français
if (!fs.existsSync(MODEL_PATH)) {
    console.error("Veuillez télécharger le modèle Vosk français et le placer dans " + MODEL_PATH);
    process.exit(1);
}
const model = new vosk.Model(MODEL_PATH);

// Fonction de traduction locale (très simplifiée)
function localTranslate(text, targetLanguage) {
    if (!targetLanguage || targetLanguage === "en") return text;
    return "TR(" + targetLanguage + "): " + text;
}

// Endpoint pour stocker un message
app.post('/api/messages', (req, res) => {
    const message = req.body;
    messages.push(message);
    res.json({ success: true });
});

// Endpoint pour récupérer les messages avec filtrage et traduction
app.get('/api/messages', (req, res) => {
    const targetLanguage = req.query.targetLanguage;
    const seat = req.query.seat;
    let filteredMessages = messages;
    
    if (seat) {
        filteredMessages = messages.filter(msg => {
            if (msg.role === 'customer') {
                return msg.seat == seat;
            } else if (msg.role === 'pilot') {
                // Les messages du pilote sont globaux
                return true;
            } else {
                // Pour le staff, filtrer selon targetSeat
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

// Fonction qui effectue la transcription audio avec Vosk
function transcribeAudio(tempWebmPath, outputWavPath) {
    return new Promise((resolve, reject) => {
        // Conversion du fichier WebM en WAV (16 kHz, mono) avec ffmpeg
        ffmpeg(tempWebmPath)
            .audioFrequency(16000)
            .audioChannels(1)
            .format('wav')
            .on('end', () => {
                try {
                    const wfStream = fs.createReadStream(outputWavPath, { highWaterMark: 4096 });
                    const rec = new vosk.Recognizer({ model: model, sampleRate: 16000 });
                    wfStream.on('data', (data) => {
                        rec.acceptWaveform(data);
                    });
                    wfStream.on('end', () => {
                        const result = rec.finalResult();
                        rec.free();
                        resolve(result.text || "");
                    });
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', (err) => {
                reject(err);
            })
            .save(outputWavPath);
    });
}

// Endpoint pour la transcription audio avec Vosk
app.post('/api/transcribe', async (req, res) => {
    const tempWebmPath = path.join(__dirname, 'temp_audio.webm');
    const outputWavPath = path.join(__dirname, 'temp_audio.wav');
    
    try {
        fs.writeFileSync(tempWebmPath, req.body);
    } catch (err) {
        return res.status(500).json({ error: "Erreur lors de la sauvegarde du fichier audio: " + err.message });
    }
    
    try {
        const transcript = await transcribeAudio(tempWebmPath, outputWavPath);
        // Nettoyage des fichiers temporaires
        fs.unlinkSync(tempWebmPath);
        fs.unlinkSync(outputWavPath);
        res.json({ transcription: transcript || "Aucune transcription" });
    } catch (err) {
        try { fs.unlinkSync(tempWebmPath); } catch (e) {}
        try { fs.unlinkSync(outputWavPath); } catch (e) {}
        res.status(500).json({ error: "Échec de la transcription: " + err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server écoute sur le port ${PORT}`);
});

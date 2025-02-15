document.getElementById('loginBtn').addEventListener('click', function(){
    const password = document.getElementById('passwordInput').value;
    if(password === "42"){
        document.getElementById('loginDiv').style.display = 'none';
        document.getElementById('controlPanel').style.display = 'block';
    } else {
        alert("Incorrect password!");
    }
});

document.getElementById('sendBtn').addEventListener('click', function(){
    const language = document.getElementById('languageSelect').value;
    const messageContent = document.getElementById('messageInput').value;
    const targetSeat = "all";
    const message = { 
        role: 'pilot', 
        content: messageContent, 
        language: language, 
        targetSeat: targetSeat, 
        timestamp: new Date() 
    };
    fetch("http://localhost:3001/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
    })
    .then(response => response.json())
    .then(data => {
        alert("Text message sent");
        document.getElementById('messageInput').value = "";
    })
    .catch(err => {
        console.error("Erreur lors de l'envoi du message:", err);
    });
});

let isRecording = false;
let recognition;
let fallbackRecorder;
let isFallbackRecording = false;

document.getElementById('recordAudioBtn').addEventListener('click', function() {
    // Si l'API Web Speech est disponible, on l'utilise
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        if (!isRecording) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = document.getElementById('languageSelect').value;
            
            recognition.onstart = function() {
                isRecording = true;
                document.getElementById('recordAudioBtn').textContent = "Stop Recording";
                document.getElementById('transcriptionOutput').textContent = "Listening...";
            };
            
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                document.getElementById('transcriptionOutput').textContent = "Transcription: " + transcript;
                const language = document.getElementById('languageSelect').value;
                const message = { 
                    role: 'pilot', 
                    content: transcript, 
                    language: language, 
                    targetSeat: "all", 
                    timestamp: new Date() 
                };
                fetch("http://localhost:3001/api/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(message)
                })
                .then(response => response.json())
                .then(() => {
                    alert("Audio message (transcribed) sent");
                })
                .catch(err => {
                    console.error("Erreur lors de l'envoi du message audio:", err);
                });
            };
            
            recognition.onerror = function(event) {
                console.error("Speech recognition error:", event.error);
                document.getElementById('recordAudioBtn').textContent = "Record Audio Message";
                document.getElementById('transcriptionOutput').textContent = "Error during transcription.";
                isRecording = false;
            };
            
            recognition.onend = function() {
                document.getElementById('recordAudioBtn').textContent = "Record Audio Message";
                isRecording = false;
            };
            
            recognition.start();
        } else {
            recognition.stop();
        }
    } else {
        // Fallback pour Firefox ou navigateurs ne supportant pas Web Speech API
        if (!isFallbackRecording) {
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                fallbackRecorder = new MediaRecorder(stream);
                let audioChunks = [];
                fallbackRecorder.addEventListener('dataavailable', event => {
                    if(event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                });
                fallbackRecorder.addEventListener('stop', () => {
                    let audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    fetch("http://localhost:3001/api/transcribe", {
                        method: "POST",
                        headers: { "Content-Type": "audio/webm" },
                        body: audioBlob
                    })
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('transcriptionOutput').textContent = "Transcription: " + data.transcription;
                        const language = document.getElementById('languageSelect').value;
                        const message = { 
                            role: 'pilot', 
                            content: data.transcription, 
                            language: language, 
                            targetSeat: "all", 
                            timestamp: new Date() 
                        };
                        return fetch("http://localhost:3001/api/messages", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(message)
                        });
                    })
                    .then(response => response.json())
                    .then(() => {
                        alert("Audio message (transcribed) sent");
                    })
                    .catch(err => {
                        console.error("Erreur lors de l'envoi du message audio:", err);
                    });
                });
                fallbackRecorder.start();
                isFallbackRecording = true;
                document.getElementById('recordAudioBtn').textContent = "Stop Recording";
            })
            .catch(err => {
                console.error("Erreur d'accès au micro:", err);
            });
        } else {
            fallbackRecorder.stop();
            isFallbackRecording = false;
            document.getElementById('recordAudioBtn').textContent = "Record Audio Message";
        }
    }
});

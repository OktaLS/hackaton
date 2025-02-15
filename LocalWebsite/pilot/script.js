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
  // Diffuser à tous les sièges
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

// Fonctionnalité d'enregistrement audio pour le pilot
let audioRecorder;
let isRecordingAudio = false;

document.getElementById('recordAudioBtn').addEventListener('click', function() {
  if (!isRecordingAudio) {
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
          audioRecorder = new MediaRecorder(stream);
          let audioChunks = [];
          audioRecorder.addEventListener('dataavailable', event => {
              if(event.data.size > 0) {
                  audioChunks.push(event.data);
              }
          });
          audioRecorder.addEventListener('stop', () => {
              let audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              // Envoyer le blob audio à l'endpoint de transcription
              fetch("http://localhost:3001/api/transcribe", {
                  method: "POST",
                  headers: { "Content-Type": "audio/webm" },
                  body: audioBlob
              })
              .then(response => response.json())
              .then(data => {
                  // Utiliser la transcription pour envoyer un message
                  const language = document.getElementById('languageSelect').value;
                  const targetSeat = "all";
                  const message = { 
                      role: 'pilot', 
                      content: data.transcription, 
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
                  .then(() => {
                      alert("Audio message sent");
                  })
                  .catch(err => {
                      console.error("Erreur lors de l'envoi du message audio:", err);
                  });
              });
          });
          audioRecorder.start();
          isRecordingAudio = true;
          document.getElementById('recordAudioBtn').textContent = "Stop Recording";
      })
      .catch(err => {
          console.error("Erreur d'accès au micro:", err);
      });
  } else {
      audioRecorder.stop();
      isRecordingAudio = false;
      document.getElementById('recordAudioBtn').textContent = "Record Audio Message";
  }
});

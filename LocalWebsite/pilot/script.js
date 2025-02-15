document.getElementById('loginBtn').addEventListener('click', function(){
    const password = document.getElementById('passwordInput').value;
    if(password === "42"){
        document.getElementById('loginDiv').style.display = 'none';
        document.getElementById('controlPanel').style.display = 'block';
        initSocket();
    } else {
        alert("Incorrect password!");
    }
});

let socket;
let mediaRecorder;
let isRecording = false;

function initSocket(){
    // Connexion au serveur backend (port 3001)
    socket = io("http://localhost:3001");
}

document.getElementById('pttBtn').addEventListener('click', function(){
    if(!isRecording){
        startRecording();
        this.textContent = "Stop Vocal Announce";
    } else {
        stopRecording();
        this.textContent = "Start Vocal Announce";
    }
    isRecording = !isRecording;
});

function startRecording(){
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(250); // envoi d'un chunk toutes les 250 ms
        mediaRecorder.addEventListener("dataavailable", event => {
            if(event.data.size > 0){
                socket.emit("pilot-vocal", event.data);
            }
        });
    })
    .catch(err => {
        console.error("Erreur d'accès au micro :", err);
    });
}

function stopRecording(){
    if(mediaRecorder){
        mediaRecorder.stop();
    }
}

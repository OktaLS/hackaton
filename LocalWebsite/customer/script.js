document.getElementById('loginBtn').addEventListener('click', function(){
    const seat = document.getElementById('seatInput').value;
    if(seat === ""){
        alert("Please enter your seat number");
        return;
    }
    document.getElementById('loginDiv').style.display = 'none';
    document.getElementById('customerPanel').style.display = 'block';
    initSocket();
    fetchMessages();
    setInterval(fetchMessages, 2000);
});

let socket;
function initSocket(){
    socket = io("http://localhost:3001");
    socket.on("pilot-vocal", (audioData) => {
        playAudioChunk(audioData);
    });
}

function playAudioChunk(audioData){
    // Crée un blob et joue le chunk audio (type 'audio/webm' ici)
    let blob = new Blob([audioData], { type: 'audio/webm' });
    let url = URL.createObjectURL(blob);
    let audio = new Audio(url);
    audio.play();
}

document.getElementById('sendBtn').addEventListener('click', function(){
    const messageContent = document.getElementById('messageInput').value;
    const language = document.getElementById('languageSelect').value;
    const seat = document.getElementById('seatInput').value;
    const message = { role: 'customer', seat: seat, content: messageContent, language: language, timestamp: new Date() };
    fetch("http://localhost:3001/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
    }).then(() => {
        document.getElementById('messageInput').value = "";
        fetchMessages();
    });
});

function fetchMessages(){
    const language = document.getElementById('languageSelect').value;
    fetch(`http://localhost:3001/api/messages?targetLanguage=${language}`)
    .then(res => res.json())
    .then(messages => {
        const chatBox = document.getElementById('chatBox');
        chatBox.innerHTML = "";
        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            if(msg.role === 'customer'){
                msgDiv.textContent = `[Seat ${msg.seat}] ${msg.content}`;
            } else {
                msgDiv.textContent = `[${msg.role}] ${msg.content}`;
            }
            chatBox.appendChild(msgDiv);
        });
    });
}

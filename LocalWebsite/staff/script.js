document.getElementById('loginBtn').addEventListener('click', function(){
    const password = document.getElementById('passwordInput').value;
    if(password === "41"){
        document.getElementById('loginDiv').style.display = 'none';
        document.getElementById('chatPanel').style.display = 'block';
        // Lancement du rafraîchissement des messages toutes les 2 secondes
        setInterval(fetchMessages, 2000);
    } else {
        alert("Incorrect password!");
    }
});

document.getElementById('sendBtn').addEventListener('click', function(){
    const messageContent = document.getElementById('messageInput').value;
    const language = document.getElementById('languageSelect').value;
    const targetSeat = document.getElementById('targetSeatInput').value;
    if(!targetSeat){
        alert("Please enter a target customer seat number");
        return;
    }
    const message = { 
        role: 'staff', 
        content: messageContent, 
        language: language, 
        targetSeat: targetSeat, 
        timestamp: new Date() 
    };
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
    const targetSeat = document.getElementById('targetSeatInput').value;
    if(!targetSeat){
        document.getElementById('chatBox').innerHTML = "";
        return;
    }
    fetch(`http://localhost:3001/api/messages?targetLanguage=${language}&seat=${targetSeat}`)
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

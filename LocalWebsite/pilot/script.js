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
    const targetSeat = document.getElementById('targetSeatInput').value;
    const messageContent = document.getElementById('messageInput').value;
    if(!targetSeat) {
        alert("Please enter a target seat number");
        return;
    }
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
        alert("Message sent");
        document.getElementById('messageInput').value = "";
    })
    .catch(err => {
        console.error("Erreur lors de l'envoi du message:", err);
    });
});


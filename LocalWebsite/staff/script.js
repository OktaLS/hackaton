document.getElementById('loginBtn').addEventListener('click', function(){
    const password = document.getElementById('passwordInput').value;
    if(password === "41"){
        document.getElementById('loginDiv').style.display = 'none';
        document.getElementById('chatPanel').style.display = 'block';
        fetchMessages();
        // Rafraîchissement des messages toutes les 2 secondes
        setInterval(fetchMessages, 2000);
    } else {
        alert("Incorrect password!");
    }
});

document.getElementById('sendBtn').addEventListener('click', function(){
    const messageContent = document.getElementById('messageInput').value;
    const language = document.getElementById('languageSelect').value;
    const message = { role: 'staff', content: messageContent, language: language, timestamp: new Date() };
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
            msgDiv.textContent = `[${msg.role}] ${msg.content}`;
            chatBox.appendChild(msgDiv);
        });
    });
}

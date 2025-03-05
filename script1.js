document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const imageUpload = document.getElementById("image-upload");

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    imageUpload.addEventListener("change", sendImage);

    function sendMessage() {
        let text = userInput.value.trim();
        if (text === "") return;

        appendMessage("user", text);
        userInput.value = "";

        setTimeout(() => {
            appendMessage("bot", "...");
        }, 1000);
    }

    function sendImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            appendImage("user", e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function appendMessage(sender, text) {
        let msgDiv = document.createElement("div");
        msgDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
        msgDiv.innerText = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendImage(sender, imgSrc) {
        let imgDiv = document.createElement("div");
        imgDiv.classList.add(sender === "user" ? "user-message" : "bot-message");

        let img = document.createElement("img");
        img.src = imgSrc;
        img.style.maxWidth = "200px";
        img.style.borderRadius = "10px";

        imgDiv.appendChild(img);
        chatBox.appendChild(imgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

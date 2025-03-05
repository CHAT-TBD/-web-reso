console.log("✅ Chat UI Loaded");

document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const uploadBtn = document.getElementById("upload-btn");
    const imageUpload = document.getElementById("image-upload");

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    uploadBtn.addEventListener("click", () => imageUpload.click());
    imageUpload.addEventListener("change", sendImage);
});

function appendMessage(sender, text, isImage = false) {
    let chatBox = document.getElementById("chat-box");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");

    if (isImage) {
        let img = document.createElement("img");
        img.src = text;
        img.style.maxWidth = "200px";
        img.style.borderRadius = "10px";
        messageDiv.appendChild(img);
    } else {
        messageDiv.innerText = text;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    let userText = document.getElementById("user-input").value.trim();
    if (userText === "") return;

    appendMessage("user", userText);
    document.getElementById("user-input").value = "";

    let loadingMessage = appendMessage("bot", "🤖 กำลังคิด");
    let dots = 0;
    let loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4; 
        loadingMessage.innerText = "🤖 กำลังคิด" + ".".repeat(dots);
    }, 500);

    try {
        console.log("🚀 ส่งข้อความไปที่ Gemini API:", userText);

        let response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]
            })
        });

        clearInterval(loadingInterval);

        if (!response.ok) {
            throw new Error(`❌ API ตอบกลับผิดพลาด: ${response.status} ${response.statusText}`);
        }

        let data = await response.json();
        console.log("✅ API ตอบกลับ:", data);

        let botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ ฉันไม่เข้าใจ กรุณาลองใหม่";

        appendMessage("bot", botReply);
    } catch (error) {
        clearInterval(loadingInterval);
        console.error("❌ Error:", error);
        appendMessage("bot", "⚠️ ขออภัย ระบบมีปัญหา กรุณาลองใหม่อีกครั้ง");
    }
}

function sendImage(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (e) {
        appendMessage("user", e.target.result, true);
    };
    reader.readAsDataURL(file);
}

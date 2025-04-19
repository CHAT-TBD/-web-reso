let language = "en";
let predefinedReplies = { en: {}, th: {} };

const userName = "You";
const botName = "TBD";
const userAvatar = "https://img5.pic.in.th/file/secure-sv1/1000049084ea52cf432a302e47.jpg";
const botAvatar = "https://img2.pic.in.th/pic/1000057685.jpg";

const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const langEnButton = document.getElementById("lang-en");
const langThButton = document.getElementById("lang-th");

// โหลด replies จาก GitHub
async function fetchReplies() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/CHAT-TBD/-web-reso/refs/heads/main/replies.json");
    const data = await res.json();
    predefinedReplies = data;
  } catch (error) {
    console.error("Error loading replies:", error);
  }
}

function levenshteinDistance(a, b) {
  // ... (ตามเดิม)
}

function containsKeyword(userMessage, keywords) {
  // ... (ตามเดิม)
}

function getBestMatch(userMessage, predefined) {
  // ... (ตามเดิม)
}

function getBotReply(userMessage) {
  const normalizedMessage = userMessage.toLowerCase().trim();
  const predefined = predefinedReplies[language];

  const bestMatch = getBestMatch(normalizedMessage, predefined);
  if (bestMatch) return predefined[bestMatch];

  const keywords = language === "th" ? ["ช่วย", "ถาม", "บอก"] : ["help", "question", "tell"];
  if (containsKeyword(normalizedMessage, keywords)) {
    return language === "th"
      ? "ฉันพร้อมช่วยคุณเเต่อาจจะช่วยไม่ได้มากเพราะระบบอยู่ในช่วง Beta "
      : "I'm ready to help you, but I may not be able to help much because the system is in Beta.";
  }

  const fallbackReplies = language === "en"
    ? ["Sorry, I don't understand. Can you try typing again?", "I'm not sure what you mean. Could you please explain more?"]
    : ["ขอโทษ ฉันไม่เข้าใจ ลองพิมพ์ใหม่อีกครั้งได้ไหม", "ฉันไม่แน่ใจว่าคุณหมายถึงอะไร คุณช่วยอธิบายเพิ่มเติมได้ไหม"];

  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

function addMessage(sender, text, avatar) {
  // ... (ตามเดิม)
}

function addThinkingAnimation() {
  // ... (ตามเดิม)
}

function removeThinkingAnimation(thinkingDiv) {
  // ... (ตามเดิม)
}

function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    addMessage("user", userMessage, userAvatar);
    userInput.value = "";
    const thinkingDiv = addThinkingAnimation();

    setTimeout(() => {
      const botReply = getBotReply(userMessage);
      removeThinkingAnimation(thinkingDiv);
      addMessage("bot", botReply, botAvatar);
    }, 1500);
  }
}

function switchLanguage(lang) {
  language = lang;
  if (lang === "en") {
    langEnButton.classList.add("active");
    langThButton.classList.remove("active");
    userInput.placeholder = "Type a message...";
  } else {
    langEnButton.classList.remove("active");
    langThButton.classList.add("active");
    userInput.placeholder = "พิมพ์ข้อความ...";
  }
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
langEnButton.addEventListener("click", () => switchLanguage("en"));
langThButton.addEventListener("click", () => switchLanguage("th"));

// โหลดข้อมูลเริ่มต้น
fetchReplies();

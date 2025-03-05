let language = "en"; // Default language is English

// Mock profiles
const userName = "You";
const botName = "TBD";
const userAvatar = "https://img5.pic.in.th/file/secure-sv1/1000049084ea52cf432a302e47.jpg";
const botAvatar = "https://img5.pic.in.th/file/secure-sv1/1000063411ccf04b143884aafe.jpg";

// Replies
const predefinedReplies = {
  en: {
    "ตังค์":"ว่า",
    "สตางค์":"ว่า"
  },
  th: {
    "ตังค์": "ว่า",
    "สตางค์":"ว่า"
    
    // Additional 80+ entries...
  }
};

// Elements
const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const langEnButton = document.getElementById("lang-en");
const langThButton = document.getElementById("lang-th");


// Calculate Levenshtein Distance (string similarity)
function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Check if user message contains certain keywords
function containsKeyword(userMessage, keywords) {
  return keywords.some(keyword => userMessage.includes(keyword));
}

// Get best match for the user input
function getBestMatch(userMessage, predefined) {
  const keys = Object.keys(predefined);
  let bestMatch = null;
  let bestDistance = Infinity;

  const threshold = language === "th" ? 5 : 3; // Adjust threshold by language

  keys.forEach((key) => {
    const distance = levenshteinDistance(userMessage, key.toLowerCase());
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = key;
    }
  });

  return bestDistance <= threshold ? bestMatch : null;
}

// Get bot reply
function getBotReply(userMessage) {
  const normalizedMessage = userMessage.toLowerCase().trim();
  const predefined = predefinedReplies[language];

  // Check predefined replies
  const bestMatch = getBestMatch(normalizedMessage, predefined);
  if (bestMatch) {
    return predefined[bestMatch];
  }

  // Check for keywords
  const keywords = language === "th" ? ["ช่วย", "ถาม", "บอก"] : ["help", "question", "tell"];
  if (containsKeyword(normalizedMessage, keywords)) {
    return language === "th" ? "ฉันพร้อมช่วยคุณเเต่อาจจะช่วยไม่ได้มากเพราะระบบอยู่ในช่วง Beta เเล้วก็ set Data อยู่ไอ้สัส รอก่อนไอ้ควาย" : "set Data อยู่ไอ้สัส รอก่อนไอ้ควาย";
  }

  // Fallback response
  const fallbackReplies = language === "en" 
    ? ["ขอโทษนะ กุ set Data อยู่ไอ้สัส ถามง่ายๆก่อนดิควาย", "กุset Data อยู่ไอ้สัส รอก่อนไอ้ควาย"] 
    : ["ขอโทษนะ กุ set Data อยู่ไอ้สัส ถามง่ายๆก่อนดิควาย", "กุset Data อยู่ไอ้สัส รอก่อนไอ้ควาย"];

  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

// Add message to chat
function addMessage(sender, text, avatar) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  const avatarImg = document.createElement("img");
  avatarImg.src = avatar;

  const textDiv = document.createElement("div");
  textDiv.textContent = text;

  messageDiv.appendChild(avatarImg);
  messageDiv.appendChild(textDiv);
  chatBody.appendChild(messageDiv);

  chatBody.scrollTop = chatBody.scrollHeight;
}

// Add thinking animation
function addThinkingAnimation() {
  const thinkingDiv = document.createElement("div");
  thinkingDiv.classList.add("thinking");
  thinkingDiv.innerHTML = `
    <img src="${botAvatar}" alt="Bot">
    <div class="dots">
      <span>?</span>
      <span>?</span>
      <span>?</span>
    </div>
  `;
  chatBody.appendChild(thinkingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
  return thinkingDiv;
}

// Remove thinking animation
function removeThinkingAnimation(thinkingDiv) {
  if (thinkingDiv) {
    thinkingDiv.remove();
  }
}

// Send message
function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    addMessage("user", userMessage, userAvatar);
    userInput.value = "";

    // Show thinking animation
    const thinkingDiv = addThinkingAnimation();

    setTimeout(() => {
      // Remove thinking animation and add bot reply
      const botReply = getBotReply(userMessage);
      removeThinkingAnimation(thinkingDiv);
      addMessage("bot", botReply, botAvatar);
    }, 1500); // Simulate delay for bot response
  }
}

// Switch language
function switchLanguage(lang) {
  language = lang;
  if (lang === "en") {
    langEnButton.classList.add("active");
    langThButton.classList.remove("active");
    userInput.placeholder = "Type a message...";
  } else if (lang === "th") {
    langEnButton.classList.remove("active");
    langThButton.classList.add("active");
    userInput.placeholder = "พิมพ์ข้อความ...";
  }
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
langEnButton.addEventListener("click", () => switchLanguage("en"));
langThButton.addEventListener("click", () => switchLanguage("th"));


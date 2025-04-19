const predefinedReplies = {
  thai: {
    "สวัสดี": ["สวัสดีครับ", "ดีจ้า", "หวัดดี!"],
    "เศร้า": ["ไม่เป็นไรนะ เดี๋ยวมันก็ผ่านไป", "เสียใจด้วยนะ อย่าลืมดูแลตัวเอง", "อยากกอดให้แน่นๆ เลย"],
    "เหงา": ["ฉันอยู่ตรงนี้เสมอนะ", "อยากคุยไหม?", "เราคุยกันได้นะ"],
  },
  english: {
    "hello": ["Hi there!", "Hello!", "Hey!"],
    "sad": ["Cheer up!", "Everything will be okay.", "Sending you a virtual hug."],
    "lonely": ["I'm here for you.", "You're not alone.", "Let's chat together!"],
  }
};

const synonyms = {
  thai: {
    "เศร้า": ["เสียใจ", "ท้อแท้", "หมดกำลังใจ"],
    "เหงา": ["โดดเดี่ยว", "ไม่มีใคร", "เหงาจัง"]
  },
  english: {
    "sad": ["upset", "down", "depressed"],
    "lonely": ["alone", "isolated"]
  }
};

let language = "thai"; // default language
let lastUserMessage = ""; // context memory

function matchWithSynonyms(userMessage, predefined, syns) {
  const normalized = userMessage.toLowerCase().trim();
  for (const key in predefined) {
    if (normalized.includes(key)) {
      return randomReply(predefined[key]);
    }

    if (syns[key]) {
      for (const alt of syns[key]) {
        if (normalized.includes(alt)) {
          return randomReply(predefined[key]);
        }
      }
    }
  }
  return null;
}

function saveUnknown(userMessage) {
  const unknowns = JSON.parse(localStorage.getItem("unknownMessages") || "[]");
  unknowns.push(userMessage);
  localStorage.setItem("unknownMessages", JSON.stringify(unknowns));
}

function randomReply(replies) {
  return replies[Math.floor(Math.random() * replies.length)];
}

function getBotReply(userMessage) {
  const normalized = userMessage.toLowerCase().trim();
  const predefined = predefinedReplies[language];
  const syns = synonyms[language];

  // ตัวอย่าง context memory
  if (lastUserMessage.includes("เศร้า") && normalized.includes("ทำยังไงดี")) {
    return "ลองพักผ่อน ฟังเพลง หรือระบายให้ใครสักคนฟังก็ได้นะ";
  }

  const matched = matchWithSynonyms(normalized, predefined, syns);
  lastUserMessage = normalized;

  if (matched) return matched;

  saveUnknown(userMessage);
  return language === "thai" ? "ฉันยังไม่เข้าใจคำนี้ แต่จะเรียนรู้นะ" : "I don't understand that yet, but I'm learning!";
}

function toggleLanguage() {
  language = language === "thai" ? "english" : "thai";
  document.getElementById("language-toggle").innerText =
    language === "thai" ? "เปลี่ยนเป็นอังกฤษ" : "Switch to Thai";
}

// ตัวอย่างการใช้งาน
document.getElementById("send-button").addEventListener("click", function () {
  const userInput = document.getElementById("user-input").value;
  const botReply = getBotReply(userInput);

  const chatArea = document.getElementById("chat-area");

  const userDiv = document.createElement("div");
  userDiv.classList.add("user-message");
  userDiv.innerText = userInput;

  const botDiv = document.createElement("div");
  botDiv.classList.add("bot-message");
  botDiv.innerText = botReply;

  chatArea.appendChild(userDiv);
  chatArea.appendChild(botDiv);

  document.getElementById("user-input").value = "";
});

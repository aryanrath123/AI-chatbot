const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
let userMessage;

const API_KEY = "AIzaSyAmAUFwr6G-wPRVPE1gF3wrP1kDk4iPhIo"; // Replace with your actual API key
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);

  if (className === "incoming") {
    chatLi.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
  } else {
    chatLi.innerHTML = `<p>${message}</p>`;
  }

  return chatLi;
};

const generateResponse = () => {
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
  const incomingChatLi = chatbox.querySelector(".incoming:last-child");
  const messageElement = incomingChatLi.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    }),
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if (data.candidates && data.candidates.length > 0) {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
      } else {
        messageElement.textContent = "No response received.";
      }
    })
    .catch((error) => {
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;
  chatbox.append(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("Typing...", "incoming");
    chatbox.append(incomingChatLi);
    generateResponse();
  }, 600);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);

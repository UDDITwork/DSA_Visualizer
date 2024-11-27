document.addEventListener('DOMContentLoaded', (event) => {
    loadChatHistory();
});

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message === '') return;

    const chatbox = document.getElementById('chatbox');
    const userMessageElement = createUserMessageElement(message);
    chatbox.appendChild(userMessageElement);

    saveMessageToLocalStorage('user', message);
    userInput.value = '';

    // Scroll to bottom after adding user message
    chatbox.scrollTop = chatbox.scrollHeight;

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: message }),
        });

        if (!response.ok) {
            throw new Error('Failed to get response from the server');
        }

        const data = await response.json();
        const botMessageElement = createBotMessageElement('');
        chatbox.appendChild(botMessageElement);
        saveMessageToLocalStorage('bot', '');

        // Scroll to bottom after adding bot message
        chatbox.scrollTop = chatbox.scrollHeight;

        displayBotMessageWordByWord(data.response, botMessageElement);
    } catch (error) {
        console.error('Error:', error);
        const botMessageElement = createBotMessageElement('Failed to get response from the server');
        chatbox.appendChild(botMessageElement);
        saveMessageToLocalStorage('bot', 'Failed to get response from the server');
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}

function createUserMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message user-message';
    messageElement.textContent = message;
    return messageElement;
}

function createBotMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message bot-message';
    messageElement.innerHTML = message; // Use innerHTML to allow HTML content
    return messageElement;
}

function saveMessageToLocalStorage(sender, message) {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ sender, message });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    const chatbox = document.getElementById('chatbox');

    chatHistory.forEach(chat => {
        const messageElement = chat.sender === 'user'
            ? createUserMessageElement(chat.message)
            : createBotMessageElement(chat.message);
        chatbox.appendChild(messageElement);
    });

    // Scroll to bottom after loading chat history
    chatbox.scrollTop = chatbox.scrollHeight;
}

function displayBotMessageWordByWord(message, element) {
    // Convert Markdown-like formatting to HTML
    const formattedMessage = convertMarkdownToHTML(message);

    // Remove unwanted backticks
    const cleanMessage = formattedMessage.replace(/`+/g, '');

    // Replace new lines with <br> tags
    const messageWithBreaks = cleanMessage.replace(/\n/g, '<br>');

    let currentIndex = 0;
    const words = messageWithBreaks.split(/(\s+)/); // Split by space and keep spaces

    const interval = setInterval(() => {
        if (currentIndex < words.length) {
            element.innerHTML += words[currentIndex];
            currentIndex++;
        } else {
            clearInterval(interval);
            saveMessageToLocalStorage('bot', element.innerHTML);
        }
    }, 50); // Adjust the delay as needed
}

function convertMarkdownToHTML(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.+?)\*/g, '<em>$1</em>'); // Italic
}

function goBack() {
    window.history.back();
}

function deleteChatHistory() {
    localStorage.removeItem('chatHistory');
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML = ''; // Clear chatbox visually
}

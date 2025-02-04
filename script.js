// Hardcoded accounts with 10 users
const accounts = {
    "user1": "password1",
    "user2": "password2"
   
};

// Store current user info and the selected user to message
let currentUser = localStorage.getItem('currentUser') || ""; // Retain currentUser from localStorage if available
let selectedUser = "";

// Retrieve chat history from localStorage
function getChatHistory() {
    const storedHistory = localStorage.getItem('chatHistory');
    return storedHistory ? JSON.parse(storedHistory) : {};
}

// Save chat history to localStorage
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Initialize chat history
let chatHistory = getChatHistory();

// Retrieve unread messages from localStorage
function getUnreadMessages() {
    const storedUnreadMessages = localStorage.getItem('unreadMessages');
    return storedUnreadMessages ? JSON.parse(storedUnreadMessages) : {};
}

// Save unread messages to localStorage
function saveUnreadMessages() {
    localStorage.setItem('unreadMessages', JSON.stringify(unreadMessages));
}

// Initialize unread messages
let unreadMessages = getUnreadMessages();

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (accounts[username] && accounts[username] === password) {
        currentUser = username;
        localStorage.setItem('currentUser', currentUser); // Save currentUser to localStorage

        // Show the user selection screen
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('select-user-container').style.display = 'block';

        populateUserList(); // Populate list of users to message
        checkForUnreadMessages(); // Check if there are unread messages
    } else {
        errorMessage.textContent = "Invalid username or password.";
    }
}

// Check for unread messages and show notification with the sender's name
function checkForUnreadMessages() {
    const notificationContainer = document.getElementById('notification-container');
    notificationContainer.innerHTML = ""; // Clear previous notifications

    // Loop through unreadMessages to check if there are any unread messages for the current user
    for (let sender in unreadMessages) {
        if (unreadMessages[sender] > 0 && sender !== currentUser) {
            const notificationMessage = document.createElement('p');
            notificationMessage.textContent = `You have a message from ${sender}.`;
            notificationContainer.appendChild(notificationMessage);
        }
    }
}

// Populate user list to choose from for messaging
function populateUserList() {
    const userListContainer = document.getElementById('user-list');
    userListContainer.innerHTML = ""; // Clear previous list

    for (let username in accounts) {
        if (username !== currentUser) {
            const userElement = document.createElement("div");
            userElement.textContent = username;
            userElement.classList.add("user-item");

            // Check if this user has unread messages
            if (unreadMessages[username] && unreadMessages[username] > 0) {
                userElement.classList.add("unread");  // Add the unread class for styling
            }
            
            userElement.onclick = () => selectUser(username);
            userListContainer.appendChild(userElement);
        }
    }
}

// Select a user to message
function selectUser(username) {
    selectedUser = username;
    document.getElementById('selected-user').textContent = `You are messaging: ${selectedUser}`;

    // Hide the user selection screen and show the chat container
    document.getElementById('select-user-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    // Mark messages as read when user enters the chat with selectedUser
    if (unreadMessages[currentUser] && unreadMessages[currentUser] > 0) {
        unreadMessages[currentUser] = 0;  // Reset unread message count for currentUser
        saveUnreadMessages();
    }

    renderChat();
}

// Send message function
function sendMessage() {
    const message = document.getElementById("message-input").value.trim();
    if (message) {
        // Add message to both the current user's and selected user's chat history
        if (!chatHistory[currentUser]) chatHistory[currentUser] = {};
        if (!chatHistory[selectedUser]) chatHistory[selectedUser] = {};

        chatHistory[currentUser][selectedUser] = chatHistory[currentUser][selectedUser] || [];
        chatHistory[selectedUser][currentUser] = chatHistory[selectedUser][currentUser] || [];

        chatHistory[currentUser][selectedUser].push({ sender: currentUser, text: message });
        chatHistory[selectedUser][currentUser].push({ sender: currentUser, text: message });

        // Increment unread message count for the recipient (selectedUser)
        if (!unreadMessages[selectedUser]) unreadMessages[selectedUser] = 0;
        unreadMessages[selectedUser] += 1; // Increase unread message count for recipient
        saveUnreadMessages();

        saveChatHistory();  // Save chat history to localStorage
        document.getElementById("message-input").value = "";  // Clear message input
        renderChat();  // Re-render the chat window
    }
}

// Render chat function
function renderChat() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";  // Clear previous messages

    // Get chat history between currentUser and selectedUser
    const chatBetweenUsers = chatHistory[currentUser][selectedUser] || [];

    chatBetweenUsers.forEach((msg) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", msg.sender === currentUser ? "sent" : "received");
        messageElement.textContent = msg.text;
        chatBox.appendChild(messageElement);
    });

    // Scroll to the latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Log out function
function logout() {
    // Clear the current user and chat history from localStorage
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('unreadMessages');
    localStorage.removeItem('currentUser');
    currentUser = "";
    selectedUser = "";

    // Show the login container and hide the chat container
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('select-user-container').style.display = 'none';
}

// Function to go back to user selection screen
function goBackToUserSelection() {
    // Show the user selection container and hide the chat container
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('select-user-container').style.display = 'block';
}

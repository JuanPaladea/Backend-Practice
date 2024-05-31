const socket = io();

const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

socket.on('messages', renderMessages);
sendButton.addEventListener('click', sendMessage);

const renderMessages = async () => {
  try {
    const response = await axios.get('/api/messages');
    const messages = response.data.messages;
    messagesContainer.innerHTML = '';
    messages.forEach((message) => {
      const messageElement = document.createElement('div');
      messageElement.innerText = message.message;
      messagesContainer.appendChild(messageElement);
    });
  } catch (error) {
    console.error(error);
  }
}

const sendMessage = async () => {
  try {
    const messageInput = messageInput.value;
    const message = await axios.post('/api/messages', { message });
    messageInput.value = '';
    socket.emit('newMessage', message.data);
  } catch (error) {
    console.error(error);
  }
}

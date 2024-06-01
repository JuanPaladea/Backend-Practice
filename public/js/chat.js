const socket = io();

const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

const renderMessages = async () => {
  try {
    const response = await axios.get('/api/messages');
    const messages = response.data.messages;
    messagesContainer.innerHTML = '';
    messages.forEach((message) => {
      const messageElement = document.createElement('div');
      messageElement.innerHTML = `
        <div class="flex items-end">
          <div class="flex flex-col text-xs max-w-xs mx-2 order-2 items-start py-2">
            <div><span class='px-4 py-2 rounded-lg inline-block rounded-tr-none bg-blue-600 text-white'>${message.email || message.firstName}</span></div>
            <div><span class='px-4 py-2 rounded-lg inline-block rounded-tl-none bg-gray-300 text-gray-600'>${message.message}</span></div>
          </div>
        </div>
      `;
      messagesContainer.appendChild(messageElement);
    });
  } catch (error) {
    alert('Error loading messages', error.message);
  }
}
renderMessages();

const sendMessage = async () => {
  try {
    const messageText = messageInput.value;
    await axios.post('/api/messages', { message: messageText});
    messageInput.value = '';
    socket.emit('newMessage');
  } catch (error) {
    alert('Error sending message', error.message);
  }
}

socket.on('newMessage', renderMessages);
sendButton.addEventListener('click', sendMessage);
const socket = io();

socket.emit('mensaje','Mensaje recibido desde el cliente');
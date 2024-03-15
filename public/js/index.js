const socket = io();

socket.emit('mensaje','Mensaje recibido desde el cliente');

function handleAddProduct() {
  const formData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
  }

  socket.emit('addProduct', formData);
}

function handleDeleteProduct(productId) {
  socket.emit('deleteProduct', productId);
}
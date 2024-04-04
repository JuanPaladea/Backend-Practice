const socket = io();

socket.emit('mensaje','Mensaje recibido desde el cliente');

// Solicita al servidor los productos para renderizar por primera vez, get Products emite un receiveProducts que envia los products al cliente; al escuchar el receiveProducts llama a RenderProducts
function getProducts() {
  socket.emit('getProducts')
}
getProducts()

socket.on('receiveProducts', products => {
  renderProducts(products);
});

function addProduct() {
  const productData = {
    title: document.getElementById('title').value,
    description : document.getElementById('description').value,
    price : document.getElementById('price').value,
    status: true,
    thumbnails: document.getElementById('thumbnails').value || "",
    code: document.getElementById('code').value,
    stock: document.getElementById('stock').value,
    category: document.getElementById('category').value
  }

  socket.emit('addProduct', productData);
  getProducts()
  
  document.getElementById('title').value = ""
  document.getElementById('description').value = ""
  document.getElementById('price').value = ""
  document.getElementById('thumbnails').value = ""
  document.getElementById('code').value = ""
  document.getElementById('stock').value = ""
  document.getElementById('category').value = ""
}

function deleteProduct(productId) {
  socket.emit('deleteProduct', +productId)
  getProducts()
}


function renderProducts(products) {
  const productsContainer = document.getElementById("products-container");
  let productCardsHTML = '';
  
  products.forEach(product => {
    productCardsHTML += `
    <div class="product-card">
      <img class="product-thumbnail" src="${product.thumbnails}" alt="Product Thumbnail">
      <div class="product-details">
        <p class="product-title">${product.title}</p>
        <p class="product-description">${product.description}</p>
        <p class="product-price">$${product.price}</p>
        <p class="product-stock">Stock: ${product.stock}</p>
        <p class="product-code">Code: ${product.code}</p>
      </div>
      <div class="product-actions">
        <button class="delete-button" onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    </div>
    `;
  });

  productsContainer.innerHTML = productCardsHTML;
}

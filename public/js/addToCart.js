const addToCartButton = document.getElementById('addToCartButton');
const productId = addToCartButton.dataset.productId

addToCartButton.addEventListener('click', async () => {
  try {
    const response = await axios.post('/api/carts/');
    const cartId = response.data.cart._id
    const cartResponse = await axios.post(`/api/carts/${cartId}/products/${productId}`)
    alert(cartResponse.data.status + ' ' + cartResponse.data.message)
  } catch (error) {
    console.error(error);
  }
});
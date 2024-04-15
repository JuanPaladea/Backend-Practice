const addToCartButton = document.getElementById('addToCartButton');
const productId = addToCartButton.dataset.productId;

addToCartButton.addEventListener('click', async () => {
  console.log('click')
  try {
    const response = await axios.post('/api/carts/');
    console.log(response)
    console.log(productId)
    
    const cartId = response.data.cart._id
    console.log(cartId)
    await axios.post(`api/carts/${cartId}/products/${productId}`)
  } catch (error) {
    console.error(error);
  }
});
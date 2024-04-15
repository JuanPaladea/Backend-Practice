import axios from "axios";

const addToCartButton = document.getElementById('addToCartButton');
const productId = addToCartButton.dataset.productId;

addToCartButton.addEventListener('click', async () => {
  try {
    const response = await axios.post('/api/carts/');
    const cartId = response.data;
    console.log(response)
    // Add product to the cart
    await axios.post(`api/carts/${cartId}/products/${productId}`, { quantity: 1 });
  } catch (error) {
    console.error(error);
  }
});
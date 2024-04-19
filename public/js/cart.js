const deleteButtons = document.querySelectorAll('.deleteButton');

deleteButtons.forEach(deleteButton => {
  deleteButton.addEventListener('click', async () => {
    const cartId = deleteButton.getAttribute('data-cart-id');
    const productId = deleteButton.getAttribute('data-product-id');
    console.log(cartId, productId);
    try { 
      const response = await axios.delete(`/api/carts/${cartId}/products/${productId}`);
      alert(response.data);
    } catch (error) {
      console.error(error);
    }
    location.reload()
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const deleteProductFromCart = document.querySelectorAll('.deleteProductFromCart')
  deleteProductFromCart.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cartId = form.getAttribute('data-cart-id');
      const productId = form.getAttribute('data-product-id');
      if (!cartId || !productId) {
        alert('No cart or product ID');
        return;
      }

      try {
        const response = await axios.delete(`/api/carts/${cartId}/products/${productId}`);
        alert(response.data.status + ' ' + response.data.message);
      } catch (error) {
        alert('Error deleting product from cart', error.message);
      }
      location.reload()
    });
  });
});
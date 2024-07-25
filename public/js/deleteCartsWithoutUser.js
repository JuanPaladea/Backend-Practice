document.addEventListener('DOMContentLoaded', () => {
  const deleteCartsWithoutUser = document.getElementById('deleteCartsWithoutUser');
  deleteCartsWithoutUser.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete('/api/carts/deleteCarts');
      alert(response.data.status + ' ' + response.data.message);
    } catch (error) {
      alert('Error deleting carts without user', error);
    }
    location.reload()
  })
})
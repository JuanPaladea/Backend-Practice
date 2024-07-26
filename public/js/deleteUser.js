document.addEventListener('DOMContentLoaded', () => {
  const deleteUser = document.querySelectorAll('.deleteUser');
  deleteUser.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userId = form.getAttribute('data-user-id');

      try {
        const response = await axios.delete(`/api/session/${userId}`);
        alert(response.data.status + ' ' + response.data.message);
      } catch (error) {
        alert('Error deleting user', error.message);
      }
      location.reload()
    })
  });
})
document.addEventListener('DOMContentLoaded', () => {
  const deleteUnactiveUsers = document.getElementById('deleteUnactiveUsers');
  deleteUnactiveUsers.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete('/api/session/');
      alert(response.data.status + ' ' + response.data.message);
    } catch (error) {
      alert('Error deleting unactive users ' + error.message);
    }
    location.reload()
  })
})
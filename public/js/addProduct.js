const productForm = document.getElementById('addProductForm')
const productTitle = document.getElementById('title')
const productDescription = document.getElementById('description')
const productCode = document.getElementById('code')
const productPrice = document.getElementById('price')
const productStock = document.getElementById('stock')
const productCategory = document.getElementById('category')
const productThumbnails = document.getElementById('thumbnails')

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(productForm)

  const product = {}
  
  formData.forEach((value, key) => {
    product[key] = value;
  });

  try {
    const response = await axios.post('/api/products/', {product})
    alert(response.data.status + ' ' + response.data.message)
  } catch (error) {
    alert('Error adding product', error.message)
  }

  productTitle.value = '';
  productDescription.value = '';
  productCode.value = '';
  productPrice.value = '';
  productStock.value = '';
  productCategory.value = '';
  productThumbnails.value = '';
})

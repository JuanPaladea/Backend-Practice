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
  
  console.log(product)
  
  try {
    const response = await axios.post('/products/add', {product})
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
})

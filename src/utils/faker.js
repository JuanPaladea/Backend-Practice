import { fakerES } from "@faker-js/faker";

export const generateProducts = (q) => {
  let numOfProducts = q
  let products = []

  for (let i = 0; i < numOfProducts; i++) {
    products.push({
      title: fakerES.commerce.productName(),
      description: fakerES.commerce.productDescription(),
      code: fakerES.number.int(1000),
      price: fakerES.number.int(100),
      stock: fakerES.number.int(100),
      category: fakerES.commerce.productMaterial(),
      thumbnails: [fakerES.image.url()]
    })
  }

  return products
}
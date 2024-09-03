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
      status: true,
      stock: fakerES.number.int(100),
      category: fakerES.commerce.productMaterial(),
      thumbnails: [fakerES.image.url()],
      owner: fakerES.database.mongodbObjectId()
    })
  }

  return products
}

export const generateProduct = () => {
  return {
    title: fakerES.commerce.productName(),
    description: fakerES.commerce.productDescription(),
    code: fakerES.number.int(1000),
    price: fakerES.number.int(100),
    stock: fakerES.number.int(100),
    category: fakerES.commerce.productMaterial(),
    thumbnails: [fakerES.image.url()],
  }
}

export const generateUser = () => {
  let email = fakerES.internet.email()
  let password = fakerES.internet.password()

  return {
    firstName: fakerES.person.firstName(),
    lastName: fakerES.person.lastName(),
    email: email,
    email2: email,
    age: fakerES.number.int(100),
    password: password,
    password2: password,
    avatar: fakerES.person.firstName()
  }
}

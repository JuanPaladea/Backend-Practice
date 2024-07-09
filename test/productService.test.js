import productService from "../src/services/productService.js";

describe("productService", () => {
  describe("getProducts", () => {
    it("should return an array of products", async () => {
      const limit = 10;
      const page = 1;
      const query = {};
      const sort = { name: 1 };

      const products = await productService.getProducts(limit, page, query, sort);

      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    it("should return products based on the provided query", async () => {
      const limit = 10;
      const page = 1;
      const query = { category: "electronics" };
      const sort = { name: 1 };

      const products = await productService.getProducts(limit, page, query, sort);

      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);

      products.forEach((product) => {
        expect(product.category).toBe("electronics");
      });
    });

    it("should return products sorted by name in ascending order", async () => {
      const limit = 10;
      const page = 1;
      const query = {};
      const sort = { name: 1 };

      const products = await productService.getProducts(limit, page, query, sort);

      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);

      let previousName = null;
      products.forEach((product) => {
        if (previousName) {
          expect(product.name).toBeGreaterThan(previousName);
        }
        previousName = product.name;
      });
    });
  });
});
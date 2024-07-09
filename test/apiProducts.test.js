import * as chai from 'chai';
const expect = chai.expect;

describe('ApiProducts', () => {
  describe('GET /products', () => {
    it('should return a list of products', async () => {
      const response = await axios.get(`${BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${authToken}`}
      });
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('productos encontrados');
      expect(response.body.products).to.be.an('array');
    });
  })
});
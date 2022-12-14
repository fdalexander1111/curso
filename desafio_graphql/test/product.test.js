import assert from 'assert';
import chai from 'chai';
import supertest from 'supertest';
const expect = chai.expect;
const agent = supertest("http://localhost:8080");


describe('berificamos las apis de productos', function () {

    let product;
    beforeEach(()=> {
      product = {
        title: "Producto desde test",
        price: 1010,
        thumbnail: "foto test"
      }
    });
    it('deberia devolver un estatus 200 y salvar un producto', async function () {
        const response = await agent.post("/api/productos/")
        .send(product);
        const body = response.body;
        console.log(body)
        expect(response.status).to.eql(200);
        expect(body).to.include.keys('status', 'message', 'code','result');
        expect(body.result.title).to.eql(product.title);
    });
});


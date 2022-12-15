import assert from 'assert';
import chai from 'chai';
import supertest from 'supertest';
const expect = chai.expect;
const agent = supertest("http://localhost:8080");


describe('berificamos las apis de productos', function () {

    let product;
    let productEdit;
    let productDelete;

    beforeEach(()=> {
        product = {
            title: "Producto desde test",
            price: 1010,
            thumbnail: "foto test"
        }
        
        productEdit = {
            id: "63987d5d4ad609d82b083502",
            title: "Producto edit desde test",
            price: 1111,
            thumbnail: "foto test edit"
        }

        productDelete = {
            id: "639a70584ad609d82b083521"
        }
    });
    it('deberia devolver un estatus 200 y salvar un producto', async function () {
        const response = await agent.post("/api/productos/")
        .send(product);
        const body = response.body;
        expect(response.status).to.eql(200);
        expect(body).to.include.keys('status', 'message', 'code','result');
        expect(body.result.title).to.eql(product.title);
    });

    it('deberia devolver un estatus 200 y editar un producto', async function () {
        console.log(product);
        const response = await agent.put(`/api/productos/${productEdit.id}`)
        .send(productEdit);
        const body = response.body;
        expect(response.status).to.eql(200);
        expect(body).to.include.keys('status', 'message', 'code','product');
        expect(body.product.title).to.eql(productEdit.title);
    });

    it('deberia devolver un estatus 200 y eliminar un producto', async function () {
        console.log(product);
        const response = await agent.delete(`/api/productos/${productDelete.id}`)
        .send(productDelete);
        const body = response.body;
        expect(response.status).to.eql(200);
        expect(body).to.include.keys('status', 'message', 'code');
    });
});


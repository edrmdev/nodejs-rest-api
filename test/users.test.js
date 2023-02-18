const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const router = require('../routes/usuarios');
require('dotenv').config();

const app = new express();
app.use( express.json());
app.use('/', router);

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_ATLASCNN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
  });
  
/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
});

describe('User Get Transactions /usuarios', () => {

    test('should respond with a 200 status code', async () => {
        const response = await request(app).get('/').send()
        expect( response.statusCode).toBe(200);
        console.log(response);
    });

    test( 'should response with header content-type as application/json', async() => {
        const res = await request(app).get('/').send()
        expect( res.header['content-type'] ).toBe('application/json; charset=utf-8');
        console.log(res);
    })

    test( 'should response with an users array', async () => {

    })
})
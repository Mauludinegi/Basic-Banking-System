const request = require('supertest'),
    { app, server } = require('../utils/createServer');
const jwt = require('jsonwebtoken');
const createToken = require('../utils/createToken')
require('dotenv').config();
const secret_key = process.env.JWT_KEY || 'no_secret';



describe('GET /', () => {
    test('Return status: 200 and a hello world message', done => {
        request(app).get('/').then(res => {
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('status')
            expect(res.body).toHaveProperty('message')
            expect(res.body.status).toBe(true)
            expect(res.body.message).toEqual("Hello World!")
            done();
        });
    });
});


// =========> Register <==============
describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
        const newUser = {
            name: 'Do Test',
            email: 'test@example.com',
            password: 'password123',
            identity_number: '1234567890',
            identity_type: 'ID Card',
            address: '123 Main St, City'
        };


        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(newUser)
            .expect(201);


        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', newUser.name);
        expect(response.body.data).toHaveProperty('email', newUser.email);


    });

    it('should return 500 on invalid registration data', async () => {

        const invalidUser = {
            name: 1234,
            email: 'johndoe',
            password: 2345,
            identity_number: '1234567890',
            identity_type: 'ID Card',
            address: '123 Main St, City'
        };


        await request(app)
            .post('/api/v1/auth/register')
            .send(invalidUser)
            .expect(400);
    });
});


// =========> Login <==============
describe('POST /api/v1/auth/login', () => {
    it('should respond with a token on valid login', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data.token');
    });

    it('should respond with 404 on invalid user', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'testpassword'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Users Not Found');
    });

    it('should respond with 403 on invalid credentials', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty('error', 'Invalid credentianls');
    });
});


// ===========> Authenticate <===============
describe('GET /api/v1/auth/authenticate', () => {
    it('should return user profile with valid token', async () => {

        const validToken = await createToken({ id: 1, username: 'test@example.com' });
        // Lakukan permintaan GET ke endpoint /api/v1/auth/authenticate dengan token yang valid
        const response = await request(app)
            .get('/api/v1/auth/authenticate')
            .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('email');
            expect(response.body.data).toHaveProperty('name');
            expect(response.body.data).toHaveProperty('profile');
        // Selainnya, Anda dapat menambahkan lebih banyak pengujian sesuai kebutuhan Anda
    });

    it('should return 401 Unauthorized with invalid token', async () => {
        const response = await request(app)
            .get('/api/v1/auth/authenticate')
            .set('Authorization', 'Bearer invalid-access-token');

        expect(response.status).toBe(401);
    });
});

afterAll(() => {
    server.close();
});




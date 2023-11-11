const request = require('supertest'),
    { app, server } = require('../utils/createServer'),
    utils = require('../utils/encryptPass')

describe('BASIC BANK API', () => {
    it('All related to users', async () => {
        try {

            // =========== TESTING CREATE ============
            const createUser = await request(app).post('/api/v1/users').send({
                name: 'Do Test',
                email: 'test@example.com',
                password: 'password123',
                identity_number: '1234567890',
                identity_type: 'ID Card',
                address: '123 Main St, City'
            })

            expect(createUser.status).toBe(201);
            expect(createUser.body).toHaveProperty('data');
            expect(createUser.body.data).toHaveProperty('name');
            expect(createUser.body.data).toHaveProperty('email');
            expect(createUser.body.message).toBe('User registered succesfully');


            // =========== TESTING GET ============
            const getAllUser = await request(app).get('/api/v1/users');

            expect(getAllUser.status).toBe(200);
            expect(getAllUser.body.message).toBe('Success get all user');
            expect(getAllUser.body.data.length).toBeGreaterThan(0);

            const userId = 1;
            const newPassword = 'newPassword123';


            // =========== TESTING UPDATE ============
            const update = await request(app)
                .put(`/api/v1/users/${userId}`)
                .send({
                    name: 'New Name',
                    email: 'newemail@example.com',
                    password: await utils.cryptPassword(newPassword),
                    identity_number: '1234567890',
                    identity_type: 'Passport',
                    address: 'New Address'
                });

            expect(update.status).toBe(200);
            expect(update.body.message).toBe('User and profile updated successfully');
            

            // =========== TESTING DELETE ============
            const userIdDelete = 1;

            const deleteUser = await request(app).delete(`/api/v1/users/${userIdDelete}`);

            expect(deleteUser.status).toBe(200);
            expect(deleteUser.body.message).toBe('User and related data deleted successfully');

            
        } catch (err) {
            expect(err).toBe('error');
        }
    })
})

afterAll(() => {
    server.close();
});

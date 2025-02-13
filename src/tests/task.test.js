const request = require('supertest');
const app = require('../app');
const { setupTestDb, clearTestDb, pool } = require('./setup');

beforeAll(async () => {
    await setupTestDb();
});

afterEach(async () => {
    await clearTestDb();
});

afterAll(async () => {
    await pool.end();
});

describe('Task API', () => {
    describe('POST /tasks', () => {
        it('should create a new task', async () => {
            const response = await request(app)
                .post('/tasks')
                .send({
                    title: 'Test Task',
                    description: 'Test Description',
                    due_date: '2024-12-31T00:00:00.000Z'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Test Task');
            expect(response.body.description).toBe('Test Description');
        });

        it('should return 400 if title is missing', async () => {
            const response = await request(app)
                .post('/tasks')
                .send({
                    description: 'Test Description'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /tasks', () => {
        it('should return all tasks', async () => {
            // Create a test task first
            await request(app)
                .post('/tasks')
                .send({
                    title: 'Test Task',
                    description: 'Test Description'
                });

            const response = await request(app).get('/tasks');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update a task', async () => {
            // Create a test task
            const createResponse = await request(app)
                .post('/tasks')
                .send({
                    title: 'Test Task',
                    description: 'Test Description'
                });

            const taskId = createResponse.body.id;

            const response = await request(app)
                .put(`/tasks/${taskId}`)
                .send({
                    title: 'Updated Task',
                    description: 'Updated Description'
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Task');
            expect(response.body.description).toBe('Updated Description');
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task', async () => {
            // Create a test task
            const createResponse = await request(app)
                .post('/tasks')
                .send({
                    title: 'Test Task',
                    description: 'Test Description'
                });

            const taskId = createResponse.body.id;

            const response = await request(app)
                .delete(`/tasks/${taskId}`);

            expect(response.status).toBe(200);

            // Verify task is deleted
            const getResponse = await request(app).get('/tasks');
            expect(getResponse.body.length).toBe(0);
        });
    });
}); 
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.TEST_DB_USER || process.env.DB_USER,
    host: process.env.TEST_DB_HOST || process.env.DB_HOST,
    database: process.env.TEST_DB_NAME || 'tasks_test',
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD,
    port: process.env.TEST_DB_PORT || process.env.DB_PORT,
});

const setupTestDb = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            due_date TIMESTAMP,
            completed_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

const clearTestDb = async () => {
    await pool.query('DELETE FROM tasks');
    await pool.query('ALTER SEQUENCE tasks_id_seq RESTART WITH 1');
};

module.exports = {
    pool,
    setupTestDb,
    clearTestDb
}; 
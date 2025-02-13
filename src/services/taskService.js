require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const calculateStatus = (dueDate, completedAt) => {
    if (completedAt) return 'Completed';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDueDate = new Date(dueDate);
    taskDueDate.setHours(0, 0, 0, 0);

    if (taskDueDate < today) return 'Overdue';
    if (taskDueDate.getTime() === today.getTime()) return 'Due Today';
    return 'Pending';
};

const createTask = async ({ title, description, due_date }) => {
    console.log("task")
    const taskDueDate = due_date ? new Date(due_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const query = `
        INSERT INTO tasks (title, description, due_date)
        VALUES ($1, $2, $3)
        RETURNING *`;
    
    const { rows } = await pool.query(query, [title, description, taskDueDate]);
    const task = rows[0];
    task.status = calculateStatus(task.due_date);
    return task;
};

const getAllTasks = async () => {
    const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows.map(task => ({
        ...task,
        status: calculateStatus(task.due_date, task.completed_at)
    }));
};

const updateTask = async (id, { title, description, due_date }) => {
    // First get the current task to log changes
    const currentTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!currentTask.rows[0]) throw new Error('Task not found');

    const updates = [];
    const values = [];
    let valueCount = 1;

    if (title) {
        updates.push(`title = $${valueCount}`);
        values.push(title);
        valueCount++;
    }
    if (description) {
        updates.push(`description = $${valueCount}`);
        values.push(description);
        valueCount++;
    }
    if (due_date) {
        updates.push(`due_date = $${valueCount}`);
        values.push(due_date);
        valueCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    const query = `
        UPDATE tasks 
        SET ${updates.join(', ')}
        WHERE id = $${valueCount}
        RETURNING *`;
    
    values.push(id);
    const { rows } = await pool.query(query, values);
    const task = rows[0];
    task.status = calculateStatus(task.due_date, task.completed_at);
    return task;
};

const completeTask = async (id) => {
    const query = `
        UPDATE tasks 
        SET status = 'Completed', 
            completed_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *`;
    
    const { rows } = await pool.query(query, [id]);
    if (!rows[0]) throw new Error('Task not found');
    
    const task = rows[0];
    task.status = 'Completed';
    return task;
};

const deleteTask = async (id) => {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    if (!rows[0]) throw new Error('Task not found');
    return rows[0];
};

const searchTasks = async (searchQuery) => {
    const query = `
        SELECT * FROM tasks 
        WHERE title ILIKE $1 
        OR description ILIKE $1 
        ORDER BY created_at DESC`;
    
    const { rows } = await pool.query(query, [`%${searchQuery}%`]);
    return rows.map(task => ({
        ...task,
        status: calculateStatus(task.due_date, task.completed_at)
    }));
};

module.exports = {
    createTask,
    getAllTasks,
    updateTask,
    completeTask,
    deleteTask,
    searchTasks
}; 
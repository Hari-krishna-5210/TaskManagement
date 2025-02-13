const taskService = require('../services/taskService');

const createTask = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }
      console.log("executed")
        const task = await taskService.createTask({ title, description, due_date });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, due_date } = req.body;
        const task = await taskService.updateTask(id, { title, description, due_date });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const completeTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.completeTask(id);
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.deleteTask(id);
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchTasks = async (req, res) => {
    try {
        const { query } = req.query;
        const tasks = await taskService.searchTasks(query);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    updateTask,
    completeTask,
    deleteTask,
    searchTasks
}; 
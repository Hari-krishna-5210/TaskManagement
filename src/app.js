require('dotenv').config();
const express = require('express');
const taskRoutes = require('./routes/index');
let taskService = require("./services/taskService")
const app = express();

// Middleware
app.use(express.json());

// Routes
 app.use('/tasks', taskRoutes);

// app.post("/tasks",(req, res) => {
//     try {
//         const { title, description, due_date } = req.body;
        
//         if (!title || !description) {
//             return res.status(400).json({ error: 'Title and description are required' });
//         }

//         const task =  taskService.createTask({ title, description, due_date });
//         res.status(201).json(task);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// })

// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         error: process.env.NODE_ENV === 'development' 
//             ? err.message 
//             : 'Internal server error'
//     });
// });

// 404 handler
// app.use((req, res) => {
//     res.status(404).json({ error: 'Route not found' });
// });

const PORT = process.env.PORT || 3001;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
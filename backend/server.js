const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a real database)
let tasks = [
  {
    id: '1',
    text: 'Welcome to Task Manager API!',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Routes

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
  try {
    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// GET /api/tasks/:id - Get a specific task
app.get('/api/tasks/:id', (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Task text is required'
      });
    }

    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const taskId = req.params.id;
    const { text, completed } = req.body;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Update task properties
    if (text !== undefined) {
      if (text.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Task text cannot be empty'
        });
      }
      tasks[taskIndex].text = text.trim();
    }
    
    if (completed !== undefined) {
      tasks[taskIndex].completed = Boolean(completed);
    }
    
    tasks[taskIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: tasks[taskIndex],
      message: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedTask,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

// DELETE /api/tasks - Delete all tasks
app.delete('/api/tasks', (req, res) => {
  try {
    const deletedCount = tasks.length;
    tasks = [];
    
    res.json({
      success: true,
      message: `Deleted ${deletedCount} tasks successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete all tasks'
    });
  }
});

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// GET / - Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      'GET /api/tasks': 'Get all tasks',
      'GET /api/tasks/:id': 'Get a specific task',
      'POST /api/tasks': 'Create a new task',
      'PUT /api/tasks/:id': 'Update a task',
      'DELETE /api/tasks/:id': 'Delete a task',
      'DELETE /api/tasks': 'Delete all tasks',
      'GET /api/health': 'Health check'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Task Manager API server running on port ${PORT}`);
  console.log(`📱 API Documentation: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Tasks Endpoint: http://localhost:${PORT}/api/tasks`);
});

module.exports = app;

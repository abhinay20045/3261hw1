const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a real database)
let users = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    createdAt: new Date().toISOString()
  }
];

let tasks = [
  {
    id: '1',
    userId: '1',
    text: 'Welcome to Task Manager API!',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let reviews = [
  {
    id: '1',
    userId: '1',
    taskId: '1',
    rating: 5,
    comment: 'Great task management app!',
    createdAt: new Date().toISOString()
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Routes

// Authentication Routes
// POST /api/auth/register - Register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt
        },
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

// POST /api/auth/login - Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
});

// GET /api/tasks - Get user's tasks (protected)
app.get('/api/tasks', authenticateToken, (req, res) => {
  try {
    const userTasks = tasks.filter(task => task.userId === req.user.userId);
    res.json({
      success: true,
      data: userTasks,
      count: userTasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// GET /api/tasks/:id - Get a specific task (protected)
app.get('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id && t.userId === req.user.userId);
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

// POST /api/tasks - Create a new task (protected)
app.post('/api/tasks', authenticateToken, (req, res) => {
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
      userId: req.user.userId,
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

// PUT /api/tasks/:id - Update a task (protected)
app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const taskId = req.params.id;
    const { text, completed } = req.body;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);
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

// DELETE /api/tasks/:id - Delete a task (protected)
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);
    
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

// DELETE /api/tasks - Delete all user's tasks (protected)
app.delete('/api/tasks', authenticateToken, (req, res) => {
  try {
    const userTasks = tasks.filter(task => task.userId === req.user.userId);
    const deletedCount = userTasks.length;
    tasks = tasks.filter(task => task.userId !== req.user.userId);
    
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

// Reviews Routes
// GET /api/reviews - Get all reviews for a task
app.get('/api/reviews/:taskId', (req, res) => {
  try {
    const taskReviews = reviews.filter(review => review.taskId === req.params.taskId);
    res.json({
      success: true,
      data: taskReviews,
      count: taskReviews.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
});

// POST /api/reviews - Create a new review (protected)
app.post('/api/reviews', authenticateToken, (req, res) => {
  try {
    const { taskId, rating, comment } = req.body;
    
    if (!taskId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Task ID and rating (1-5) are required'
      });
    }

    // Check if task exists and belongs to user
    const task = tasks.find(t => t.id === taskId && t.userId === req.user.userId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Check if user already reviewed this task
    const existingReview = reviews.find(r => r.taskId === taskId && r.userId === req.user.userId);
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this task'
      });
    }

    const newReview = {
      id: Date.now().toString(),
      userId: req.user.userId,
      taskId,
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    
    res.status(201).json({
      success: true,
      data: newReview,
      message: 'Review created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create review'
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
    message: 'Task Manager API with Authentication',
    version: '2.0.0',
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user'
      },
      tasks: {
        'GET /api/tasks': 'Get user tasks (protected)',
        'GET /api/tasks/:id': 'Get a specific task (protected)',
        'POST /api/tasks': 'Create a new task (protected)',
        'PUT /api/tasks/:id': 'Update a task (protected)',
        'DELETE /api/tasks/:id': 'Delete a task (protected)',
        'DELETE /api/tasks': 'Delete all user tasks (protected)'
      },
      reviews: {
        'GET /api/reviews/:taskId': 'Get reviews for a task',
        'POST /api/reviews': 'Create a review (protected)'
      },
      system: {
        'GET /api/health': 'Health check'
      }
    },
    demo: {
      username: 'demo',
      email: 'demo@example.com',
      password: 'password'
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

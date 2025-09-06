# Task Manager API Backend

A RESTful API server for the Task Manager mobile application, built with Node.js and Express.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for task management
- **CORS Enabled**: Cross-origin requests supported for mobile app
- **JSON API**: Clean JSON responses with consistent structure
- **Error Handling**: Comprehensive error handling and validation
- **Health Check**: API health monitoring endpoint

## 📡 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `DELETE /api/tasks` - Delete all tasks

### System
- `GET /api/health` - Health check
- `GET /` - API documentation

## 🛠️ Installation & Setup

```bash
# Install dependencies
npm install

# Start the server
npm start

# Development mode (with auto-restart)
npm run dev
```

## 📊 API Usage Examples

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"text": "Complete mobile app assignment"}'
```

### Get All Tasks
```bash
curl http://localhost:3000/api/tasks
```

### Update a Task
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## 🔧 Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## 📱 Mobile App Integration

This API is designed to work with the React Native Task Manager app. The mobile app can:

1. **Sync Tasks**: Fetch tasks from the server
2. **Create Tasks**: Add new tasks via API
3. **Update Tasks**: Mark tasks as complete/incomplete
4. **Delete Tasks**: Remove tasks from the server
5. **Offline Support**: Local storage with server sync

## 🗄️ Data Storage

Currently uses in-memory storage for simplicity. In production, integrate with:
- MongoDB
- PostgreSQL
- Firebase Firestore
- AWS DynamoDB

## 🔒 Security Considerations

For production deployment:
- Add authentication middleware
- Implement rate limiting
- Use HTTPS
- Add input sanitization
- Implement proper CORS policies

## 📈 Future Enhancements

- Database integration
- User authentication
- Real-time updates with WebSockets
- Task categories and priorities
- Due dates and reminders
- File attachments
- Search and filtering

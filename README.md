# Mobile Development Assignment - CS 3261

This repository contains a React Native mobile application built with Expo, demonstrating cross-platform mobile development capabilities.

## 📱 Project Overview

**Task Manager Mobile App** - A simple and functional task management application with the following features:

### Features
- ✅ **User Input**: Text input for adding new tasks
- ✅ **Interactive Buttons**: Add, delete, and clear all tasks
- ✅ **Form Validation**: Input validation with error alerts
- ✅ **Local Storage**: Persistent data storage using AsyncStorage
- ✅ **Cross-Platform**: Works on both iOS and Android
- ✅ **Modern UI**: Clean, responsive design with proper styling
- ✅ **Task Management**: Complete CRUD operations for tasks
- ✅ **RESTful API**: Backend server for data synchronization

### User Interactions
1. **Text Input**: Users can type task descriptions
2. **Add Button**: Submit new tasks
3. **Checkbox Tapping**: Mark tasks as complete/incomplete
4. **Delete Button**: Remove individual tasks
5. **Clear All Button**: Remove all tasks at once
6. **Form Validation**: Prevents empty task submissions

## 🛠️ Development Environment

### Installed Tools
- **Expo CLI**: Cross-platform mobile development framework
- **React Native**: Mobile app development framework
- **TypeScript**: Type-safe JavaScript development
- **Node.js**: JavaScript runtime environment
- **AsyncStorage**: Local data persistence

### Platform Support
- ✅ iOS (via Expo Go app or Xcode)
- ✅ Android (via Expo Go app or Android Studio)
- ✅ Web (for development/testing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.20.8 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation & Setup
```bash
# Clone the repository
git clone <repository-url>
cd 3261hw1

# Navigate to mobile app
cd MobileApp

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Physical Device
1. Install **Expo Go** app on your iOS/Android device
2. Scan the QR code displayed in the terminal
3. The app will load on your device

### Running on Simulator/Emulator
```bash
# For iOS Simulator (requires Xcode)
npx expo run:ios

# For Android Emulator (requires Android Studio)
npx expo run:android

# For web browser
npx expo start --web
```

## 📁 Project Structure

```
3261hw1/
├── README.md                 # This file
├── MobileApp/               # React Native application
│   ├── App.tsx             # Main application component
│   ├── package.json        # Dependencies and scripts
│   ├── app.json           # Expo configuration
│   ├── tsconfig.json      # TypeScript configuration
│   └── assets/            # App icons and images
└── .git/                  # Git version control
```

## 🔧 Technical Implementation

### Core Technologies
- **React Native**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **Expo**: Development platform and tools
- **AsyncStorage**: Local data persistence
- **React Hooks**: State management (useState, useEffect)

### Key Components
- **Task Interface**: TypeScript interface for task objects
- **State Management**: React hooks for app state
- **Data Persistence**: AsyncStorage for local data storage
- **Form Handling**: Input validation and submission
- **UI Components**: Custom styled components

### User Input Handling
- Text input with validation
- Button interactions with feedback
- Touch gestures for task completion
- Alert dialogs for confirmations

---

**Course**: CS 3261 - Mobile Development  
**Assignment**: Development Environment Setup and Sample Application  
**Platform**: React Native with Expo  

## 📄 Documentation

This README file serves as the essential documentation for the project, providing an overview, setup instructions, and technical details necessary for developers and users to understand and work with the Task Manager Mobile App effectively.

## 📜 Project Description

The Task Manager Mobile App is designed to help users efficiently manage their tasks. It allows users to create, update, and delete tasks seamlessly, ensuring that they can keep track of their responsibilities. With a user-friendly interface and robust functionality, this app aims to enhance productivity and organization for users on both iOS and Android platforms.

## 📥 Installation Instructions

To set up the project locally, follow these steps:

1. Ensure you have the prerequisites installed as mentioned above.
2. Clone the repository using the command provided in the Installation & Setup section.
3. Navigate into the `MobileApp` directory.
4. Install the necessary dependencies with `npm install`.
5. Start the development server using `npx expo start`.

## 📚 Usage Examples

Here are some examples of how to use the Task Manager Mobile App:

### Adding a Task
```javascript
const addTask = (taskDescription) => {
    if (taskDescription.trim()) {
        // Code to add task
    } else {
        // Show error alert
    }
};
```

### Deleting a Task
```javascript
const deleteTask = (taskId) => {
    // Code to delete task by ID
};
```

### Marking a Task as Complete
```javascript
const toggleTaskCompletion = (taskId) => {
    // Code to toggle task completion status
};
```
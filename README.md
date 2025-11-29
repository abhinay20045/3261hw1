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

## 📄 Project Description

The Task Manager Mobile App is designed to help users efficiently manage their daily tasks. It provides a user-friendly interface for adding, deleting, and organizing tasks, ensuring that users can keep track of their responsibilities with ease. The app leverages local storage for data persistence, allowing users to access their tasks even when offline. With its cross-platform capabilities, the app is accessible on both iOS and Android devices, making task management seamless and convenient for everyone.

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

### Installation Instructions
To set up the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 3261hw1
   ```

2. Navigate to the mobile app directory:
   ```bash
   cd MobileApp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
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

## 📚 Documentation

This README provides essential information for developers and users to understand and work with the Task Manager Mobile App. It includes project overview, features, development environment setup, and technical implementation details to facilitate contributions and usage.

## 📖 Usage

To use the Task Manager Mobile App, follow these steps:

1. Launch the app on your device or simulator.
2. Use the text input field to enter a task description.
3. Click the "Add" button to add the task to your list.
4. Mark tasks as complete by tapping the checkbox next to them.
5. To delete a task, tap the "Delete" button next to the task.
6. Use the "Clear All" button to remove all tasks from the list.

## 🤝 Contribution Guidelines

We welcome contributions to the Task Manager Mobile App! To contribute, please follow these guidelines:

1. **Fork the Repository**: Create your own copy of the repository by forking it.
2. **Create a Branch**: Use a descriptive name for your branch (e.g., `feature/add-new-feature`).
3. **Make Changes**: Implement your changes and ensure they are well-tested.
4. **Commit Your Changes**: Write clear and concise commit messages.
5. **Push to Your Branch**: Push your changes to your forked repository.
6. **Open a Pull Request**: Submit a pull request to the main repository for review.

Thank you for considering contributing to our project!

---

**Course**: CS 3261 - Mobile Development  
**Assignment**: Development Environment Setup and Sample Application  
**Platform**: React Native with Expo  
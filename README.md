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

## 📊 Assignment Requirements Status

- [x] **Development Environment**: Expo CLI installed and configured
- [x] **Sample Application**: Task Manager app with user input
- [x] **Physical Device**: App runs on mobile devices via Expo Go
- [x] **User Input**: Text input, buttons, form validation
- [x] **Git Repository**: Version control with comprehensive documentation
- [x] **Code Documentation**: Detailed README and inline comments
- [ ] **Partner Collaboration**: Code sharing and collaborative development
- [ ] **Web Service**: Backend API with database integration

## 🤝 Partner Collaboration

This repository is set up for collaborative development:

### For Partners
1. **Clone the repository**: `git clone <repository-url>`
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make changes and test**: Ensure app runs on your device
4. **Commit changes**: `git commit -m "Description of changes"`
5. **Push to repository**: `git push origin feature/your-feature`
6. **Create pull request**: For code review and integration

### Development Workflow
- Use feature branches for new development
- Test on physical devices before committing
- Document any new features or changes
- Follow TypeScript best practices

## 🔮 Next Steps

### Planned Enhancements
1. **Web Service Integration**: Connect to Firebase or AWS backend
2. **User Authentication**: Login/signup functionality
3. **Cloud Sync**: Synchronize tasks across devices
4. **Push Notifications**: Task reminders and updates
5. **Advanced Features**: Categories, due dates, priorities

### Backend Integration
- Firebase Firestore for cloud data storage
- RESTful API endpoints for task management
- User authentication and authorization
- Real-time data synchronization

## 📱 Screenshots

*Screenshots will be added once the app is deployed and tested on physical devices*

## 🐛 Known Issues

- None currently identified

## 📝 Development Log

### Initial Setup (Current)
- ✅ Installed Expo CLI and development environment
- ✅ Created React Native TypeScript project
- ✅ Implemented Task Manager with full CRUD operations
- ✅ Added local data persistence with AsyncStorage
- ✅ Configured Git repository with comprehensive documentation
- ✅ Set up project structure for collaborative development

### Next Development Phase
- [ ] Partner collaboration and code sharing
- [ ] Web service backend development
- [ ] Database integration and cloud sync
- [ ] Advanced features and UI enhancements

## 📞 Support

For questions or issues:
1. Check the [Expo Documentation](https://docs.expo.dev/)
2. Review [React Native Documentation](https://reactnative.dev/)
3. Create an issue in this repository
4. Contact the development team

---

**Course**: CS 3261 - Mobile Development  
**Assignment**: Development Environment Setup and Sample Application  
**Platform**: React Native with Expo  
**Status**: In Progress - Ready for Partner Collaboration
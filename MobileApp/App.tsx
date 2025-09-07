import React, { useState, useEffect } from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Switch,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  accelerometerData?: {
    x: number;
    y: number;
    z: number;
  };
}

interface Review {
  id: string;
  taskId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ username: '', email: '', password: '' });
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState({
    tasksCreated: 0,
    tasksCompleted: 0,
    appOpens: 0,
    lastActive: new Date().toISOString()
  });

  // Load data on app start
  useEffect(() => {
    loadUserData();
    loadTasks();
    loadAnalytics();
    requestLocationPermission();
    setupAccelerometer();
    setupNotifications();
  }, []);

  // Update task count when tasks change
  useEffect(() => {
    setTaskCount(tasks.length);
    updateAnalytics('tasksCreated', tasks.length);
  }, [tasks]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        await fetchTasksFromAPI(parsedUser.token);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const storedAnalytics = await AsyncStorage.getItem('analytics');
      if (storedAnalytics) {
        setAnalytics(JSON.parse(storedAnalytics));
      }
      updateAnalytics('appOpens', analytics.appOpens + 1);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const updateAnalytics = async (key: string, value: any) => {
    try {
      const newAnalytics = { ...analytics, [key]: value, lastActive: new Date().toISOString() };
      setAnalytics(newAnalytics);
      await AsyncStorage.setItem('analytics', JSON.stringify(newAnalytics));
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        await fetchWeatherData(currentLocation.coords.latitude, currentLocation.coords.longitude);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      // Using OpenWeatherMap API (you'll need to get a free API key)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`
      );
      if (response.ok) {
        const data = await response.json();
        setWeather({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          location: data.name
        });
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback weather data for demo
      setWeather({
        temperature: 22,
        description: 'Partly cloudy',
        location: 'Current Location'
      });
    }
  };

  const setupAccelerometer = () => {
    Accelerometer.setUpdateInterval(1000);
    const subscription = Accelerometer.addListener(accelerometerData => {
      setAccelerometerData(accelerometerData);
    });
    return () => subscription?.remove();
  };

  const setupNotifications = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      setNotificationsEnabled(finalStatus === 'granted');
    }
  };

  const sendNotification = async (title: string, body: string) => {
    if (notificationsEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: null,
      });
    }
  };

  const fetchTasksFromAPI = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const apiTasks = data.data.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(apiTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(apiTasks));
      }
    } catch (error) {
      console.error('Error fetching tasks from API:', error);
    }
  };

  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin 
        ? { email: authData.email, password: authData.password }
        : authData;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (data.success) {
        const userData = {
          id: data.data.user.id,
          username: data.data.user.username,
          email: data.data.user.email,
          token: data.data.token
        };
        
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setShowAuthModal(false);
        setAuthData({ username: '', email: '', password: '' });
        await fetchTasksFromAPI(data.data.token);
        Alert.alert('Success', isLogin ? 'Logged in successfully!' : 'Account created successfully!');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('tasks');
    setTasks([]);
  };

  const addTask = async () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date(),
      location: location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: 'Current Location'
      } : undefined,
      accelerometerData: {
        x: accelerometerData.x,
        y: accelerometerData.y,
        z: accelerometerData.z
      }
    };

    // Add to local storage
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    // Add to API if user is logged in
    if (user) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newTask.text }),
        });
        
        if (response.ok) {
          const data = await response.json();
          // Update local task with API ID
          const apiTask = { ...newTask, id: data.data.id };
          const updatedTasksWithAPI = tasks.map(t => t.id === newTask.id ? apiTask : t);
          setTasks(updatedTasksWithAPI);
          await saveTasks(updatedTasksWithAPI);
        }
      } catch (error) {
        console.error('Error syncing task to API:', error);
      }
    }

    setInputText('');
    await sendNotification('New Task Added', `"${newTask.text}" has been added to your list`);
    updateAnalytics('tasksCreated', analytics.tasksCreated + 1);
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      updateAnalytics('tasksCompleted', analytics.tasksCompleted + 1);
      await sendNotification('Task Completed!', `"${task.text}" has been completed`);
    }

    // Update API if user is logged in
    if (user) {
      try {
        await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completed: !task?.completed }),
        });
      } catch (error) {
        console.error('Error syncing task update to API:', error);
      }
    }
  };

  const deleteTask = async (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            await saveTasks(updatedTasks);

            // Delete from API if user is logged in
            if (user) {
              try {
                await fetch(`${API_BASE_URL}/tasks/${id}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${user.token}`,
                  },
                });
              } catch (error) {
                console.error('Error deleting task from API:', error);
              }
            }
          }
        }
      ]
    );
  };

  const clearAllTasks = async () => {
    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to delete all tasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setTasks([]);
            await saveTasks([]);

            // Clear from API if user is logged in
            if (user) {
              try {
                await fetch(`${API_BASE_URL}/tasks`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${user.token}`,
                  },
                });
              } catch (error) {
                console.error('Error clearing tasks from API:', error);
              }
            }
          }
        }
      ]
    );
  };

  const openReviewModal = (task: Task) => {
    setSelectedTaskForReview(task);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedTaskForReview || !user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: selectedTaskForReview.id,
          rating: reviewData.rating,
          comment: reviewData.comment
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Review submitted successfully!');
        setShowReviewModal(false);
        setReviewData({ rating: 5, comment: '' });
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTask(item.id)}
      >
        <View style={[
          styles.checkbox,
          item.completed && styles.checkboxCompleted
        ]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.taskTextContainer}>
          <Text style={[
            styles.taskText,
            item.completed && styles.taskTextCompleted
          ]}>
            {item.text}
          </Text>
          {item.location && (
            <Text style={styles.taskLocation}>📍 {item.location.address}</Text>
          )}
          {item.accelerometerData && (
            <Text style={styles.taskSensor}>
              📱 Motion: {item.accelerometerData.x.toFixed(2)}, {item.accelerometerData.y.toFixed(2)}, {item.accelerometerData.z.toFixed(2)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => openReviewModal(item)}
        >
          <Text style={styles.reviewButtonText}>⭐</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Task Manager Pro</Text>
            {user ? (
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setShowAuthModal(true)} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.subtitle}>
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            {user && ` • ${user.username}`}
          </Text>

          {weather && (
            <View style={styles.weatherContainer}>
              <Text style={styles.weatherText}>
                🌤️ {weather.temperature}°C • {weather.description}
              </Text>
            </View>
          )}

          <View style={styles.sensorContainer}>
            <Text style={styles.sensorText}>
              📱 Motion: X:{accelerometerData.x.toFixed(2)} Y:{accelerometerData.y.toFixed(2)} Z:{accelerometerData.z.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a new task..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {tasks.length > 0 && (
          <View style={styles.clearContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={clearAllTasks}>
              <Text style={styles.clearButtonText}>Clear All Tasks</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
          showsVerticalScrollIndicator={false}
        />

        {/* Authentication Modal */}
        <Modal visible={showAuthModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {isLogin ? 'Login' : 'Create Account'}
              </Text>
              
              {!isLogin && (
                <TextInput
                  style={styles.modalInput}
                  placeholder="Username"
                  value={authData.username}
                  onChangeText={(text) => setAuthData({...authData, username: text})}
                />
              )}
              
              <TextInput
                style={styles.modalInput}
                placeholder="Email"
                value={authData.email}
                onChangeText={(text) => setAuthData({...authData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Password"
                value={authData.password}
                onChangeText={(text) => setAuthData({...authData, password: text})}
                secureTextEntry
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleAuth}
                >
                  <Text style={styles.modalButtonText}>
                    {isLogin ? 'Login' : 'Register'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalButtonSecondary}
                  onPress={() => setIsLogin(!isLogin)}
                >
                  <Text style={styles.modalButtonSecondaryText}>
                    {isLogin ? 'Need an account?' : 'Have an account?'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAuthModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Review Modal */}
        <Modal visible={showReviewModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Rate Task</Text>
              <Text style={styles.reviewTaskText}>{selectedTaskForReview?.text}</Text>
              
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Rating:</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setReviewData({...reviewData, rating: star})}
                    >
                      <Text style={[
                        styles.star,
                        star <= reviewData.rating && styles.starSelected
                      ]}>
                        ⭐
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <TextInput
                style={styles.reviewCommentInput}
                placeholder="Add a comment (optional)"
                value={reviewData.comment}
                onChangeText={(text) => setReviewData({...reviewData, comment: text})}
                multiline
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={submitReview}
                >
                  <Text style={styles.modalButtonText}>Submit Review</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowReviewModal(false)}
                >
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F4FD',
    marginBottom: 10,
  },
  weatherContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  weatherText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  sensorContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 8,
  },
  sensorText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#FAFAFA',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearContainer: {
    padding: 20,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#4A90E2',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  taskSensor: {
    fontSize: 10,
    color: '#888',
    marginTop: 1,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewButton: {
    padding: 5,
    marginRight: 5,
  },
  reviewButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  modalButtons: {
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonSecondary: {
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonSecondaryText: {
    color: '#4A90E2',
    fontSize: 14,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
  reviewTaskText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 30,
    marginHorizontal: 5,
    opacity: 0.3,
  },
  starSelected: {
    opacity: 1,
  },
  reviewCommentInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    height: 80,
    textAlignVertical: 'top',
  },
});
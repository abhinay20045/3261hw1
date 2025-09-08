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
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestAndGetLocation } from './location';
import { getWeather } from './weather';
import { scheduleReminder } from './notifications';
import { t, setLanguage, loadLanguage, saveLanguage, getCurrentLanguage } from './i18n';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  location?: { lat: number; lon: number };
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [weather, setWeather] = useState<{ temp: number; description: string } | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  // Load tasks from storage on app start
  useEffect(() => {
    loadTasks();
    loadWeather();
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    const savedLanguage = await loadLanguage();
    setLanguage(savedLanguage);
    setCurrentLanguage(savedLanguage);
  };

  const loadWeather = async () => {
    try {
      const location = await requestAndGetLocation();
      if (location) {
        const weatherData = await getWeather(location.lat, location.lon);
        setWeather(weatherData);
      }
    } catch (error) {
      console.error('Error loading weather:', error);
    }
  };

  // Update task count when tasks change
  useEffect(() => {
    setTaskCount(tasks.length);
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = () => {
    if (inputText.trim() === '') {
      Alert.alert(t('error'), t('pleaseEnterTask'));
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setInputText('');
  };

  const addTaskWithLocation = async () => {
    if (inputText.trim() === '') {
      Alert.alert(t('error'), t('pleaseEnterTask'));
      return;
    }

    const location = await requestAndGetLocation();
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...(location && { location }) // Only add location if it exists
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setInputText('');
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      t('delete'),
      t('deleteConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('deleteAction'),
          style: 'destructive',
          onPress: () => {
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
          }
        }
      ]
    );
  };

  const clearAllTasks = () => {
    Alert.alert(
      t('clearAll'),
      t('clearAllConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('clearAllAction'),
          style: 'destructive',
          onPress: () => {
            setTasks([]);
            saveTasks([]);
          }
        }
      ]
    );
  };

  const getWeatherEmoji = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('cloudy')) return '☁️';
    if (desc.includes('foggy')) return '🌫️';
    if (desc.includes('drizzle') || desc.includes('rain')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunderstorm')) return '⛈️';
    return '🌤️';
  };

  const openReminderModal = (taskText: string) => {
    setSelectedTask(taskText);
    setShowReminderModal(true);
  };

  const handleReminder = async (taskText: string, minutes: number) => {
    try {
      const notificationId = await scheduleReminder(taskText, minutes);
      
      if (notificationId) {
        Alert.alert(
          t('reminderSet'),
          `${t('reminderSetMessage')} ${minutes} ${minutes !== 1 ? t('minutes') : t('minute')}.`,
          [{ text: 'OK' }]
        );
        setShowReminderModal(false);
      } else {
        Alert.alert(
          t('permissionDenied'),
          t('enableNotifications'),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('error'),
        t('failedToSetReminder'),
        [{ text: 'OK' }]
      );
    }
  };

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    await saveLanguage(newLanguage);
  };

  const reminderOptions = [
    { label: t('reminderOptions.fiveMinutes'), value: 5 },
    { label: t('reminderOptions.tenMinutes'), value: 10 },
    { label: t('reminderOptions.thirtyMinutes'), value: 30 },
    { label: t('reminderOptions.oneHour'), value: 60 },
    { label: t('reminderOptions.twoHours'), value: 120 },
    { label: t('reminderOptions.oneDay'), value: 1440 },
  ];

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
            <Text style={styles.locationText}>
              {item.location.lat.toFixed(4)}, {item.location.lon.toFixed(4)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.reminderButton}
        onPress={() => openReminderModal(item.text)}
      >
        <Text style={styles.reminderButtonText}>🔔</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
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
            <Text style={styles.title}>{t('title')}</Text>
            <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
              <Text style={styles.languageToggleText}>
                {currentLanguage === 'en' ? 'ES' : 'EN'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            {taskCount} {taskCount === 1 ? t('tasksCount') : t('subtitle')}
          </Text>
        </View>

        {weather && (
          <View style={styles.weatherBanner}>
            <Text style={styles.weatherText}>
              {getWeatherEmoji(weather.description)} {weather.temp}°F · {weather.description}
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={t('placeholder')}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>{t('add')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addWithLocationButton} onPress={addTaskWithLocation}>
            <Text style={styles.addWithLocationButtonText}>{t('addWithLocation')}</Text>
          </TouchableOpacity>
        </View>

        {tasks.length > 0 && (
          <View style={styles.clearContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={clearAllTasks}>
              <Text style={styles.clearButtonText}>{t('clearAll')}</Text>
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

        <StatusBar />
      </KeyboardAvoidingView>

      {/* Reminder Time Selection Modal */}
      <Modal
        visible={showReminderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReminderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('setReminder')}</Text>
            <Text style={styles.modalSubtitle}>"{selectedTask}"</Text>
            
            <View style={styles.reminderOptionsContainer}>
              {reminderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.reminderOption}
                  onPress={() => handleReminder(selectedTask, option.value)}
                >
                  <Text style={styles.reminderOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowReminderModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  languageToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  languageToggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F4FD',
  },
  weatherBanner: {
    backgroundColor: '#E8F4FD',
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D0E7F7',
  },
  weatherText: {
    fontSize: 16,
    color: '#2C5F8A',
    fontWeight: '500',
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  taskTextContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  reminderButton: {
    padding: 5,
    marginRight: 5,
  },
  reminderButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  addWithLocationButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginLeft: 10,
  },
  addWithLocationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  reminderOptionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  reminderOption: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  reminderOptionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

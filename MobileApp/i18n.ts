import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple translation system
const translations = {
  en: {
    'app.title': 'Task Manager',
    'task.add': 'Add Task',
    'task.placeholder': 'Enter a new task...',
    'task.clear': 'Clear All Tasks',
    'task.count': 'Tasks: {count}',
    'task.completed': 'Completed',
    'task.pending': 'Pending',
    'weather.title': 'Weather',
    'location.title': 'Location',
    'reminder.title': 'Set Reminder',
    'reminder.set': 'Set Reminder',
    'reminder.cancel': 'Cancel',
    'language.title': 'Language',
    'language.english': 'English',
    'language.spanish': 'Español',
    'language.french': 'Français',
  },
  es: {
    'app.title': 'Gestor de Tareas',
    'task.add': 'Agregar Tarea',
    'task.placeholder': 'Ingresa una nueva tarea...',
    'task.clear': 'Limpiar Todas las Tareas',
    'task.count': 'Tareas: {count}',
    'task.completed': 'Completado',
    'task.pending': 'Pendiente',
    'weather.title': 'Clima',
    'location.title': 'Ubicación',
    'reminder.title': 'Establecer Recordatorio',
    'reminder.set': 'Establecer Recordatorio',
    'reminder.cancel': 'Cancelar',
    'language.title': 'Idioma',
    'language.english': 'English',
    'language.spanish': 'Español',
    'language.french': 'Français',
  },
  fr: {
    'app.title': 'Gestionnaire de Tâches',
    'task.add': 'Ajouter une Tâche',
    'task.placeholder': 'Entrez une nouvelle tâche...',
    'task.clear': 'Effacer Toutes les Tâches',
    'task.count': 'Tâches: {count}',
    'task.completed': 'Terminé',
    'task.pending': 'En Attente',
    'weather.title': 'Météo',
    'location.title': 'Emplacement',
    'reminder.title': 'Définir un Rappel',
    'reminder.set': 'Définir un Rappel',
    'reminder.cancel': 'Annuler',
    'language.title': 'Langue',
    'language.english': 'English',
    'language.spanish': 'Español',
    'language.french': 'Français',
  },
};

let currentLanguage = 'en';

export const setLanguage = (lang: string) => {
  currentLanguage = lang;
};

export const getCurrentLanguage = () => currentLanguage;

export const t = (key: string, params?: Record<string, string | number>): string => {
  const translation = translations[currentLanguage as keyof typeof translations]?.[key as keyof typeof translations['en']] || 
                     translations.en[key as keyof typeof translations['en']] || 
                     key;
  
  if (params) {
    return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return translation;
};

export const loadLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem('language');
    return savedLanguage || 'en';
  } catch (error) {
    console.error('Error loading language:', error);
    return 'en';
  }
};

export const saveLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('language', language);
    setLanguage(language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

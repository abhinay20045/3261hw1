export interface WeatherData {
  temp: number;
  description: string;
  location?: string;
}

export const getWeather = async (lat?: number, lon?: number): Promise<WeatherData | null> => {
  try {
    // For demo purposes, return mock weather data
    // In a real app, you would use a weather API like OpenWeatherMap
    const mockWeather: WeatherData = {
      temp: Math.round(Math.random() * 30 + 10), // Random temp between 10-40°C
      description: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      location: lat && lon ? `${lat.toFixed(2)}, ${lon.toFixed(2)}` : 'Current Location'
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockWeather;
  } catch (error) {
    console.error('Error getting weather:', error);
    return null;
  }
};

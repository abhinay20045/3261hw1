import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export const requestAndGetLocation = async (): Promise<LocationData | null> => {
  try {
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return null;
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    
    // Get address from coordinates
    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: address[0] ? `${address[0].city}, ${address[0].region}` : 'Unknown location'
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

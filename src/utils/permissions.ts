import * as MediaLibrary from 'expo-media-library';

export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status === 'granted') return true;

    const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
    return newStatus === 'granted';
  } catch (error) {
    // This stops the app from crashing in Expo Go
    console.warn("Media permissions not available in Expo Go. Use a Development Build.");
    return false; 
  }
};
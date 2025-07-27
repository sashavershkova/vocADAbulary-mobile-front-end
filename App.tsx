import React from 'react';
import { useFonts } from 'expo-font';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';

const customFonts = {
  'ArchitectsDaughter': require('./src/assets/fonts/ArchitectsDaughter-Regular.ttf'),
};

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}

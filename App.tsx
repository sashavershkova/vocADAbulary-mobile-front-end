// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TopicsScreen from './screens/TopicsScreen';

// Define the types for navigation params
export type RootStackParamList = {
  Login: undefined;
  Home: { userId: number };
};

// Create the stack navigator with the type
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Topics" component={TopicsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
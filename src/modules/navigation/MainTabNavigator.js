import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../home/HomeView';
import LoginViewContainer from '../login/LoginView';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'SyncUp' : 'Login'}
        
      >
        <Stack.Screen
        name="Login"
        component={LoginViewContainer}
        options={{
          header: () => null,
          headerLeft: null, // Hide the header left component
          headerLeftContainerStyle: { display: 'none' }, // Additional style to hide the container
        }}
      />
        <Stack.Screen name="SyncUp" component={HomeScreen} />
      </Stack.Navigator>
    
  );
}

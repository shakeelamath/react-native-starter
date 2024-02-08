import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, Image, StyleSheet, Platform } from 'react-native';
import { colors } from '../../styles';

import tabNavigationData from './tabNavigationData';
import { useSelector } from 'react-redux'; // Import the useSelector hook
import HomeScreen from '../home/HomeView';
import LoginViewContainer from '../login/LoginViewContainer';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = React.useState('Login');

  return (
    <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginViewContainer} />

       <Stack.Screen name="SyncUp" component={HomeScreen} />
    </Stack.Navigator>
  );
}
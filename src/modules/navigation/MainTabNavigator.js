import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, Image, StyleSheet, Platform } from 'react-native';
import { colors } from '../../styles';
import tabNavigationData from './tabNavigationData';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      {tabNavigationData.map((item, idx) => (
        <Stack.Screen 
          key={`tab_item${idx+1}`}
          name={item.name}
          component={item.component}
          options={{
            headerShown: false, // Optional: Hide the header if you don't need it
          }}
        />
      ))}
    </Stack.Navigator>
  );
}

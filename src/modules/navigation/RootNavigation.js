import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import StackNavigationData from './stackNavigationData';

const Stack = createStackNavigator();

const NavigatorView = (props) => {
  const headerLeftComponentMenu = () => (
    <TouchableOpacity
      onPress={() => props.navigation.toggleDrawer()}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Image
        source={require('../../../assets/images/drawer/menu.png')}
        resizeMode="contain"
        style={{
          height: 20,
        }}
      />
    </TouchableOpacity>
  );

  return (
    <Stack.Navigator>
      {StackNavigationData.map((item, idx) => (
        <Stack.Screen
          key={`stack_item-${idx+1}`}
          name={item.name} 
          component={item.component} 
          options={{
            headerLeft: item.headerLeft || headerLeftComponentMenu,
            headerTransparent:true,
            headerTitleStyle: item.headerTitleStyle,
          }} 
        />
      ))}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: '#1a1a1a',
    
    flex: 1, // Ensure the header background takes the full space
  },
});

export default NavigatorView;

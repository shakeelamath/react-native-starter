import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import LoginViewContainer from '../login/LoginViewContainer';
import HomeScreen from '../home/HomeView';
import { useNavigation } from '@react-navigation/native'; 
const Stack = createStackNavigator();
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth'; 
const NavigatorView = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Check if the user is authenticated
    const user = auth().currentUser;

    if (user) {
      // If authenticated, navigate to "SyncUp" screen
      navigation.navigate('Login');
    }
  }, []);

  const headerLeftComponentMenu = () => (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
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
      <Stack.Screen
        name="SyncUp"
        component={HomeScreen}
        options={{
          headerTransparent: true,
          headerLeft: headerLeftComponentMenu,
          headerTitleStyle: {
            color: 'transparent',
          },
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginViewContainer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: '#1a1a1a',
    flex: -1,
  },
});

export default NavigatorView;
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import LoginViewContainer from '../login/LoginViewContainer';
import HomeScreen from '../home/HomeViewContainer';
import { useNavigation } from '@react-navigation/native'; 
const Stack = createStackNavigator();
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth'; 
import ArtistScreen from '../artistpage/ArtistView';
import pages from '../pages/PagesViewContainer'
import EventScreen from '../eventpage/EventView';
const NavigatorView = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        // If authenticated, navigate to "SyncUp" screen
        navigation.navigate('Home');
      } else {
        // If not authenticated, stay on the "Login" screen
        navigation.navigate('Login');
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [navigation]);

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
        name="Login"
        component={LoginViewContainer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
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
        name="Artist"
        component={ArtistScreen}
        options={{
          headerTransparent: true,
          headerLeft: headerLeftComponentMenu,
          headerTitleStyle: {
            color: 'transparent',
          },
        }}
      />
      <Stack.Screen
        name="Event"
        component={EventScreen}
        options={{
          headerTransparent: true,
          headerLeft: headerLeftComponentMenu,
          headerTitleStyle: {
            color: 'transparent',
          },
        }}
      />
      <Stack.Screen
        name="Pages"
        component={pages}
        options={{
          headerTransparent: true,
          headerLeft: headerLeftComponentMenu,
          headerTitleStyle: {
            color: 'transparent',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default NavigatorView;
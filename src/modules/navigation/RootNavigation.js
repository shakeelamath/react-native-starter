import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import LoginViewContainer from '../login/LoginViewContainer';
import HomeScreen from '../home/HomeViewContainer';
import SplashScreen from './SplashScreen';
import { useNavigation } from '@react-navigation/native';
const Stack = createStackNavigator();
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth'; 
import ArtistScreen from '../artistpage/ArtistView';
import pages from '../pages/PagesViewContainer'
import EventScreen from '../eventpage/EventView';
import ArtistsList from '../artists/ArtistsView';
import EventsList from '../events/EventsView';
import AboutScreen from '../pages/PagesViewContainer';
import CreateEventScreen from '../vendor/CreateEventScreen';
import VendorLogin from '../vendor/VendorLogin';
import VendorSignup from '../vendor/VendorSignup';
import VendorDashboard from '../vendor/VendorDashboard';

const NavigatorView = () => {
  const navigation = useNavigation();

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
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginViewContainer}
        options={{ headerShown: false }}
      />
      {/* Vendor auth & dashboard */}
      <Stack.Screen
        name="VendorLogin"
        component={VendorLogin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorSignup"
        component={VendorSignup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorDashboard"
        component={VendorDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
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
          headerBackTitleVisible: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            color: 'transparent',
          },
        }}
      />
      <Stack.Screen
        name="Artists"
        component={ArtistsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Event"
        component={EventScreen}
        options={{
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            color: 'transparent',
          },
        }}
      />
      <Stack.Screen
        name="Events"
        component={EventsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: true, title: 'About' }}
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
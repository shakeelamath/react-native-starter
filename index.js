import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initializeApp } from '@react-native-firebase/app';
import { getDatabase } from '@react-native-firebase/database';

import auth from '@react-native-firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyClBHN0TZmD2YzVR2ciJKrxpbJcZ6kP-BM',
  authDomain: 'syncup-c2f1d.firebaseapp.com',
  projectId: 'syncup-c2f1d',
  storageBucket: 'syncup-c2f1d.appspot.com',
  messagingSenderId: '561706331753',
  appId: '1:561706331753:web:367cc0fe204905c3ab7c',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Check if the initialization is successful
if (firebaseApp) {
  console.log('Firebase initialized successfully');

  // Now you can use Firebase services, e.g., auth
  const user = auth().currentUser;
  console.log('Current user:', user);
} else {
  console.error('Error initializing Firebase');
}

// Register the main component
AppRegistry.registerComponent(appName, () => App);

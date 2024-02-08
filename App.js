import { Provider } from 'react-redux';
import React, {useState, useEffect}from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './src/styles';

import { store, persistor } from './src/redux/store';

import AppView from './src/modules/AppViewContainer';
import { firebase } from '@react-native-firebase/app';
export default function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: 'AIzaSyClBHN0TZmD2YzVR2ciJKrxpbJcZ6kP-BM',
      authDomain: 'localhost',
      projectId: 'syncup-c2f1d',
      storageBucket: 'syncup-c2f1d.appspot.com',
      messagingSenderId: '561706331753',
      appId: '1:561706331753:android:367cc0fe204905c3ab7c',
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log('hi');
    }

    // Set the initialization state to true
    setFirebaseInitialized(true);
  }, []);
  if (!firebaseInitialized) {
    // Wait for Firebase initialization
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.red} />
      </View>
    );
  }


 
  return (
    <Provider store={store}>
      <NavigationContainer>
        <PersistGate
          loading={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <View style={styles.container}>
              <ActivityIndicator color={colors.red} />
            </View>
          }
          persistor={persistor}
        >
          <AppView />
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
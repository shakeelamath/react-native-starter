import { Provider } from 'react-redux';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from './src/styles';

import { store, persistor } from './src/redux/store';

import AvailableInFullVersionScreen from './src/modules/login/LoginView';
import HomeScreen from './src/modules/home/HomeView';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <PersistGate
          loading={
            <View style={styles.container}>
              <ActivityIndicator color={colors.red} />
            </View>
          }
          persistor={persistor}
        >
          <Stack.Navigator initialRouteName="AvailableInFullVersionScreen">
            <Stack.Screen name="AvailableInFullVersionScreen" component={AvailableInFullVersionScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            {/* Add other screens as needed */}
          </Stack.Navigator>
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import HomeScreen from '../home/HomeView';
import LoginViewContainer from '../login/LoginViewContainer';
import Pages from '../pages/PagesView';
import { loginSuccess } from '../../redux/actions';
const Stack = createStackNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);



  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Login" component={LoginViewContainer} options={{ headerShown: false }} />
      <Stack.Screen name="SyncUp" component={HomeScreen} />
      <Stack.Screen name="Pages" component={Pages} />
    </Stack.Navigator>
  );
}

// Add a LoadingScreen component if needed
const LoadingScreen = () => {
  return (
    // Your loading UI, e.g., a spinner or a splash screen
    <YourLoadingComponent />
  );
};

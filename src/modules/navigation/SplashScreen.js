import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import GradientBackground from '../../components/GradientBackground';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      // Small timeout so the splash is visible briefly
      setTimeout(() => {
        if (user) navigation.replace('Home');
        else navigation.replace('Login');
      }, 700);
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <GradientBackground style={styles.container}>
      <Image source={require('../../../assets/images/syncupLogo.png')} style={styles.logo} />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 120, height: 120, resizeMode: 'contain' },
});

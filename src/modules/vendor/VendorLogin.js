import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../../services/firebase';

export default function VendorLogin() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    if (!email || !password) return Alert.alert('Missing', 'Please enter email and password');
    try {
      const res = await auth().signInWithEmailAndPassword(email.trim(), password);
      const uid = res.user.uid;
      // read user doc and check role
      const userDoc = await firestore().collection('users').doc(uid).get();
      const userData = userDoc && userDoc.exists ? userDoc.data() : null;

      if (!userData || userData.role !== 'vendor') {
        return Alert.alert('Not a vendor', 'This account is not registered as a vendor.');
      }

      // Successful vendor login: reset navigation stack to dashboard
      navigation.reset({ index: 0, routes: [{ name: 'VendorDashboard' }] });
    } catch (e) {
      console.warn('login failed', e.message || e);
      Alert.alert('Login failed', e.message || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/syncupLogo.png')} style={styles.logo} />
      <Text style={styles.title}>Vendor Portal</Text>
      <Text style={styles.subtitle}>Manage Your Venues & Events</Text>

      <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.loginText}>Login as Vendor</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('VendorSignup')} style={styles.linkRow}>
        <Text style={styles.linkText}>Not a vendor? <Text style={{ fontWeight: '700' }}>Sign in as a user</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 20, resizeMode: 'contain' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#bbb', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#181818', padding: 12, borderRadius: 10, marginTop: 12, color: '#fff' },
  loginButton: { marginTop: 18, backgroundColor: '#e63946', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 30, width: '100%', alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: '800' },
  linkRow: { marginTop: 12 },
  linkText: { color: '#bbb' },
});

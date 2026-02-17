import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../../services/firebase';

export default function VendorSignup() {
  const navigation = useNavigation();
  const [venue, setVenue] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const onCreate = async () => {
    if (!email || !password) return Alert.alert('Missing', 'Please enter email and password');
    try {
      const res = await auth().createUserWithEmailAndPassword(email.trim(), password);
      const uid = res.user.uid;
      // write users/{uid} doc with vendor role
      await firestore().collection('users').doc(uid).set({
        displayName: venue || email.split('@')[0],
        email: email.trim(),
        phone: phone.trim(),
        role: 'vendor',
        createdAt: firestore().FieldValue.serverTimestamp(),
      });

      // reset navigation to vendor dashboard
      navigation.reset({ index: 0, routes: [{ name: 'VendorDashboard' }] });
    } catch (e) {
      console.warn('signup failed', e.message || e);
      Alert.alert('Signup failed', e.message || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vendor Sign Up</Text>

      <TextInput style={styles.input} placeholder="Venue / Business Name" placeholderTextColor="#aaa" value={venue} onChangeText={setVenue} />
      <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#aaa" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.createButton} onPress={onCreate}><Text style={styles.createText}>Create Vendor Account</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20, paddingTop: 80 },
  header: { color: '#fff', fontSize: 22, marginBottom: 16, fontWeight: '700' },
  input: { backgroundColor: '#181818', padding: 12, borderRadius: 10, marginTop: 12, color: '#fff' },
  createButton: { marginTop: 20, backgroundColor: '#e63946', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  createText: { color: '#fff', fontWeight: '700' },
});

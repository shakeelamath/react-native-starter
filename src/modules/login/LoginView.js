import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { fonts, colors } from '../../styles';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/actions';
import GradientBackground from '../../components/GradientBackground';

export default function LoginScreen(props) {
  const [selectedRole, setSelectedRole] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const dispatch = useDispatch();

  GoogleSignin.configure({
    webClientId: '561706331753-jvgchmrcr3ul6js8hs6i5bpgseqbm6o1.apps.googleusercontent.com',
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      dispatch(loginSuccess());
      props.navigation.replace('Home');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // in progress
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available');
      } else {
        console.error('Google Sign-In Error:', error);
        Alert.alert('Login failed', error.message || 'Unknown error');
      }
    }
  };

  const handleEmailLogin = async () => {
    if (!username || !password) return Alert.alert('Validation', 'Enter username and password');
    try {
      await auth().signInWithEmailAndPassword(username, password);
      dispatch(loginSuccess());
      // replace so user can't go back to login
      props.navigation.replace('Home');
    } catch (e) {
      console.error('Email login error', e);
      Alert.alert('Login failed', e.message || 'Unable to sign in');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <GradientBackground style={styles.screen}>
        <View style={styles.card}>
          <Image source={require('../../../assets/images/syncupLogo.png')} style={styles.logo} />

          <View style={styles.roleRow}>
            <TouchableOpacity style={[styles.rolePill, selectedRole === 'user' && styles.rolePillActive]} onPress={() => setSelectedRole('user')}>
              <Text style={[styles.roleText, selectedRole === 'user' && styles.roleTextActive]}>User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.rolePill, selectedRole === 'entertainer' && styles.rolePillActive]} onPress={() => setSelectedRole('entertainer')}>
              <Text style={[styles.roleText, selectedRole === 'entertainer' && styles.roleTextActive]}>Entertainer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput value={username} onChangeText={setUsername} placeholder="Enter your username" style={styles.input} autoCapitalize="none" placeholderTextColor="#bbb" />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry style={styles.input} placeholderTextColor="#bbb" />
          </View>

          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.rememberRow} onPress={() => setRemember(!remember)}>
              <View style={[styles.checkbox, remember && styles.checkboxChecked]} />
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigation.navigate('ForgotPassword') }>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleEmailLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}> Or With </Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Image source={require('../../../assets/images/googlelogo.png')} style={styles.googleIcon} />
            <Text style={styles.googleText}>Login with Google</Text>
          </TouchableOpacity>

          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>Don't have an account ? </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GradientBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: '90%', backgroundColor: 'transparent', paddingTop: 36, paddingHorizontal: 24, alignSelf: 'center' },
  logo: { width: 140, height: 140, marginBottom: 18, resizeMode: 'contain', alignSelf: 'center' },
  roleRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  rolePill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginHorizontal: 6, backgroundColor: 'rgba(255,255,255,0.04)' },
  rolePillActive: { backgroundColor: 'rgba(198,40,40,0.95)' },
  roleText: { color: '#ddd' },
  roleTextActive: { color: '#fff', fontWeight: '700' },
  field: { width: '100%', marginTop: 8 },
  label: { color: '#ddd', marginBottom: 6 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 28 },
  rowBetween: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, marginBottom: 14 },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 8 },
  checkboxChecked: { backgroundColor: '#c62828', borderColor: '#c62828' },
  rememberText: { color: '#ddd' },
  forgotText: { color: '#ff8a80', fontWeight: '700' },
  loginButton: { backgroundColor: '#c62828', borderRadius: 28, paddingVertical: 14, paddingHorizontal: 30, width: '100%', alignItems: 'center', marginTop: 6 },
  loginButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  orText: { marginHorizontal: 12, color: '#bbb' },
  googleButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.28)', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8, width: '100%', justifyContent: 'center' },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleText: { color: '#fff', fontWeight: '700' },
  signUpRow: { flexDirection: 'row', marginTop: 14, justifyContent: 'center' },
  signUpText: { color: '#ccc' },
  signUpLink: { color: '#ff8a80', fontWeight: '700' },
});

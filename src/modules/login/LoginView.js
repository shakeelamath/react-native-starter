import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth'; 
import { fonts, colors } from '../../styles';
import { Button } from '../../components';
import { dispatch, useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/actions';

export default function AvailableInFullVersionScreen(props) {
  const rnsUrl = 'https://reactnativestarter.com';

  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      console.log('Navigating to SyncUp screen');
      dispatch(loginSuccess());
      // Navigate to HomeScreen upon successful sign-in
      props.navigation.navigate('SyncUp');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google Sign-In cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google Sign-In in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('Google Sign-In Error:', error);
      }
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const renderRoleButton = (role, label) => (
    <TouchableOpacity
      style={[styles.roleButton, selectedRole === role && styles.selectedRole]}
      onPress={() => handleRoleSelection(role)}
    >
      <Text style={[styles.roleButtonText, selectedRole === role && styles.selectedRoleText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/syncupLogo.png')} style={styles.nerdImage} />

      <View style={styles.roleContainer}>
        {renderRoleButton('vendor', 'Vendor')}
        {renderRoleButton('entertainer', 'Entertainer')}
        {renderRoleButton('user', 'User')}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          large
          secondary
          rounded
          style={styles.button}
          caption="Submit"
          onPress={() => console.log('Submit button pressed')}
        />

        <Button
          large
          bordered
          rounded
          style={styles.button}
          caption="Later"
          onPress={() => props.navigation.goBack()}
        />

        {/* Google Sign-In button */}
        <Button
          large
          secondary
          rounded
          style={styles.button}
          caption="Sign In with Google"
          onPress={handleGoogleSignIn}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
    
  },
  nerdImage: {
    width: 100,
    height: 100,
    
  },
  availableText: {
    color: colors.black,
    fontFamily: fonts.primaryRegular,
    fontSize: 40,
    marginVertical: 3,
  },
  textContainer: {
    alignItems: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 60,

  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7, 
    
  },
  selectedRole: {
    backgroundColor: '#d61616',
    color: 'white',
  },
  roleButtonText: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'center',
  },
  selectedRoleText: {
    color: 'white',
  },
  buttonsContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  inputContainer: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
  },
  buttonsContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
});

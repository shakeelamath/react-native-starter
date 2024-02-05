import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { fonts, colors } from '../../styles';
import { Button } from '../../components';

export default function AvailableInFullVersionScreen(props) {
  const rnsUrl = 'https://reactnativestarter.com';
  const handleClick = () => {
    Linking.canOpenURL(rnsUrl).then(supported => {
      if (supported) {
        Linking.openURL(rnsUrl);
      } else {
        console.log(`Don't know how to open URI: ${rnsUrl}`);
      }
    });
  };

  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const renderRoleButton = (role, label) => (
    <TouchableOpacity
    style={[
      styles.roleButton,
      selectedRole === role && styles.selectedRole,
    ]}
    onPress={() => handleRoleSelection(role)}
  >
    <Text
      style={[
        styles.roleButtonText,
        selectedRole === role && styles.selectedRoleText,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/syncupLogo.png')}
        style={styles.nerdImage}
      />

      

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

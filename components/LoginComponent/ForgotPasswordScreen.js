import React, {useState} from 'react';
import {View, TextInput, Button, Alert, TouchableOpacity} from 'react-native';
import firebase from 'firebase/app';
import auth from '@react-native-firebase/auth';
import colors from '../../assets/consts/colors';
import {Text} from 'react-native-paper';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (email) {
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          // Password reset email sent successfully
          Alert.alert('Success', 'Password reset email sent');
        })
        .catch(error => {
          // An error occurred while sending password reset email
          Alert.alert('Error', `Error sending password reset email: ${error}`);
        });
    } else {
      Alert.alert('Error', 'Please enter your email');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          marginRight: 270,
          fontSize: 15,
          fontWeight: 'bold',
          marginBottom: 10,
        }}>
        Email
      </Text>
      <TextInput
        style={{
          width: '80%',
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          borderRadius: 10,
        }}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={{
          height: 45,
          width: 310,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.dark,
          borderRadius: 10,
        }}
        onPress={handleResetPassword}>
        <Text style={{color: colors.white, fontSize: 15}}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

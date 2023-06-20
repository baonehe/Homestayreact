import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIoni from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import colors from '../../assets/consts/colors';

function SignUp({navigation}) {
  const [formData, setFormData] = useState({
    regemail: '',
    fullname: '',
    phonenumber: '',
    password: '',
    checkpassword: '',
  });

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  const handleSignUp = async () => {
    const {regemail, fullname, phonenumber, password, checkpassword} = formData;

    try {
      const response = await auth().createUserWithEmailAndPassword(
        regemail,
        password,
      );
      const {uid} = response.user;

      await firestore().collection('Users').doc(uid).set({
        name: fullname,
        email: regemail,
        phone: phonenumber,
        password: checkpassword,
        gender: '',
        date_of_birth: '',
      });
      backloginscreen();
    } catch (error) {
      console.log('Sign up error:', error);
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  const backloginscreen = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.samerow}>
        <Icon name="envelope" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.regemail}
          keyboardType="email-address"
          onChangeText={text => handleInputChange('regemail', text)}
        />
      </View>
      <View style={styles.samerow}>
        <Icon name="user" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={formData.fullname}
          keyboardType="default"
          onChangeText={text => handleInputChange('fullname', text)}
        />
      </View>
      <View style={styles.samerow}>
        <Icon name="phone" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="Your mobile phone"
          value={formData.phonenumber}
          keyboardType="number-pad"
          onChangeText={text => handleInputChange('phonenumber', text)}
        />
      </View>
      <View style={styles.samerow}>
        <Icon name="lock" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="New password"
          value={formData.password}
          secureTextEntry
          onChangeText={text => handleInputChange('password', text)}
        />
      </View>
      <View style={styles.samerow}>
        <IconIoni name="lock-closed-outline" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="Confirm your new password"
          value={formData.checkpassword}
          secureTextEntry
          onChangeText={text => handleInputChange('checkpassword', text)}
        />
      </View>
      <View style={styles.samerow}>
        <Text style={{marginStart: 12, marginTop: 5}}>
          {' '}
          By signing up, you're agree to our{' '}
        </Text>
        <Text style={colors.primary}> Terms & Conditions </Text>
        <Text> and </Text>
        <Text style={{color: colors.primary, marginStart: 12}}>
          {' '}
          Privacy Policy{' '}
        </Text>
      </View>
      <Button
        mode="contained"
        style={{
          height: 45,
          width: '80%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.dark,
          marginTop: 20,
        }}
        onPress={handleSignUp}>
        Sign up
      </Button>
      <View style={styles.samerow}>
        <Text style={{marginStart: 12, marginTop: 5}}> Joined us before? </Text>
        <Text style={{color: '#00008B'}} onPress={backloginscreen}>
          {' '}
          Login{' '}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.dark,
  },
  samerow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    borderRadius: 10,
    paddingTop: 25,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export default SignUp;

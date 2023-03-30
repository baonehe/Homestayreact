import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TextInput} from 'react-native';
import {Button} from 'react-native-paper';
import colors from '../assets/consts/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIoni from 'react-native-vector-icons/Ionicons';

function SignUp() {
  const [email, setEmail] = useState('');
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text style={styles.title}>Sign up</Text>
      <View style={styles.samerow}>
        <Icon name="envelope" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.samerow}>
        <Icon name="user" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={email}
          keyboardType="default"
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.samerow}>
        <Icon name="phone" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="Your mobile phone"
          value={email}
          keyboardType="number-pad"
          onChangeText={text => setEmail(text)}
        />
      </View>

      <View style={styles.samerow}>
        <Icon name="lock" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="New password"
          value={email}
          secureTextEntry
          onChangeText={text => setEmail(text)}
        />
      </View>

      <View style={styles.samerow}>
        <IconIoni name="lock-closed-outline" size={20} marginRight={10} />
        <TextInput
          style={styles.input}
          placeholder="Confirm your new password"
          value={email}
          secureTextEntry
          onChangeText={text => setEmail(text)}
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
        }}>
        Sign up
      </Button>

      <View style={styles.samerow}>
        <Text style={{marginStart: 12, marginTop: 5}}> Joined us before? </Text>
        <Text style={colors.primary}> Login </Text>
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

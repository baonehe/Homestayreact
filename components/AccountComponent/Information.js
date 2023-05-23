import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';

const Information = () => {
  return (
    <View>
      <Text>Information</Text>
      <View style={{flexDirection: 'row'}}>
        <Text>Name</Text>
        <TextInput />
      </View>
    </View>
  );
};

export default Information;

const styles = StyleSheet.create({});

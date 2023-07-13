import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const CompletedBox = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <Text style={styles.text}>Hoàn thành</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangle: {
    width: 100,
    height: 20,
    backgroundColor: 'green',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CompletedBox;

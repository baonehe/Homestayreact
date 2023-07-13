import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import colors from '../assets/consts/colors';

const OPTIONS = ['Male', 'Female'];
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const ModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };
  const option = OPTIONS.map((item, index) => {
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => onPressItem(item)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  });
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.container}>
      <View
        style={[styles.modal, {width: WIDTH - 400}, {height: HEIGHT / 6 + 10}]}>
        <ScrollView>{option}</ScrollView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  option: {
    alignItems: 'flex-start',
  },
  text: {
    margin: 20,
    fontSize: 20,
    color: colors.black,
  },
});

export {ModalPicker};

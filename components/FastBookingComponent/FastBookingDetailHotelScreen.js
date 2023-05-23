import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const FastBookingDetailHotel = ({route}) => {
  const {hotel} = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>{hotel.name}</Text>
    </View>
  );
};
export default FastBookingDetailHotel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tittle: {
    fontSize: 28,
    color: '#005792',
    fontFamily: 'Inter-Bold',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 35,
  },
});

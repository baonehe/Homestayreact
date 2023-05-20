import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const FastBookingDetailHotel = ({route}) => {
  const {hotel} = route.params; 
  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>{hotel.name}</Text>
      <View style={styles.choseTimes}>
      </View>
      <View style={styles.time}>
        <View style={styles.checkIn}>

        </View>
        <Text style={styles.textTo}>
          TO
        </Text>
        <View style={styles.checkOut}>

        </View>
      </View>
    </View>
  );
};
export default FastBookingDetailHotel;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'white'
  },
  tittle:{
    fontSize: 28,
    color: '#005792',
    fontFamily: 'Inter-Bold',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 35,
  },
  choseTimes:{
    height:100,
  },
  time:{
    flexDirection:'row',
    marginHorizontal: 15,
  },
  checkIn:{
    borderWidth: 1,
    borderRadius: 20,
    borderColor:'#C4C4C4',
    width: 157,
    height: 140,
  },
  textTo:{
    fontSize: 18,
    marginHorizontal: 10,
    fontFamily: 'Inter-ExtraLight',
    color: 'black',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkOut:{
    borderWidth: 1,
    borderRadius: 20,
    borderColor:'#C4C4C4',
    width: 157,
    height: 140,
  },
})

import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';
import Icon from 'react-native-vector-icons/Octicons';
import hotels from '../assets/data/hotels';
import images from '../assets/images';



const FastBooking  = ({navigation}) => {
  const ListHotelCard = ({hotel}) => {
    return (
      <TouchableOpacity
         onPress={() => navigation.navigate('FastBookingDetailHotel', {hotel})}>
        <View style={styles.containerCard}>
          <View style={styles.card}>
              <View style={styles.containerImage}>
                <Image style={styles.image} source={hotel.image} />
              </View>
              <View style={styles.itemInfor}>
                <Text style={styles.name}>{hotel.name}</Text>
                <View style={styles.roomType}>
                  <Text style={styles.stRoomType}>Room type</Text>
                  <Text style={styles.type}>SINGLE ROOM</Text>
                </View>
                <View style={styles.inforFee}>
                  <Text style={styles.estimatedFee}>Estimated fee</Text>
                  <Text style={styles.price}>{hotel.price}$</Text>
                  <Text style={{ fontSize:14, marginTop: 2 }} > /night</Text>
                </View>
              </View>
          </View>
          <Image source={require('../assets/images/line.png')} style={{height:25, width:'100%', opacity: 0.3 }}></Image>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* //header */}
      <View style={styles.topContainer}>
        <Text style={styles.header}>Fast Booking </Text>
        <TouchableOpacity>
            <Icon style={styles.icon} name="plus-circle" size={31} color={colors.dark}></Icon>
        </TouchableOpacity>
      </View>

      {/* //listhotel */}
      <FlatList
          data={hotels}
          contentContainerStyle={styles.flatList}
          renderItem={({item}) => <ListHotelCard hotel={item} />}
        />
    </View>
  );
};

export default FastBooking;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: 'while'
  },
  topContainer:{
    flexDirection: 'row',
    justifyContent:'space-evenly',
    marginHorizontal: 10
  },
  header:{
    width: '60%',
    color: '#00204A',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 100,
    fontFamily: 'Inter-Bold'
  },
  icon:{
    marginTop: 35,
  },

  //listHotel

  flatList: {
    marginTop: 10,
    marginHorizontal:10,
    paddingBottom: 100,
  },
  containerCard:{
    backgroundColor: colors.white,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    // marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    flexDirection: 'row',
  },
  containerImage:{
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: 'black',
    elevation: 10,
  },
  image: {
    height: 90,
    width: 90,
    borderRadius: 10,
  },
  itemInfor: {
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  name: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#005792',
  },
  roomType:{
    marginTop:8,
    flexDirection: 'row'
  },
  stRoomType:{
    fontSize: 16,
    color: '#858585',
    fontFamily: 'Inter-Regular',
  },
  type:{
    marginStart:45,
    fontSize: 16,
    color:'black',
    fontFamily: 'Merriweather-Regular'
  },
  inforFee:{
    marginTop:4,
    flexDirection: 'row'
  },
  estimatedFee:{
    fontSize: 16,
    color: '#858585',
    fontFamily: 'Inter-Regular',
  },
  price:{
    marginStart:25,
    fontSize: 16,
    color:'black',
    fontFamily: 'Merriweather-Regular'
  },
})

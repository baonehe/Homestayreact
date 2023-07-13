import React, {useEffect, useState, useRef, useCallback} from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';
import colors from '../../assets/consts/colors';
import sizes from '../../assets/consts/sizes';
import utils from '../../assets/consts/utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {Rating} from 'react-native-ratings';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const listImages = [images.imageRoom1, images.imageRoom2, images.imageRoom3, images.imageRoom4, images.imageRoom5];

const FastBookingDetailHotel = ({navigation, route}) => {
  const {item} = route.params;
  const timeType = useSelector(state => state.timestamp.timeType);
  const selector = useSelector(state => state.timestamp);
  const dispatch = useDispatch();
  const hourlyDuration = useSelector(state => state.timestamp.hourly.duration);
  const ov9Duration = useSelector(state => state.timestamp.overnight.duration);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState();
  const checkIn = useSelector(state => state.timestamp.checkIn);
  const checkOut = useSelector(state => state.timestamp.checkOut);

  const [chooseRoom, setChooseRoom] = useState();
  const [check, setCheck] = useState(false);
  const [text, setText] = useState('Confirm Booking');
  const [roomNumber, setRoomNumber] = useState();
  const [price, setPrice] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleBookHomestay = useCallback(
    roomType => {
      // if (isDataLoaded) {
      //   console.log('room', rooms);
      //   const roomList = rooms[roomType.roomtype_id];
      //   if (roomList && roomList.length > 0) {
      //     // Phòng thuộc roomtype_id tồn tại
      //     const firstRoom = roomList[0];
      //     setCheck(true);
      //     setText('Confirm Booking');
      //     setRoomNumber(firstRoom.room_number);
      //     setType(roomType.room_type);
      //     if (timeType === 'Hourly') {
      //       setPrice(roomType.price_per_hour * hourlyDuration);
      //     } else if (timeType === 'Overnight') {
      //       setPrice(roomType.price_per_night);
      //     } else {
      //     }
      //     setChooseRoom(firstRoom);
      //     setNotiModal(true);
      //   } else {
      //     // Không có phòng thuộc roomtype_id
      //     setCheck(false);
      //     setText('There are currently no available rooms of this type');
      //     setNotiModal(true);
      //   }
      // } else {
      //   // Hiển thị thông báo hoặc xử lý khác khi dữ liệu chưa sẵn sàng
      //   console.log('Data is loading...');
      // }
    },
    [hourlyDuration, isDataLoaded, rooms, timeType],
  );

  function generateBookingId() {
    const length = 10; // Độ dài của bookingId
    let bookingId = '';

    for (let i = 0; i < length; i++) {
      const randomDigit = Math.floor(Math.random() * 10); // Sinh ra một số ngẫu nhiên từ 0 đến 9
      bookingId += randomDigit.toString(); // Chuyển đổi số thành chuỗi và thêm vào bookingId
    }

    return bookingId;
  }

  const bookHomestay = async () => {
    const newBooking = {
      booking_id: generateBookingId(),
      room_id: chooseRoom.room_id,
      user_id: await AsyncStorage.getItem('userId'),
      check_in: selector.checkIn,
      check_out: selector.checkOut,
      price: price,
      status: 'booked',
    };
    setNotiModal(!notiModal);
    database()
      .ref('booking')
      .push(newBooking)
      .then(() => {
        console.log('Booking added to the database');
        fetchRooms();
      })
      .catch(error => {
        console.log('Error adding booking to the database: ', error);
        // Xử lý lỗi nếu có
      });
    firestore()
      .collection('Booking')
      .add(newBooking)
      .then(() => {
        console.log('Booking added to the database');
        fetchRooms();
      })
      .catch(error => {
        console.log('Error adding booking to the database: ', error);
        // Xử lý lỗi nếu có
      });
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.header}>
        <SliderBox
        ImageComponent={FastImage}
        images={listImages}
        autoplay={true}
        circleLoop={true}
        activeOpacity={1}
        dotStyle={styles.dotSlider}
        dotColor={colors.light}
        inactiveDotColor={colors.dark}
        imageLoadingColor={colors.primary}
        paginationBoxStyle={styles.boxSlider}
        ImageComponentStyle={styles.boxImageSlider}
        onCurrentImagePressed={index => console.log(`image ${index} pressed`)}
        />
       <View style={styles.iconBack}>
          <Ionicons
            name="chevron-back-circle-sharp"
            size={sizes.iconLarge}
            color={colors.white}
            onPress={navigation.goBack}
          />
        </View>
      </View>
      <Text style={styles.tittle}>{item.homestayName}</Text>
      <Text style={styles.textLocation}>{item.homestayLocation}</Text>
      <View
              style={{
                marginTop: 5,
                marginHorizontal:20,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Rating
                  imageSize={16}
                  readonly
                  startingValue={item.rating}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    marginLeft: 5,
                    color: colors.black,
                  }}>
                  {item.rating}
                </Text>
              </View>
              <Text style={{fontSize: 13, color: colors.black}}>
                {item.ratingvote} reviews
              </Text>
      </View>
      <View style={styles.time}>
        <View style={styles.checkIn}>
          <Text style={{fontSize: 16, marginTop: 10}}>Check-in</Text>
          <Text style={styles.dayCkI}>{utils.formatDate(checkIn)}</Text>
          <Text style={styles.timeCkI}>{utils.formatTime(checkIn)}</Text>
        </View>
        <Text style={styles.textTo}>TO</Text>
        <View style={styles.checkOut}>
          <Text style={{fontSize: 16, marginTop: 10}}>Check-out</Text>
          <Text style={styles.dayCkO}>{utils.formatDate(checkOut)}</Text>
          <Text style={styles.timeCkO}>{utils.formatTime(checkOut)}</Text>
        </View>
      </View>

      <Text style={styles.inforRoom}>Room</Text>
      <View style={styles.roomType}>
          <Ionicons
            name="md-home-outline"
            size={sizes.iconSmall}
          />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Lato-Regular',
            left: 5,
            top: 5,
          }}>
          Room type :
        </Text>
        <Text style={styles.type}>{item.room_type}</Text>
      </View>

      <View style={styles.estimatedFee}>
          <Ionicons
            name="cash-outline"
            size={sizes.iconSmall}
          />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Lato-Regular',
            left: 5,
            top: 5,
          }}>
          Estimated fee :
        </Text>
        <Text style={styles.fee}>{item.price_per_night}$</Text>
      </View>
      
      <Text style={styles.inforServices}>Services</Text>
      <View style={styles.itemServices}>
          <View style={{flexDirection: 'row', marginTop: 10, marginHorizontal:20}}>
            <Ionicons
              name="bed-outline"
              size={sizes.iconSmall}
            />
            <Text style={styles.service}>{item.condition[0]}</Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10, marginHorizontal:20}}>
            <Ionicons
              name="ios-map-outline"
              size={sizes.iconSmall}
            />
            <Text style={styles.service}>{item.condition[1]}</Text>
          </View>
          
          <View style={{flexDirection: 'row', marginTop: 10, marginHorizontal:20}}>
            <MaterialCommunityIcons
              name="window-closed-variant"
              size={sizes.iconSmall}
            />
            <Text style={styles.service}>{item.condition[2]}</Text>
          </View>
      </View>

      <Button
        mode="contained"
        style={{
          marginHorizontal: 60,
          marginVertical: 20,
          height: 45,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.dark,
        }}
        onPress={() => handleBookHomestay(item)}>
        <Text style={{fontSize: 16, fontFamily: 'Merriweather-Bold'}}>
          BOOK NOW
        </Text>
      </Button>
    </View>
    </ScrollView>
  );
};
export default FastBookingDetailHotel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 35,
  },
  iconBack: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  tittle: {
    fontSize: 22,
    color: '#005792',
    fontFamily: 'Merriweather-Bold',
    justifyContent: 'center',
    // alignSelf: 'center',
    // alignItems: 'center',
    // textAlign: 'center',
    marginHorizontal: 20,
    marginTop:20,
  },
  textLocation:{
    marginHorizontal: 20,
    marginTop: 10,
  },

  inforRoom:{
    marginHorizontal:20,
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    color: 'black',
  },
  time: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  checkIn: {
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#C4C4C4',
    width: 157,
    height: 100,
    alignItems: 'center',
  },
  dayCkI: {
    fontSize: 16,
    fontFamily: 'Merriweather-Regular',
    color: 'black',
    marginTop: 5,
  },
  timeCkI: {
    fontSize: 16,
    fontFamily: 'Merriweather-Regular',
    color: 'black',
    marginTop: 5,
  },
  textTo: {
    fontSize: 16,
    marginHorizontal: 5,
    fontFamily: 'Inter-Light',
    color: 'black',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkOut: {
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#C4C4C4',
    width: 157,
    height: 100,
    alignItems: 'center',
  },
  dayCkO: {
    fontSize: 16,
    fontFamily: 'Merriweather-Regular',
    color: 'black',
    marginTop: 5,
  },
  timeCkO: {
    fontSize: 16,
    fontFamily: 'Merriweather-Regular',
    color: 'black',
    marginTop: 5,
  },

  // slider
  boxSlider: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  boxImageSlider: {
    height: 250,
    overflow: 'hidden',
  },
  dotSlider: {
    width: 10,
    height: 10,
    borderRadius: 15,
    marginHorizontal: -5,
  },

  // information
  roomType: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal:20
  },
  type: {
    fontSize: 16,
    fontFamily: 'Merriweather-Bold',
    left: 10,
    top: 4,
    color: 'black',
  },
  estimatedFee: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal:20
  },
  fee: {
    fontSize: 16,
    fontFamily: 'Merriweather-Bold',
    left: 10,
    top: 4,
    color: 'black',
  },
  inforServices: {
    marginTop: 20,
    marginHorizontal:20,
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    color: 'black',
  },
  service: {
    fontSize: 16,
    left: 5,
    top:4,
  },
});

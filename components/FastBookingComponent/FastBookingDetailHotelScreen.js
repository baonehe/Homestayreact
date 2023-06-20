import React, {useEffect, useState, useRef, useCallback} from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';
import colors from '../../assets/consts/colors';
import sizes from '../../assets/consts/sizes';
import utils from '../../assets/consts/utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Button} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import TimestampPicker from '../SupComponent/TimestampPicker';

const listImages = [images.image1, images.image2, images.image3, images.image4];

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

  const bottomSheetModalRef = useRef(null);
  // handle
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBack}>
          <MaterialIcons
            name="arrow-back-ios"
            size={sizes.iconExtraSmall}
            color={colors.dark}
            onPress={navigation.goBack}
          />
        </View>
        <Text style={styles.tittle}>{item.homestayName}</Text>
      </View>

      <View style={styles.choseTimes}>
        <View style={styles.timeContainer}>
          <TouchableOpacity
            style={styles.chooseBtn}
            onPress={handlePresentModalPress}>
            {timeType === 'Hourly' ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons
                  name="timer-sand"
                  size={24}
                  style={{color: colors.black, marginLeft: 8}}
                />
                <Text style={styles.timeText}>{hourlyDuration} hour(s) </Text>
              </View>
            ) : timeType === 'Overnight' ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome
                  name="moon-o"
                  size={24}
                  style={{color: colors.black, marginLeft: 8}}
                />
                <Text style={styles.timeText}>{ov9Duration} night </Text>
              </View>
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome
                  name="building-o"
                  size={24}
                  style={{color: colors.black, marginLeft: 8}}
                />
                <Text style={styles.timeText}>{ov9Duration} day(s) </Text>
              </View>
            )}
            <Text
              style={{
                color: colors.black,
                fontSize: 24,
                marginHorizontal: 4,
              }}>
              |
            </Text>
            <Text style={styles.timeText}>{utils.formatDateTime(checkIn)}</Text>
            <AntDesign
              name="arrowright"
              size={18}
              style={{color: colors.black, marginHorizontal: 4}}
            />
            <Text style={styles.timeText}>
              {utils.formatDateTime(checkOut)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.time}>
        <View style={styles.checkIn}>
          <Text style={{fontSize: 16, marginTop: 10}}>Check-in</Text>
          <Text style={styles.dayCkI}>14/02/2023</Text>
          <Text style={styles.timeCkI}>20h00</Text>
        </View>
        <Text style={styles.textTo}>TO</Text>
        <View style={styles.checkOut}>
          <Text style={{fontSize: 16, marginTop: 10}}>Check-out</Text>
          <Text style={styles.dayCkO}>15/02/2023</Text>
          <Text style={styles.timeCkO}>20h00</Text>
        </View>
      </View>
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
        // currentImageEmitter={index => console.log(`current pos is: ${index}`)}
      />
      <View style={styles.roomType}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Lato-Regular',
            color: 'black',
            left: 45,
          }}>
          Room type :
        </Text>
        <Text style={styles.type}>{item.room_type}</Text>
      </View>

      <View style={styles.estimatedFee}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Lato-Regular',
            color: 'black',
            left: 45,
          }}>
          Estimated fee :
        </Text>
        <Text style={styles.fee}>{item.price_per_night}$</Text>
      </View>

      <View style={styles.itemServices}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Lato-Regular',
            color: 'black',
            left: 45,
          }}>
          Services :
        </Text>
        <View style={styles.listService}>
          <Text style={styles.service}>{item.condition[0]}</Text>
          <Text style={styles.service}>{item.condition[1]}</Text>
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
        }}>
        <Text style={{fontSize: 16, fontFamily: 'Merriweather-Bold'}}>
          BOOK NOW
        </Text>
      </Button>
    </View>
  );
};
export default FastBookingDetailHotel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBack: {
    position: 'absolute',
    left: 15,
  },
  tittle: {
    fontSize: 28,
    color: '#005792',
    fontFamily: 'Inter-Bold',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginHorizontal: 30,
  },
  choseTimes: {
    height: 100,
  },
  time: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  checkIn: {
    borderWidth: 1,
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
    borderWidth: 1,
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
    marginVertical: 15,
    borderRadius: 15,
    width: '89%',
  },
  dotSlider: {
    width: 10,
    height: 10,
    borderRadius: 15,
    marginHorizontal: -5,
    marginVertical: 15,
  },

  // information
  roomType: {
    flexDirection: 'row',
    marginTop: 5,
  },
  type: {
    fontSize: 16,
    position: 'absolute',
    fontFamily: 'Merriweather-Bold',
    left: 195,
    color: 'black',
  },
  estimatedFee: {
    flexDirection: 'row',
    marginTop: 10,
  },
  fee: {
    fontSize: 16,
    position: 'absolute',
    fontFamily: 'Merriweather-Bold',
    left: 195,
    color: 'black',
  },
  itemServices: {
    flexDirection: 'row',
    marginTop: 10,
  },
  listService: {
    marginTop: -10,
  },
  service: {
    fontSize: 16,
    fontFamily: 'Merriweather-Bold',
    left: 80,
    color: 'black',
    marginTop: 10,
  },
});

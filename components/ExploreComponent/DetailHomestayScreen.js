import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import FastImage from 'react-native-fast-image';
import { SliderBox } from 'react-native-image-slider-box';
import {
  GestureHandlerRootView,
  ScrollView,
  FlatList,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Rating } from 'react-native-ratings';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addHours, format, parse, isWithinInterval, isBefore } from 'date-fns';
import TimestampPicker from '../SupComponent/TimestampPicker';
import {
  setTimeType,
  setCheckIn,
  setCheckOut,
  setCheckInTab,
  setCheckOutTab,
  setCheckInTime,
  setCheckOutTime,
  setSelectedTimeframe,
  getTimeframeList,
} from '../redux/timestampReducers';
import FavoriteButton from '../FavoriteButton';
import { onDisplayNotification } from '../NotificationComponent/PushNotiHelper';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import colors from '../../assets/consts/colors';
import sizes from '../../assets/consts/sizes';
import images from '../../assets/images';
import utils from '../../assets/consts/utils';

const DetailHomestayScreen = ({ navigation, route }) => {
  const homestay = route.params;
  const timeType = useSelector(state => state.timestamp.timeType);
  const selector = useSelector(state => state.timestamp);
  const dispatch = useDispatch();
  const hourlyDuration = useSelector(state => state.timestamp.hourly.duration);
  const ov9Duration = useSelector(state => state.timestamp.overnight.duration);
  const dailyDuration = useSelector(state => state.timestamp.daily.duration);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState();
  const checkIn = useSelector(state => state.timestamp.checkIn);
  const checkOut = useSelector(state => state.timestamp.checkOut);

  const [chooseRoom, setChooseRoom] = useState();
  const [check, setCheck] = useState(false);
  const [text, setText] = useState('Confirm Booking');
  const [roomNumber, setRoomNumber] = useState();
  const [type, setType] = useState();
  const [price, setPrice] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const dataArray = Object.entries(homestay.extension).map(([key, value]) => ({
    key,
    value,
  }));

  const listImages = [
    images.image1,
    images.image2,
    images.image3,
    images.image4,
  ];
  const [notiModal, setNotiModal] = useState(false);

  // hooks
  const bottomSheetModalRef = useRef(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // variables
  const snapPoints = useMemo(() => ['75%'], []);

  // handle
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const getData = (firstRoom, user_id,timeType, roomType, price) => {
    try {
      const data = {
        homestay_id: homestay.homestay_id,
        room_id: firstRoom.room_id,
        room_number: firstRoom.room_number,
        time_type: timeType,
        room_type: roomType,
        user_id: user_id,
        check_in: selector.checkIn,
        check_out: selector.checkOut,
        price: price,
        status: 'pending',
      };
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  const handleBookHomestay = useCallback(async (roomType) => {
    const roomList = rooms[roomType.roomtype_id];
    const firstRoom = roomList[0];
    let price;
    const user_id = await AsyncStorage.getItem('userId');
  
    if (roomType.timetype.includes(timeType)) {
      if (timeType === 'Hourly') {
        price = roomType.price_per_hour * hourlyDuration;
      } else if (timeType === 'Overnight') {
        price = roomType.price_per_night;
      } else {
        price = roomType.price_per_night * dailyDuration;
      }
    }
    console.log(price);
    try {
      const data = await getData(firstRoom, user_id, timeType, roomType.room_type, price);
      navigation.navigate('Payment', data);
    } catch (error) {
      console.log('Error:', error);
    }
  }, [dailyDuration, getData, hourlyDuration, navigation, rooms, timeType]);

  const bookHomestay = async () => {
    const booking_id = generateBookingId();
    const newBooking = {
      booking_id: booking_id,
      homestay_id: homestay.homestay_id,
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
    onDisplayNotification({
      title: 'Stelio Booking',
      body: `Your booking ${booking_id} is confirmed.`,
    });
  };

  const ShowExtension = ({item, itemCount}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 10,
        }}>
        {item.value == '1' && (
          <View style={styles.extensionItem}>
            {item.key === 'Buffet' && (
              <Ionicons name="restaurant" size={30} color="black" />
            )}
            {item.key === 'Car_park' && (
              <MaterialCommunityIcons name="parking" size={30} color="black" />
            )}
            {item.key === 'MotorBike' && (
              <MaterialCommunityIcons
                name="motorbike"
                size={30}
                color="black"
              />
            )}
            {item.key === 'Wifi' && (
              <AntDesign name="wifi" size={30} color="black" />
            )}
            <Text style={styles.extensionText}>{item.key}</Text>
          </View>
        )}
      </View>
    );
  };

  const RoomItem = ({item}) => {
    const hasRooms = rooms[item.roomtype_id];
    const isAvailable = hasRooms !== undefined && hasRooms.length > 0;
    if (isAvailable) {
      return (
        <TouchableOpacity
          style={styles.roomCard}
          onPress={() => navigation.navigate('FastBookingDetailHotel', { item })}>
          <SliderBox
            ImageComponent={FastImage}
            images={listImages}
            autoplay={true}
            circleLoop={true}
            parentWidth={350}
            sliderBoxHeight={175}
            activeOpacity={1}
            dotStyle={styles.dotSlider}
            dotColor={colors.light}
            inactiveDotColor={colors.dark}
            imageLoadingColor={colors.primary}
            ImageComponentStyle={styles.boxImageSlider}
          />

          <View style={styles.inforRoom}>
            <Text style={styles.roomTypeText}>{item.room_type}</Text>
            <View style={styles.detailRoom}>
              <View style={styles.priceContainer}>
                <Text style={styles.timeTypeText}>{timeType}</Text>
                <Text style={styles.priceText}>
                  {' '}
                  {item.timetype.includes(timeType) ? (
                    <Text>
                      {timeType === 'Hourly'
                        ? item.price_per_hour * hourlyDuration
                        : timeType === 'Overnight'
                          ? item.price_per_night
                          : item.price_per_night * dailyDuration}
                      $
                    </Text>
                  ) : null}
                </Text>
              </View>
              <View style={styles.conditionContainer}>
                <View style={styles.conditionItem}>
                  <Ionicons name="bed" size={20} color={colors.primary} />
                  <Text style={styles.conditionText}>{item.condition[0]}</Text>
                </View>
                <View style={styles.conditionItem}>
                  <MaterialCommunityIcons
                    name="floor-plan"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.conditionText}>{item.condition[1]}</Text>
                </View>
                <View style={styles.conditionItem}>
                  <MaterialCommunityIcons
                    name="window-open-variant"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.conditionText}>{item.condition[2]}</Text>
                </View>
              </View>
            </View>
            <View style={styles.provisionRoom}>
              <View style={styles.provisionItem}>
                <AntDesign name="creditcard" size={16} color={colors.black} />
                <Text style={styles.provisionText}>{item.provision[0]}</Text>
              </View>
              <View style={styles.provisionItem}>
                <FontAwesome5 name="coins" size={16} color={colors.black} />
                <Text style={styles.provisionText}>{item.provision[1]}</Text>
              </View>
            </View>
            <View style={styles.policyRoom}>
              <View style={styles.policyItem}>
                <Ionicons
                  name="md-information-circle-outline"
                  size={27}
                  color={colors.secondary}
                />
                <Text style={styles.policyText}>Chính sách hoàn trả</Text>
              </View>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => handleBookHomestay(item)}>
                <Text style={styles.textBtn}>BOOK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <Text
          style={[
            styles.loadText,
            { fontSize: 16, marginTop: 10, marginBottom: 0 },
          ]}>
          No rooms for type:{' '}
          <Text style={[styles.roomTypeText, { fontSize: 14 }]}>
            {item.room_type}
          </Text>{' '}
          right now.
        </Text>
      );
    }
  };

  // Update datetime
  useEffect(() => {
    const timeframeList = getTimeframeList(selector.hourly.checkInDate);
    const itemString = timeframeList.find(item => !item.disabled).timeString;
    const checkInTime = parse(itemString, 'HH:mm', new Date());
    const newCheckOutTime = addHours(checkInTime, selector.hourly.duration);
    const formattedCheckOutTime = format(newCheckOutTime, 'HH:mm');

    const checkInDate = selector.hourly.checkInDate;
    const checkOutDate = selector.hourly.checkOutDate;
    const formattedCheckIn = `${itemString}, ${checkInDate}`;
    const formattedCheckOut = `${formattedCheckOutTime}, ${checkOutDate}`;
    dispatch(setTimeType('Hourly'));
    dispatch(setCheckInTime({ checkInTime: itemString, tabName: 'hourly' }));
    dispatch(
      setCheckOutTime({
        checkOutTime: formattedCheckOutTime,
        tabName: 'hourly',
      }),
    );
    dispatch(
      setSelectedTimeframe({
        selectedTimeFrame: itemString,
        tabName: 'hourly',
      }),
    );
    dispatch(setCheckInTab({ checkIn: formattedCheckIn, tabName: 'hourly' }));
    dispatch(setCheckOutTab({ checkOut: formattedCheckOut, tabName: 'hourly' }));
    dispatch(setCheckIn(formattedCheckIn));
    dispatch(setCheckOut(formattedCheckOut));
  }, []);

  console.log('Time:' + selector.checkIn, selector.checkOut);

  // Fetch Room Types
  useEffect(() => {
    const fetchRoomTypes = async () => {
      const snapshot = await database().ref('roomtypes').once('value');
      if (snapshot && snapshot.val) {
        const data = snapshot.val();
        const roomTypesData = Object.values(data);

        // Lọc các kiểu phòng theo homestay_id
        const filteredRoomTypes = roomTypesData.filter(
          roomType =>
            roomType.homestay_id === homestay.homestay_id &&
            roomType.timetype.includes(timeType),
        );
        console.log(filteredRoomTypes, homestay.homestay_id);
        // Lưu trữ danh sách kiểu phòng đã lọc vào state
        setRoomTypes(filteredRoomTypes);
      }
    };
    fetchRoomTypes();
  }, [homestay.homestay_id, timeType]);

  const fetchRooms = useCallback(async () => {
    setIsDataLoaded(false);
    const snapshot = await database().ref('rooms').once('value');
    if (snapshot && snapshot.val) {
      const data = snapshot.val();
      const roomsData = Object.values(data);

      // Tạo một danh sách tất cả các phòng có sẵn
      const availableRooms = [];
      for (const room of roomsData) {
        const isAvailable = await isRoomAvailable(
          room,
          selector.checkIn,
          selector.checkOut,
        );
        if (isAvailable) {
          availableRooms.push(room);
        }
      }

      // Tạo một đối tượng để phân loại các phòng theo roomtype_id
      const classifiedRooms = {};
      availableRooms.forEach(room => {
        if (classifiedRooms.hasOwnProperty(room.roomtype_id)) {
          classifiedRooms[room.roomtype_id].push(room);
        } else {
          classifiedRooms[room.roomtype_id] = [room];
        }
      });

      // Lưu trữ các phòng đã phân loại và kiểm tra sẵn sàng vào state
      setRooms(classifiedRooms);
      setIsDataLoaded(true);
    }
  }, [selector.checkIn, selector.checkOut]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      fetchRooms();
    });
  }, [navigation, fetchRooms]);
  
  const isRoomAvailable = async (room, checkin, checkout) => {
    const snapshot = await database().ref('booking').once('value');
    if (snapshot && snapshot.val) {
      const data = snapshot.val();
      const bookings = Object.values(data);

      // Kiểm tra xem phòng có trong bookings không
      const roomBookings = bookings.filter(
        booking => booking.room_id === room.room_id,
      );
      if (roomBookings.length === 0) {
        return true; // Phòng không có đặt phòng
      }

      const checkinDate = parse(checkin, 'HH:mm, dd/MM/yyyy', new Date());
      const checkoutDate = parse(checkout, 'HH:mm, dd/MM/yyyy', new Date());

      for (const booking of roomBookings) {
        const bookingCheckinDate = parse(
          booking.check_in,
          'HH:mm, dd/MM/yyyy',
          new Date(),
        );
        const bookingCheckoutDate = parse(
          booking.check_out,
          'HH:mm, dd/MM/yyyy',
          new Date(),
        );

        // Kiểm tra nếu ngày check-out trong quá khứ
        if (isBefore(bookingCheckoutDate, new Date())) {
          continue; // Bỏ qua phòng đã có đặt trong quá khứ
        }

        const isConflict =
          isWithinInterval(checkinDate, {
            start: bookingCheckinDate,
            end: bookingCheckoutDate,
          }) ||
          isWithinInterval(checkoutDate, {
            start: bookingCheckinDate,
            end: bookingCheckoutDate,
          }) ||
          isWithinInterval(bookingCheckinDate, {
            start: checkinDate,
            end: checkoutDate,
          }) ||
          isWithinInterval(bookingCheckoutDate, {
            start: checkinDate,
            end: checkoutDate,
          });

        if (isConflict) {
          return false; // Phòng đã có người đặt trong khoảng thời gian này
        }
      }

      return true; // Phòng không bị xung đột với khoảng thời gian này
    }

    return true; // Nếu không có dữ liệu đặt phòng
  };

  return (
    <GestureHandlerRootView contentContainerStyle={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <ImageBackground
          source={{ uri: homestay.image }}
          style={styles.headerImage}>
          <View style={styles.header}>
            <Icon
              name="arrow-back-ios"
              size={sizes.iconExtraSmall}
              color={colors.white}
              onPress={navigation.goBack}
            />
            <Icon
              name="bookmark-border"
              size={sizes.iconSmall}
              color={colors.white}
            />
          </View>
        </ImageBackground>
        <View>
          <View style={styles.iconContainer}>
            <FavoriteButton item={homestay} />
          </View>
          <View style={styles.itemInfor}>
            <Text style={styles.textName}> {homestay.name}</Text>
            <Text style={styles.textLocation}> {homestay.location}</Text>
            <View
              style={{
                marginTop: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <Rating
                  imageSize={20}
                  readonly
                  startingValue={homestay.rating}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginLeft: 5,
                    color: colors.black,
                  }}>
                  {homestay.rating}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: colors.gray }}>
                {homestay.ratingvote} reviews
              </Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ lineHeight: 20, color: colors.gray }}>
                {homestay.details}
              </Text>
            </View>
          </View>
          <FlatList
            data={dataArray}
            horizontal
            contentContainerStyle={styles.flatListContainer}
            renderItem={({item}) => (
              <ShowExtension
                item={item}
                itemCount={dataArray.filter(i => i.value === '1').length}
              />
            )}
          />
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Price from</Text>
            <View style={styles.priceTag}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.grey,
                  marginLeft: 5,
                }}>
                ${homestay.price}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: colors.grey,
                  marginLeft: 5,
                }}>
                + breakfast
              </Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <TouchableOpacity
              style={styles.chooseBtn}
              onPress={handlePresentModalPress}>
              {timeType === 'Hourly' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name="timer-sand"
                    size={24}
                    style={{ color: colors.black, marginLeft: 8 }}
                  />
                  <Text style={styles.timeText}>{hourlyDuration} hour(s) </Text>
                </View>
              ) : timeType === 'Overnight' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome
                    name="moon-o"
                    size={24}
                    style={{ color: colors.black, marginLeft: 8 }}
                  />
                  <Text style={styles.timeText}>{ov9Duration} night </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome
                    name="building-o"
                    size={24}
                    style={{ color: colors.black, marginLeft: 8 }}
                  />
                  <Text style={styles.timeText}>{dailyDuration} day(s) </Text>
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
              <Text style={styles.timeText}>
                {utils.formatDateTime(checkIn)}
              </Text>
              <AntDesign
                name="arrowright"
                size={18}
                style={{ color: colors.black, marginHorizontal: 4 }}
              />
              <Text style={styles.timeText}>
                {utils.formatDateTime(checkOut)}
              </Text>
            </TouchableOpacity>
          </View>
          {isDataLoaded ? (
            <FlatList
              data={roomTypes}
              vertical
              contentContainerStyle={styles.flatList}
              renderItem={({ item }) => <RoomItem item={item} />}
            />
          ) : (
            <Text style={styles.loadText}>Loading...</Text>
          )}
        </View>
      </ScrollView>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}>
          <TimestampPicker />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default DetailHomestayScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingBottom: 20,
  },
  iconContainer: {
    position: 'absolute',
    height: 60,
    width: 60,
    backgroundColor: colors.primary,
    top: -35,
    right: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    paddingVertical: 10,
    flex: 1,
    justifyContent: 'center',
  },
  headerImage: {
    height: 400,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    overflow: 'hidden',
  },
  header: {
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  itemInfor: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  textName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Merriweather-Black',
    color: colors.black,
  },
  textLocation: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray,
    marginTop: 5,
  },

  priceTag: {
    height: 40,
    alignItems: 'center',
    marginLeft: 40,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: colors.light,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: 'row',
  },

  flatList: {
    alignItems: 'center',
  },
  flatListVertical: {
    paddingVertical: 20,
  },
  roomCard: {
    height: 'auto',
    width: 350,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'stretch',
    borderWidth: 0.7,
    borderRadius: 15,
    borderColor: colors.darkgray,
    marginVertical: 15,
    elevation: 12,
    backgroundColor: colors.white,
  },
  boxImageSlider: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  dotSlider: {
    width: 10,
    height: 10,
    borderRadius: 15,
    marginHorizontal: -5,
    marginTop: 10,
  },

  inforRoom: {
    flexDirection: 'column',
    height: 'auto',
    alignItems: 'flex-start',
  },
  roomTypeText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: colors.dark,
    margin: 10,
    alignSelf: 'center',
  },

  detailRoom: {
    flexDirection: 'row',
    height: 'auto',
    alignItems: 'flex-start',
  },
  conditionContainer: {
    width: '50%',
    height: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    borderLeftWidth: 0.7,
    borderColor: colors.dark,
    verticalAlign: 'top',
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  conditionText: {
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    color: colors.black,
    marginHorizontal: 10,
  },

  priceContainer: {
    width: '50%',
    height: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingBottom: 8,
  },
  timeTypeText: {
    fontFamily: 'Merriweather-Regular',
    fontSize: 15,
    color: colors.black,
    marginLeft: 20,
    marginBottom: 5,
  },
  priceText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: colors.red,
    marginLeft: 20,
    marginBottom: 5,
  },

  provisionRoom: {
    height: 'auto',
    width: 310,
    flexDirection: 'column',
    backgroundColor: colors.light,
    marginHorizontal: 20,
    marginVertical: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  provisionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  provisionText: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    marginHorizontal: 10,
    marginVertical: 5,
    color: colors.black,
  },

  policyRoom: {
    width: '100%',
    // backgroundColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  policyItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  policyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 5,
    color: colors.darkgray,
  },
  bookBtn: {
    height: 40,
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 20,
  },
  textBtn: {
    color: colors.white,
    fontSize: 13,
    fontFamily: 'Merriweather-Bold',
  },

  timeContainer: {
    marginTop: 10,
  },
  timeText: {
    color: colors.black,
    fontSize: 15,
    fontFamily: 'Lato-Regular',
  },

  chooseBtn: {
    height: 45,
    width: 320,
    padding: 2.5,
    backgroundColor: '#EFEEFC',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#BCB6DC',
  },
  extensionItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  extensionText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  cancelBtn: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
  },
  loadText: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Lato-Regular',
    color: colors.red,
    marginVertical: 20,
  },
});

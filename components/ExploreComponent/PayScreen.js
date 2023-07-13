import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-virtualized-view';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {onDisplayNotification} from '../NotificationComponent/PushNotiHelper';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import sizes from '../../assets/consts/sizes';
import colors from '../../assets/consts/colors';

const PayScreen = ({navigation, route}) => {
  const data = route.params;
  console.log(data);
  const selector = useSelector(state => state.timestamp);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [homestay, setHomestay] = useState();
  const [name, setname] = useState('');
  const [phone, setphone] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('Thanh toán trực tiếp');
  const [showAlert, setShowAlert] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(data.price);
  const [disPrice, setDisPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(data.price);
  const [checkedPrice, setCheckedPrice] = useState(false);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleInputChange = text => {
    setInputValue(text);
  };

  const handleOptionSelect = option => {
    setSelectedOption(option);
  };

  const RadioButton = ({label, selected, onSelect}) => (
    <TouchableOpacity style={styles.radioButton} onPress={onSelect}>
      <View style={styles.radioButtonIcon}>
        {selected ? <View style={styles.radioButtonInner} /> : null}
      </View>
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const showBookAlert = () => {
    Alert.alert(
      'Xác nhận đặt phòng', // Tiêu đề của thông báo
      'Bạn có chắc chắn muốn đặt phòng?', // Nội dung của thông báo
      [
        {
          text: 'Hủy', // Nút hủy
          onPress: () => handleCloseAlert(), // Hành động khi nhấn vào nút hủy
          style: 'cancel',
        },
        {
          text: 'Đặt phòng', // Nút đặt phòng
          //   onPress: () => bookHomestay(), // Hành động khi nhấn vào nút đặt phòng
          onPress: async () => {
            await bookHomestay();
            navigation.goBack();
          },
        },
      ],
      {cancelable: false}, // Tùy chọn để không cho phép người dùng đóng thông báo bằng cách bấm bên ngoài
    );
  };

  const handleCheckCode = async () => {
    const snapshot = await database()
      .ref('voucher')
      .orderByChild('code')
      .equalTo(inputValue)
      .once('value');
    if (snapshot && snapshot.val()) {
      const voucherData = snapshot.val();
      const firstVoucher = Object.values(voucherData)[0];
      setDiscount(firstVoucher.value);
      setCheckedPrice(true);
      alert('Voucher hợp lệ!');
    } else {
      setCheckedPrice(false);
      alert('Voucher không hợp lệ!');
    }
  };

  const roundToInteger = number => {
    if (isNaN(number)) {
      return '';
    }

    return Math.round(number);
  };

  const handleRewards = () => {
    const dis = roundToInteger(price * discount);
    const total = roundToInteger(price - price * discount);
    setDisPrice(dis);
    setTotalPrice(total);
  };

  useEffect(() => {
    checkInfo();
    loadHomestay();
  }, []);

  useEffect(() => {
    if (checkedPrice) {
      handleRewards();
    } else {
      setDisPrice(0);
      setTotalPrice(price);
    }
  }, [price, discount, disPrice, checkedPrice]);

  const checkInfo = async () => {
    const docSnapshot = await firestore()
      .collection('Users')
      .doc(data.user_id)
      .get();
    if (docSnapshot.exists) {
      const user = docSnapshot.data();
      console.log(user);
      setname(user.name);
      setphone(user.phone);
    }
  };

  const loadHomestay = useCallback(async () => {
    try {
      const snapshot = await database().ref('homestays').once('value');
      if (snapshot.exists()) {
        const homestayData = snapshot.val();
        const homestays = Object.values(homestayData);
        const filteredHomestays = homestays.filter(
          home => home.homestay_id === data.homestay_id,
        );
        if (filteredHomestays.length > 0) {
          setHomestay(filteredHomestays[0]);
          setIsDataLoaded(true);
        }
      }
    } catch (error) {
      console.log('Error loading homestay: ', error);
    }
  }, [data.homestay_id]);

  function generateBookingId() {
    const length = 10; // Độ dài của bookingId
    let bookingId = '';

    for (let i = 0; i < length; i++) {
      const randomDigit = Math.floor(Math.random() * 10); // Sinh ra một số ngẫu nhiên từ 0 đến 9
      bookingId += randomDigit.toString(); // Chuyển đổi số thành chuỗi và thêm vào bookingId
    }

    return bookingId;
  }

  const addBookingToRealtimeDatabase = async newBooking => {
    try {
      await database().ref('booking').push(newBooking);
      console.log('Booking added to the database');
    } catch (error) {
      console.log('Error adding booking to the database: ', error);
      // Xử lý lỗi nếu có
    }
  };

  const addBookingToFirestore = async newBooking => {
    try {
      await firestore().collection('Booking').add(newBooking);
      console.log('Booking added to the firestore');
    } catch (error) {
      console.log('Error adding booking to the firestore: ', error);
      // Xử lý lỗi nếu có
    }
  };

  const addNotificationToUser = async (user_id, newBooking) => {
    const docSnapshot = await firestore()
      .collection('Users')
      .doc(user_id)
      .get();

    if (docSnapshot.exists) {
      const user = docSnapshot.data();
      console.log(user);
      const currentDate = new Date();
      const formattedDate = `${currentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })} ${currentDate.toLocaleDateString()}`;

      if (user.notifications) {
        firestore()
          .collection('Users')
          .doc(user_id)
          .update({
            notifications: firestore.FieldValue.arrayUnion({
              id: newBooking.booking_id,
              title: 'Stelio Notification',
              details: `Your booking ${newBooking.booking_id} is confirmed.`,
              date: formattedDate,
              type: 'Booking',
            }),
          })
          .then(() => {
            console.log('Notification added to the document');
          })
          .catch(error => {
            console.log('Error adding notification to the document: ', error);
          });
      } else {
        firestore()
          .collection('Users')
          .doc(user_id)
          .set(
            {
              notifications: [
                {
                  id: newBooking.booking_id,
                  title: 'Stelio Notification',
                  details: `Your booking ${newBooking.booking_id} is confirmed.`,
                  date: formattedDate,
                  type: 'Booking',
                },
              ],
            },
            {merge: true},
          )
          .then(() => {
            console.log('Notifications field created in the document');
          })
          .catch(error => {
            console.log(
              'Error creating notifications field in the document: ',
              error,
            );
          });
      }
    } else {
      console.log('Document does not exist');
    }
  };

  const bookHomestay = async () => {
    const booking_id = generateBookingId();
    const newBooking = {
      ...data,
      booking_id: booking_id,
      total_price: totalPrice,
      status: 'booked',
    };

    addBookingToRealtimeDatabase(newBooking);
    addBookingToFirestore(newBooking);
    addNotificationToUser(data.user_id, newBooking);

    onDisplayNotification({
      title: 'Stelio Booking',
      body: `Your booking ${booking_id} is confirmed.`,
    });
  };

  return (
    <SafeAreaView style={styles.containers}>
      <ScrollView>
        <View style={styles.view}>
          <Text style={styles.title}>Booking Information</Text>
          {isDataLoaded ? (
            <View>
              <TouchableOpacity key={'hs_info'}>
                <View style={styles.itemCard}>
                  <View style={styles.itemImageContainer}>
                    <Image
                      style={styles.itemImage}
                      source={{uri: homestay.image}}
                    />
                  </View>
                  <View style={styles.itemInfor}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.itemName}>
                      {homestay.name}
                    </Text>
                    <Text style={{...styles.itemType, fontFamily: 'Lato-Bold'}}>
                      {data.room_type} - No.{data.room_number}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.itemType}>
                      {homestay.location}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity key={'time_info'}>
                <View style={styles.itemCard}>
                  <View style={styles.itemImageContainer}>
                    {data.time_type === 'Hourly' ? (
                      <ImageBackground
                        style={styles.itemImage}
                        source={{
                          uri: 'https://firebasestorage.googleapis.com/v0/b/homestay-cacf0.appspot.com/o/Hourly.png?alt=media&token=3d8db9a1-2f3e-41ef-9645-24de97dbbe06',
                        }}>
                        <Text style={styles.durationText}>
                          {selector.hourly.duration} hour(s)
                        </Text>
                      </ImageBackground>
                    ) : data.time_type === 'Overnight' ? (
                      <ImageBackground
                        style={styles.itemImage}
                        source={{
                          uri: 'https://firebasestorage.googleapis.com/v0/b/homestay-cacf0.appspot.com/o/Overnight.png?alt=media&token=4afc5d56-be7d-4a77-a7f1-2b7f56ec832e',
                        }}>
                        <Text style={styles.durationText}>
                          {selector.overnight.duration} night(s)
                        </Text>
                      </ImageBackground>
                    ) : (
                      <ImageBackground
                        style={styles.itemImage}
                        source={{
                          uri: 'https://firebasestorage.googleapis.com/v0/b/homestay-cacf0.appspot.com/o/Daily.png?alt=media&token=405265a0-6d56-493e-a901-9b613e22d823',
                        }}>
                        <Text style={styles.durationText}>
                          {selector.daily.duration} day(s)
                        </Text>
                      </ImageBackground>
                    )}
                  </View>
                  <View style={styles.itemInfor}>
                    <Text style={styles.textStyle}>Check In</Text>
                    <Text style={styles.timeText}>{data.check_in}</Text>
                    <Text style={styles.textStyle}>Check Out</Text>
                    <Text style={styles.timeText}>{data.check_out}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <Text> Loading...</Text>
          )}
        </View>
        <View style={styles.view}>
          <Text style={styles.title}>User Information</Text>
          <View style={styles.view1}>
            <Text style={styles.content}>Name</Text>
            <Text
              style={{
                fontSize: 18,
                marginRight: 50,
                fontFamily: 'Inter-SemiBold',
                color: colors.black,
              }}>
              {name}
            </Text>
          </View>
          <View style={styles.view1}>
            <Text style={styles.content}>Phone</Text>
            <Text
              style={{
                fontSize: 18,
                marginRight: 50,
                fontFamily: 'Inter-SemiBold',
                color: colors.black,
              }}>
              {phone}
            </Text>
          </View>
        </View>
        <View style={styles.view}>
          <Text style={styles.title}>Rewards</Text>
          <View style={styles.view1}>
            <Text style={styles.content}>Code</Text>
            <TextInput
              style={{
                marginRight: 50,
                fontSize: 20,
                fontFamily: 'Lato-BoldItalic',
                color: colors.primary,
              }}
              value={inputValue}
              onChangeText={text => handleInputChange(text)}
              placeholder="Enter a code"
              onSubmitEditing={() => handleCheckCode()}
            />
          </View>
        </View>
        <View style={styles.view}>
          <Text style={styles.title}>Payment Method</Text>
          <View style={styles.view1}>
            <RadioButton
              label="Pay at the hotel"
              selected={selectedOption === 'Thanh toán trực tiếp'}
              onSelect={() => handleOptionSelect('Thanh toán trực tiếp')}
            />
          </View>
          <View style={styles.view1}>
            <RadioButton
              label="Online Payment"
              // selected={selectedOption === 'Thanh toán online'}
              // onSelect={() => handleOptionSelect('Thanh toán online')}
              onSelect={() => alert('Chức năng đang được phát triển')}
            />
          </View>
        </View>
        <View style={styles.view}>
          <Text style={styles.title}>Payment Details</Text>
          <View>
            <View style={styles.view2}>
              <Icon
                name="money"
                size={24}
                color={colors.lightblack}
                marginLeft={10}
                marginRight={10}
              />
              <Text style={{fontSize: 15, color: colors.lightblack}}>
                Room rate
              </Text>
              <Text style={styles.price}>{price}</Text>
            </View>
          </View>
          <View>
            <View style={styles.view2}>
              <MaterialCommunityIcons
                name="ticket-percent-outline"
                size={29}
                color={colors.lightblack}
                marginLeft={8}
                marginRight={9}
              />
              <Text
                style={{fontSize: 16, marginTop: 5, color: colors.lightblack}}>
                Discount
              </Text>
              <Text style={styles.coupon}> {disPrice} </Text>
            </View>
          </View>
          <View style={styles.view_sum}>
            <Text style={styles.content1}>Total payment</Text>
            <Text style={styles.sum}>{totalPrice}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{backgroundColor: colors.white}}>
        <TouchableOpacity
          style={styles.bookbtn}
          onPress={() => showBookAlert()}>
          <Text style={styles.book}>Book</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containers: {
    display: 'flex',
    flex: 1,
    backgroundColor: colors.lightgray,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10,
  },
  radioButtonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  radioButtonLabel: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  view: {
    width: '100%',
    backgroundColor: colors.white,
    marginTop: 10,
  },
  view1: {
    width: '100%',
    backgroundColor: colors.white,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  view2: {
    width: '95%',
    backgroundColor: colors.white,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
  },
  price: {
    fontFamily: 'Merriweather-Bold',
    color: colors.black,
    marginLeft: 205,
    fontSize: 20,
  },
  coupon: {
    fontFamily: 'Merriweather-Bold',
    color: colors.black,
    marginLeft: 210,
    fontSize: 20,
  },
  view_sum: {
    width: '95%',
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sum: {
    fontFamily: 'Merriweather-Bold',
    color: colors.black,
    fontSize: 28,
  },
  txtview: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.primary,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: colors.black,
    padding: 10,
    paddingLeft: 20,
  },
  content: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    paddingLeft: 10,
    paddingBottom: 10,
    color: colors.black,
  },
  content1: {
    fontSize: 22,
    fontFamily: 'Lato-Bold',
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    color: colors.black,
  },
  bookbtn: {
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    padding: 12,
    margin: 15,
  },
  book: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    color: colors.white,
  },

  itemCard: {
    height: 120,
    width: 345,
    backgroundColor: colors.white,
    marginBottom: 15,
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  itemImage: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 12,
  },
  itemImageContainer: {
    height: 105,
    width: 105,
  },
  itemInfor: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 25,
    borderBottomWidth: 1,
    borderColor: colors.gray2,
  },
  itemName: {
    fontSize: 19,
    fontFamily: 'Merriweather-Bold',
    color: colors.primary,
  },
  itemType: {
    fontSize: sizes.fontLarge,
    fontFamily: 'Lato-Regular',
    color: colors.black,
    marginVertical: 7,
  },

  textStyle: {
    fontSize: 16,
    textAlign: 'left',
    color: colors.darkgray,
    fontFamily: 'Lato-Regular',
  },
  timeText: {
    fontSize: 16,
    textAlign: 'left',
    color: colors.black,
    fontFamily: 'Lato-Bold',
    marginTop: 7,
    marginBottom: 12,
  },
  durationText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.white,
    fontFamily: 'Lato-Bold',
  },
});

export default PayScreen;

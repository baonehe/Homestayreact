import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef, useMemo, useCallback} from 'react';
import FastImage from 'react-native-fast-image';
import {SliderBox} from 'react-native-image-slider-box';
import {
  GestureHandlerRootView,
  ScrollView,
  FlatList,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
// import RNDateTimePicker, {
//   DateTimePickerAndroid,
// } from '@react-native-community/datetimepicker';
import TimestampPicker from './TimestampPicker';
import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';
import images from '../assets/images';

const DetailHomestayScreen = ({navigation, route}) => {
  const homestay = route.params;
  console.log(homestay);
  const listImages = [
    images.image1,
    images.image2,
    images.image3,
    images.image4,
  ];

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

  const RoomItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.roomCard}>
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
          <Text style={styles.roomTypeText}>{item.roomtype}</Text>
          <View style={styles.detailRoom}>
            <View style={styles.priceContainer}>
              <Text style={styles.timeTypeText}>{item.timetype}</Text>
              <Text style={styles.priceText}>{item.price}$</Text>
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
            <TouchableOpacity style={styles.bookBtn}>
              <Text style={styles.textBtn}>BOOK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView contentContainerStyle={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <ImageBackground source={homestay.image} style={styles.headerImage}>
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
            <Icon name="place" color={colors.white} size={sizes.iconSmall} />
          </View>
          <View style={styles.itemInfor}>
            <Text style={styles.textName}> {homestay.name}</Text>
            <Text style={styles.textLocation}> {homestay.location}</Text>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name="star" size={20} color={colors.yellow} />
                  <Icon name="star" size={20} color={colors.yellow} />
                  <Icon name="star" size={20} color={colors.yellow} />
                  <Icon name="star" size={20} color={colors.yellow} />
                  <Icon name="star" size={20} color={colors.gray} />
                </View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginLeft: 5,
                    color: colors.black,
                  }}>
                  4.0
                </Text>
              </View>
              <Text style={{fontSize: 13, color: colors.gray}}>
                365 reviews
              </Text>
            </View>
            <View style={{marginTop: 20}}>
              <Text style={{lineHeight: 20, color: colors.gray}}>
                {homestay.details}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Price from</Text>
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
              <Text>Choose</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={homestay.rooms}
            vertical
            contentContainerStyle={styles.flatList}
            renderItem={({item}) => <RoomItem item={item} />}
          />
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
    top: -30,
    right: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginVertical: 10,
  },
  chooseBtn: {
    height: 40,
    width: 60,
    backgroundColor: colors.primary,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
});

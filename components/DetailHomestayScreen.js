import {
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useRef, useMemo} from 'react';
import FastImage from 'react-native-fast-image';
import {SliderBox} from 'react-native-image-slider-box';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet from '@gorhom/bottom-sheet';

import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';
import images from '../assets/images';

const DetailHomestayScreen = ({navigation, route}) => {
  const homestay = route.params;
  // console.log(homestay);
  const listImages = [
    images.image1,
    images.image2,
    images.image3,
    images.image4,
  ];

  // hooks
  const sheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['5%'], []);

  const RoomItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.roomCard}>
        <SliderBox
          ImageComponent={FastImage}
          images={listImages}
          circleLoop={true}
          parentWidth={300}
          sliderBoxHeight={175}
          activeOpacity={1}
          dotStyle={styles.dotSlider}
          dotColor={colors.light}
          inactiveDotColor={colors.dark}
          imageLoadingColor={colors.primary}
          ImageComponentStyle={styles.boxImageSlider}
        />

        <Text style={styles.roomTypeText}>{item.roomtype}</Text>
        <Text style={styles.timeTypeText}>{item.timetype}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
        <Text style={styles.conditionText}>{item.condition}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
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
            <Text style={{fontSize: 13, color: colors.gray}}>365 reviews</Text>
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
        <FlatList
          data={homestay.rooms}
          vertical
          contentContainerStyle={styles.flatList}
          renderItem={({item}) => <RoomItem item={item} />}
        />
        <BottomSheet
          ref={sheetRef}
          detached={true}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={false}
          enableOverDrag={false}
          enablePanDownToClose={true}
          snapPoints={snapPoints}>
          <TouchableOpacity style={styles.btnBook}>
            <Text style={styles.textBtn}>SELECT</Text>
          </TouchableOpacity>
        </BottomSheet>
      </View>
    </ScrollView>
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

  btnBook: {
    height: 42,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    backgroundColor: colors.dark,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  textBtn: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Merriweather-Bold',
  },

  flatList: {
    marginTop: 15,
    paddingBottom: 30,
    alignItems: 'center',
  },
  roomCard: {
    height: 300,
    width: 300,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'stretch',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 30,
    marginVertical: 20,
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

  roomTypeText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: colors.dark,
    margin: 10,
    marginLeft: 20,
  },
  timeTypeText: {
    fontFamily: 'Merriweather-Regular',
    fontSize: 16,
    color: colors.black,
    marginLeft: 20,
  },
  priceText: {
    fontFamily: 'Merriweather-Regular',
    fontSize: 16,
    color: colors.red,
    marginLeft: 20,
  },
  conditionText: {
    fontFamily: 'Merriweather-Regular',
    fontSize: 16,
    color: colors.black,
    marginLeft: 20,
  },
});

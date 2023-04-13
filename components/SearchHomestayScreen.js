import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import BottomSheet from 'react-native-gesture-bottom-sheet';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import Mapbox from '@rnmapbox/maps';
import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';
import hotels from '../assets/data/hotels';
import images from '../assets/images';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const tokenMapBox =
  'sk.eyJ1IjoiZmFuZzEwMTEiLCJhIjoiY2xnMDlubmpqMDFoaDNocDl3b3NxcjVldiJ9.89FqHKLDIfP6IUVYtNy0xg';
Mapbox.setAccessToken(tokenMapBox);

const SearchHomestay = ({navigation}) => {
  const screenHeight = Dimensions.get('screen').height;

  // hooks
  const sheetRef = useRef(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // variables
  const snapPoints = useMemo(() => ['17%', '50%', '95%'], []);

  // callbacks
  const handleSheetChange = useCallback(index => {
    if (index === 0) {
      setSheetOpen(false);
    } else {
      setSheetOpen(true);
    }
  }, []);
  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // render
  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailHomestay', item)}>
        <View style={styles.itemCard}>
          <View style={styles.itemImageContainer}>
            <Image style={styles.itemImage} source={item.image} />
          </View>
          <View style={styles.itemInfor}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSlogan}>{item.slogan}</Text>
            <View style={styles.itemDistanceContainer}>
              <Text style={styles.itemDistance}>2.5km</Text>
              <Ionicons
                name="location-sharp"
                size={sizes.iconTiny}
                color={colors.gray}
              />
            </View>
            <View style={styles.itemRatingContainer}>
              <Text style={styles.itemRating}>{item.rating}</Text>
              <Text style={styles.itemRatingVote}>{item.ratingvote}</Text>
              <Ionicons
                name="star"
                size={sizes.iconTiny}
                color={colors.secondary}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  // useEffect(() => {
  //   sheetRef.current?.snapToIndex(2);
  // });
  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons
              name="arrow-back-ios"
              size={sizes.iconExtraSmall}
              color={colors.dark}
              onPress={navigation.goBack}
            />
          </View>
          <View style={styles.searchBar}>
            <Feather
              name="search"
              size={sizes.iconExtraSmall}
              color={colors.lightblack}
              style={styles.iconSearch}
            />
            <View style={styles.searchBarInfor}>
              <Text style={styles.location}>Binh Thanh - Ho Chi Minh</Text>
              <Text style={styles.time}>Hourly * Anytime </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Ionicons
              name="options"
              size={sizes.iconSmall}
              color={colors.dark}
              style={{transform: [{rotate: '90deg'}]}}
            />
          </View>
        </View>
        <Mapbox.MapView style={[styles.map, {height: screenHeight}]} />
        <BottomSheet
          ref={sheetRef}
          index={2}
          snapPoints={snapPoints}
          onChange={handleSheetChange}>
          <BottomSheetFlatList
            data={hotels}
            renderItem={renderItem}
            contentContainerStyle={styles.flatList}
          />
        </BottomSheet>
        {sheetOpen && (
          <View style={styles.mapViewBtn}>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => handleSnapPress(0)}>
              <Text style={styles.mapText}>Map</Text>
              <Image style={styles.mapImage} source={images.map} />
            </TouchableOpacity>
          </View>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default SearchHomestay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    marginLeft: 15,
  },
  headerRight: {
    marginRight: 15,
  },
  searchBar: {
    flexDirection: 'row',
    width: '75%',
    borderRadius: 25,
    backgroundColor: colors.lightwhite,
  },
  iconSearch: {
    marginHorizontal: 10,
    marginVertical: 8,
  },
  searchBarInfor: {
    justifyContent: 'center',
  },
  location: {
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    color: colors.black,
  },
  time: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: colors.gray,
  },
  map: {},

  flatList: {
    marginTop: 10,
    paddingBottom: 120,
  },
  itemCard: {
    height: 120,
    width: 345,
    backgroundColor: colors.white,
    marginBottom: 30,
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  itemImage: {
    height: '100%',
    width: '100%',
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
  itemSlogan: {
    fontSize: sizes.fontLarge,
    fontFamily: 'Lato-Regular',
    color: colors.gray,
    marginTop: 10,
  },

  itemDistanceContainer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  itemDistance: {
    fontSize: 13,
    fontFamily: 'Lato-Regular',
    color: colors.gray,
    marginHorizontal: 3,
  },

  itemRatingContainer: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  itemRating: {
    fontSize: 13,
    fontFamily: 'Lato-Black',
    color: colors.black,
  },
  itemRatingVote: {
    fontSize: 13,
    fontFamily: 'Lato-Regular',
    color: colors.gray,
    marginHorizontal: 3,
  },

  mapViewBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 135,
    right: '37.5%',
  },
  mapBtn: {
    height: 35,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  mapText: {
    fontFamily: 'Merriweather-Black',
    fontSize: 16,
    color: colors.black,
    textAlignVertical: 'center',
  },
  mapImage: {
    height: 24,
    width: 32,
    alignSelf: 'center',
  },
});

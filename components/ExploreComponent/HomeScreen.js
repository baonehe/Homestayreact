import React, {useState, useEffect, useCallback} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SliderBox} from 'react-native-image-slider-box';
import {ScrollView, TextInput, FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import Geolocation from '@react-native-community/geolocation';
import Notification from './NotiScreen';
import database from '@react-native-firebase/database';
import utils from '../../assets/consts/utils';
import colors from '../../assets/consts/colors';
import sizes from '../../assets/consts/sizes';
import images from '../../assets/images';
import hotels from '../../assets/data/hotels';

const Home = ({navigation}) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const categoryIcons = [
    <Image name="Near you" source={images.nearyou} />,
    <Image name="Hourly" source={images.hourly} />,
    <Image name="Overnight" source={images.overnight} />,
    <Image name="Couple" source={images.couple} />,
    <Image name="Travel" source={images.travel} />,
    <Image name="Luxury" source={images.luxury} />,
  ];
  const ListCategories = () => {
    const [categoriesTime, setCategoriesTime] = useState([]);
    const [categoriesType, setCategoriesType] = useState([]);

    useEffect(() => {
      const mid = Math.ceil(categoryIcons.length / 2);
      setCategoriesTime(categoryIcons.slice(0, mid));
      setCategoriesType(categoryIcons.slice(mid));
    }, []);

    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryRow}>
          {categoriesTime.map((icon, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconContainer}
              onPress={() =>
                navigation.navigate('SearchHomestay', selectedLocation)
              }>
              {icon}
              <Text style={styles.iconName}>{icon.props.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.categoryRow}>
          {categoriesType.map((icon, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconContainer}
              onPress={() =>
                navigation.navigate('SearchHomestay', selectedLocation)
              }>
              {icon}
              <Text style={styles.iconName}>{icon.props.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const listImages = [
    images.image1,
    images.image2,
    images.image3,
    images.image4,
  ];

  const SalesOffCard = ({hotel}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailHomestay', hotel)}>
        <View style={styles.salesOffCard}>
          <View style={styles.itemRating}>
            <Text style={styles.itemRatingText}>5.0</Text>
            <Ionicons name="star" size={sizes.iconTiny} color={colors.yellow} />
          </View>
          <Image style={styles.salesOffCardImage} source={hotel.image} />
          <View style={styles.itemInfor}>
            <Text style={styles.itemInforName}>{hotel.name}</Text>
            <Text style={styles.itemInforPrice}>{hotel.price}</Text>
          </View>
          <View style={styles.itemLocation}>
            <Text style={styles.itemLocationText}>{hotel.location}</Text>
            <Ionicons
              name="location-sharp"
              size={sizes.iconTiny}
              color={colors.gray}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getMyLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;

        console.log(latitude, longitude);
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${utils.mapKey}`;

        fetch(geocodingUrl)
          .then(response => response.json())
          .then(data => {
            const results = data.results;
            if (results.length > 0) {
              for (const component of results[0].address_components) {
                if (component.types.includes('administrative_area_level_1')) {
                  const currentProvince = component.long_name;
                  console.log('Tỉnh/Thành phố hiện tại:', currentProvince);

                  database()
                    .ref('locations')
                    .orderByChild('name')
                    .equalTo(currentProvince)
                    .once('value', snapshot => {
                      if (snapshot.exists()) {
                        console.log(
                          'Tìm thấy trùng khớp trong Firebase Realtime Database',
                        );
                        setSelectedLocation(currentProvince);
                      } else {
                        console.log(
                          'Không tìm thấy trùng khớp trong Firebase Realtime Database',
                        );
                      }
                    });
                  return currentProvince;
                }
              }
            }
            console.log('Không xác định được tỉnh/ thành phố.');
            return null;
          })
          .catch(error => {
            console.log('Lỗi khi lấy địa chỉ từ tọa độ:', error);
            return null;
          });
      },
      error => {
        console.log('Error getting current location:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getMyLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    requestLocationPermission();

    const fetchLocations = async () => {
      try {
        const snapshot = await database().ref('locations').once('value');
        const data = snapshot.val();

        if (data) {
          const locationList = Object.values(data).map(
            location => location.name,
          );
          const sortedLocations = locationList.sort((a, b) =>
            a.localeCompare(b),
          );
          setLocations(sortedLocations);
          console.log(sortedLocations);
          // setSelectedLocation(sortedLocations[0] || '');
        }
      } catch (error) {
        console.log('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor={colors.transparent}
      />
      <View style={styles.menuWrapper}>
        <Image source={images.logo} style={styles.logoImage} />
        <Ionicons
          name="notifications-outline"
          size={sizes.iconMedium}
          color={colors.primary}
          style={styles.menuIcon}
          onPress={() => navigation.navigate(Notification)}
        />
      </View>

      {/* Body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SearchBar */}
        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => navigation.navigate('SearchHomestay')}>
            <Ionicons name="search-outline" style={styles.searchIcon} />
          </TouchableOpacity>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
            placeholder="Search for destinations, hotels, ..."
            placeholderTextColor="#333333"
            // value={searchTerm}
            // onChangeText={onSearchTermChange}
            // onEndEditing={onSearchTermSubmit}
          />
        </View>

        {/* Location */}
        <View style={styles.locationWrapper}>
          <Ionicons
            name="location-sharp"
            size={sizes.iconSmall}
            color={colors.dark}
            style={styles.locationIcon}
          />
          <Picker
            style={styles.locationPicker}
            selectedValue={selectedLocation}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLocation(itemValue)
            }>
            {locations.map((location, index) => (
              <Picker.Item
                key={index}
                style={styles.pickerItem}
                label={location}
                value={location}
              />
            ))}
          </Picker>
        </View>

        {/* Filters  */}
        <ListCategories />

        {/* Slider */}
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

        {/* SalesOff */}
        <View style={styles.salesOffWrapper}>
          <Text style={styles.textTitle}>SALES OFF</Text>
          <Text>Show all</Text>
        </View>
        <FlatList
          data={hotels}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          renderItem={({item}) => <SalesOffCard hotel={item} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
  },

  //Header
  menuWrapper: {
    paddingHorizontal: 15,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  logoImage: {
    width: sizes.widthLogo,
    height: sizes.heightLogo,
  },
  menuIcon: {
    height: 32,
    width: 32,
    marginHorizontal: 5,
  },

  //SearchBar
  searchBar: {
    borderRadius: 8,
    borderColor: colors.dark,
    borderWidth: 1,
    marginTop: 20,
    backgroundColor: colors.white,
    height: 50,
    marginHorizontal: 15,
    flexDirection: 'row',
    marginBottom: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  searchBtn: {
    justifyContent: 'center',
  },
  searchIcon: {
    color: colors.lightblack,
    fontSize: sizes.iconLarge,
    alignSelf: 'center',
    marginLeft: 10,
  },

  //Location
  locationWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  locationIcon: {
    width: 32,
    height: 32,
    marginTop: 15,
  },
  locationPicker: {
    verticalAlign: 'center',
    marginLeft: -15,
    width: 200,
  },
  pickerItem: {
    fontWeight: 'bold',
    color: colors.dark,
    fontFamily: 'Lato-Black',
    fontSize: sizes.fontExtraLarge,
  },

  //Filters
  categoryContainer: {
    marginTop: 10,
    marginHorizontal: 40,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconContainer: {
    height: 60,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconName: {
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    fontSize: sizes.fontMedium,
    // fontWeight: '700',
    color: colors.black,
    marginTop: 15,
    textAlignVertical: 'bottom',
  },

  //Slider
  boxSlider: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  boxImageSlider: {
    borderRadius: 15,
    width: '88%',
  },
  dotSlider: {
    width: 14,
    height: 14,
    borderRadius: 15,
    marginHorizontal: -5,
  },

  //SalesOff
  textTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: sizes.fontExtraLarge,
    color: colors.dark,
  },
  salesOffWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
  },
  flatList: {
    marginTop: 8,
    paddingLeft: 15,
    paddingBottom: 30,
  },
  salesOffCard: {
    height: 250,
    width: 300,
    backgroundColor: colors.white,
    elevation: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 50,
  },
  salesOffCardImage: {
    height: 150,
    width: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  itemRating: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 1,
    flexDirection: 'row',
  },
  itemRatingText: {
    color: colors.red,
    fontWeight: 'bold',
    fontSize: sizes.fontMedium,
    marginHorizontal: 3,
  },
  itemLocation: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    zIndex: 1,
    flexDirection: 'row',
  },
  itemLocationText: {},
  itemInfor: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  itemInforName: {
    fontSize: sizes.fontLarge,
    fontWeight: 'bold',
    color: colors.primary,
  },
  itemInforPrice: {
    fontSize: sizes.fontExtraLarge,
    fontWeight: 'bold',
    color: colors.dark,
  },
});
export default Home;

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {
  GestureHandlerRootView,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useSelector, useDispatch} from 'react-redux';
import {setCurrentLocation} from '../redux/locationReducer';
import RangeSlider from '../SupComponent/RangeSlider';
import database from '@react-native-firebase/database';
import colors from '../../assets/consts/colors';
import images from '../../assets/images';
import sizes from '../../assets/consts/sizes';
import utils from '../../assets/consts/utils';

const SearchHomestay = ({navigation, route}) => {
  const screenHeight = Dimensions.get('screen').height;
  const {type, province} = route.params;
  const currentLocation = useSelector(state => state.location.currentLocation);
  const dispatch = useDispatch();

  /* Map View */
  const mapRef = useRef(null);
  const markerRefs = useMemo(() => ({}), []);
  const [location, setLocation] = useState(null); // Current location for map camera
  const [homestayData, setHomestayData] = useState(null);
  const [homestaySuggestions, setHomestaySuggestions] = useState([]);
  const [selectedMarkerRef, setSelectedMarkerRef] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = () => {};

  const handleSearchInput = text => {
    setSearchText(text);
    if (text !== '') {
      const filteredHomestays = homestayData.filter(homestay =>
        homestay.name.toLowerCase().includes(text.toLowerCase()),
      );
      setHomestaySuggestions(filteredHomestays);
    } else {
      setHomestaySuggestions([]);
    }
  };

  const handleSelectResult = result => {
    if (mapRef.current && result && result.coordinates) {
      mapRef.current.animateToRegion({
        latitude: result.coordinates.latitude,
        longitude: result.coordinates.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });
    }
    setSelectedMarkerRef(markerRefs[result.homestay_id]);
    markerRefs[result.homestay_id].showCallout();
  };

  const handleSelectCallout = result => {
    navigation.navigate('DetailHomestay', result);
  };

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

  const getMyLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        dispatch(setCurrentLocation(position.coords));
        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [dispatch]);

  const toRad = value => {
    return value * (Math.PI / 180);
  };

  const calculateDistance = (latitude, longitude) => {
    if (currentLocation) {
      const lat1 = currentLocation.latitude;
      const lon1 = currentLocation.longitude;

      const lat2 = latitude;
      const lon2 = longitude;

      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance.toFixed(2) + ' km';
    }

    return '';
  };

  /* Bottom sheet */
  // hooks
  const sheetRef = useRef(null);
  const [sheetRefOpen, setSheetRefOpen] = useState(false);

  // variables
  const snapRefPoints = useMemo(() => ['3%', '50%', '93%'], []);

  // callbacks
  const handleRefChange = useCallback(index => {
    if (index === 0) {
      setSheetRefOpen(false);
    } else {
      setSheetRefOpen(true);
    }
  }, []);
  const handleRefPress = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  // render
  const renderHSItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailHomestay', item)}>
        <View style={styles.itemCard}>
          <View style={styles.itemImageContainer}>
            <Image style={styles.itemImage} source={{uri: item.image}} />
          </View>
          <View style={styles.itemInfor}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.itemName}>
              {item.name}
            </Text>
            <Text style={styles.itemSlogan}>{item.slogan}</Text>
            <View style={styles.itemDistanceContainer}>
              <Text style={styles.itemDistance}>{item.distance}</Text>
              <Ionicons
                name="location-sharp"
                size={sizes.iconTiny}
                color={colors.gray}
              />
            </View>
            <View style={styles.itemRatingContainer}>
              <Text style={styles.itemRating}>{item.rating}</Text>
              <Text style={styles.itemRatingVote}>({item.ratingvote})</Text>
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
    [navigation],
  );

  /* Filtersheet */
  // hooks
  const sheetFil = useRef(null);
  const [filters, setFilters] = useState([]);
  const [provinces, setProvinces] = useState([]); // Provinces list variable
  const [selectedProvince, setSelectedProvince] = useState(province); // Choose province
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState([]);

  const [minValue, setMinValue] = useState(utils.MIN_VALUE);
  const [maxValue, setMaxValue] = useState(utils.MAX_VALUE);

  // variables
  const snapFilPoints = useMemo(() => ['93%'], []);

  const handleFilOpen = useCallback(() => {
    sheetFil.current?.snapToIndex(0);
  }, []);

  const handleReset = useCallback(() => {
    setMinValue(utils.MIN_VALUE);
    setMaxValue(utils.MAX_VALUE);

    setFilters(prevFilters => {
      return prevFilters.map(filter => {
        return {
          ...filter,
          checked: false,
        };
      });
    });

    setTypes(prevTypes => {
      return prevTypes.map(item => {
        return {
          ...item,
          checked: false,
        };
      });
    });
    setSelectedProvince(province);
  }, [province]);

  const handleFilterChange = useCallback((filterName, isChecked) => {
    setFilters(prevFilters => {
      return prevFilters.map(filter => {
        if (filter.value === filterName) {
          return {
            ...filter,
            checked: !isChecked,
          };
        }
        return filter;
      });
    });
  }, []);

  const handleTypeChange = useCallback((typeName, isChecked) => {
    setTypes(prevTypes => {
      return prevTypes.map(item => {
        if (item.value === typeName) {
          return {
            ...item,
            checked: !isChecked,
          };
        }
        return item;
      });
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    console.log(minValue, maxValue);
    console.log(filters);
    console.log(types);

    const reference = database().ref('homestays');
    const unsubscribe = reference.on('value', snapshot => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        // Filter homestay depend on province
        let filteredHomestays = Object.values(data).filter(
          homestay => homestay.province === selectedProvince,
        );

        // Calculate the distance of item
        filteredHomestays.forEach(homestay => {
          homestay.distance = calculateDistance(
            homestay.coordinates.latitude,
            homestay.coordinates.longitude,
          );
        });

        // Apply price filters
        filteredHomestays = filteredHomestays.filter(homestay => {
          const price = parseInt(homestay.price, 10);
          return price >= minValue && price <= maxValue;
        });
        console.log('price:', filteredHomestays);

        // Apply extension filters
        filteredHomestays = filteredHomestays.filter(homestay => {
          const extension = homestay.extension;
          const filterValues = filters
            .filter(filter => filter.checked && extension[filter.value] === 1)
            .map(filter => filter.value);
          return (
            filterValues.length ===
            filters.filter(filter => filter.checked).length
          );
        });
        console.log('Ex:', filteredHomestays);

        //Apply type filters
        filteredHomestays = filteredHomestays.filter(homestay => {
          const item = homestay.type;
          const typeValues = types
            .filter(type => type.checked && item.includes(type.value))
            .map(type => type.value);
          return (
            typeValues.length === types.filter(type => type.checked).length
          );
        });
        console.log('type:', filteredHomestays);

        setHomestayData(filteredHomestays);
      }
    });

    return () => unsubscribe();
  }, [minValue, maxValue, filters, types, selectedProvince]);

  const renderFTItem = useCallback(
    ({item}) => (
      <View
        style={{
          width: '100%',
          paddingHorizontal: 8,
          marginVertical: 3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter-Regular',
            color: colors.black,
          }}>
          {item.value}
        </Text>
        <BouncyCheckbox
          size={20}
          fillColor={colors.primary}
          unfillColor={colors.white}
          disableBuiltInState
          onPress={() => handleFilterChange(item.value, item.checked)}
          isChecked={item.checked}
        />
      </View>
    ),
    [handleFilterChange],
  );

  const renderTypeItem = useCallback(
    ({item}) => (
      <View
        style={{
          width: '100%',
          paddingHorizontal: 8,
          marginVertical: 3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter-Regular',
            color: colors.black,
          }}>
          {item.value}
        </Text>
        <BouncyCheckbox
          size={20}
          fillColor={colors.primary}
          unfillColor={colors.white}
          disableBuiltInState
          onPress={() => handleTypeChange(item.value, item.checked)}
          isChecked={item.checked}
        />
      </View>
    ),
    [handleTypeChange],
  );

  const handleSelectAll = useCallback(() => {}, []);
  // Request permission and fetch data depend on type, location
  useEffect(() => {
    requestLocationPermission();

    const fetchData = async () => {
      const snapshot = await database().ref('homestays').once('value');
      if (snapshot && snapshot.val) {
        const data = snapshot.val();
        const homestays = Object.values(data);

        let filteredHomestays = homestays;

        // Calculate the distance of item
        filteredHomestays.forEach(homestay => {
          homestay.distance = calculateDistance(
            homestay.coordinates.latitude,
            homestay.coordinates.longitude,
          );
        });

        if (type === 'Near you') {
          // Filter items within a maximum distance of 10km
          filteredHomestays = filteredHomestays.filter(
            item => parseFloat(item.distance) <= 10,
          );

          // Sort by distance from smallest to largest
          filteredHomestays.sort((a, b) => {
            const distanceA = parseFloat(a.distance);
            const distanceB = parseFloat(b.distance);
            if (distanceA < distanceB) {
              return -1;
            } else if (distanceA > distanceB) {
              return 1;
            } else {
              return 0;
            }
          });
        } else {
          filteredHomestays = filteredHomestays.filter(
            homestay =>
              homestay.province === selectedProvince &&
              homestay.type.includes(type),
          );
        }

        if (isMounted) {
          setHomestayData(filteredHomestays);
        }
      }
    };
    const fetchProvinces = async () => {
      try {
        const snapshot = await database().ref('provinces').once('value');
        const data = snapshot.val();

        if (data) {
          const provincesList = Object.values(data).map(item => item.name);
          const sortedProvince = provincesList.sort((a, b) =>
            a.localeCompare(b),
          );
          setProvinces(sortedProvince);
          console.log(sortedProvince);
          // setSelectedLocation(sortedProvince[0] || '');
        }
      } catch (error) {
        console.log('Error fetching provinces:', error);
      }
    };

    let isMounted = true;

    fetchData();
    fetchProvinces();

    return () => {
      isMounted = false;
    };
  }, [selectedProvince, type]);

  // Fetch type list
  useEffect(() => {
    const fetchTypes = async () => {
      const reference = database().ref('types');
      const snapshot = await reference.once('value');
      if (snapshot && snapshot.val) {
        const data = snapshot.val();
        const typesList = Object.values(data).map(item => ({
          value: item,
          checked: false,
        }));
        setTypes(typesList);
      }
    };
    fetchTypes();
    return () => {};
  }, []);

  // Fetch extension list
  useEffect(() => {
    const fetchExtension = async () => {
      const reference = database().ref('extension');
      const snapshot = await reference.once('value');
      if (snapshot && snapshot.val) {
        const data = snapshot.val();
        const filtersData = Object.values(data).map(item => ({
          value: item,
          checked: false,
        }));
        setFilters(filtersData);
      }
    };
    fetchExtension();
    return () => {};
  }, []);

  // Update data when current location change
  useEffect(() => {
    if (homestayData && currentLocation) {
      const updatedData = homestayData.map(homestay => {
        const updatedHomestay = {...homestay};
        updatedHomestay.distance = calculateDistance(
          homestay.coordinates.latitude,
          homestay.coordinates.longitude,
        );
        return updatedHomestay;
      });
      setHomestayData(updatedData);
    }
  }, [currentLocation]);

  // Move camera to current location
  useEffect(() => {
    if (location) {
      mapRef.current?.animateToRegion(location);
    }
    console.log(location);
  }, [location]);

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
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
            <View style={styles.searchBarInfor}>
              <TextInput
                style={styles.location}
                placeholder="Search for a location"
                value={searchText}
                onChangeText={handleSearchInput}
              />
              <TouchableOpacity onPress={handleSearch}>
                <Feather
                  name="search"
                  size={sizes.iconExtraSmall}
                  color={colors.lightblack}
                  style={styles.iconSearch}
                />
              </TouchableOpacity>

              {/* <Text style={styles.time}>Hourly * Anytime </Text> */}
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => handleFilOpen()}>
              <Ionicons
                name="options"
                size={sizes.iconSmall}
                color={colors.dark}
                style={{transform: [{rotate: '90deg'}]}}
              />
            </TouchableOpacity>
          </View>
        </View>

        {homestaySuggestions.length > 0 && searchText !== '' && (
          <View
            style={{
              alignItems: 'center',
              width: '100%',
              height: 100,
              zIndex: 10,
              top: -10,
            }}>
            {homestaySuggestions.slice(0, 5).map(suggestedHomestay => {
              return (
                <TouchableOpacity
                  key={suggestedHomestay.homestay_id}
                  style={{
                    backgroundColor: 'white',
                    borderColor: colors.black,
                    borderRadius: 8,
                    borderWidth: 1,
                    width: '75%',
                  }}
                  onPress={() => handleSelectResult(suggestedHomestay)}>
                  <Text
                    style={{padding: 10, fontSize: 15, color: colors.black}}>
                    {suggestedHomestay.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <MapView
          provider={PROVIDER_GOOGLE}
          onMapReady={getMyLocation}
          ref={mapRef}
          style={[styles.map, {height: screenHeight}]}
          showsMyLocationButton={true}
          showsUserLocation={true}>
          {homestayData &&
            homestayData.map(home => (
              <Marker
                key={home.homestay_id}
                ref={marker => (markerRefs[home.homestay_id] = marker)}
                icon={images.marker}
                coordinate={{
                  latitude: home.coordinates.latitude,
                  longitude: home.coordinates.longitude,
                }}>
                <Callout
                  style={styles.itemMarker}
                  onPress={() => handleSelectCallout(home)}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.itemMarkerName}>
                      {home.name}
                    </Text>
                    <Text
                      style={{
                        width: 200,
                        height: 150,
                        position: 'relative',
                        bottom: 30,
                      }}>
                      <Image
                        style={styles.itemMarkerImage}
                        source={{uri: home.image}}
                        resizeMode="cover"
                      />
                    </Text>

                    <Text style={styles.itemMarkerPrice}>{home.price}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
        </MapView>

        <BottomSheet
          ref={sheetRef}
          index={2}
          snapPoints={snapRefPoints}
          onChange={handleRefChange}>
          <BottomSheetFlatList
            data={homestayData}
            renderItem={renderHSItem}
            contentContainerStyle={styles.flatList}
          />
        </BottomSheet>
        {sheetRefOpen && (
          <View style={styles.mapViewBtn}>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => handleRefPress(0)}>
              <Text style={styles.mapText}>Map</Text>
              <Image style={styles.mapImage} source={images.map} />
            </TouchableOpacity>
          </View>
        )}

        <BottomSheet
          ref={sheetFil}
          index={-1}
          snapPoints={snapFilPoints}
          enablePanDownToClose={true}>
          <View style={styles.filterHeader}>
            <View style={{flex: 1}} />
            <Text style={styles.filterLabel}>Filter</Text>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity onPress={() => handleReset()}>
                <Text style={styles.filterReset}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
          <BottomSheetScrollView>
            <View style={styles.priceContainer}>
              <Text style={styles.categoryLabel}>Price range</Text>
              <View style={{marginVertical: 20}}>
                <RangeSlider
                  sliderWidth={320}
                  min={utils.MIN_VALUE}
                  max={utils.MAX_VALUE}
                  step={10}
                  onValueChange={range => {
                    setMinValue(range.min);
                    setMaxValue(range.max);
                  }}
                />
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 25,
                  }}>
                  <View style={styles.priceFrame}>
                    <Text style={styles.priceItemLabel}>Min price</Text>
                    <Text style={styles.priceValue}>{minValue}</Text>
                  </View>
                  <View style={styles.priceFrame}>
                    <Text style={styles.priceItemLabel}>Max price</Text>
                    <Text style={styles.priceValue}>{maxValue}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.provinceContainer}>
              <Text style={styles.categoryLabel}>Province</Text>
              <Picker
                style={styles.locationPicker}
                selectedValue={selectedProvince}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedProvince(itemValue)
                }>
                {provinces.map((item, index) => (
                  <Picker.Item
                    key={index}
                    style={styles.pickerItem}
                    label={item}
                    value={item}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.flatListContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.categoryLabel}>Type</Text>
                <View style={{flexDirection: 'row', marginRight: 23}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Inter-Regular',
                      color: colors.black,
                      marginHorizontal: 8,
                    }}>
                    All
                  </Text>
                  <BouncyCheckbox
                    disableText
                    size={22}
                    fillColor={colors.primary}
                    unfillColor="#FFFFFF"
                    iconStyle={{borderColor: colors.primary, borderRadius: 0}}
                    innerIconStyle={{borderWidth: 1.8, borderRadius: 0}}
                    onPress={() => handleSelectAll()}
                  />
                </View>
              </View>

              <FlatList
                data={types}
                renderItem={renderTypeItem}
                keyExtractor={(item, index) => item.value.toString()}
                contentContainerStyle={styles.flatList}
              />
            </View>

            <View style={styles.flatListContainer}>
              <Text style={styles.categoryLabel}>Facilites</Text>
              <FlatList
                data={filters}
                renderItem={renderFTItem}
                keyExtractor={(item, index) => item.value.toString()}
                contentContainerStyle={styles.flatList}
              />
            </View>
          </BottomSheetScrollView>
          <View style={styles.applyContainer}>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => handleApplyFilters()}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
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
    marginVertical: 10,
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
  searchBarInfor: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconSearch: {
    marginRight: 12,
  },
  location: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    width: 240,
    flexWrap: 'wrap',
    color: colors.black,
    marginLeft: 12,
  },
  time: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: colors.gray,
  },
  map: {},

  flatList: {
    marginTop: 10,
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
    bottom: 10,
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

  itemMarker: {
    height: 200,
    width: 200,
  },
  itemMarkerName: {
    fontSize: 15,
    alignSelf: 'stretch',
    fontFamily: 'Merriweather-Bold',
    color: colors.primary,
    marginTop: 8,
    marginHorizontal: 2,
  },
  itemMarkerImage: {
    width: 200,
    height: 100,
    borderRadius: 12,
  },
  itemMarkerPrice: {
    fontSize: 20,
    fontFamily: 'Merriweather-Bold',
    color: colors.red,
    position: 'relative',
    bottom: 20,
    marginHorizontal: 5,
  },

  filterHeader: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 6,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderColor: colors.gray,
  },
  filterLabel: {
    fontSize: 20,
    fontFamily: 'Lato-Bold',
    color: colors.black,
    textAlign: 'center',
    flex: 1,
  },
  filterReset: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    fontWeight: '600',
    color: colors.primary,
    paddingRight: 15,
  },
  priceContainer: {
    flexDirection: 'column',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: colors.gray,
  },
  categoryLabel: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    color: colors.black,
  },
  priceFrame: {
    flexDirection: 'column',
    width: 150,
    backgroundColor: colors.lightgray,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  priceItemLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: colors.darkgray,
  },
  priceValue: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    fontWeight: '600',
    color: colors.black,
  },

  provinceContainer: {
    flexDirection: 'column',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: colors.gray,
  },
  locationPicker: {
    verticalAlign: 'center',
    marginLeft: -15,
    width: 300,
  },
  pickerItem: {
    fontWeight: 'bold',
    color: colors.dark,
    fontFamily: 'Lato-Black',
    fontSize: sizes.fontLarge,
  },

  flatListContainer: {
    flexDirection: 'column',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: colors.gray,
  },

  applyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  applyText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: 'Merriweather-Bold',
  },
  applyBtn: {
    height: 40,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 20,
  },
});

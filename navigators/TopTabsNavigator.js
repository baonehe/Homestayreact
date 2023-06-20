import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Geolocation from '@react-native-community/geolocation';
import {useSelector, useDispatch} from 'react-redux';
import {setCurrentLocation} from '../components/redux/locationReducer';
import database from '@react-native-firebase/database';
import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';

const Top = createMaterialTopTabNavigator();

const TopTabsNavigator = ({navigation}) => {
  const currentLocation = useSelector(state => state.location.currentLocation);
  const [homestayData, setHomestayData] = useState(null);
  const dispatch = useDispatch();

  // Follow and update current location
  const getMyLocation = useCallback(() => {
    const handleLocation = position => {
      dispatch(setCurrentLocation(position.coords));
    };

    const handleError = error => {
      console.log(error);
    };

    const options = {
      enableHighAccuracy: true,
      distanceFilter: 10,
    };

    const watchId = Geolocation.watchPosition(
      handleLocation,
      handleError,
      options,
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [dispatch]);

  // Load data from firebase
  useEffect(() => {
    const reference = database().ref('/data');
    const unsubscribe = reference.on('value', snapshot => {
      if (snapshot && snapshot.val) {
        const data = snapshot.val();
        const homestays = Object.values(data);
        setHomestayData(homestays);
      }
    });

    return () => unsubscribe();
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

  const DetailItem = ({item}) => {
    return (
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
    );
  };

  const ListItem = ({name}) => {
    if (!homestayData) {
      return <Text style={styles.loadText}>Loading...</Text>;
    }

    let filteredData = homestayData;
    if (name === 'Near you') {
      // Calculate the distance of item
      filteredData.forEach(homestay => {
        homestay.distance = calculateDistance(
          homestay.coordinates.latitude,
          homestay.coordinates.longitude,
        );
      });

      // Filter items within a maximum distance of 10km
      filteredData = filteredData.filter(
        homestay => parseFloat(homestay.distance) <= 10,
      );

      // Sort by distance from smallest to largest
      filteredData.sort((a, b) => {
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
    } else if (name === 'Trending') {
      filteredData = homestayData.filter(homestay =>
        homestay.type.includes('Trending'),
      );
      filteredData.sort((a, b) => b.rating - a.rating);
    } else if (name === 'For sales') {
      filteredData = homestayData.filter(homestay =>
        homestay.type.includes('For sales'),
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={filteredData}
          vertical
          contentContainerStyle={styles.flatList}
          renderItem={({item}) => <DetailItem item={item} />}
        />
      </ScrollView>
    );
  };

  // Call getLocation function
  useEffect(() => {
    getMyLocation();
  }, [getMyLocation]);

  return (
    <Top.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.black,
        tabBarAllowFontScaling: true,
        tabBarPressColor: colors.transparent,
        tabBarIndicatorStyle: styles.tabBarIndicator,
      }}>
      <Top.Screen name="Near you">
        {() => <ListItem name="Near you" />}
      </Top.Screen>
      <Top.Screen name="Trending">
        {() => <ListItem name="Trending" />}
      </Top.Screen>
      <Top.Screen name="For sales">
        {() => <ListItem name="For sales" />}
      </Top.Screen>
    </Top.Navigator>
  );
};

export default TopTabsNavigator;

const styles = StyleSheet.create({
  tabBar: {
    shadowColor: colors.transparent,
    borderRadius: 35,
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 8,
    marginHorizontal: 30,
  },
  tabBarLabel: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
    fontWeight: 700,
    alignSelf: 'flex-start',
  },
  tabBarIndicator: {
    backgroundColor: colors.light,
    height: 30,
    width: 90,
    justifyContent: 'center',
    verticalAlign: 'middle',
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 35,
  },

  flatList: {
    marginTop: 15,
    paddingBottom: 40,
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

  loadText: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Lato-Regular',
    color: colors.red,
    marginVertical: 20,
  },
});

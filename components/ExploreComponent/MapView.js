import React, {useRef, useMemo, useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';
import images from '../../assets/images';
import colors from '../../assets/consts/colors';

const MapViewComponent = ({homestays, handleSelectCallout}) => {
  const screenHeight = Dimensions.get('screen').height;

  const mapRef = useRef(null);
  const markerRefs = useMemo(() => ({}), []);
  const [location, setLocation] = useState(null);

  const getMyLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
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
  }, []);

  useEffect(() => {
    if (location) {
      mapRef.current?.animateToRegion(location);
    }
  }, [location]);

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      onMapReady={getMyLocation}
      ref={mapRef}
      style={[styles.map, {height: screenHeight}]}
      showsMyLocationButton={true}
      showsUserLocation={true}>
      {homestays &&
        homestays.map(home => (
          <Marker
            key={home.id}
            ref={marker => (markerRefs[home.id] = marker)}
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
  );
};

export default MapViewComponent;

const styles = StyleSheet.create({
  map: {},
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
});

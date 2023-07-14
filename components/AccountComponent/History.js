import {StyleSheet, Text, View, Image, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CompletedBox from '../CompleteButton';
import colors from '../../assets/consts/colors';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
const History = () => {
  const [bookingData, setBookingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookingDataByUserId = async userId => {
    try {
      const querySnapshot = await firestore()
        .collection('Booking')
        .where('user_id', '==', userId)
        .get();

      if (!querySnapshot.empty) {
        const bookings = querySnapshot.docs.map(async doc => {
          const booking = doc.data();
          console.log(booking);
          const homestayInfo = await fetchHomestayInfo(booking.homestay_id);
          return {
            ...booking,
            name: homestayInfo.name,
            image: homestayInfo.image, // Add fallback image URL here
          };
        });

        return Promise.all(bookings);
      } else {
        return [];
      }
    } catch (error) {
      console.log('Error getting booking documents:', error);
      return [];
    }
  };

  const fetchHomestayInfo = async homestayId => {
    try {
      const snapshot = await database()
        .ref('/homestays')
        .orderByChild('homestay_id')
        .equalTo(homestayId)
        .once('value');

      if (snapshot.exists()) {
        const homestay = Object.values(snapshot.val())[0];
        console.log('ZALO', homestay);
        if (homestay && homestay.name && homestay.image) {
          return {
            name: homestay.name,
            image: homestay.image,
          };
        } else {
          console.log('Invalid homestay data:', homestay);
          return {
            name: '',
            image: '',
          };
        }
      } else {
        console.log('No homestay found for homestay_id:', homestayId);
        return {
          name: '',
          image: '',
        };
      }
    } catch (error) {
      console.log('Error fetching homestay info:', error);
      return {
        name: '',
        image: '',
      };
    }
  };

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const bookings = await fetchBookingDataByUserId(userId);

      const bookingsWithInfo = await Promise.all(
        bookings.map(async booking => {
          const homestayInfo = await fetchHomestayInfo(booking.homestay_id);

          return {
            ...booking,
            name: homestayInfo.name,
            image: homestayInfo.image, // Add fallback image URL here
          };
        }),
      );
      setBookingData(bookingsWithInfo);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching user data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (bookingData.length === 0) {
    return <Text style={styles.noItemsText}>No booking data available</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookingData}
        keyExtractor={item => item.booking_id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image
              style={styles.salesOffCardImage}
              source={{uri: item.image}}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={3}>
                {item.name + ' - ' + 'No.' + item.room_number}
              </Text>
              <Text style={styles.cardPrice}>{item.total_price} $</Text>
              <View style={{marginLeft: 150}}>
                <CompletedBox />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  salesOffCardImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  cardTitle: {
    color: colors.dark,
    fontSize: 18,
    maxWidth: 250,
    marginBottom: 10,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  noItemsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

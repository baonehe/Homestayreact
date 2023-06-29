import {StyleSheet, Text, View, Image, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import CompletedBox from '../CompleteButton';
import colors from '../../assets/consts/colors';

const History = () => {
  const [bookingData, setBookingData] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDataById = async id => {
    try {
      const snapshot = await database()
        .ref('/homestays')
        .orderByChild('homestay_id')
        .equalTo(id)
        .once('value');

      if (snapshot.exists()) {
        const rooms = [];
        snapshot.forEach(childSnapshot => {
          const room = childSnapshot.val();
          rooms.push(room);
        });
        setRoomData(rooms);
      } else {
        console.log('No room found for room_id:', id);
      }
    } catch (error) {
      console.log('Error fetching room:', error);
    }
  };

  const fetchBookingDataByUserId = async id => {
    try {
      const querySnapshot = await firestore()
        .collection('Booking')
        .where('user_id', '==', id)
        .get();

      if (!querySnapshot.empty) {
        const document = querySnapshot.docs[0].data();
        setBookingData(document);
        await fetchDataById(document.room_id);
      } else {
        setBookingData(null);
      }
    } catch (error) {
      console.log('Error getting booking document:', error);
      setBookingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
        console.log(userId);

        await fetchBookingDataByUserId(userId);
      } catch (error) {
        console.log('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, [userId]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {bookingData && roomData ? (
        <FlatList
          data={roomData}
          keyExtractor={item => item.homestay_id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Image
                style={styles.salesOffCardImage}
                source={{uri: item.image}}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={3}>
                  {item.name}
                </Text>
                <Text style={styles.cardPrice}>{bookingData.price} $</Text>
                <View style={{marginLeft: 150}}>
                  <CompletedBox />
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noItemsText}>No booking data available</Text>
      )}
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
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

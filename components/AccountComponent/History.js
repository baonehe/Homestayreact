import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import CompletedBox from '../CompleteButton';

const History = () => {
  const [bookingData, setBookingData] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const userId = 'UbtD9KFlGDd2kJwqwwt9v23lyFs2';
  const fetchDataById = id => {
    // Thực hiện truy vấn dữ liệu dựa trên id
    database()
      .ref('/homestays')
      .orderByChild('homestay_id')
      .equalTo(1)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(childSnapshot => {
            const room = childSnapshot.val();
            console.log(room);
            setRoomData(room);
          });
        } else {
          console.log('No room found for room_id:', id);
        }
      })
      .catch(error => {
        console.log('Error fetching room:', error);
      });
  };

  const fetchBookingDataByUserId = async userId => {
    const fire = firestore()
      .collection('Booking')
      .where('user_id', '==', userId)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const document = querySnapshot.docs[0].data();
          setBookingData(document);
          fetchDataById(document.room_id);
        } else {
          setBookingData(null);
        }
      })
      .catch(error => {
        console.log('Error getting booking document: ', error);
        setBookingData(null);
      });
  };
  useEffect(() => {
    fetchBookingDataByUserId(userId);
  }, []);

  return (
    <View style={styles.card}>
      {bookingData ? (
        <>
          <Image
            style={styles.salesOffCardImage}
            source={{uri: roomData.image}}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={3}>
              {roomData.name}
            </Text>
            <Text style={styles.cardPrice}>{bookingData.price} $</Text>
            <CompletedBox />
          </View>
        </>
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
    color: 'black',
    fontSize: 16,
    maxWidth: 190,
    marginBottom: 10,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  noItemsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import BottomSheet from '@gorhom/bottom-sheet';
import database from '@react-native-firebase/database';
import colors from '../../assets/consts/colors';
import images from '../../assets/images';
import {ScrollView} from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';

const FastBooking = ({navigation}) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const [homestays, setHomestays] = useState([]);
  const [filteredHomestays, setFilteredHomestays] = useState([]);
  const [searchText, setSearchText] = useState('');
  const bottomSheetRef = useRef(null);

  const [selectedHomestayId, setSelectedHomestayId] = useState(null);
  const [roomTypesSearch, setRoomTypesSearch] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);


  // hàm xử lý sự kiện khi nhấn vào nút "Add Homestay" để mở bottom sheet:
  const handleAddHomestay = () => {
    setSearchText('');
    setFilteredHomestays([]);
    bottomSheetRef.current?.expand();
  };

  // hàm handleSearch để xử lý tìm kiếm homestays dựa trên tên:
  const handleSearch = () => {
    const filteredHomestays = homestays.filter(homestay =>
      homestay.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredHomestays(filteredHomestays);
  };

  // hàm handleHomestayPress để xử lý khi bấm vào một homestay trong danh sách:
  const handleHomestayPress = homestayId => {
    setSelectedHomestayId(homestayId);
  };


  const updateRoomTypes = newRoomTypes => {
    const updatedRoomTypes = newRoomTypes.map(roomType => {
      const homestay = homestays.find(
        homestay => homestay.homestay_id === roomType.homestay_id,
      );
  
      return {
        ...roomType,
        homestayName: homestay ? homestay.name : 'Unknown',
        homestayLocation: homestay ? homestay.location : 'Unknown',
        homestayImage: homestay ? homestay.image : '',
        rating: homestay ? homestay.rating : '',
        ratingvote: homestay ? homestay.ratingvote : '',
      };
    });
  
    setRoomTypes(updatedRoomTypes);
    setSelectedRoomTypes([]);
  
    // Lưu trữ dữ liệu roomtypes vào AsyncStorage
    AsyncStorage.setItem('roomtypes', JSON.stringify(updatedRoomTypes))
      .then(() => {
        console.log('Room types updated in AsyncStorage');
      })
      .catch(error => {
        console.log('Error updating room types in AsyncStorage:', error);
      });
  };
  

  const handleRoomTypePress = roomTypeId => {
    const selectedRoomType = roomTypesSearch.find(
      roomTypeSearch => roomTypeSearch.roomtype_id === roomTypeId,
    );
    const homestay = homestays.find(
      homestay => homestay.homestay_id === selectedHomestayId,
    );
  
    const updatedRoomType = {
      ...selectedRoomType,
      homestayName: homestay ? homestay.name : 'Unknown',
      homestayLocation: homestay ? homestay.location : 'Unknown',
      homestayImage: homestay ? homestay.image : '',
      rating: homestay ? homestay.rating : '',
      ratingvote: homestay ? homestay.ratingvote : '',
    };
  
    setSelectedRoomTypes(prevSelectedRoomTypes => [
      ...prevSelectedRoomTypes,
      updatedRoomType,
    ]);
    bottomSheetRef.current?.close();
    setRoomTypes(prevRoomTypes => [...prevRoomTypes, updatedRoomType]);
  
    // Lưu trữ dữ liệu roomtypes vào AsyncStorage
    AsyncStorage.setItem(
      'roomtypes',
      JSON.stringify([...roomTypes, updatedRoomType])
    )
      .then(() => {
        console.log('Room types updated in AsyncStorage');
      })
      .catch(error => {
        console.log('Error updating room types in AsyncStorage:', error);
      });
  };

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        const homestaysData = await AsyncStorage.getItem('homestays');
        if (homestaysData) {
          const homestaysArray = JSON.parse(homestaysData);
          setHomestays(homestaysArray);
          setFilteredHomestays(homestaysArray);
        } else {
          const homestaysSnapshot = await database()
            .ref('homestays')
            .once('value');
          const homestaysData = homestaysSnapshot.val();
          if (homestaysData) {
            const homestaysArray = Object.values(homestaysData);
            setHomestays(homestaysArray);
            setFilteredHomestays(homestaysArray);
  
            // Lưu trữ dữ liệu homestays vào AsyncStorage
            AsyncStorage.setItem('homestays', JSON.stringify(homestaysArray))
              .then(() => {
                console.log('Homestays updated in AsyncStorage');
              })
              .catch(error => {
                console.log('Error updating homestays in AsyncStorage:', error);
              });
          }
        }
      } catch (error) {
        console.log('Error fetching homestays:', error);
      }
    };
  
    fetchHomestays();
  }, []);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const roomTypesData = await AsyncStorage.getItem('roomtypes');
        if (roomTypesData) {
          const roomTypesArray = JSON.parse(roomTypesData);
          setRoomTypes(roomTypesArray);
          setIsFiltered(true);
        }
      } catch (error) {
        console.log('Error fetching room types:', error);
      }
    };
  
    if (!isFiltered) {
      fetchRoomTypes();
    }
  }, [roomTypes, isFiltered]);

  useEffect(() => {
    const fetchRoomTypesSearch = async () => {
      try {
        const roomTypesSearchSnapshot = await database()
          .ref('roomtypes')
          .once('value');
        const roomTypesSearchData = roomTypesSearchSnapshot.val();
        if (roomTypesSearchData) {
          const roomTypesSearchArray = Object.values(roomTypesSearchData);
          setRoomTypesSearch(roomTypesSearchArray);
        }
      } catch (error) {
        console.log('Error fetching room types:', error);
      }
    };

    fetchRoomTypesSearch();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('FastBookingDetailHotel', {item})}>
      <View style={styles.containerCard}>
        <View style={styles.card}>
          <View style={styles.containerImage}>
            {item.homestayImage ? (
              <Image style={styles.image} source={{uri: item.homestayImage}} />
            ) : (
              <Text>Image not available</Text>
            )}
          </View>
          <View style={styles.itemInfor}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {item.homestayName}
            </Text>
            <View style={styles.roomType}>
              <Text style={styles.stRoomType}>Room type</Text>
              <Text style={styles.type}>{item.room_type}</Text>
            </View>
            <View style={styles.inforFee}>
              <Text style={styles.estimatedFee}>Estimated fee</Text>
              <Text style={styles.price}>{item.price_per_night}$</Text>
              <Text style={{fontSize: 14, marginTop: 2}}> /night</Text>
            </View>
          </View>
        </View>
        <Image
          source={images.line}
          style={{height: 25, width: '100%', opacity: 0.3}}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.header}>Fast Booking</Text>
        <TouchableOpacity onPress={handleAddHomestay}>
          <Icon
            style={styles.icon}
            name="plus-circle"
            size={31}
            color={colors.dark}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={roomTypes}
        contentContainerStyle={styles.flatList}
        renderItem={renderItem}
        keyExtractor={item => item.roomtype_id.toString()}
        extraData={selectedRoomTypes}
      />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['1%', '80%']}
        index={-1}
        enablePanDownToClose={true}
        handleComponent={() => <View style={styles.bottomSheetHandle} />}>
        <View style={styles.bottomSheetContent}>
          <Text style={styles.modalTitle}>Fast Booking Set Up</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter homestay name"
              value={searchText}
              onChangeText={text => setSearchText(text)}
            />
          </View>
          <TouchableOpacity onPress={handleSearch}>
            <Text style={styles.searchButton}>Search</Text>
          </TouchableOpacity>

          <ScrollView style={{marginBottom: 200}}>
            <FlatList
               data={searchText !== '' && filteredHomestays.length > 0 ? filteredHomestays : homestays}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => handleHomestayPress(item.homestay_id)}>
                  <View
                    style={[
                      styles.homestayItem,
                      selectedHomestayId === item.homestay_id &&
                        styles.selectedHomestay,
                    ]}>
                    <Text style={styles.homestayName}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.homestay_id.toString()}
            />
            {selectedHomestayId && (
              <>
                <Text style={styles.roomTypesTitle}>Room Types</Text>
                <FlatList
                  data={roomTypesSearch.filter(
                    roomTypeSearch =>
                      roomTypeSearch.homestay_id === selectedHomestayId,
                  )}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => handleRoomTypePress(item.roomtype_id)}>
                      <View style={styles.roomTypeItem}>
                        <Text style={styles.roomTypeName}>
                          {item.room_type}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.roomtype_id.toString()}
                />
              </>
            )}
          </ScrollView>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'while',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
  },
  header: {
    width: '60%',
    color: '#00204A',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 100,
    fontFamily: 'Inter-Bold',
  },
  icon: {
    marginTop: 45,
  },

  //listHotel

  flatList: {
    marginTop: 5,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  containerCard: {
    marginVertical: 5,
    // justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    flexDirection: 'row',
  },
  containerImage: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: 'black',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  itemInfor: {
    marginHorizontal: 10,
    flexDirection: 'column',
    marginRight: 100,
  },
  name: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: '#005792',
  },
  roomType: {
    marginTop: 8,
    flexDirection: 'row',
  },
  stRoomType: {
    fontSize: 16,
    color: '#858585',
    fontFamily: 'Inter-Regular',
  },
  type: {
    marginStart: 45,
    fontSize: 16,
    color: 'black',
    fontFamily: 'Merriweather-Regular',
  },
  inforFee: {
    marginTop: 4,
    flexDirection: 'row',
  },
  estimatedFee: {
    fontSize: 16,
    color: '#858585',
    fontFamily: 'Inter-Regular',
  },
  price: {
    marginStart: 25,
    fontSize: 16,
    color: 'black',
    fontFamily: 'Merriweather-Regular',
  },

  //bottomSheet
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    marginBottom: 10,
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  searchButton: {
    fontSize: 18,
    color: '#005792',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: 4,
  },
  homestayItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    paddingVertical: 8,
  },
  homestayName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roomTypeItem: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  roomTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FastBooking;

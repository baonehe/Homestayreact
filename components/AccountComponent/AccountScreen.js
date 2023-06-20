import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../assets/consts/colors';
import {ScrollView} from 'react-native-gesture-handler';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconIont from 'react-native-vector-icons/Ionicons';
import IconMT from 'react-native-vector-icons/MaterialIcons';
import IconOticon from 'react-native-vector-icons/Octicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

function Account({navigation, route}) {
  const {email} = route.params;
  const [name, setname] = useState('');
  const [phone, setphone] = useState('');
  const [selectLanguage, setselectLanguage] = useState([]);

  const NotificationSettingHandal = async () => {
    navigation.navigate('NotificationSetting');
  };
  const logout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userId');
    navigation.navigate('Login');
  };
  const favoriteSettingHandal = async () => {
    navigation.navigate('FavoritesScreen');
  };
  const InforHandle = async () => {
    navigation.navigate('Information');
  };
  const HistoryHandle = async () => {
    navigation.navigate('HistoryScreen');
  };
  useEffect(() => {
    checkInfo();
  });
  const checkInfo = async () => {
    firestore()
      .collection('Users')
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length > 0) {
          if (querySnapshot.docs[0]._data.email === email) {
            setname(querySnapshot.docs[0]._data.name);
            setphone(querySnapshot.docs[0]._data.phone);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <SafeAreaView>
      <ScrollView style={{marginBottom: 80}}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomWidth: 5.5,
              marginTop: 5,
              borderBottomColor: '#e9e9e9',
              paddingVertical: 8,
            }}>
            <View style={{flexDirection: 'column'}}>
              <Text style={{fontSize: 16, marginLeft: 20}}>{name} </Text>
              <Text style={{fontSize: 16, marginLeft: 20}}>{phone}</Text>
              <Text style={{fontSize: 16, marginLeft: 20}}>{email}</Text>
            </View>
            <TouchableOpacity
              style={{marginRight: 20}}
              onPress={() => InforHandle()}>
              <Icon
                name="account-edit-outline"
                size={35}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.Title}>My Journey</Text>
            <View style={styles.Card}>
              <Icon
                name="history"
                size={24}
                marginHorizontal={10}
                onPress={HistoryHandle}
              />
              <Text style={styles.FontCard}> History Booking</Text>
            </View>
            <View style={styles.Card}>
              <IconAnt name="rocket1" size={24} marginHorizontal={10} />
              <Text style={styles.FontCard}> My Fast Booking</Text>
            </View>
            <View style={styles.Card}>
              <Icon
                name="cards-heart-outline"
                size={24}
                marginHorizontal={10}
              />
              <Text style={styles.FontCard} onPress={favoriteSettingHandal}>
                {' '}
                My Favorite
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.Title}>Settings</Text>
            <View style={styles.Card}>
              <IconAnt name="bells" size={24} marginHorizontal={10} />
              <Text style={styles.FontCard} onPress={NotificationSettingHandal}>
                {' '}
                Notification
              </Text>
            </View>
            <View style={styles.Card}>
              <Icon
                name="earth"
                size={24}
                marginHorizontal={10}
                paddingTop={15}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
                <Text
                  style={[
                    styles.FontCard,
                    {alignItems: 'center', paddingTop: 15},
                  ]}>
                  {' '}
                  Language
                </Text>
                <Picker
                  style={{width: 170, height: 10}}
                  selectedValue={selectLanguage}
                  onValueChange={(itemValue, itemIndex) =>
                    setselectLanguage(itemValue)
                  }>
                  <Picker.Item label="VietNamese" value="VN" />
                  <Picker.Item label="English" value="Eng" />
                </Picker>
              </View>
            </View>
          </View>
          <View style={styles.Card}>
            <IconIont name="location-outline" size={24} marginHorizontal={10} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text style={styles.FontCard}> Location</Text>
              <Text
                style={{...styles.FontCard, color: 'black', fontWeight: '500'}}>
                {' '}
                Ho Chi Minh
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.Title}>Information</Text>
            <View style={styles.Card}>
              <IconMT name="question-answer" size={24} marginHorizontal={10} />
              <Text style={styles.FontCard}> Q&A</Text>
            </View>
            <View style={styles.Card}>
              <IconAnt name="rocket1" size={24} marginHorizontal={10} />
              <Text style={styles.FontCard}> Terms& Privacy Policy</Text>
            </View>
            <View style={styles.Card}>
              <IconOticon name="versions" size={24} marginHorizontal={10} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
                <Text style={styles.FontCard}> Version</Text>
                <Text
                  style={{
                    ...styles.FontCard,
                    color: '#9a9a9a',
                    fontWeight: '500',
                  }}>
                  {' '}
                  0.1.1
                </Text>
              </View>
            </View>
            <View style={styles.Card}>
              <IconIont
                name="ios-information-circle-outline"
                size={24}
                marginHorizontal={10}
              />
              <Text style={styles.FontCard}> Contact us</Text>
            </View>
            <View style={styles.Card}>
              <IconAnt name="logout" size={24} marginHorizontal={10} />
              <Text style={styles.FontCard} onPress={logout}>
                {' '}
                sign Out
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  Title: {
    fontSize: 24,
    marginLeft: 20,
    fontWeight: '600',
    marginVertical: 10,
    color: colors.dark,
  },
  Card: {
    flexDirection: 'row',
    paddingBottom: 7,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  FontCard: {
    fontSize: 16,
    fontWeight: '300',
  },
});
export default Account;

import React from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/consts/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconIont from 'react-native-vector-icons/Ionicons';
import IconMT from 'react-native-vector-icons/MaterialIcons';
import IconOticon from 'react-native-vector-icons/Octicons'

function Account  ({navigation}) {
  const NotificationSettingHandal = async () => {
    navigation.navigate('NotificationSetting');
  };
  return (
    <ScrollView>
      <View style={{borderBottomWidth: 5.5,marginTop:5,borderBottomColor:'#e9e9e9',paddingVertical:8}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize:16,marginLeft:20}}>Tran Du Gia Bao </Text>
          <Icon
            name="account-edit-outline"
            size={24}
            color={colors.primary}></Icon>
        </View>
        <Text style={{fontSize:16,marginLeft:20}}>0904020529</Text>
        <Text style={{fontSize:16,marginLeft:20}}>giabao1352002@gmail.com</Text>
      </View>
      <View>
        <Text style={styles.Title}>My Journey</Text>
        <View style={styles.Card}>
          <Icon name="history" size={24} marginHorizontal={10}></Icon>
          <Text style={styles.FontCard}> History Booking</Text>
        </View>
        <View style={styles.Card}>
          <IconAnt name="rocket1" size={24} marginHorizontal={10}></IconAnt>
          <Text style={styles.FontCard}> My Fast Booking</Text>
        </View>
        <View style={styles.Card}>
          <Icon
            name="cards-heart-outline"
            size={24}
            marginHorizontal={10}></Icon>
          <Text style={styles.FontCard}> My Favorite</Text>
        </View>
      </View>

      <View>
        <Text style={styles.Title}>Settings</Text>
        <View style={styles.Card} >
          <IconAnt name="bells" size={24} marginHorizontal={10} ></IconAnt>
          <Text style={styles.FontCard} onPress={NotificationSettingHandal} > Notification</Text>
        </View>
        <View style={styles.Card}>
          <Icon name="earth" size={24} marginHorizontal={10}></Icon>
          <View style={{flexDirection:'row',justifyContent:'space-between', flex:1}}>
          <Text style={styles.FontCard}> Language</Text>
          <Text style={{...styles.FontCard,color:'black',fontWeight:'500'}}> VietNamese</Text>
          </View>
        </View>
        </View>
        <View style={styles.Card}>
          <IconIont
            name="location-outline"
            size={24}
            marginHorizontal={10}></IconIont>
           <View style={{flexDirection:'row',justifyContent:'space-between', flex:1}}>
          <Text style={styles.FontCard}> Location</Text>
          <Text style={{...styles.FontCard, color:'black',fontWeight:'500'}}> Ho Chi Minh</Text>
          </View>
        </View>
        
        <View>
        <Text style={styles.Title}>Information</Text>
        <View style={styles.Card}>
          <IconMT name="question-answer" size={24} marginHorizontal={10}></IconMT>
          <Text style={styles.FontCard}> Q&A</Text>
        </View>
        <View style={styles.Card}>
          <IconAnt name="rocket1" size={24} marginHorizontal={10}></IconAnt>
          <Text style={styles.FontCard}> Terms& Privacy Policy</Text>
        </View>
        <View style={styles.Card}>
          <IconOticon
            name="versions"
            size={24}
            marginHorizontal={10}>
            </IconOticon>
            <View style={{flexDirection:'row',justifyContent:'space-between', flex:1}}>
          <Text style={styles.FontCard}> Version</Text>
          <Text style={{...styles.FontCard, color:'#9a9a9a',fontWeight:'500'}}> 0.1.1</Text>
          </View>
        </View>
        <View style={styles.Card}>
          <IconIont
            name="ios-information-circle-outline"
            size={24}
            marginHorizontal={10}></IconIont>
          <Text style={styles.FontCard}> Contact us</Text>
        </View>
        <View style={styles.Card}>
          <IconAnt
            name="logout"
            size={24}
            marginHorizontal={10}></IconAnt>
          <Text style={styles.FontCard}> sign Out</Text>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  Title: {
    fontSize: 24,
    marginLeft:20,
    fontWeight: '600',
    marginVertical: 10,
    color:  colors.dark,
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
    fontWeight: '350',
  },
});
export default Account;

import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import colors from '../../assets/consts/colors';
import sizes from '../../assets/consts/sizes';
import TopTabsNavigator2 from '../../navigators/TopTabsNavigator2';

const Notification = ({navigation, route}) => {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      await fetchData();
    } catch (error) {
      console.log('Error fetching user ID:', error);
    }
  };

  const fetchData = async () => {
    try {
      const userSnapshot = await firestore()
        .collection('Users')
        .doc(userId)
        .get();

      const user = userSnapshot.data();

      // Kiểm tra nếu thuộc tính "notification" là một mảng và không rỗng
      if (Array.isArray(user?.notifications) && user.notifications.length > 0) {
        const notificationsData = user.notifications.map(notification => ({
          id: notification.id,
          title: notification.title,
          details: notification.details,
          date: notification.date,
          type: notification.type,
        }));
        setNotifications(notificationsData);
      } else {
        setNotifications([]);
      }
      setIsDataLoaded(true);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons
            name="arrow-back-ios"
            size={sizes.iconExtraSmall}
            color={colors.dark}
            onPress={navigation.goBack}
          />
        </View>
        <Text style={styles.titleScreen}>Notification</Text>
        <View style={styles.headerRight}>
          <Ionicons
            name="checkmark-done"
            size={sizes.iconSmall}
            color={colors.lightblack}
          />
        </View>
      </View>
      {isDataLoaded ? (
        <TopTabsNavigator2 notifications={notifications} />
      ) : (
        <Text style={styles.loadText}>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleScreen: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.dark,
    textAlign: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  loadText: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Lato-Regular',
    color: colors.red,
    marginVertical: 20,
  },
});

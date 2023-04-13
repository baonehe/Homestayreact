import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';
import notifications from '../assets/data/notifications';

const Top = createMaterialTopTabNavigator();
const TopTabsNavigator2 = ({navigation}) => {
  const DetailItem = ({item}) => {
    return (
      <TouchableOpacity>
        <View style={styles.itemCard}>
          <View style={styles.itemIconContainer}>
            <Ionicons
              name={
                item.type === 'Setting'
                  ? 'settings-sharp'
                  : item.type === 'Booking'
                  ? 'calendar'
                  : item.type === 'Promotion'
                  ? 'md-ribbon'
                  : 'mail'
              }
              size={sizes.iconSmall}
              color={colors.primary}
            />
          </View>
          <View style={styles.itemInfor}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDetails}>{item.details}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const ListItem = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={notifications}
          vertical
          contentContainerStyle={styles.flatList}
          renderItem={({item}) => <DetailItem item={item} />}
        />
      </ScrollView>
    );
  };

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
      <Top.Screen name="All" component={ListItem} />
      <Top.Screen name="Booking" component={ListItem} />
      <Top.Screen name="Promotion" component={ListItem} />
      <Top.Screen name="Others" component={ListItem} />
    </Top.Navigator>
  );
};

export default TopTabsNavigator2;

const styles = StyleSheet.create({
  tabBar: {
    // shadowColor: colors.transparent,
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Lato-Light',
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  tabBarIndicator: {
    width: 70,
    backgroundColor: colors.light,
    justifyContent: 'center',
    verticalAlign: 'middle',
    flexDirection: 'row',
    marginLeft: 15,
    marginBottom: 10,
    borderRadius: 35,
  },
  flatList: {
    paddingBottom: 30,
  },

  itemCard: {
    width: '100%',
    height: 200,
    flexDirection: 'row',
    paddingTop: 20,
    borderWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: colors.gray2,
  },
  itemIconContainer: {
    height: 45,
    width: 45,
    backgroundColor: colors.light,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  itemInfor: {},
  itemTitle: {
    color: colors.black,
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginVertical: 10,
  },
  itemDetails: {
    width: 255,
    color: colors.black,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
  },
  itemDate: {
    // width: '100%',
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 15,
    right: -20,
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});

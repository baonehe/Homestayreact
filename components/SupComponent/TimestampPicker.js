import {StyleSheet, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Calendar, CalendarList} from 'react-native-calendars';
import {useSelector, useDispatch} from 'react-redux';
import {
  setDuration,
  setCheckInTime,
  setCheckOutTime,
  setCheckInDate,
  setCheckOutDate,
  setMarkedDates,
  setCurrentMonth,
  setSelectedTimeframe,
} from '../redux/timereducers';
import colors from '../../assets/consts/colors';
import Hourly from './Hourly';
import Overnight from './Overnight';
import Daily from './Daily';

const Top = createMaterialTopTabNavigator();

const TimestampPicker = () => {
  return (
    <View style={{flex: 1}}>
      <Top.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.darkgray,
          tabBarAllowFontScaling: true,
          tabBarPressColor: colors.transparent,
          tabBarIndicatorStyle: styles.tabBarIndicator,
        }}>
        <Top.Screen name="Hourly" component={Hourly} />
        <Top.Screen name="Overnight" component={Overnight} />
        <Top.Screen name="Daily" component={Daily} />
      </Top.Navigator>
    </View>
  );
};

export default TimestampPicker;

const styles = StyleSheet.create({
  tabBar: {
    shadowColor: colors.transparent,
    borderRadius: 35,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  tabBarLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    alignSelf: 'center',
  },
  tabBarIndicator: {
    backgroundColor: colors.light,
    height: 30,
    width: 110,
    justifyContent: 'space-between',
    verticalAlign: 'middle',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 35,
  },

  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

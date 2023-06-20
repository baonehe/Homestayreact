import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import {CalendarList} from 'react-native-calendars';
import {useSelector, useDispatch} from 'react-redux';
import {
  setTimeType,
  setCheckIn,
  setCheckOut,
  setCheckInDate,
  setCheckOutDate,
  setMarkedDates,
  setCurrentMonth,
} from '../redux/timestampReducers';
import {addHours, format, parse} from 'date-fns';
import colors from '../../assets/consts/colors';
import utils from '../../assets/consts/utils';

const Daily = () => {
  const minDate = [format(new Date(), 'yyyy-MM-dd')].toString();
  const timeType = 'Daily';
  const selector = useSelector(state => state.timestamp);
  const daily = useSelector(state => state.timestamp.daily);
  const dailyDispatch = useDispatch();

  const handleApplyBtn = useCallback(() => {
    const formattedCheckIn = `${daily.checkInTime}, ${daily.checkInDate}`;
    const formattedCheckOut = `${daily.checkOutTime}, ${daily.checkOutDate}`;

    dailyDispatch(setTimeType(timeType));
    dailyDispatch(setCheckIn({checkIn: formattedCheckIn}));
    dailyDispatch(setCheckOut({checkOut: formattedCheckOut}));
  }, [
    daily.checkInDate,
    daily.checkInTime,
    daily.checkOutDate,
    daily.checkOutTime,
    dailyDispatch,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Text style={styles.timeTitle}>Check-in</Text>
          <Text style={styles.timeContent}>{selector.checkIn}</Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={styles.timeTitle}>Check-out</Text>
          <Text style={styles.timeContent}>{selector.checkOut}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <CalendarList
          minDate={minDate}
          scrollEnabled={true}
          pastScrollRange={0}
          futureScrollRange={100}
          current={daily.currentMonth}
          enableSwipeMonths={true}
          markingType="period"
          markedDates={daily.markedDates}
        />
      </ScrollView>
      <TouchableOpacity style={styles.pickBtn} onPress={handleApplyBtn}>
        <Text style={styles.textBtn}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Daily;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeItem: {},
  timeTitle: {
    color: colors.darkgray,
  },
  timeContent: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    color: colors.black,
    marginVertical: 5,
  },
  pickBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    width: 120,
    height: 40,
    borderRadius: 18,
    marginVertical: 8,
  },
  textBtn: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: colors.white,
    textAlign: 'center',
  },
});

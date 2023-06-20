import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {Calendar, CalendarList} from 'react-native-calendars';
import {useSelector, useDispatch} from 'react-redux';
import {
  setTimeType,
  setCheckIn,
  setCheckOut,
  setCheckInTab,
  setCheckOutTab,
  setCheckInDate,
  setCheckOutDate,
  setMarkedDates,
  setCurrentMonth,
} from '../redux/timestampReducers';
import {addHours, addDays, format, parse} from 'date-fns';
import colors from '../../assets/consts/colors';
import utils from '../../assets/consts/utils';

const Overnight = () => {
  const minDate = [format(new Date(), 'yyyy-MM-dd')].toString();
  const timeType = 'Overnight';
  const overnight = useSelector(state => state.timestamp.overnight);
  const overnightDispatch = useDispatch();

  const onPressDay = day => {
    const tomorrow = addDays(
      parse(day.dateString, 'yyyy-MM-dd', new Date()),
      1,
    );
    const dayString = format(day.dateString, 'yyyy-MM-dd');
    const tomorrowString = format(tomorrow, 'yyyy-MM-dd');

    overnightDispatch(
      setMarkedDates({
        markedDates: {
          [dayString]: {
            selected: true,
            startingDay: true,
            color: colors.light,
            textColor: colors.primary,
          },
          [tomorrowString]: {
            selected: true,
            endingDay: true,
            color: colors.light,
            textColor: colors.primary,
          },
        },
        tabName: 'overnight',
      }),
    );

    overnightDispatch(
      setCheckInDate({
        checkInDate: format(day.dateString, 'dd/MM/yyyy'),
        tabName: 'overnight',
      }),
    );
    overnightDispatch(
      setCheckOutDate({
        checkOutDate: format(tomorrow, 'dd/MM/yyyy'),
        tabName: 'overnight',
      }),
    );

    overnightDispatch(
      setCurrentMonth({
        currentMonth: format(day.dateString, 'yyyy-MM'),
        tabName: 'overnight',
      }),
    );

    const checkInTime = overnight.checkInTime;
    const checkOutTime = overnight.checkOutTime;
    const formattedCheckIn = `${checkInTime}, ${format(
      day.dateString,
      'dd/MM/yyyy',
    )}`;
    const formattedCheckOut = `${checkOutTime}, ${format(
      tomorrow,
      'dd/MM/yyyy',
    )}`;
    overnightDispatch(
      setCheckInTab({checkIn: formattedCheckIn, tabName: 'overnight'}),
    );
    overnightDispatch(
      setCheckOutTab({checkIn: formattedCheckOut, tabName: 'overnight'}),
    );
  };

  const handleApplyBtn = useCallback(() => {
    const formattedCheckIn = overnight.checkIn;
    const formattedCheckOut = overnight.checkOut;

    overnightDispatch(setTimeType(timeType));
    overnightDispatch(setCheckIn(formattedCheckIn));
    overnightDispatch(setCheckOut(formattedCheckOut));
  }, [overnight.checkIn, overnight.checkOut, overnightDispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Text style={styles.timeTitle}>Check-in</Text>
            <Text style={styles.timeContent}>
              {utils.formatDateTime(overnight.checkIn)}
            </Text>
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeTitle}>Check-out</Text>
            <Text style={styles.timeContent}>
              {utils.formatDateTime(overnight.checkOut)}
            </Text>
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeTitle}>Duration</Text>
            <Text style={styles.timeContent}>{overnight.duration}</Text>
          </View>
        </View>
        <Calendar
          minDate={minDate}
          current={overnight.currentMonth}
          enableSwipeMonths={true}
          markingType="period"
          markedDates={overnight.markedDates}
          onDayPress={day => onPressDay(day)}
        />
      </View>

      <TouchableOpacity style={styles.pickBtn} onPress={handleApplyBtn}>
        <Text style={styles.textBtn}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Overnight;

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

  calendar: {
    marginBottom: 20,
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

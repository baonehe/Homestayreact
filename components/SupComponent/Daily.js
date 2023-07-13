import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import {CalendarList} from 'react-native-calendars';
import {useSelector, useDispatch} from 'react-redux';
import {
  setTimeType,
  setDuration,
  setCheckIn,
  setCheckOut,
  setCheckInTab,
  setCheckOutTab,
  setCheckInDate,
  setCheckOutDate,
  setMarkedDates,
  setCurrentMonth,
} from '../redux/timestampReducers';
import {addHours, addDays, format, intervalToDuration, parse} from 'date-fns';
import colors from '../../assets/consts/colors';
import utils from '../../assets/consts/utils';

const Daily = () => {
  const minDate = [format(new Date(), 'yyyy-MM-dd')].toString();
  const timeType = 'Daily';
  const daily = useSelector(state => state.timestamp.daily);
  const dailyDispatch = useDispatch();
  const [isCheck, setIsCheck] = useState(true);

  const onPressDay = useCallback(
    day => {
      const dayString = day.dateString;
      const selectedDate = new Date(dayString);
      const CheckInDate = new Date(
        Date.UTC(
          parse(daily.checkInDate, 'dd/MM/yyyy', new Date()).getFullYear(),
          parse(daily.checkInDate, 'dd/MM/yyyy', new Date()).getMonth(),
          parse(daily.checkInDate, 'dd/MM/yyyy', new Date()).getDate(),
          0,
          0,
          0,
        ),
      );
      if (selectedDate <= CheckInDate || isCheck) {
        const checkInDate = format(new Date(day.timestamp), 'dd/MM/yyyy');
        const checkInTime = daily.checkInTime;
        const formattedCheckIn = `${checkInTime}, ${checkInDate}`;
        setIsCheck(false);

        dailyDispatch(
          setCheckInDate({
            checkInDate: checkInDate,
            tabName: 'daily',
          }),
        );
        dailyDispatch(
          setCheckInTab({checkIn: formattedCheckIn, tabName: 'daily'}),
        );
        dailyDispatch(
          setMarkedDates({
            markedDates: {
              [dayString]: {
                selected: true,
                startingDay: true,
                color: colors.light,
                textColor: colors.primary,
              },
            },
            tabName: 'daily',
          }),
        );
      } else {
        const checkOutDate = format(new Date(day.timestamp), 'dd/MM/yyyy');
        const checkOutTime = daily.checkOutTime;
        const formattedCheckOut = `${checkOutTime}, ${checkOutDate}`;
        const duration = intervalToDuration({
          start: CheckInDate,
          end: selectedDate,
        }).days;
        const markedDates = {};

        setIsCheck(true);

        for (
          let date = new Date(CheckInDate);
          date <= selectedDate;
          date.setDate(date.getDate() + 1)
        ) {
          const dateString = format(date, 'yyyy-MM-dd');
          const isStartingDay = date.getTime() === CheckInDate.getTime();
          const isEndingDay = date.getTime() === selectedDate.getTime();

          markedDates[dateString] = {
            selected: true,
            startingDay: isStartingDay,
            endingDay: isEndingDay,
            color: colors.light,
            textColor: colors.primary,
          };
        }

        dailyDispatch(
          setCheckOutDate({
            checkOutDate: checkOutDate,
            tabName: 'daily',
          }),
        );

        dailyDispatch(
          setCheckOutTab({checkOut: formattedCheckOut, tabName: 'daily'}),
        );

        dailyDispatch(setDuration({duration: duration, tabName: 'daily'}));

        dailyDispatch(
          setMarkedDates({
            markedDates: markedDates,
            tabName: 'daily',
          }),
        );
      }

      dailyDispatch(
        setCurrentMonth({
          currentMonth: dayString.slice(0, 7),
          tabName: 'daily',
        }),
      );
    },
    [
      daily.checkInDate,
      daily.checkInTime,
      daily.checkOutTime,
      dailyDispatch,
      isCheck,
    ],
  );

  const handleApplyBtn = useCallback(() => {
    if (isCheck) {
      const formattedCheckIn = daily.checkIn;
      const formattedCheckOut = daily.checkOut;

      dailyDispatch(setTimeType(timeType));
      dailyDispatch(setCheckIn(formattedCheckIn));
      dailyDispatch(setCheckOut(formattedCheckOut));
    }
  }, [daily.checkIn, daily.checkOut, dailyDispatch, isCheck]);

  const applyBtnStyle = isCheck ? styles.pickBtn : styles.disabledBtn;
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Text style={styles.timeTitle}>Check-in</Text>
          <Text style={styles.timeContent}>
            {utils.formatDateTime(daily.checkIn)}
          </Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={styles.timeTitle}>Check-out</Text>

          <Text style={styles.timeContent}>
            {isCheck ? utils.formatDateTime(daily.checkOut) : ''}
          </Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={styles.timeTitle}>Duration</Text>
          <Text style={styles.timeContent}>
            {isCheck ? daily.duration : ''}
          </Text>
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
          onDayPress={day => onPressDay(day)}
        />
      </ScrollView>
      <TouchableOpacity
        style={applyBtnStyle}
        disabled={!isCheck}
        onPress={handleApplyBtn}>
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
  disabledBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray2,
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

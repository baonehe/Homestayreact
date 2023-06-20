import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import {Calendar, CalendarList} from 'react-native-calendars';
import {useSelector, useDispatch} from 'react-redux';
import {
  getTimeframeList,
  setTimeType,
  setCheckIn,
  setCheckOut,
  setCheckInTab,
  setCheckOutTab,
  setDuration,
  setCheckInTime,
  setCheckOutTime,
  setCheckInDate,
  setCheckOutDate,
  setMarkedDates,
  setCurrentMonth,
  setSelectedTimeframe,
} from '../redux/timestampReducers';
import {addHours, format, parse} from 'date-fns';
import colors from '../../assets/consts/colors';
import utils from '../../assets/consts/utils';

const Hourly = () => {
  const minDate = [format(new Date(), 'yyyy-MM-dd')].toString();
  const timeType = 'Hourly';
  const hourly = useSelector(state => state.timestamp.hourly);
  const timeFrameList = getTimeframeList(hourly.checkInDate);
  const hourlyDispatch = useDispatch();

  // set checkInTime, auto timeFrame
  useEffect(() => {
    const interval = setInterval(() => {
      const timeList = getTimeframeList(hourly.checkInDate);
      const itemString = timeList.find(item => !item.disabled).timeString;

      const checkInTime = parse(itemString, 'HH:mm', new Date());
      const newCheckOutTime = addHours(checkInTime, hourly.duration);
      const formattedCheckOutTime = format(newCheckOutTime, 'HH:mm');

      hourlyDispatch(
        setCheckInTime({checkInTime: itemString, tabName: 'hourly'}),
      );
      hourlyDispatch(
        setCheckOutTime({
          checkOutTime: formattedCheckOutTime,
          tabName: 'hourly',
        }),
      );
      hourlyDispatch(
        setSelectedTimeframe({
          selectedTimeFrame: itemString,
          tabName: 'hourly',
        }),
      );

      const formattedCheckIn = `${itemString}, ${hourly.checkInDate}`;
      const formattedCheckOut = `${formattedCheckOutTime}, ${hourly.checkOutDate}`;
      hourlyDispatch(
        setCheckInTab({checkIn: formattedCheckIn, tabName: 'hourly'}),
      );
      hourlyDispatch(
        setCheckOutTab({checkOut: formattedCheckOut, tabName: 'hourly'}),
      );
    }, 1000 * 60); // Cập nhật sau 1 phút

    return () => clearInterval(interval);
  }, [
    hourly.checkInDate,
    hourly.checkOutDate,
    hourly.duration,
    hourlyDispatch,
    timeFrameList,
  ]);

  // set duration, check OutTime
  const handleDurationPress = useCallback(
    ({item}) => {
      hourlyDispatch(setDuration({duration: item, tabName: 'hourly'}));
      const checkInTime = hourly.checkInTime;
      const newCheckInTime = parse(checkInTime, 'HH:mm', new Date());
      const newCheckOutTime = addHours(newCheckInTime, item);
      const formattedCheckOutTime = format(newCheckOutTime, 'HH:mm');

      const checkInDate = hourly.checkInDate;
      const checkOutDate = hourly.checkOutDate;
      hourlyDispatch(
        setCheckOutTime({
          checkOutTime: formattedCheckOutTime,
          tabName: 'hourly',
        }),
      );
      const formattedCheckIn = `${checkInTime}, ${checkInDate}`;
      const formattedCheckOut = `${formattedCheckOutTime}, ${checkOutDate}`;

      hourlyDispatch(
        setCheckInTab({checkIn: formattedCheckIn, tabName: 'hourly'}),
      );
      hourlyDispatch(
        setCheckOutTab({checkOut: formattedCheckOut, tabName: 'hourly'}),
      );
    },
    [
      hourly.checkInDate,
      hourly.checkInTime,
      hourly.checkOutDate,
      hourlyDispatch,
    ],
  );

  // // set checkInTime, checkOutTime, selectedTimeFrame
  const handleTimeframePress = useCallback(
    ({item}) => {
      const itemString = item.timeString;

      const newCheckInTime = parse(itemString, 'HH:mm', new Date());
      const newCheckOutTime = addHours(newCheckInTime, hourly.duration);

      const formattedCheckInTime = format(newCheckInTime, 'HH:mm');
      const formattedCheckOutTime = format(newCheckOutTime, 'HH:mm');

      const checkInDate = hourly.checkInDate;
      const checkOutDate = hourly.checkOutDate;

      const formattedCheckIn = `${formattedCheckInTime}, ${checkInDate}`;
      const formattedCheckOut = `${formattedCheckOutTime}, ${checkOutDate}`;

      hourlyDispatch(
        setCheckInTime({checkInTime: itemString, tabName: 'hourly'}),
      );
      hourlyDispatch(
        setCheckOutTime({
          checkOutTime: formattedCheckOutTime,
          tabName: 'hourly',
        }),
      );
      hourlyDispatch(
        setSelectedTimeframe({
          selectedTimeFrame: itemString,
          tabName: 'hourly',
        }),
      );

      hourlyDispatch(
        setCheckInTab({checkIn: formattedCheckIn, tabName: 'hourly'}),
      );
      hourlyDispatch(
        setCheckOutTab({checkOut: formattedCheckOut, tabName: 'hourly'}),
      );
    },
    [hourly.checkInDate, hourly.checkOutDate, hourly.duration, hourlyDispatch],
  );

  const onPressDay = useCallback(
    day => {
      const dayString = day.dateString;
      const checkInDate = new Date(day.timestamp);
      const checkOutDate = new Date(day.timestamp);

      hourlyDispatch(
        setCheckInDate({
          checkInDate: format(checkInDate, 'dd/MM/yyyy'),
          tabName: 'hourly',
        }),
      );
      hourlyDispatch(
        setCheckOutDate({
          checkOutDate: format(checkOutDate, 'dd/MM/yyyy'),
          tabName: 'hourly',
        }),
      );
      hourlyDispatch(
        setMarkedDates({
          markedDates: {
            [dayString]: {
              selected: true,
              startingDay: true,
              endingDay: true,
            },
          },
          tabName: 'hourly',
        }),
      );
      hourlyDispatch(
        setCurrentMonth({
          currentMonth: day.dateString.slice(0, 7),
          tabName: 'hourly',
        }),
      );

      // Update checkIn and checkOut values
      const timeframeList = getTimeframeList(format(checkInDate, 'dd/MM/yyyy'));
      const itemString = timeframeList.find(item => !item.disabled).timeString;
      hourlyDispatch(
        setCheckInTime({checkInTime: itemString, tabName: 'hourly'}),
      );
      hourlyDispatch(
        setSelectedTimeframe({
          selectedTimeFrame: itemString,
          tabName: 'hourly',
        }),
      );

      const newCheckInTime = parse(itemString, 'HH:mm', new Date());
      const newCheckOutTime = addHours(newCheckInTime, hourly.duration);
      const formattedCheckOutTime = format(newCheckOutTime, 'HH:mm');
      const formattedCheckIn = `${itemString}, ${format(
        checkInDate,
        'dd/MM/yyyy',
      )}`;
      const formattedCheckOut = `${formattedCheckOutTime}, ${format(
        checkOutDate,
        'dd/MM/yyyy',
      )}`;

      hourlyDispatch(
        setCheckInTab({checkIn: formattedCheckIn, tabName: 'hourly'}),
      );
      hourlyDispatch(
        setCheckOutTab({checkOut: formattedCheckOut, tabName: 'hourly'}),
      );
    },
    [hourly.duration, hourlyDispatch],
  );

  const handleApplyBtn = useCallback(() => {
    const formattedCheckIn = hourly.checkIn;
    const formattedCheckOut = hourly.checkOut;

    hourlyDispatch(setTimeType(timeType));
    hourlyDispatch(setCheckIn(formattedCheckIn));
    hourlyDispatch(setCheckOut(formattedCheckOut));
  }, [hourly.checkIn, hourly.checkOut, hourlyDispatch]);

  const Duration = () => {
    return (
      <View style={styles.durationContainer}>
        <Text style={styles.durationTitle}>Duration</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          data={hourly.durationList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <DurationItem
              time={item}
              onPress={() => handleDurationPress({item})}
              selected={item === hourly.duration}
            />
          )}
        />
      </View>
    );
  };

  const DurationItem = React.memo(({time, onPress, selected}) => {
    return (
      <TouchableOpacity
        style={[
          styles.durationItem,
          {backgroundColor: selected ? colors.light : colors.lightgray},
        ]}
        onPress={onPress}>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: selected ? colors.primary : colors.black,
          }}>
          {time} hour(s)
        </Text>
      </TouchableOpacity>
    );
  });

  const Timeframe = () => {
    return (
      <View style={styles.timeframeContainer}>
        <Text style={styles.timeframeTitle}>Check-in time</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          data={timeFrameList.filter(item => !item.disabled)}
          keyExtractor={item => item.timeString}
          renderItem={({item}) => {
            return (
              <TimeframeItem
                time={item.timeString}
                onPress={() => handleTimeframePress({item})}
                selected={item.timeString === hourly.selectedTimeFrame}
              />
            );
          }}
        />
      </View>
    );
  };

  const TimeframeItem = React.memo(({time, onPress, selected}) => {
    return (
      <TouchableOpacity
        style={[
          styles.timeframeItem,
          {
            backgroundColor: selected ? colors.light : colors.lightgray,
          },
        ]}
        onPress={onPress}>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: 14,
            color: selected ? colors.primary : colors.black,
          }}>
          {time}
        </Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Text style={styles.timeTitle}>Check-in</Text>
          <Text style={styles.timeContent}>
            {utils.formatDateTime(hourly.checkIn)}
          </Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={styles.timeTitle}>Check-out</Text>
          <Text style={styles.timeContent}>
            {utils.formatDateTime(hourly.checkOut)}
          </Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={styles.timeTitle}>Duration</Text>
          <Text style={styles.timeContent}>{hourly.duration}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <Calendar
          minDate={minDate}
          current={hourly.currentMonth}
          enableSwipeMonths={true}
          markingType="dot"
          markedDates={hourly.markedDates}
          style={styles.calendar}
          onDayPress={day => onPressDay(day)}
        />
        <Timeframe />
        <Duration />
      </ScrollView>
      <TouchableOpacity style={styles.pickBtn} onPress={handleApplyBtn}>
        <Text style={styles.textBtn}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Hourly;

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

  timeframeContainer: {
    borderTopWidth: 0.75,
    borderColor: colors.dark,
    paddingTop: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  timeframeTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 18,
    color: colors.black,
    marginBottom: 15,
  },
  timeframeItem: {
    padding: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    borderRadius: 12,
    opacity: 1,
  },
  flatList: {
    paddingTop: 10,
  },
  calendar: {
    marginBottom: 20,
  },
  durationContainer: {
    borderTopWidth: 0.75,
    borderColor: colors.dark,
    paddingTop: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  durationTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 18,
    color: colors.black,
    marginBottom: 15,
  },
  durationItem: {
    padding: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    borderRadius: 12,
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

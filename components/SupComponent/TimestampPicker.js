import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
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
} from '../redux/reducers';
import colors from '../../assets/consts/colors';

const Top = createMaterialTopTabNavigator();

const TimestampPicker = () => {
  const minDate = new Date().toISOString().split('T')[0];

  const formatTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;
    return formattedTime;
  };
  const formatDay = date => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const formattedDate = `${day}/${month}`;
    return formattedDate;
  };
  const format = (time, date) => {
    const formattedTime = formatTime(time);
    const formattedDate = formatDay(date);
    return `${formattedTime}, ${formattedDate}`;
  };

  const Hourly = () => {
    const hourly = useSelector(state => state.timestamp.hourly);
    const dispatch = useDispatch();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const newCheckOutTime = new Date(
        hourly.checkInTime.getTime() + hourly.duration * 60 * 60 * 1000,
      );
      dispatch(
        setCheckOutTime({checkOutTime: newCheckOutTime, tabName: 'hourly'}),
      );
    }, [dispatch, hourly.checkInTime, hourly.duration]);

    useEffect(() => {
      const itemString = timeframeList.find(item => !item.disabled).timeString;
      const [hours, minutes] = itemString.split(':').map(Number);
      const newCheckInTime = new Date(hourly.checkInDate);
      newCheckInTime.setHours(hours);
      newCheckInTime.setMinutes(minutes);
      dispatch(
        setCheckInTime({checkInTime: newCheckInTime, tabName: 'hourly'}),
      );
      dispatch(
        setSelectedTimeframe({
          selectedTimeframe: itemString,
          tabName: 'hourly',
        }),
      );

      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000 * 60);
      return () => clearInterval(interval);
    }, []);

    const handleDurationPress = useCallback(
      ({item}) => {
        const newCheckOutTime = new Date(
          hourly.checkInTime.getTime() + item * 60 * 60 * 1000,
        );
        dispatch(setDuration({duration: item, tabName: 'hourly'}));
        dispatch(
          setCheckOutTime({checkOutTime: newCheckOutTime, tabName: 'hourly'}),
        );
      },
      [dispatch, hourly.checkInTime],
    );

    const handleTimeframePress = useCallback(
      ({item}) => {
        const itemString = item.timeString;
        const [hours, minutes] = itemString.split(':').map(Number);
        const newCheckInTime = new Date(hourly.checkInDate);
        newCheckInTime.setHours(hours);
        newCheckInTime.setMinutes(minutes);
        const newCheckOutTime = new Date(
          newCheckInTime.getTime() + hourly.duration * 60 * 60 * 1000,
        );
        dispatch(
          setCheckInTime({checkInTime: newCheckInTime, tabName: 'hourly'}),
        );
        dispatch(
          setCheckOutTime({checkOutTime: newCheckOutTime, tabName: 'hourly'}),
        );
        dispatch(
          setSelectedTimeframe({
            selectedTimeframe: item.timeString,
            tabName: 'hourly',
          }),
        );
      },
      [dispatch, hourly.checkInDate, hourly.duration],
    );

    const onPressDay = useCallback(
      day => {
        const dayString = day.dateString;
        dispatch(
          setCheckInDate({
            checkInDate: new Date(day.timestamp),
            tabName: 'hourly',
          }),
        );
        dispatch(
          setCheckOutDate({
            checkOutDate: new Date(day.timestamp),
            tabName: 'hourly',
          }),
        );
        dispatch(
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
        dispatch(
          setCurrentMonth({
            currentMonth: day.dateString.slice(0, 7),
            tabName: 'hourly',
          }),
        );
      },
      [dispatch],
    );

    const getTimeframeList = () => {
      formatTime(currentTime);
      const timeframeList = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`;

          const [itemHour, itemMinute] = timeString.split(':').map(Number);
          const [currentHour, currentMinute] = [
            currentTime.getHours(),
            currentTime.getMinutes(),
          ];

          const isDisabled =
            itemHour < currentHour ||
            (itemHour === currentHour && itemMinute < currentMinute);
          const listItem = {timeString, disabled: isDisabled};
          timeframeList.push(listItem);
        }
      }
      return timeframeList;
    };
    const timeframeList = getTimeframeList();
    console.log(timeframeList);

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
            data={timeframeList}
            keyExtractor={item => item.timeString}
            renderItem={
              ({item}) => (
                // item.disabled ? null : (
                <TimeframeItem
                  time={item.timeString}
                  disabled={item.disabled}
                  onPress={() => handleTimeframePress({item})}
                  selected={item.timeString === hourly.selectedTimeframe}
                />
              )
              // )
            }
          />
        </View>
      );
    };

    const TimeframeItem = React.memo(({time, disabled, onPress, selected}) => {
      return (
        <TouchableOpacity
          style={[
            styles.timeframeItem,
            {
              backgroundColor: selected ? colors.light : colors.lightgray,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          onPress={disabled ? null : onPress}
          disabled={disabled}>
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
              {format(hourly.checkInTime, hourly.checkInDate)}
            </Text>
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeTitle}>Check-out</Text>
            <Text style={styles.timeContent}>
              {format(hourly.checkOutTime, hourly.checkOutDate)}
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
      </View>
    );
  };

  const OverNight = () => {
    const overnight = useSelector(state => state.timestamp.overnight);
    const dispatch = useDispatch();

    const onPressDay = day => {
      const tomorrow = new Date(day.timestamp + 24 * 60 * 60 * 1000);
      const dayString = day.dateString;
      const tomorrowString = tomorrow.toISOString().split('T')[0];

      dispatch(
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

      dispatch(
        setCheckInDate({
          checkInDate: new Date(day.timestamp),
          tabName: 'overnight',
        }),
      );
      dispatch(
        setCheckOutDate({
          checkOutDate: new Date(tomorrow),
          tabName: 'overnight',
        }),
      );

      dispatch(
        setCurrentMonth({
          currentMonth: day.dateString.slice(0, 7),
          tabName: 'overnight',
        }),
      );
    };
    return (
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Text style={styles.timeTitle}>Check-in</Text>
            <Text style={styles.timeContent}>
              {format(overnight.checkInTime, overnight.checkInDate)}
            </Text>
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeTitle}>Check-out</Text>
            <Text style={styles.timeContent}>
              {format(overnight.checkOutTime, overnight.checkOutDate)}
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
    );
  };

  const Daily = () => {
    const daily = useSelector(state => state.timestamp.daily);
    const dispatch = useDispatch();

    return (
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Text style={styles.timeTitle}>Check-in</Text>
            <Text style={styles.timeContent} />
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeTitle}>Check-out</Text>
            <Text style={styles.timeContent} />
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeTitle}>Duration</Text>
          </View>
        </View>
        <CalendarList
          minDate={minDate}
          current={daily.currentMonth}
          enableSwipeMonths={true}
          markingType="period"
          markedDates={daily.markedDates}
        />
      </View>
    );
  };

  const handleApplyBtn = () => {};
  const CalendarPicker = ({name}) => {
    const isHourlyScreen = name === 'Hourly';
    const isOvernightScreen = name === 'Overnight';
    const isDailyScreen = name === 'Daily';
    return (
      <View style={styles.container}>
        {isHourlyScreen && <Hourly />}
        {isOvernightScreen && <OverNight />}
        {isDailyScreen && <Daily />}
        <TouchableOpacity style={styles.pickBtn} onPress={handleApplyBtn}>
          <Text style={styles.textBtn}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
        <Top.Screen name="Hourly">
          {() => <CalendarPicker name="Hourly" />}
        </Top.Screen>
        <Top.Screen name="Overnight">
          {() => <CalendarPicker name="Overnight" />}
        </Top.Screen>
        <Top.Screen name="Daily">
          {() => <CalendarPicker name="Daily" />}
        </Top.Screen>
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

  flatList: {
    paddingTop: 10,
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
  },
});

import {createSlice} from '@reduxjs/toolkit';
import {format, startOfDay} from 'date-fns';
import colors from '../../assets/consts/colors';

const now = new Date();
const ovnCheckIn = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  22,
  0,
  0,
);
const ovnCheckOut = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() + 1,
  12,
  0,
  0,
);
const dailyCheckIn = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  14,
  0,
  0,
);
const dailyCheckOut = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() + 1,
  10,
  0,
  0,
);

export const getTimeframeList = checkInDate => {
  const currentYear = new Date().getFullYear();
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentDate = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1; // Tháng tính từ 0, cần +1 để khớp với định dạng "dd/MM"
  const isCurrentDay =
    checkInDate ===
    `${currentDate.toString().padStart(2, '0')}/${currentMonth
      .toString()
      .padStart(2, '0')}/${currentYear.toString()}`;

  const timeframeList = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;

      const [itemHour, itemMinute] = timeString.split(':').map(Number);

      let isDisabled = false;
      if (isCurrentDay) {
        isDisabled =
          itemHour < currentHour ||
          (itemHour === currentHour && itemMinute < currentMinute);
      } else {
        isDisabled = false;
      }

      const listItem = {timeString, disabled: isDisabled};
      timeframeList.push(listItem);
    }
  }

  return timeframeList;
};

const initialState = {
  timeType: 'Hourly',
  checkIn: `${format(now, 'HH:mm')}, ${format(now, 'dd/MM/yyyy')}`,
  checkOut: `${format(now, 'HH:mm')}, ${format(now, 'dd/MM/yyyy')}`,
  hourly: {
    durationList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    duration: 1,
    checkInTime: format(now, 'HH:mm'),
    checkOutTime: format(now, 'HH:mm'),
    checkInDate: format(now, 'dd/MM/yyyy'),
    checkOutDate: format(now, 'dd/MM/yyyy'),
    checkIn: `${format(now, 'HH:mm')}, ${format(now, 'dd/MM/yyyy')}`,
    checkOut: `${format(now, 'HH:mm')}, ${format(now, 'dd/MM/yyyy')}`,
    markedDates: {
      [format(startOfDay(now), 'yyyy-MM-dd')]: {selected: true},
    },
    currentMonth: format(now, 'yyyy-MM'),
    timeFrameList: getTimeframeList(format(now, 'dd/MM/yyyy')),
    selectedTimeFrame: {},
  },
  overnight: {
    duration: 1,
    checkInTime: format(ovnCheckIn, 'HH:mm'),
    checkOutTime: format(ovnCheckOut, 'HH:mm'),
    checkInDate: format(ovnCheckIn, 'dd/MM/yyyy'),
    checkOutDate: format(ovnCheckOut, 'dd/MM/yyyy'),
    checkIn: `${format(ovnCheckIn, 'HH:mm')}, ${format(
      ovnCheckIn,
      'dd/MM/yyyy',
    )}`,
    checkOut: `${format(ovnCheckOut, 'HH:mm')}, ${format(
      ovnCheckOut,
      'dd/MM/yyyy',
    )}`,
    markedDates: {
      [format(ovnCheckIn, 'yyyy-MM-dd')]: {
        selected: true,
        startingDay: true,
        color: colors.light,
        textColor: colors.primary,
      },
      [format(ovnCheckOut, 'yyyy-MM-dd')]: {
        selected: true,
        endingDay: true,
        color: colors.light,
        textColor: colors.primary,
      },
    },
    currentMonth: format(now, 'yyyy-MM'),
  },
  daily: {
    duration: 1,
    checkInTime: format(dailyCheckIn, 'HH:mm'),
    checkOutTime: format(dailyCheckOut, 'HH:mm'),
    checkInDate: format(dailyCheckIn, 'dd/MM/yyyy'),
    checkOutDate: format(dailyCheckOut, 'dd/MM/yyyy'),
    checkIn: `${format(dailyCheckIn, 'HH:mm')}, ${format(
      dailyCheckIn,
      'dd/MM/yyyy',
    )}`,
    checkOut: `${format(dailyCheckOut, 'HH:mm')}, ${format(
      dailyCheckOut,
      'dd/MM/yyyy',
    )}`,
    markedDates: {
      [format(dailyCheckIn, 'yyyy-MM-dd')]: {
        selected: true,
        startingDay: true,
        color: colors.light,
        textColor: colors.primary,
      },
      [format(dailyCheckOut, 'yyyy-MM-dd')]: {
        selected: true,
        endingDay: true,
        color: colors.light,
        textColor: colors.primary,
      },
    },
    currentMonth: format(now, 'yyyy-MM'),
  },
};

const timestampSlice = createSlice({
  name: 'timestamp',
  initialState,
  reducers: {
    setTimeType: (state, {payload: timeType}) => {
      state.timeType = timeType;
    },
    setCheckIn: (state, {payload: checkIn}) => {
      state.checkIn = checkIn;
    },
    setCheckOut: (state, {payload: checkOut}) => {
      state.checkOut = checkOut;
    },
    setCheckInTab: (state, {payload: {checkIn, tabName}}) => {
      state[tabName].checkIn = checkIn;
    },
    setCheckOutTab: (state, {payload: {checkOut, tabName}}) => {
      state[tabName].checkOut = checkOut;
    },
    setDuration: (state, {payload: {duration, tabName}}) => {
      state[tabName].duration = duration;
    },
    setCheckInTime: (state, {payload: {checkInTime, tabName}}) => {
      state[tabName].checkInTime = checkInTime;
    },
    setCheckOutTime: (state, {payload: {checkOutTime, tabName}}) => {
      state[tabName].checkOutTime = checkOutTime;
    },
    setCheckInDate: (state, {payload: {checkInDate, tabName}}) => {
      state[tabName].checkInDate = checkInDate;
      if (tabName === 'hourly') {
        state.hourly.timeFrameList = getTimeframeList(checkInDate);
      }
    },
    setCheckOutDate: (state, {payload: {checkOutDate, tabName}}) => {
      state[tabName].checkOutDate = checkOutDate;
    },
    setMarkedDates: (state, {payload: {markedDates, tabName}}) => {
      state[tabName].markedDates = markedDates;
    },
    setCurrentMonth: (state, {payload: {currentMonth, tabName}}) => {
      state[tabName].currentMonth = currentMonth;
    },
    setSelectedTimeframe: (state, {payload: {selectedTimeFrame, tabName}}) => {
      state[tabName].selectedTimeFrame = selectedTimeFrame;
    },
  },
});

export const {
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
} = timestampSlice.actions;

export default timestampSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';
import colors from '../../assets/consts/colors';

const now = new Date();
const defaultCheckInTime = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  22,
  0,
  0,
);
const defaultCheckOutTime = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() + 1,
  12,
  0,
  0,
);

const initialState = {
  hourly: {
    durationList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    duration: 1,
    checkInTime: new Date(),
    checkOutTime: new Date(),
    checkInDate: new Date(),
    checkOutDate: new Date(),
    markedDates: Object.fromEntries([
      [new Date().toISOString().split('T')[0], {selected: true}],
    ]),
    currentMonth: new Date().toISOString().slice(0, 7),
    selectedTimeframe: {},
  },
  overnight: {
    duration: 1,
    checkInTime: defaultCheckInTime,
    checkOutTime: defaultCheckOutTime,
    checkInDate: defaultCheckInTime,
    checkOutDate: defaultCheckOutTime,
    markedDates: Object.fromEntries([
      [
        defaultCheckInTime.toISOString().split('T')[0],
        {
          selected: true,
          startingDay: true,
          color: colors.light,
          textColor: colors.primary,
        },
      ],
      [
        defaultCheckOutTime.toISOString().split('T')[0],
        {
          selected: true,
          endingDay: true,
          color: colors.light,
          textColor: colors.primary,
        },
      ],
    ]),
    currentMonth: new Date().toISOString().slice(0, 7),
  },
  daily: {
    duration: 1,
    checkInTime: defaultCheckInTime,
    checkOutTime: defaultCheckOutTime,
    checkInDate: defaultCheckInTime,
    checkOutDate: defaultCheckOutTime,
    markedDates: Object.fromEntries([
      [
        defaultCheckInTime.toISOString().split('T')[0],
        {
          selected: true,
          startingDay: true,
          color: colors.light,
          textColor: colors.primary,
        },
      ],
      [
        defaultCheckOutTime.toISOString().split('T')[0],
        {
          selected: true,
          endingDay: true,
          color: colors.light,
          textColor: colors.primary,
        },
      ],
    ]),
    currentMonth: new Date().toISOString().slice(0, 7),
  },
};

const timestampSlice = createSlice({
  name: 'timestamp',
  initialState,
  reducers: {
    setDuration: (state, {payload: {duration, tabName}}) => {
      state[tabName].duration = duration;
      const {checkInTime, duration: currentDuration} = state[tabName];
      const newCheckOutTime = new Date(
        checkInTime.getTime() + currentDuration * 60 * 60 * 1000,
      );
      state[tabName].checkOutTime = newCheckOutTime;
    },
    setCheckInTime: (state, {payload: {checkInTime, tabName}}) => {
      state[tabName].checkInTime = checkInTime;
    },
    setCheckOutTime: (state, {payload: {checkOutTime, tabName}}) => {
      state[tabName].checkOutTime = checkOutTime;
    },
    setCheckInDate: (state, {payload: {checkInDate, tabName}}) => {
      state[tabName].checkInDate = checkInDate;
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
    setSelectedTimeframe: (state, {payload: {selectedTimeframe, tabName}}) => {
      state[tabName].selectedTimeframe = selectedTimeframe;
    },
  },
});

export const {
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

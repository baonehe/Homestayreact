import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentLocation: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    // Thêm các reducers khác tại đây (nếu cần)
  },
});

export const {setCurrentLocation} = locationSlice.actions;

export default locationSlice.reducer;

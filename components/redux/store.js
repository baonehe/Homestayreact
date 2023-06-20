import {configureStore} from '@reduxjs/toolkit';
import timestampReducer from './timestampReducers';
import locationReducer from './locationReducer';

const store = configureStore({
  reducer: {
    timestamp: timestampReducer,
    location: locationReducer,
  },
});

export default store;

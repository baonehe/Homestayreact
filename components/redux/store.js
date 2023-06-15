import {configureStore} from '@reduxjs/toolkit';
import reducers from '../redux/reducers';

const store = configureStore({
  reducer: {
    timestamp: reducers,
  },
});

export default store;

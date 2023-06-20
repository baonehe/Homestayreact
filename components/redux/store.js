import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoritesSlice from './favoritesSlice';
import timestampReducer from './timestampReducers';
import locationReducer from './locationReducer';

const rootReducer = combineReducers({
  favorites: favoritesSlice,
  timestamp: timestampReducer,
  location: locationReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export {store, persistor};

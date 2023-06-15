import {combineReducers} from 'redux';
import favoritesReducer from '../redux/favoritesSlice';
import reducers from '../redux/reducers';

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  timestamp: reducers,
  // Add more reducers here if needed
});

export default rootReducer;

import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {addFavorite, removeFavorite} from './redux/favoritesSlice';

const FavoriteButton = ({item}) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites) || [];

  const isFavorite = favorites.some(
    favorite => favorite && favorite.homestay_id === item.homestay_id,
  );
  useEffect(() => {
    console.log('sfksdfkhdsfhdskjfhdsk', favorites);
  });
  const handleFavoritePress = () => {
    if (isFavorite) {
      dispatch(removeFavorite(item));
    } else {
      dispatch(addFavorite(item));
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleFavoritePress}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={40}
          color={isFavorite ? 'red' : 'white'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FavoriteButton;

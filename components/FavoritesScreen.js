// src/screens/FavoritesScreen.js

import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';

const FavoritesScreen = () => {
  const favorites = useSelector(state => state.favorites) || [];

  return (
    <View>
      <Text>Favorite Items:</Text>
      {favorites.length > 0 ? (
        favorites.map(item => (
          <View style={styles.card}>
            <Image
              style={styles.salesOffCardImage}
              source={{uri: item.image}}
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{color: 'black', maxWidth: 180}}
                numberOfLines={3}
                key={item.id}>
                {item.name}
              </Text>
              <Text>{item.price} $</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>No favorite items found.</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    height: 200,
    width: 350,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  salesOffCardImage: {
    height: 150,
    width: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});
export default FavoritesScreen;

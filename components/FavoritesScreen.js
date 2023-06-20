// src/screens/FavoritesScreen.js

import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

const FavoritesScreen = ({navigation}) => {
  const favorites = useSelector(state => state.favorites) || [];

  return (
    <View>
      {favorites.length > 0 ? (
        favorites.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('DetailHomestay', item)}>
            <View
              style={[
                styles.card,
                index !== favorites.length - 1 && styles.divider,
              ]}>
              <Image
                style={styles.salesOffCardImage}
                source={{uri: item.image}}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={3}>
                  {item.name}
                </Text>
                <Text style={styles.cardPrice}>{item.price} $</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noItemsText}>No favorite items found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  salesOffCardImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    color: 'black',
    fontSize: 16,
    maxWidth: 190,
    marginBottom: 10,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  noItemsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
export default FavoritesScreen;

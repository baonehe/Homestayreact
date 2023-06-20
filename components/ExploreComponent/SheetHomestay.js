import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../assets/consts/colors';
import sizes from '../../assets/consts/sizes';

const SheetHomestay = ({
  navigation,
  homestays,
  sheetRefOpen,
  setSheetRefOpen,
  handleRefPress,
}) => {
  const sheetRef = useRef(null);

  // variables
  const snapRefPoints = useMemo(() => ['15%', '50%', '93%'], []);

  // callbacks
  const handleRefChange = useCallback(index => {
    if (index === 0) {
      setSheetRefOpen(false);
    } else {
      setSheetRefOpen(true);
    }
  }, []);
  const handleRefPress = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  // render
  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailHomestay', item)}>
        <View style={styles.itemCard}>
          <View style={styles.itemImageContainer}>
            <Image style={styles.itemImage} source={{uri: item.image}} />
          </View>
          <View style={styles.itemInfor}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.itemName}>
              {item.name}
            </Text>
            <Text style={styles.itemSlogan}>{item.slogan}</Text>
            <View style={styles.itemDistanceContainer}>
              <Text style={styles.itemDistance}>2.5km</Text>
              <Ionicons
                name="location-sharp"
                size={sizes.iconTiny}
                color={colors.gray}
              />
            </View>
            <View style={styles.itemRatingContainer}>
              <Text style={styles.itemRating}>{item.rating}</Text>
              <Text style={styles.itemRatingVote}>{item.ratingvote}</Text>
              <Ionicons
                name="star"
                size={sizes.iconTiny}
                color={colors.secondary}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={2}
      snapPoints={snapRefPoints}
      onChange={handleRefChange}>
      <BottomSheetFlatList
        data={homestays}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList}
      />
    </BottomSheet>
  );
};

export default SheetHomestay;

const styles = StyleSheet.create({});

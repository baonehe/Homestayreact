import React from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import hotels from '../assets/data/hotels';
import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';

const Top = createMaterialTopTabNavigator();

const TopTabsNavigator = ({navigation}) => {
  const DetailItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailHomestay', item)}>
        <View style={styles.itemCard}>
          <View style={styles.itemImageContainer}>
            <Image style={styles.itemImage} source={item.image} />
          </View>
          <View style={styles.itemInfor}>
            <Text style={styles.itemName}>{item.name}</Text>
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
    );
  };
  const ListItem = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={hotels}
          vertical
          contentContainerStyle={styles.flatList}
          renderItem={({item}) => <DetailItem item={item} />}
        />
      </ScrollView>
    );
  };

  return (
    <Top.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.black,
        tabBarAllowFontScaling: true,
        tabBarPressColor: colors.transparent,
        tabBarIndicatorStyle: styles.tabBarIndicator,
      }}>
      <Top.Screen name="Near you" component={ListItem} />
      <Top.Screen name="Trending" component={ListItem} />
      <Top.Screen name="For sales" component={ListItem} />
    </Top.Navigator>
  );
};

export default TopTabsNavigator;

const styles = StyleSheet.create({
  tabBar: {
    shadowColor: colors.transparent,
    borderRadius: 35,
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 8,
    marginHorizontal: 30,
  },
  tabBarLabel: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
    fontWeight: 700,
    alignSelf: 'flex-start',
  },
  tabBarIndicator: {
    backgroundColor: colors.light,
    height: 30,
    width: 90,
    justifyContent: 'center',
    verticalAlign: 'middle',
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 35,
  },

  flatList: {
    marginTop: 15,
    paddingBottom: 30,
  },
  itemCard: {
    height: 120,
    width: 345,
    backgroundColor: colors.white,
    marginBottom: 30,
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  itemImage: {
    height: '100%',
    width: '100%',
    borderRadius: 12,
  },
  itemImageContainer: {
    height: 105,
    width: 105,
  },

  itemInfor: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 25,
    borderBottomWidth: 1,
    borderColor: colors.gray2,
  },
  itemName: {
    fontSize: 19,
    fontFamily: 'Merriweather-Bold',
    color: colors.primary,
  },
  itemSlogan: {
    fontSize: sizes.fontLarge,
    fontFamily: 'Lato-Regular',
    color: colors.gray,
    marginTop: 10,
  },

  itemDistanceContainer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  itemDistance: {
    fontSize: 13,
    fontFamily: 'Lato-Regular',
    color: colors.gray,
    marginHorizontal: 3,
  },

  itemRatingContainer: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  itemRating: {
    fontSize: 13,
    fontFamily: 'Lato-Black',
    color: colors.black,
  },
  itemRatingVote: {
    fontSize: 13,
    fontFamily: 'Lato-Regular',
    color: colors.gray,
    marginHorizontal: 3,
  },
});

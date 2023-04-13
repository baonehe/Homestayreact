import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';
import TopTabsNavigator2 from '../navigators/TopTabsNavigator2';

const Notification = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons
            name="arrow-back-ios"
            size={sizes.iconExtraSmall}
            color={colors.dark}
            onPress={navigation.goBack}
          />
        </View>
        <Text style={styles.titleScreen}>Notification</Text>
        <View style={styles.headerRight}>
          <Ionicons
            name="checkmark-done"
            size={sizes.iconSmall}
            color={colors.lightblack}
          />
        </View>
      </View>
      <TopTabsNavigator2 />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleScreen: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.dark,
    textAlign: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

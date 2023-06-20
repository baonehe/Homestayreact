import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../assets/consts/colors';
import TopTabsNavigator from '../../navigators/TopTabsNavigator';

const Suggest = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleScreen}>For You</Text>
      </View>
      <TopTabsNavigator navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
  },
  header: {},
  titleScreen: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.dark,
    alignSelf: 'center',
  },
});
export default Suggest;

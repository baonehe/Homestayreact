import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomFabBar} from 'rn-wave-bottom-bar';
import Icon from 'react-native-vector-icons/AntDesign';
import Home from '../components/ExploreComponent/HomeScreen';
import Suggest from '../components/SuggestionComponent/SuggestScreen';
import FastBooking from '../components/FastBookingComponent/FastBookingScreen';
import Rewards from '../components/RewardComponent/RewardsScreen';
import Account from '../components/AccountComponent/AccountScreen';
import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';
import {presets} from '../babel.config';

const Bottom = createBottomTabNavigator();

function BottomTabs(props) {
  return (
    <Bottom.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarActiveBackgroundColor: colors.dark,
        tabBarInactiveTintColor: colors.white,
        tabBarStyle: styles.tabBar,
      }}
      tabBar={props => (
        <BottomFabBar
          mode={'default'}
          isRtl={false}
          // Add Shadow for active tab bar button
          focusedButtonStyle={styles.tabBarFocusedButton}
          // - You can add the style below to show screen content under the tab-bar
          // - It will makes the "transparent tab bar" effect.
          bottomBarContainerStyle={styles.tabBarBottomContainer}
          {...props}
        />
      )}>
      <Bottom.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="home"
              size={sizes.iconMedium}
              color={focused ? colors.yellow : colors.white}
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Bottom.Screen
        name="Suggest"
        component={Suggest}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="staro"
              size={sizes.iconMedium}
              color={focused ? colors.yellow : colors.white}
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Bottom.Screen
        name="Fast Booking"
        component={FastBooking}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="rocket1"
              size={sizes.iconMedium}
              color={focused ? colors.yellow : colors.white}
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Bottom.Screen
        name="Rewards"
        component={Rewards}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="gift"
              size={sizes.iconMedium}
              color={focused ? colors.yellow : colors.white}
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Bottom.Screen
        name="Account"
        initialParams={{email: props.email}}
        component={Account}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="user"
              size={sizes.iconMedium}
              color={focused ? colors.yellow : colors.white}
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
    </Bottom.Navigator>
  );
}

const BottomTabsNavigator = ({route}) => {
  const {email} = route.params;
  return <BottomTabs email={email} />;
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    shadow: true,
  },
  tabBarIcon: {
    alignItems: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  tabBarBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarFocusedButton: {
    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
});
export default BottomTabsNavigator;

import React from 'react';
import {StyleSheet} from 'react-native';
import Home from './components/HomeScreen';
import Suggest from './components/SuggestScreen';
import FastBooking from './components/FastBookingScreen';
import Rewards from './components/RewardsScreen';
import Account from './components/AccountScreen';
import Notification from './components/NotiScreen';
import Login from './components/SignInScreen';
import SignUp from './components/SignUpScreen';
import DetailHomestay from './components/DetailHomestayScreen';
import colors from './assets/consts/colors';
import sizes from './assets/consts/sizes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import {BottomFabBar} from 'rn-wave-bottom-bar';

// import {
//   AnimatedTabBarNavigator,
//   // DotSize,
//   // TabButtonLayout,
//   // IAppearanceOptions,
// } from 'react-native-animated-nav-tab-bar';

MaterialCommunityIcons.loadFont();

const Stack = createNativeStackNavigator();
// const Tabs = AnimatedTabBarNavigator();
const Tabs = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tabs.Navigator
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
      <Tabs.Screen
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
      <Tabs.Screen
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
      <Tabs.Screen
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
      <Tabs.Screen
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
      <Tabs.Screen
        name="Account"
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
    </Tabs.Navigator>
  );
}

const myTheme = {
  colors: {
    background: colors.white,
  },
};

const App = () => {
  return (
    <NavigationContainer theme={myTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailHomestay"
          component={DetailHomestay}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
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
export default App;

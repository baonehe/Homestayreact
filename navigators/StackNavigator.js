import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Notification from '../components/NotiScreen';
import Login from '../components/SignInScreen';
import SignUp from '../components/SignUpScreen';
import DetailHomestay from '../components/DetailHomestayScreen';
import SearchHomestay from '../components/SearchHomestayScreen';
import NotificationSetting from '../AccountScreenComponent/NotificationSetting';
import BottomTabsNavigator from './BottomTabsNavigator';
import TopTabsNavigator from './TopTabsNavigator';
import colors from '../assets/consts/colors';
import Information from '../AccountScreenComponent/Information';

const Stack = createNativeStackNavigator();
const myTheme = {
  colors: {
    background: colors.white,
  },
};
function StackTabs() {
  return (
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
        name="Information"
        component={Information}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="BottomTabsNavigator"
        component={BottomTabsNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TopTabsNavigator"
        component={TopTabsNavigator}
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
      <Stack.Screen
        name="SearchHomestay"
        component={SearchHomestay}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationSetting"
        component={NotificationSetting}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
  );
}
const StackNavigator = () => {
  return (
    <NavigationContainer theme={myTheme}>
      <StackTabs />
    </NavigationContainer>
  );
};

export default StackNavigator;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Notification from '../components/ExploreComponent/NotiScreen';
import Login from '../components/LoginComponent/SignInScreen';
import SignUp from '../components/LoginComponent/SignUpScreen';
import DetailHomestay from '../components/ExploreComponent/DetailHomestayScreen';
import SearchHomestay from '../components/ExploreComponent/SearchHomestayScreen';
import NotificationSetting from '../components/AccountComponent/NotificationSetting';
import BottomTabsNavigator from './BottomTabsNavigator';
import TopTabsNavigator from './TopTabsNavigator';
import colors from '../assets/consts/colors';
import DetailsReward from '../components/RewardComponent/DetailReward';
import Information from '../components/AccountComponent/Information';
import FastBookingDetailHotel from '../components/FastBookingComponent/FastBookingDetailHotelScreen';
import FavoritesScreen from '../components/FavoritesScreen';
import History from '../components/AccountComponent/History';
import PayScreen from '../components/ExploreComponent/PayScreen'
import ForgotPasswordScreen from '../components/LoginComponent/ForgotPasswordScreen';

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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Information"
        component={Information}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="BottomTabsNavigator"
        component={BottomTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TopTabsNavigator"
        component={TopTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailHomestay"
        component={DetailHomestay}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchHomestay"
        component={SearchHomestay}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationSetting"
        component={NotificationSetting}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="FastBookingDetailHotel"
        component={FastBookingDetailHotel}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailsReward"
        component={DetailsReward}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payment"
        component={PayScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="HistoryScreen" component={History} />
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

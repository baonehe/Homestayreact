import React from 'react';
import 'react-native-gesture-handler';
import StackNavigator from './navigators/StackNavigator';
import store from './components/redux/store';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// import {
//   AnimatedTabBarNavigator,
//   // DotSize,
//   // TabButtonLayout,
//   // IAppearanceOptions,
// } from 'react-native-animated-nav-tab-bar';

// // const Tabs = AnimatedTabBarNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <StackNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;

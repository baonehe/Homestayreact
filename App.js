import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import StackNavigator from './navigators/StackNavigator';
import {store, persistor} from './components/redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  requestUserPermission,
  NotificationListener,
} from './components/NotificationComponent/PushNotiHelper';

// import {
//   AnimatedTabBarNavigator,
//   // DotSize,
//   // TabButtonLayout,
//   // IAppearanceOptions,
// } from 'react-native-animated-nav-tab-bar';

// // const Tabs = AnimatedTabBarNavigator();

const App = () => {
  useEffect(() => {
    requestUserPermission();
    NotificationListener();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <StackNavigator />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;

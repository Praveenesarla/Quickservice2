import 'react-native-reanimated';
import 'react-native-get-random-values';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {Provider} from 'react-redux';

import QuickRide from './src/screens/QuickRide';
import HomeScreen from './src/screens/HomeScreen';
import WalletScreen from './src/screens/WalletScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import OrderStatus from './src/screens/OrderStatus';
import ServicesBookNow from './src/screens/ServicesBookNow';
import RidePickup from './src/screens/RidePickup';

import {UserProvider, useUser} from './src/context/UserContext';
import store from './src/redux/slices/store';
import {Image, View} from 'react-native';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tabs (Bottom Navigation)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({color, size}) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Quick Ride') iconName = 'motorcycle';
        else if (route.name === 'Wallet') iconName = 'account-balance-wallet';
        else if (route.name === 'Profile') iconName = 'person';
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#B82929',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Quick Ride" component={RidePickup} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main Stack Navigation
const MainStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="Ride" component={QuickRide} />
    <Stack.Screen name="OrderStatus" component={OrderStatus} />
    <Stack.Screen name="ServicesBookNow" component={ServicesBookNow} />
  </Stack.Navigator>
);

// Authentication Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const App = () => {
  const {user} = useUser();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        {user ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
  );
};

export default () => (
  <UserProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </UserProvider>
);

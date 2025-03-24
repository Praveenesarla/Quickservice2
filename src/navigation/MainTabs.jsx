import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import HomeScreen from '../screens/HomeScreen';
import QuickRide from '../screens/QuickRide';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

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
    <Tab.Screen name="Quick Ride" component={QuickRide} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainTabs;

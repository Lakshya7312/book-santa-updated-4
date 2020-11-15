import React, { Component } from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import SideDrawer from './SideDrawer';
import { AppTabNavigator } from './AppTabNavigator';
import SettingScreen from '../screens/SettingScreen';
import AllNotifications from '../screens/AllNotifications';
import MyDonations from '../screens/MyDonations';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator,
    },
    Notifications: {
        screen: AllNotifications
    },
    MyDonations: {
        screen: MyDonations
    },
    Settings: {
        screen: SettingScreen,
    },
},
    { contentComponent: SideDrawer },
    {
        initialRouteName: "Home"
    }
)
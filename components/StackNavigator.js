import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import DonateScreen from '../screens/DonateScreen';
import ReceiverDetails from '../screens/ReceiverDetails';

export const navigator = createStackNavigator({
    DonateBook: {
        screen: DonateScreen,
        navigationOptions: {
            headerShown: false
        }
    },

    ReceiverDetails: {
        screen: ReceiverDetails,
        navigationOptions: {
            headerShown: false
        }
    }
},
    {
        initialRouteName: "DonateBook"
    }
);
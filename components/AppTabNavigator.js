import React, { Component } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import RequestScreen from '../screens/RequestScreen';
import DonateScreen from '../screens/DonateScreen';

export const AppTabNavigator = createBottomTabNavigator({
  RequestScreen: {
    screen: RequestScreen,
    navigationOptions: {
      tabBarIcon: <Image source={require('../assets/request-book.png')} />,
      tabBarLabel: "Request a Book"
    }
  },
  DonateScreen: {
    screen: DonateScreen,
    navigationOptions: {
      tabBarIcon: <Image source={require('../assets/request-list.png')} />,
      tabBarLabel: "Donate a Book"
    }
  }
})

const AppContainer = createAppContainer(AppTabNavigator);
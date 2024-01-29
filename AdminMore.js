// src/MainApp.js
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { View, Text } from 'react-native';
import AdminMoreScreen from './AdminMore';

// ... (InventoryScreen, FeedbackScreen, SettingsScreen components)

// Admin More Screen
class AdminMoreScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>Admin More Screen</Text>
      </View>
    );
  }
}

// Stack Navigator for Admin More Screen
const AdminMoreStack = createStackNavigator({
  AdminMore: AdminMoreScreen,
});

// Bottom Tab Navigator
const TabNavigator = createBottomTabNavigator(
  {
    Inventory: InventoryScreen,
    Feedback: FeedbackScreen,
    Settings: SettingsStack,
    AdminMore: AdminMoreStack,
  },
  {
    initialRouteName: 'Inventory',
  }
);

export default createAppContainer(TabNavigator);

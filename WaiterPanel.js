import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './Waiter/Waiter';
import AssignScreen from './Waiter/Assign';
import OrderScreenWaiter from './Waiter/order';
import StatusScreen from './Waiter/Status';
import BillScreen from './Waiter/bill';

const Tab = createBottomTabNavigator();

const WaiterPanel = () => {
  return (
    <Tab.Navigator initialRouteName="Order">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Table"
        component={AssignScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-plus" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreenWaiter}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="clipboard-text" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="checkbox-marked-circle" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Bill"
        component={BillScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default WaiterPanel;

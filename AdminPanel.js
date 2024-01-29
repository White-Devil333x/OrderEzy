import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BillingScreen from './Billing';
import InventoryScreen from './Inventory';
import UserScreen from './UserManagement';
import FeedbackScreen from './AdminFeedback';
import OrderScreen from './OrderManagement';
import WMenu from './WMenu';

const Tab = createBottomTabNavigator();

const AdminPanel = () => {
  return (
    <Tab.Navigator initialRouteName="Order Management">
      <Tab.Screen
        name="Bill"
        component={BillingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="package" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Order Management"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="clipboard-list" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Staff"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="WMenu"
        component={WMenu}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="silverware" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminPanel;

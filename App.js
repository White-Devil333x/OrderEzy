import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Registration from './Registration';
import Login from './login';
import Home from './Home';
import Inventory from './Inventory';
import FeedbackPage from './FeedbackPage';
import NextPage from './NextPage';
import Forgotpass from './Forgotpass';
import AdminPanel from './AdminPanel';
import Billing from './Billing';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import AdminFeedback from './AdminFeedback';
import TableManagement from './TableManagement';
import WMenu from './WMenu';
import WaiterPage from './WaiterPage';

// Import your Waiter screens/components
import HomeScreen from './Waiter/Waiter';
import AssignScreen from './Waiter/Assign';
import OrderScreen from './Waiter/order';
import StatusScreen from './Waiter/Status';
import BillScreen from './Waiter/bill';
import BottomMenu from './Waiter/BottomMenu';
import WaiterPanel from './WaiterPanel';


import ChefMod from './ChefMod';

const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'OrderEzy',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="Registration"
        component={Registration}
        options={{
          title: 'Sign Up',
          headerLeft:null,
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Sign In',
          headerLeft:null,
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />

      <Stack.Screen
        name="AdminPanel"
        component={AdminPanel}
        options={{
          title: 'Admin Panel',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="Inventory"
        component={Inventory}
        options={{
          title: 'Inventory',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackPage}
        options={{
          title: 'Feedback',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="NextPage"
        component={NextPage}
        options={{
          title: 'NextPage',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="Forgotpass"
        component={Forgotpass}
        options={{
          title: 'Forgot Password',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />

      <Stack.Screen
        name="Billing"
        component={Billing}
        options={{
          title: 'Billing',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="OrderManagement"
        component={OrderManagement}
        options={{
          title: 'OrderManagement',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagement}
        options={{
          title: 'User Management',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />

      <Stack.Screen
        name="AdminFeedback"
        component={AdminFeedback}
        options={{
          title: 'Admin Feedback',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />

    <Stack.Screen
        name="TableManagement"
        component={TableManagement}
        
        options={{
          title: 'Table Management',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="WMenu"
        component={WMenu}
        
        options={{
          title: 'Table Management',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      
      <Stack.Screen
        name="WaiterPage"
        component={WaiterPage}
        
        options={{
          title: 'WaiterPage',
          headerStyle: {
            backgroundColor: 'orange',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
          <Stack.Screen name="WaiterHome" component={HomeScreen} />
          <Stack.Screen name="Assign" component={AssignScreen} />
          <Stack.Screen name="Order" component={OrderScreen} />
          <Stack.Screen name="Status" component={StatusScreen} />
          <Stack.Screen name="Bill" component={BillScreen} />
          <Stack.Screen name="BottomMenu" component={BottomMenu} />
          <Stack.Screen name="WaiterPanel" component={WaiterPanel} />


          <Stack.Screen name="ChefMod" component={ChefMod} />
    </Stack.Navigator>

  );
}

export default function AppContainer() {
  return (
    <NavigationContainer>
      <MainStackNavigator />
     
    </NavigationContainer>
  );
}

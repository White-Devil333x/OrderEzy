// WaiterPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WaiterPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Waiter!</Text>
      {/* Add more content for the WaiterPage */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WaiterPage;

// src/RestaurantHomeScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

class RestaurantHomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayImage: null,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Restaurant Management System</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ displayImage: 'menu' });
            }}
          >
            <Text style={styles.buttonText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ displayImage: 'menuQR' });
            }}
          >
            <Text style={styles.buttonText}>Menu QR</Text>
          </TouchableOpacity>
        </View>
        {this.state.displayImage === 'menu' && (
          <Image source={require('./assets/menu.png')} style={styles.image} />
        )}
        {this.state.displayImage === 'menuQR' && (
          <Image source={require('./assets/MenuQR.png')} style={styles.image} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300,
  },
});

export default RestaurantHomeScreen;

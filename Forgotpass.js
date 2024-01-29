import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // ...
const handleSendPassword = async () => {
  if (email === '') {
    Alert.alert("Email Required");
  } else if (!validateEmail(email)) {
    setEmailError('Enter a valid email address');
  } else {
    setEmailError('');

    try {
      // Make an API call to your server to send the email
      const response = await fetch('http://192.168.102.62:3001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toEmail: email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Optionally, you may want to navigate to the next page or show a success message
        navigation.navigate('NextPage');
      } else {
        Alert.alert('Error', 'Failed to send password email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending password email:', error);
      Alert.alert('Error', 'Failed to send password email. Please try again.');
    }
  }
};
// ...


  const validateEmail = (input) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(input);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OrderEzy</Text>
      <TextInput
        style={styles.inputem}
        placeholder="Email Address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError('');
        }}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TouchableOpacity onPress={handleSendPassword} style={styles.button}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffdab9', // Background color of the container
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  inputem: {
    width: 300,
    height: 60,
    borderWidth: 1,
    borderColor: '#888', // Border color
    padding: 10,
    marginVertical: 20,
    borderRadius: 30, // Border radius
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'orange', // Button background color
    padding: 10,
    borderRadius: 10, // Button border radius
    width: 150, // Button width
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  // Other styles you may add
});


export default ForgotPassword;

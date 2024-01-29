import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Example: Using FontAwesome icons
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

const Registration = () => {

  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [role, setRole] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [contactNoError, setContactNoError] = useState('');

  const handleSignUp = async () => {
    try {
      if (firstName === '' || lastName === '' || email === '' || password === '' || contactNo === '' || role === '') {
        Alert.alert("You are Missing Something!");
      } else {
        // Define your registration query
        const registrationQuery = `INSERT INTO registration (First_Name, Last_Name, Email, Password, Contact_No, U_Role) VALUES (?, ?, ?, ?, ?, ?)`;

        // Make a request to the server to execute the registration query
        const response = await axios.post(
          'http://192.168.174.62:3001/api/query',
          {
            query: registrationQuery,
            values: [firstName, lastName, email, password, contactNo, role],
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }
        );

        console.log(response.data);

        if (response.data.success) {
          // Registration successful, navigate to the respective page based on the role
          if (role === 'waiter') {
            navigation.navigate('Waiter');
          } else if (role === 'chef') {
            navigation.navigate('WaiterPanel');
          }
        } else {
          Alert.alert("Registration Failed", response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Registration Failed", "An error occurred during registration.");
    }
  };
  

  const validateFirstName = (text) => {
    if (!text.match(/^[a-zA-Z]+$/)) {
      setFirstNameError('First name should only contain Characters.');
    } else {
      setFirstNameError('');
    }
    setFirstName(text);
  };

  const validateLastName = (text) => {
    if (!text.match(/^[a-zA-Z]+$/)) {
      setLastNameError('Last name should only contain Characters.');
    } else {
      setLastNameError('');
    }
    setLastName(text);
  };

  const validateEmail = (text) => {
    // A simple email validation regex
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!email.match(emailRegex)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
    setEmail(text);
  };

  const validatePassword = (text) => {
    if (text.length < 8 || !/[0-9]/.test(text) || !/[!@#$%^&*]/.test(text)) {
      setPasswordError('Password must be at least 8 characters and contain numbers and special symbols.');
    } else {
      setPasswordError('');
    }
    setPassword(text);
  };

  const validateContactNo = (text) => {
    if (!text.match(/^[0-9]+$/) || text.length !== 10) {
      setContactNoError('Contact number should contain exactly 10 digits.');
    } else {
      setContactNoError('');
    }
    setContactNo(text);
  };

  return (
    <View style={styles.container}>
     
      <ScrollView style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="orange" style={styles.iconcont} />
          <TextInput
            style={styles.input}
            placeholder=" First Name"
            value={firstName}
            onChangeText={validateFirstName}
          />
        </View>
        {firstNameError !== '' && <Text style={styles.errorText}>{firstNameError}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="orange" style={styles.iconcont}/>
          <TextInput
            style={styles.input}
            placeholder=" Last Name"
            value={lastName}
            onChangeText={validateLastName}
          />
        </View>
        {lastNameError !== '' && <Text style={styles.errorText}>{lastNameError}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="orange" style={styles.iconcont}/>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={validateEmail}
          />
        </View>
        {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="orange" style={styles.iconcont}/>
          <TextInput
            style={styles.input}
            placeholder=" Password"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry
          />
        </View>
        {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="orange" style={styles.iconcont}/>
          <TextInput
            style={styles.input}
            placeholder="Contact No"
            value={contactNo}
            onChangeText={validateContactNo}
          />
        </View>
        {contactNoError !== '' && <Text style={styles.errorText}>{contactNoError}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="orange" style={styles.iconcont}/>
          <Picker
          style={styles.inputpicker}
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
            >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Waiter" value="waiter" />
            <Picker.Item label="Chef" value="chef" />
          </Picker>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.alreadytext}>Already Have an Account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
 
  image: {
    width: 300,
    height: 200,
  },
  formContainer: {
    width: '80%',
    marginTop: '50%',
    borderColor:'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  inputpicker:{
    flex: 1,
    height:40,
    paddingHorizontal: 10,
    color: "gray"
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    width:'70%',
    marginLeft:55,
    marginTop:25
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  iconcont:{
    margin:5,
  },
  alreadytext:{
    color:"gray",
    marginLeft:70,
    marginTop:20,
  },
});

export default Registration;

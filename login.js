import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlesforgot = () =>{
    
    navigation.navigate('Forgotpass');
  }
  const handleEmailChange = (text) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
    if (!text.match(emailRegex)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    // Validate password on every change
    const hasSymbol = /[\!@\#%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(text);
    const hasNumber = /[0-9]/.test(text);

    if (text.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (!hasSymbol) {
      setPasswordError("Password must include at least one symbol.");
    } else if (!hasNumber) {
      setPasswordError("Password must include at least one number.");
    } else {
      setPasswordError("");
    }
    setPassword(text);
  };
  const handleSignIn = async () => {
   

    try {
      // Check if email and password are not empty
      if (email === '' || password === '') {
        Alert.alert("Please enter both email and password.");
        return;
      }

      if (email == "Admin" && password == "Admin") {
        navigation.navigate('AdminPanel'); // Replace 'NextPage' with the name of the screen you want to navigate to
      } 
      // Define your login query
      const loginQuery = `SELECT * FROM registration WHERE Email = ? AND Password = ?`;

      // Make a request to the server to execute the login query
      const response = await axios.post(
        'http://192.168.102.62:3001/api/query',
        {
          query: loginQuery,
          values: [email, password],
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
        // Login successful, navigate to the respective page based on the role
        const user = response.data.results[0];
        if (user && user.U_Role === 'waiter') {
          navigation.navigate('WaiterPanel');
        } else if (user && user.U_Role === 'chef') {
          navigation.navigate('ChefMod');
        } else {
          Alert.alert("Unknown role", "The user has an unknown role.");
        }
      } else {
        Alert.alert("Login Failed", "Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login Failed", "An error occurred during login.");
    }
  };

 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.inputem}
        placeholder="Email Address"
        onChangeText={handleEmailChange}
        value={email}
      />
      <TextInput
        style={styles.inputpass}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={handlePasswordChange}
        value={password}
      />
      <TouchableOpacity  onPress={handlesforgot}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      
    </View>
  );
};

// Your styles remain the same...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffdab9",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  inputem: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 30,
    
  },
  inputpass: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop:20,
    marginBottom: 10,
    borderRadius: 30,
  
  },
  button: {
    backgroundColor: "orange",
    padding: 10,
    marginTop: 40,
    borderRadius: 30,
    paddingHorizontal: 60,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    marginLeft: 150,
    marginTop: 10,
    color: "gray",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});


export default SignIn;

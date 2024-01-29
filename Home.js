import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  const handleSignUp = () => {
    navigation.navigate('Registration');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };  

  const handleadmin = () =>{
    navigation.navigate('AdminPanel');
  };

  const handlemenu = () =>{
    navigation.navigate('WMenu');
  };
  
  return (
    <View style={styles.container}>

        <Image source={require('./assets/homeimg.png')} style={styles.logo} />

      <Text style={styles.title}>OrderEzy</Text>
      <Text style={styles.subtitle}>Efficiently manage your restaurant with</Text>
      <Text style={styles.subtitle2}>OrderEzy</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
  },
  logo: {
    width: 250,
    height: 250,
    
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 0,
  },
  subtitle2: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 30,
    margin:10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Home;
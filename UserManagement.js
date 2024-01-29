import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';

const UserManagement = () => {
  const Navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ U_ID: null, First_Name: '', Last_Name: '', Email: '', U_Role: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch and display users when the component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Define your custom query to fetch users from the database
      const getUsersQuery = `SELECT U_ID, First_Name, Last_Name, Email, U_Role FROM registration`;

      // Make a request to the server to execute the query
      const response = await axios.post(
        'http://192.168.216.62:3001/api/query',
        {
          query: getUsersQuery,
          values: [],
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
        // Set the users state with the fetched data
        setUsers(response.data.results);
      } else {
        Alert.alert('Error', 'Failed to fetch users from the database.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching users.');
    }
  };

  const handleAddUser = async () => {
    try {
      // Define your custom query to insert a new user into the database
      const addUserQuery = `INSERT INTO registration (username, email, role) VALUES (?, ?, ?)`;

      // Make a request to the server to execute the query
      const response = await axios.post(
        'http://192.168.216.62:3001/api/query',
        {
          query: addUserQuery,
          values: [newUser.username, newUser.email, newUser.role],
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
        // Fetch and display updated users after adding a new user
        fetchUsers();
        setNewUser({ id: null, username: '', email: '', role: '' });
      } else {
        Alert.alert('Error', 'Failed to add a new user.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding a new user.');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      // Define your custom query to delete a user from the database
      const deleteUserQuery = `DELETE FROM registration WHERE U_ID = ?`;

      // Make a request to the server to execute the query
      const response = await axios.post(
        'http://192.168.216.62:3001/api/query',
        {
          query: deleteUserQuery,
          values: [id],
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
        // Fetch and display updated users after deleting a user
        fetchUsers();
      } else {
        Alert.alert('Error', 'Failed to delete the user.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while deleting the user.');
    }
  };

  const handleEditUser = (id) => {
    // Find the selected user from the state and update the newUser state
    const selectedUser = users.find((user) => user.U_ID === id);
  
    if (selectedUser) {
      setNewUser({
        U_ID: selectedUser.U_ID,
        First_Name: selectedUser.First_Name,
        Last_Name: selectedUser.Last_Name,
        Email: selectedUser.Email,
        U_Role: selectedUser.U_Role,
      });
    } else {
      Alert.alert("User not found");
    }
  };
  
  

  const handleUpdateUser = async () => {
    try {
      // Define your custom query to update a user in the database
      const updateUserQuery = `UPDATE registration SET First_Name = ?, Last_Name = ?, Email = ?, U_Role = ? WHERE U_ID = ?`;
  
      // Make a request to the server to execute the query
      const response = await axios.post(
        'http://192.168.216.62:3001/api/query',
        {
          query: updateUserQuery,
          values: [newUser.First_Name, newUser.Last_Name, newUser.Email, newUser.U_Role, newUser.U_ID],
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
        // Fetch and display updated users after updating a user
        fetchUsers();
        setNewUser({ U_ID: null, First_Name: '', Last_Name: '', Email: '', U_Role: '' });
      } else {
        Alert.alert('Error', 'Failed to update the user.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while updating the user.');
    }
  };
  

  const handleSearch = async () => {
    // Perform search logic based on the searchTerm
    // For simplicity, this example performs a case-insensitive search in usernames and emails
    try {
      // Define your custom query to search for users in the database
      const searchUsersQuery = `SELECT * FROM registration WHERE LOWER(username) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?)`;

      // Make a request to the server to execute the query
      const response = await axios.post(
        'http://192.168.216.62:3001/api/query',
        {
          query: searchUsersQuery,
          values: [`%${searchTerm}%`, `%${searchTerm}%`],
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
        // Set the users state with the search results
        setUsers(response.data.results);
      } else {
        Alert.alert('Error', 'Failed to perform the search.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while performing the search.');
    }
  };

  const handleResetSearch = () => {
    // Reset the user list to the original state
    setSearchTerm('');
    fetchUsers();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.userBox}>
          <Feather name="user" size={24} color="black" style={styles.userIcon} />
          <Text style={styles.userCount}>Total Users: {users.length}</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={handleResetSearch}>
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>ID</Text>
          <Text style={styles.headerText}>Username</Text>
          <Text style={styles.headerText}>Email</Text>
          <Text style={styles.headerText}>Role</Text>
          <Text style={styles.headerText}>Actions</Text>
        </View>

        <FlatList
          data={users}
          keyExtractor={(user) => (user.U_ID !== undefined ? user.U_ID.toString() : 'defaultKey')}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.rowText}>{item.U_ID}</Text>
              <Text style={styles.rowText}>{item.First_Name + item.Last_Name}</Text>
              <Text style={styles.rowText}>{item.Email}</Text>
              <Text style={styles.rowText}>{item.U_Role}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEditUser(item.U_ID)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteUser(item.U_ID)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => Navigation.navigate('Registration')}>
        <Text style={styles.addButtonIcon}>+</Text>
      </TouchableOpacity>

      {newUser.U_ID && (
  <View style={styles.editUserContainer}>
    <Text>Edit User</Text>
    <TextInput
  style={styles.input}
  value={newUser.First_Name}
  onChangeText={(text) => setNewUser({ ...newUser, First_Name: text })}
/>
<TextInput
  style={styles.input}
  value={newUser.Last_Name}
  onChangeText={(text) => setNewUser({ ...newUser, Last_Name: text })}
/>
<TextInput
  style={styles.input}
  value={newUser.Email}
  onChangeText={(text) => setNewUser({ ...newUser, Email: text })}
/>
<TextInput
  style={styles.input}
  value={newUser.U_Role}
  onChangeText={(text) => setNewUser({ ...newUser, U_Role: text })}
/>

    <TouchableOpacity style={styles.button} onPress={handleUpdateUser}>
      <Text>Update User</Text>
    </TouchableOpacity>
  </View>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  topSection: {
    marginBottom: 10,
  },
  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  userIcon: {
    marginRight: 10,
  },
  userCount: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: 'lightcoral',
    padding: 10,
    borderRadius: 5,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'lightblue',
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 5,
    color: 'red'
  },
  rowText: {
    flex: 1,
    color: 'black'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'orange',
    padding: 20,
    borderRadius: 50,
  },
  addButtonIcon: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  editUserContainer: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default UserManagement;

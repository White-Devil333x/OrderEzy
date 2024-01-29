import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({
    Table_no: '',
    Capacity: '',
  });
  const [isAddingTable, setIsAddingTable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = 'SELECT * FROM dtables';
        const response = await axios.post(
          'http://192.168.216.62:3001/api/query',
          {
            query,
            values: [],
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }
        );

        if (response.data.success) {
          setTables(response.data.results);
        } else {
          console.error('Failed to fetch table data:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchData();
  }, []);

  const addTable = async () => {
    if (newTable.Table_no && newTable.Capacity) {
      try {
        // Define the insert query to add a new table
        const insertQuery = `INSERT INTO dtables (Table_no, Capacity, Status) VALUES (?, ?, ?)`;

        // Send a request to the server to execute the insert query
        const response = await axios.post(
          'http://192.168.216.62:3001/api/query',
          {
            query: insertQuery,
            values: [newTable.Table_no, newTable.capacity, 'Available'], // Assuming 0 represents the default status (available)
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }
        );

        if (response.data.success) {
          // If the table is successfully added to the database, update the state
          const newTableData = {
            id: response.data.insertedId,
            Table_no: parseInt(newTable.Table_no),
            Capacity: parseInt(newTable.Capacity),
            Status: response.data.Status, // Assuming the status is directly available in the response
          };

          setTables((prevTables) => [...prevTables, newTableData]);
          
          if (newTableData.Status === 'Occupied') {
            setAllocatedTables((count) => count + 1);
          }
          // Update the newTable state using the previous state
          setNewTable((prev) => ({
            ...prev,
            Table_no: '',
            Capacity: '',
          }));

          setIsAddingTable(false);
        } else {
          console.error('Failed to add a new table:', response.data.error);
        }
      } catch (error) {
        console.error('Error adding a new table:', error);
      }
    }
  };

  const allocatedTables = tables.filter((table) => table.isOccupied).length;
  const emptyTables = tables.filter((table) => !table.isOccupied).length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Table Management</Text>

      <View style={styles.tableCountContainer}>
        <View style={styles.tableCountBox}>
          <Text style={styles.tableCountText}>Allocated Tables</Text>
          <Text style={styles.tableCountNumber}>{allocatedTables}</Text>
        </View>
        <View style={styles.tableCountBox}>
          <Text style={styles.tableCountText}>Empty Tables</Text>
          <Text style={styles.tableCountNumber}>{emptyTables > 0 ? emptyTables : 0}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Tables:</Text>
      {tables.map((table) => (
  <TouchableOpacity
    key={table.TableID}
    onPress={() => {
      // Removed the functionality for placing an order
    }}
  >
    <View
      style={[
        styles.tableItem,
        {
          backgroundColor: table.Status === 'Occupied' ? '#FFD5D5' : '#D7FFD5',
          borderWidth: 1,
          borderColor: 'gray',
        },
      ]}
    >
      <Text>{`Table No. ${table.Table_no}`}</Text>
      <Text>{`Capacity: ${table.Capacity} people`}</Text>
      <Text>{`Status: ${table.Status ? 'Occupied' : 'Available'}`}</Text>
    </View>
  </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.floatingButton} onPress={() => setIsAddingTable(true)}>
        <FontAwesome name="plus" size={22} color="white" />
      </TouchableOpacity>

      <Modal visible={isAddingTable} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.subtitle}>Add New Table:</Text>
          <TextInput
            style={styles.input}
            placeholder="Table Number"
            keyboardType="numeric"
            value={newTable.Table_no}
            onChangeText={(text) => setNewTable((prev) => ({ ...prev, Table_no: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Seating Capacity"
            keyboardType="numeric"
            value={newTable.Capacity}
            onChangeText={(text) => setNewTable((prev) => ({ ...prev, Capacity: text }))}
          />
          <Button title="Add Table" onPress={addTable} color="orange" />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tableCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableCountBox: {
    backgroundColor: '#DBE6FD',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  tableCountText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tableCountNumber: {
    fontSize: 18,
  },
  tableItem: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'orange',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginTop: 'auto',
  },
});

export default TableManagement;

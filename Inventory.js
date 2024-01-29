import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { IconButton } from 'react-native-paper';

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([
    // Your existing inventory items...
    { id: 1, name: 'Item 1', quantity: 10, price: 5.0 , Total:50},
    { id: 2, name: 'Item 2', quantity: 20, price: 8.0 , Total:160},
    { id: 3, name: 'Item 3', quantity: 15, price: 12.0 , Total:0},
    { id: 4, name: 'Item 4', quantity: 25, price: 12.0 , Total:300},
    { id: 5, name: 'Item 5', quantity: 35, price: 12.0 , Total:0},
    { id: 6, name: 'Item 6', quantity: 15, price: 12.0 , Total:0},
    { id: 7, name: 'Item 7', quantity: 15, price: 12.0 , Total:0},
  ]);
   
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    price: '',
  });

  const addNewItem = () => {
    setShowModal(true);
  };

  const handleInputChange = (key, value) => {
    setNewItem({
      ...newItem,
      [key]: value,
    });
  };

  const saveNewItem = () => {
    // Perform any necessary validation before saving the new item
    if (newItem.name && newItem.quantity && newItem.price) {
      const total = parseInt(newItem.quantity) * parseFloat(newItem.price);
      setInventoryItems([
        ...inventoryItems,
        {
          id: inventoryItems.length + 1,
          name: newItem.name,
          quantity: parseInt(newItem.quantity),
          price: parseFloat(newItem.price),
          Total: total,
        },
      ]);
      setNewItem({ name: '', quantity: '', price: '' });
      setShowModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.column]}>ID</Text>
            <Text style={[styles.tableHeader, styles.column]}>Name</Text>
            <Text style={[styles.tableHeader, styles.column]}>Quantity</Text>
            <Text style={[styles.tableHeader, styles.column]}>Price</Text>
            <Text style={[styles.tableHeader, styles.column]}>Total</Text>

          </View>

          {/* Table Data */}
          {inventoryItems.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableData, styles.column]}>{item.id}</Text>
              <Text style={[styles.tableData, styles.column]}>{item.name}</Text>
              <Text style={[styles.tableData, styles.column]}>{item.quantity}</Text>
              <Text style={[styles.tableData, styles.column]}>{item.price}</Text>
              <Text style={[styles.tableData, styles.column]}>{item.Total}</Text>

            </View>
          ))}
          </View>
      </ScrollView>
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={newItem.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={newItem.quantity}
              onChangeText={(text) => handleInputChange('quantity', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={newItem.price}
              onChangeText={(text) => handleInputChange('price', text)}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={saveNewItem}>
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <IconButton
        icon="plus"
        size={30}
        style={styles.fab}
        onPress={addNewItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles...

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  table: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#000',
    margin: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    fontWeight: 'bold',
    padding: 10,
  },
  tableData: {
    padding: 10,
  },
  column: {
    flex: 1,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'orange',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  form: {
    backgroundColor: '#fff',
    padding: 50,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
  },
  input: {
    height: 50,
    width:200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default InventoryManagement;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import OrderForm from './Waiter/order';  // Adjust the path accordingly
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
const OrderManagement = () => {
  const navigation = useNavigation();

  const navigateToTableManagement = () => {
    navigation.navigate('TableManagement');
  };

  const formatOrderTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    tableNo: '',
    items: '',
  });
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tables, setTables] = useState({ allocated: 5, empty: 10 });

  useEffect(() => {
    // Fetch orders from the database when the component mounts
    fetchOrders();
  }, []);

  const addOrder = () => {
    const newOrderObj = {
      id: orders.length + 1,
      customerName: newOrder.customerName,
      tableNo: newOrder.tableNo,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Processing',
      items: newOrder.items.split(',').map(item => item.trim()),
    };
    setOrders([...orders, newOrderObj]);
    setNewOrder({
      customerName: '',
      tableNo: '',
      items: '',
    });
    setIsAddingOrder(false);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const toggleOrderForm = () => {
    setIsAddingOrder(!isAddingOrder);
  };

  const fetchOrders = async () => {
    try {
      // Define your custom query to retrieve orders
      const fetchOrdersQuery = 'SELECT * FROM orders'; // Modify this query based on your database schema

      // Make a request to the server to execute the query
      const response = await axios.post(
        'http://192.168.216.62:3001/api/query', // Replace with your actual server endpoint
        {
          query: fetchOrdersQuery,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Check if the request was successful
      if (response.data.success) {
        // Update the orders state with the retrieved data
        setOrders(response.data.results);
      } else {
        // Handle the case when the request was not successful
        console.error('Failed to fetch orders:', response.data.error);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error fetching orders:', error);
    }

    
  };
  useEffect(() => {
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.runningOrdersHeader}>
        <FontAwesome name="spoon" size={30} color="black" />
        <Text style={styles.runningtext}>Running Orders</Text>
        <Text style={styles.runningOrdersCount}>{orders.length}</Text>
      </View>

      <TouchableOpacity onPress={navigateToTableManagement}>
        <View style={styles.tablesButton}>
          <Text style={styles.tablesButtonText}>Tables</Text>
          <Text style={styles.tablesInfo}>
            Allocated: {tables.allocated} | Empty: {tables.empty}
          </Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openOrderDetails(item)}>
            <View style={[
              styles.orderItem,
              { backgroundColor: item.status === 'Processing' ? '#FFD5D5' : '#D7FFD5' }
            ]}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{`Order #${item.order_id}`}</Text>
                <Text style={styles.orderTime}>{formatOrderTime(item.order_time)}</Text>
              </View>
              <Text>{`Customer Name: ${item.customer_name}`}</Text>
              <Text style={styles.status}>{`Status: ${item.status}`}</Text>
              <Text style={styles.tableNo}>{`Table No: ${item.table_no}`}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {isAddingOrder && (
        <Modal
          visible={isAddingOrder}
          transparent
          animationType="slide"
          onRequestClose={() => setIsAddingOrder(false)}
        >
          <OrderForm
            onAddOrder={addOrder}
            onCancel={() => setIsAddingOrder(false)}
          />
        </Modal>
      )}

      <TouchableOpacity style={styles.floatingButton} onPress={toggleOrderForm}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={selectedOrder !== null} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.subtitle}>Order Details:</Text>
          {selectedOrder && (
            <>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{`Order #${selectedOrder.order_id}`}</Text>
                <Text style={styles.orderTime}>{formatOrderTime(selectedOrder.order_time)}</Text>
              </View>
              <Text>{`Customer Name: ${selectedOrder.customer_name}`}</Text>
              <Text style={styles.status}>{`Status: ${selectedOrder.status}`}</Text>
              <Text>{`Table No: ${selectedOrder.table_no}`}</Text>
              <Text style={styles.subtitle}>Ordered Items:</Text>
              <FlatList
                  data={selectedOrder.items_ordered}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true} // Set horizontal to true
                  renderItem={({ item }) => (
                    <View style={styles.horizontalItem}>
                      <Text>{item}</Text>
                    </View>
                  )}
                />
              <Button title="Close" onPress={closeOrderDetails} color="orange" />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (existing styles)
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  horizontalItem: {
    marginRight: 3, // Adjust spacing between items
  },
  
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  orderItem: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderId: {
    fontWeight: 'bold',
  },
  orderTime: {
    color: 'gray',
  },
  tableNo: {
    textAlign: 'right',
    color: 'gray',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
  floatingButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginTop: 'auto',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  runningOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DBE6FD',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  runningOrdersCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  runningtext: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 130,
  },
  tablesButton: {
    backgroundColor: '#FFD5D5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  tablesButtonText: {
    fontWeight: 'bold',
    fontSize:20
  },
  tablesInfo: {
    marginTop: 5,
  },

});

export default OrderManagement;

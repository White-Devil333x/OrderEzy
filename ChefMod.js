import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, FlatList } from 'react-native';
import { ScrollView } from 'react-native';
import axios from 'axios';

const App = () => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [acceptedStarter, setAcceptedStarter] = useState(false);
  const [acceptedMainCourse, setAcceptedMainCourse] = useState(false);
  const [acceptedDessert, setAcceptedDessert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    fetchOrder();
  }, []);

  const formatOrderTime = (timeString) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    };
    const formattedTime = new Date(timeString).toLocaleTimeString('en-US', options);
    return formattedTime;
  };

  const fetchOrder = async () => {
    try {
      const orderQuery = `
        SELECT * FROM orders
        WHERE status = 'Processing'
        ORDER BY order_time ASC
        LIMIT 1
      `;

      const response = await axios.post(
        'http://192.168.102.62:3001/api/query',
        {
          query: orderQuery,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      if (response.data.success) {
        const order = response.data.results[0];
        setCurrentOrder(order);
        const pendingOrdersQuery = `
          SELECT * FROM orders
          WHERE status = 'Processing' AND order_id != ${order.order_id}
          ORDER BY order_time ASC
        `;
        const pendingOrdersResponse = await axios.post(
          'http://192.168.102.62:3001/api/query',
          {
            query: pendingOrdersQuery,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }
        );
        if (pendingOrdersResponse.data.success) {
          const orders = pendingOrdersResponse.data.results;
          setPendingOrders(orders);
        } else {
          console.error('Failed to fetch pending orders:', pendingOrdersResponse.data.error);
        }
      } else {
        console.error('Failed to fetch order:', response.data.error);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const markOrderAsComplete = async () => {
    try {
      const updateStatusQuery = `
        UPDATE orders
        SET status = 'Served'
        WHERE order_id = ${currentOrder.order_id}
      `;

      const response = await axios.post(
        'http://192.168.102.62:3001/api/query',
        {
          query: updateStatusQuery,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      if (response.data.success) {
        fetchOrder();
        setShowModal(false);
      } else {
        console.error('Failed to update order status:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleAcceptOrder = (category) => {
    setShowModal(true);

    switch (category) {
      case 'starter':
        setAcceptedStarter(true);
        break;
      case 'maincourse':
        setAcceptedMainCourse(true);
        break;
      case 'dessert':
        setAcceptedDessert(true);
        break;
      default:
        break;
    }
  };

  const calculateTotal = (items) => {
    if (!Array.isArray(items)) return 0;

    return items.reduce((acc, item) => acc + (item.total || 0), 0).toFixed(2);
  };

  const itemsOrdered = currentOrder?.items_ordered ? JSON.parse(currentOrder.items_ordered) : [];

  const renderOrderItems = () => {
    const groupedItems = {};
    itemsOrdered.forEach((item) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });
  
    return (
      <FlatList
        data={Object.entries(groupedItems)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View style={styles.categoryContainer}>
            <Text style={styles.boldText}>{item[0]}</Text>
            {item[1].map((item, index) => (
              <View key={index} style={styles.menuItemRow}>
                <Text>{item.item}</Text>
                <Text style={styles.quantityText}>x{item.quantity}</Text>
                <Text>${item.total?.toFixed(2) || 'N/A'}</Text>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.menuItemRow}>
            <Text>No items available</Text>
          </View>
        )}
      />
    );
  };



  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {currentOrder ? (
          <>
            <View style={styles.formLine}>
              <Text style={styles.boldText}>Ongoing Order</Text>
              <Text>Processing</Text>
            </View>

            <View style={styles.formLine}>
              <Text style={styles.boldText}>Order No</Text>
              <Text>{currentOrder?.order_id || 'N/A'}</Text>
            </View>

            <View style={styles.formLine}>
              <Text style={styles.boldText}>Order Time</Text>
              <Text>{currentOrder?.order_time ? formatOrderTime(currentOrder.order_time) : 'N/A'}</Text>
            </View>

            <View style={styles.formLine}>
              <Text style={styles.boldText}>Table No.</Text>
              <Text>{currentOrder?.table_no || 'N/A'}</Text>
            </View>

            <View style={styles.formLine}>
              <Text style={styles.boldText}>Customer Name</Text>
              <Text>{currentOrder?.customer_name || 'N/A'}</Text>
            </View>

            <View style={styles.orderTable}>
              <View style={styles.tableRow}>
                <Text style={styles.boldText}>Order Menu</Text>
                <Text style={styles.boldText}>Quantity</Text>
                <Text style={styles.boldText}>Price</Text>
              </View>
              {itemsOrdered.length > 0 ? (
                itemsOrdered.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text>{item.item}</Text>
                    <Text>{item.quantity}</Text>
                    <Text>${item.total?.toFixed(2) || 'N/A'}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={styles.boldText}>No items available</Text>
                </View>
              )}
              <View style={styles.tableRow}>
                <Text style={[styles.boldText, styles.orangeText]}>Total</Text>
                <Text></Text>
                <Text style={[styles.boldText, styles.orangeText]}>${calculateTotal(itemsOrdered)}</Text>
              </View>
            </View>

            <View style={styles.formLine}>
              <Text style={styles.boldText}>Comments</Text>
              <Text>{currentOrder?.comments || 'N/A'}</Text>
            </View>

            <TouchableOpacity
              style={[styles.buttonContainer, styles.markCompleteButton]}
              onPress={markOrderAsComplete}>
              <Text style={styles.buttonText}>Mark as Complete</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>No ongoing orders</Text>
        )}
      </View>

      <View style={{ height: 10 }} />

      <Text style={styles.pendingOrdersText}>Pending Orders</Text>

      {pendingOrders.length > 0 ? (
        pendingOrders.map((order) => (
          <View key={order.order_id} style={[styles.pendingOrder, { borderBottomWidth: 1, borderBottomColor: 'lightgrey' }]}>
            <View style={styles.orderDetails}>
              <Text style={styles.boldText}>Order No.: {order.order_id}</Text>
              <Text style={styles.boldText}>Table No.: {order.table_no}</Text>
              <Text style={styles.boldText}>Order Time: {formatOrderTime(currentOrder.order_time)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.acceptOrderButton, styles.smallButton]}
              onPress={() => handleAcceptOrder(order.category)}>
              <Text style={[styles.buttonText, styles.smallButtonText]}>View Order</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text>No pending orders</Text>
      )}

      <Modal
        transparent={true}
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {currentOrder && (
              <>
                <View style={styles.modalText}>
                  <Text style={styles.boldText}>Order No.: {currentOrder.order_id}</Text>
                  <Text style={styles.boldText}>Order Time: {formatOrderTime(currentOrder.order_time)}</Text>
                </View>
                <View style={styles.modalSeparator} />
                {renderOrderItems()}
                <TouchableOpacity
                  style={[styles.buttonContainer, styles.backButton]}
                  onPress={() => setShowModal(false)}>
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  formContainer: {
    marginTop: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    paddingTop: 10,
    padding: 15,
  },
  formLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  boldText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 12,
  },
  orderTable: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  orangeText: {
    color: 'orange',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  markCompleteButton: {
    backgroundColor: 'orange',
  },
  pendingOrdersText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  pendingOrder: {
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 10,
  },
  acceptOrderButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'orange',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'center',
  },
  orderDetails: {},
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  smallButtonText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    height: Dimensions.get('window').height / 3, // Set the height to half of the screen
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 20, // Adjust padding as needed
    paddingHorizontal: 20,
    justifyContent: 'space-between', // Add this to align items at the bottom
  },
    modalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 10,
    },
    categoryContainer: {
      borderBottomWidth: 1,
      borderColor: 'black',
      marginBottom: 0,
      paddingBottom: 10,
      
    },
    menuItemRow: {
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    marginBottom: 5,
  },
  
  quantityText: {
    fontSize: 12,
    //marginRight: 5, // Adjust the margin as needed
  },
  backButton: {
    backgroundColor: 'orange', // Customize the color as needed
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center', // Align the button to the center horizontally
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  });
  
  export default App;
  
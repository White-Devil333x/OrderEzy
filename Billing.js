import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Share } from 'react-native';
import axios from 'axios';
import { PDFDocument, PDFPage } from 'react-native-pdf-lib';

const Billing = () => {
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [fetchingData, setFetchingData] = useState(false);
  useEffect(() => {
    if (orderId.trim() !== '') {
      // Fetch data when orderId is not empty
      retrieveOrderData();
    }
  }, [orderId]);

  const handleFetchPress = async () => {
    try {
      setFetchingData(true);
      await retrieveOrderData();
    } catch (error) {
      // Handle the error and show an alert
      Alert.alert('Error', 'Failed to retrieve order data. Please check the order ID and try again.');
    } finally {
      setFetchingData(false);
    }
  };

  const retrieveOrderData = async () => {
    try {
      const orderQuery = `SELECT customer_name, table_no, items_ordered, total_cost FROM orders WHERE order_id = ?`;
  
      const orderResponse = await axios.post(
        'http://192.168.102.62:3001/api/query',
        {
          query: orderQuery,
          values: [orderId],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
  
      if (orderResponse.data.success) {
        const orderData = orderResponse.data.results[0];
  
        if (orderData) {
          // Check if orderData is not undefined
          setCustomerName(orderData.customer_name);
          setTableNo(orderData.table_no);
  
          // Now call retrieveOrderItems
          retrieveOrderItems(orderData.items_ordered, orderData.total_cost);
        } else {
          console.log('Order data not found:', orderResponse.data);
          // Show an alert if order data is not found
          Alert.alert('Order Not Found', 'The entered order ID does not exist in the database.');
        }
      } else {
        console.error('Failed to retrieve order data:', orderResponse.data.error);
      }
    } catch (error) {
      console.error('Error retrieving order data:', error);
    }
  };
  

  const retrieveOrderItems = async () => {
    try {
      const itemsQuery = `SELECT items_ordered, total_cost FROM orders WHERE order_id = ?`;

      const itemsResponse = await axios.post(
        'http://192.168.102.62:3001/api/query',
        {
          query: itemsQuery,
          values: [orderId],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      if (itemsResponse.data.success) {
        const orderItems = itemsResponse.data.results[0];

        // Assuming items_ordered is a JSON array string, parse it
        const parsedItems = JSON.parse(orderItems.items_ordered);

        setItems(parsedItems);

        const totalCost = parseFloat(orderItems.total_cost);
        setTotalAmount(totalCost);
      } else {
        console.error('Failed to retrieve order items:', itemsResponse.data.error);
      }
    } catch (error) {
      console.error('Error retrieving order items:', error);
    }
  };

  const generateBill = async () => {
    try {
      const pdfBytes = await generatePDFContent();
      sharePDFViaWhatsApp(pdfBytes);
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
    }
  };

  const generatePDFContent = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage(); // Create a new page
  
      // Now you can use drawText on the page object
      page.drawText('Your Restaurant', { x: 50, y: 750, fontSize: 20 });
      page.drawText(`Address: 123 Main Street, City`, { x: 50, y: 730 });
      page.drawText(`GSTIN: 1234567890`, { x: 50, y: 710 });
      page.drawText('-------------------------------------', { x: 50, y: 690 });
      page.drawText(`Bill No: ${orderId}`, { x: 50, y: 670 });
      page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: 650 });
      page.drawText(`Table No: ${tableNo}`, { x: 50, y: 630 });
      page.drawText(`Customer's Name: John Doe`, { x: 50, y: 610 });
      page.drawText('-------------------------------------', { x: 50, y: 590 });
      page.drawText(`Order ID: ${orderId}`, { x: 50, y: 570 });
      page.drawText('-------------------------------------', { x: 50, y: 550 });
  
      // Draw table headers
      page.drawText('Food Items', { x: 50, y: 530 });
      page.drawText('Qty', { x: 200, y: 530 });
      page.drawText('Amount', { x: 300, y: 530 });
  
      // Draw items
      let yPosition = 510;
      items.forEach((item) => {
        yPosition -= 20;
        page.drawText(`${item.item}`, { x: 50, y: yPosition });
        page.drawText(`${item.quantity}`, { x: 200, y: yPosition });
        page.drawText(`Rs. ${item.total.toFixed(2)}`, { x: 300, y: yPosition });
      });
  
      // Draw total amounts
      yPosition -= 20;
      page.drawText('-------------------------------------', { x: 50, y: yPosition });
      yPosition -= 20;
      page.drawText(`Subtotal: Rs. ${totalAmount.toFixed(2)}`, { x: 50, y: yPosition });
      yPosition -= 20;
      page.drawText(`GST (18%): Rs. ${(totalAmount * 0.18).toFixed(2)}`, { x: 50, y: yPosition });
      yPosition -= 20;
      page.drawText('-------------------------------------', { x: 50, y: yPosition });
      yPosition -= 20;
      page.drawText(`Total Bill Amount: Rs. ${(totalAmount + totalAmount * 0.18).toFixed(2)}`, { x: 50, y: yPosition });
  
      const pdfBytes = await pdfDoc.save();
  
      // Now you can use pdfBytes to share or save the PDF
      sharePDFViaWhatsApp(pdfBytes);
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
    }
  };
  

  const sharePDFViaWhatsApp = async (pdfBytes) => {
    try {
      const options = {
        message: 'Your message',
        url: `data:application/pdf;base64,${pdfBytes.toString('base64')}`,
      };

      await Share.share(options);
    } catch (error) {
      console.error('Error sharing PDF via WhatsApp:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Order ID:</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={orderId}
          onChangeText={(text) => setOrderId(text)}
          placeholder="Enter order ID"
        />
         <TouchableOpacity style={[styles.retrieveBtn]} onPress={handleFetchPress}>
          <Text style={styles.btnText}>{fetchingData ? 'Fetching...' : 'Fetch'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Customer Name:</Text>
      <Text>{customerName}</Text>

      <Text style={styles.label}>Table No:</Text>
      <Text>{tableNo}</Text>

      <Text style={styles.label}>Items:</Text>
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{` ${item.item} x ${item.quantity}`}</Text>
            <Text>{item.total ? `Rs. ${item.total.toFixed(2)}` : 'Calculating...'}</Text>
          </View>
        )}
      />

      <Text style={styles.totalAmount}>Total Amount: Rs. {totalAmount.toFixed(2)}</Text>

      <TouchableOpacity style={[styles.btn, styles.generateBtn]} onPress={generateBill}>
        <Text style={styles.btnText}>Generate Bill</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
 
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'orange',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  retrieveBtn: {
    backgroundColor: 'orange',
    marginLeft: 10,
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  generateBtn: {
    backgroundColor: 'orange',
  },
});

export default Billing;

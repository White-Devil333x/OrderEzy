import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const FeedbackReviewsPage = () => {
  const [feedbackData, setFeedbackData] = useState([
    { id: 1, email: 'user1@example.com', rating: 4, comments: 'Great experience with the system!' },
    { id: 2, email: 'user2@example.com', rating: 2, comments: 'Needs improvement' },
    { id: 3, email: 'user3@example.com', rating: 5, comments: 'Easy to use' },
    { id: 4, email: 'user4@example.com', rating: 3, comments: 'Attractive but could be better' },
    { id: 5, email: 'user5@example.com', rating: 2, comments: 'Very user-friendly interface.' },
    // Add more feedback data as needed

  ]);
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback and Reviews</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 1.5 }]}>Feedback ID</Text>
          <Text style={[styles.headerText, { flex: 2, textAlign: 'center' }]}>Email ID</Text>
          <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Stars</Text>
          <Text style={[styles.headerText, { flex: 4, textAlign: 'center' }]}>Comments</Text>
        </View>

        <FlatList
          data={feedbackData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.tableRow, { backgroundColor: item.rating < 3 ? '#FFD5D5' : 'white' }]}>
                <Text style={[styles.rowText, { flex: 1.5 }]}>{item.id}</Text>
                <Text style={[styles.rowText, styles.emailColumn, { flex: 2 }]}>{item.email}</Text>
                <Text style={[styles.rowText, { flex: 1, textAlign: 'center' }]}>{item.rating}</Text>
                <Text style={[styles.rowText, { flex: 4, textAlign: 'center' }]}>{item.comments}</Text>
            </View>
          )}
        />
      </View>
    </View>
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
    marginBottom: 20,
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
    justifyContent: 'space-around', // Adjusted to evenly space the header text
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 10,
    justifyContent: 'space-around', // Adjusted to evenly space the row text
  },
  emailColumn: {
    textAlign: 'center',
    flexWrap: 'wrap',
  },  
  rowText: {
    flex: 1,
  },
});

export default FeedbackReviewsPage;
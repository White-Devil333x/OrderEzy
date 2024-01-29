import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const FeedbackPage = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What do you think about us!</Text>
      
      <Text style={styles.label}>How did we do?</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={star <= rating ? styles.selectedStar : styles.star}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.commentInput}
        placeholder="Comments"
        value={comment}
        onChangeText={(text) => setComment(text)}
        multiline={true}
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    backgroundColor: '#FFC773', // Light orange color
    padding: 20,
  },
  heading: {
    color:'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  star: {
    fontSize: 30,
    color: 'gray',
  },
  selectedStar: {
    fontSize: 24,
    color: 'orange',
  },
  commentInput: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'white',
    marginBottom: 50,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: 'orange',
    padding: 15,
    alignItems:'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FeedbackPage;
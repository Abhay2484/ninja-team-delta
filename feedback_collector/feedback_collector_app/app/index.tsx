import React, { useState } from 'react';
import { View, Alert, Text, StyleSheet } from 'react-native';
import FeedbackInput from './feedback_input';
import FeedbackButton from './button';

export default function App() {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    const trimmed = feedback.trim();
    if (!trimmed) {
      Alert.alert('Empty Feedback', 'Please enter your feedback before submitting.', [{ text: 'OK' }]);
      return;
    }
    Alert.alert('Feedback Submitted', 'Feedback submitted successfully! 💙', [{ text: 'OK' }]);
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>💬 Feedback Collector</Text>
      <Text style={styles.teamName}>By Team Delta 💙</Text>

      <FeedbackInput feedback={feedback} onChangeFeedback={setFeedback} onSubmit={handleSubmit} />
      <FeedbackButton onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    backgroundColor: '#CAF0F8',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#03045E',
    marginBottom: 10,
  },
  teamName: {
    fontSize: 16,
    color: '#0077B6',
    marginBottom: 20,
  },
});

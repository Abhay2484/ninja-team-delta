import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import FeedbackButton from './button';
import FeedbackInput from './feedback_input';
import FeedbackList from './feedback_list';


export default function App() {
  const [feedback, setFeedback] = useState<string>('');
  const [feedbacks, setFeedbacks] = useState<string[]>([]); 

  const handleSubmit = () => {
    const trimmed = feedback.trim();
    if (!trimmed) {
      Alert.alert(
        'Empty Feedback',
        'Please enter your feedback before submitting.',
        [{ text: 'OK' }]
      );
      return;
    }
// Add new feedback to the list
    setFeedbacks([...feedbacks, trimmed]);
    // Clear the input
    setFeedback('');

    Alert.alert(
      'Feedback Submitted',
      'Feedback submitted successfully! ',
      [{ text: 'OK' }]
    );
  };

  return (
    <View >
      

      <FeedbackInput
        feedback={feedback}
        onChangeFeedback={setFeedback}
        onSubmit={handleSubmit}
      />

      <FeedbackButton onSubmit={handleSubmit} />

      {/*  Display the feedback list dynamically */}
     
     
      <View >
  <FeedbackList feedbacks={feedbacks} />
</View>


    </View>
  );
}

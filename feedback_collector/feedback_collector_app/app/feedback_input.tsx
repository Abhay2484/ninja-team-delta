import React from 'react';
import { Text, TextInput, View } from 'react-native';


type FeedbackInputProps = {
  feedback: string;
  onChangeFeedback: (text: string) => void;
  onSubmit: () => void;
};

const FeedbackInput = ({ feedback,onChangeFeedback, onSubmit }: FeedbackInputProps) => {

  return (
    <View>
      <Text >FEEDBACK PLEASE</Text> 
      <TextInput
       
        placeholder="Type your feedback here..."
        placeholderTextColor="#666"
        value={feedback}
        onChangeText={onChangeFeedback}
        multiline={false}
        returnKeyType="send"
        onSubmitEditing={onSubmit}
      />
     
    </View>
  );
};

export default FeedbackInput;

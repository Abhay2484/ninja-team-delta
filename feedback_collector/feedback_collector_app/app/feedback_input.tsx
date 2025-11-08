import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

type FeedbackInputProps = {
  feedback: string;
  onChangeFeedback: (text: string) => void;
  onSubmit: () => void;
};
const FeedbackInput = ({ feedback, onChangeFeedback, onSubmit }: FeedbackInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>FEEDBACK PLEASE</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your feedback here..."
        placeholderTextColor="#666"
        value={feedback}
        onChangeText={onChangeFeedback}
        multiline
        returnKeyType="send"
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: 40,
    backgroundColor: '#E0F2FF',
    borderRadius: 10,
    padding: 15,
    alignSelf: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004B8D',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#00B4D8',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});


export default FeedbackInput;
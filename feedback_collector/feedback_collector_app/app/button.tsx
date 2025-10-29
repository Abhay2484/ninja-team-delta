import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type FeedbackButtonProps = {
  onSubmit: () => void;
};

const FeedbackButton = ({ onSubmit }: FeedbackButtonProps) => {
  return (
    <View>
      <TouchableOpacity
       
        onPress={onSubmit}>
        <Text >Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackButton;
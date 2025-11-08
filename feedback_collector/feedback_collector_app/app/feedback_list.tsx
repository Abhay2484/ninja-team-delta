import React, { useRef } from 'react';
import { FlatList, Text, View } from 'react-native';

interface FeedbackListProps {
  feedbacks: string[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
  const flatListRef = useRef<FlatList<string>>(null);

  return (
    <View >
      <Text > Submitted Feedbacks</Text>

      {feedbacks.length === 0 ? (
        <Text >No feedback yet</Text>
      ) : (
        <FlatList
          ref={flatListRef}
          data={feedbacks}
          keyExtractor={(_, index) => index.toString()}
         
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View >
              <Text > {item}
          </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};


export default FeedbackList;

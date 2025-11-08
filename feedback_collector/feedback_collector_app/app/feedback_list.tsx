import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

type FeedbackListProps = {
  feedbacks: string[];
};

const FeedbackList = ({ feedbacks }: FeedbackListProps) => {
  if (feedbacks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No feedback submitted yet </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Submitted Feedbacks</Text>

      <FlatList
        data={feedbacks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.number}>#{index + 1}</Text>
            <Text style={styles.feedbackText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#E3F2FD', // light blue background box
    borderRadius: 15,
    padding: 15,
    marginTop: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004B8D',
    textAlign: 'center',
    marginBottom: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0077B6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  number: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0077B6',
    marginRight: 8,
  },
  feedbackText: {
    fontSize: 16,
    color: '#03045E',
    flexShrink: 1,
  },

  emptyContainer: {
    marginTop: 30,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
  },
});

export default FeedbackList;

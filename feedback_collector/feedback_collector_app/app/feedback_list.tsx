import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
type FeedbackListProps = {
  feedbacks: string[];
};
const FeedbackList = ({ feedbacks }: FeedbackListProps) => {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 5;

  // 🧠 Filter logic
  const filteredFeedbacks = feedbacks.filter(fb =>
    fb.toLowerCase().includes(filter.toLowerCase())
  );

  // 🔃 Sort logic
  const sortedFeedbacks = (() => {
    if (sortOrder === 'alphabetical') {
      return [...filteredFeedbacks].sort((a, b) => a.localeCompare(b));
    } else if (sortOrder === 'oldest') {
      return [...filteredFeedbacks];
    } else {
      return [...filteredFeedbacks].reverse(); // newest first
    }
  })();

  // 📄 Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedFeedbacks.length / perPage));
  const start = (page - 1) * perPage;
  const visibleFeedbacks = sortedFeedbacks.slice(start, start + perPage);

  useEffect(() => setPage(1), [filter, sortOrder]);

  return (
    <View style={styles.container}>
      {/* Title + Dropdown */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Submitted Feedbacks</Text>

        {/* Sorting Dropdown */}
        <TouchableOpacity
          onPress={() => setDropdownVisible(true)}
          style={styles.dropdownBox}
        >
          <Text style={styles.dropdownText}>
            {sortOrder === 'newest'
              ? 'Newest First'
              : sortOrder === 'oldest'
              ? 'Oldest First'
              : 'A–Z'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for dropdown options */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              {[
                { label: 'Newest First', value: 'newest' },
                { label: 'Oldest First', value: 'oldest' },
                { label: 'A–Z (Alphabetical)', value: 'alphabetical' },
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setSortOrder(option.value as any);
                    setDropdownVisible(false);
                  }}
                  style={[
                    styles.option,
                    sortOrder === option.value && styles.optionSelected,
                  ]}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Filter input */}
      <TextInput
        placeholder="Filter feedback..."
        value={filter}
        onChangeText={setFilter}
        style={styles.filterInput}
      />

      {/* Feedback List */}
      {visibleFeedbacks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No feedback found</Text>
        </View>
      ) : (
        <FlatList
          data={visibleFeedbacks}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.number}>#{start + index + 1}</Text>
              <Text style={styles.feedbackText}>{item}</Text>
            </View>
          )}
        />
      )}

      {/* Pagination */}
      {filteredFeedbacks.length > perPage && (
        <View style={styles.paginationContainer}>
          <Button
            title="Prev"
            onPress={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          />
          <Text style={styles.pageText}>
            Page {page} / {totalPages}
          </Text>
          <Button
            title="Next"
            onPress={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#E3F2FD',
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004B8D',
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#90CAF9',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 13,
    color: '#004B8D',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    width: 180,
    elevation: 5,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionSelected: {
    backgroundColor: '#E3F2FD',
  },
  optionText: {
    fontSize: 14,
    color: '#004B8D',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#90CAF9',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
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
    marginTop: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  pageText: {
    color: '#004B8D',
    fontWeight: '600',
  },
});

export default FeedbackList;

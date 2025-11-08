import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

type FeedbackListProps = {
  feedbacks: string[];
};

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const perPage = 5;

  // Step 1: Filter
  const filteredFeedbacks = feedbacks.filter(fb =>
    fb.toLowerCase().includes(filter.toLowerCase())
  );

  // Step 2: Sort
  const sortedFeedbacks = (() => {
    if (sortOrder === 'alphabetical') {
      return [...filteredFeedbacks].sort((a, b) => a.localeCompare(b));
    } else if (sortOrder === 'oldest') {
      return [...filteredFeedbacks];
    } else {
      return [...filteredFeedbacks].reverse();
    }
  })();

  // Step 3: Pagination
  const totalPages = Math.max(1, Math.ceil(sortedFeedbacks.length / perPage));
  const start = (page - 1) * perPage;
  const visibleFeedbacks = sortedFeedbacks.slice(start, start + perPage);

  useEffect(() => setPage(1), [filter, sortOrder]);

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Submitted Feedbacks</Text>

        {/* 🎛 Custom Sorting Dropdown */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            onPress={() => setDropdownVisible(true)}
            style={{
              borderWidth: 1,
              borderColor: '#bbb',
              borderRadius: 8,
              paddingVertical: 6,
              paddingHorizontal: 10,
              backgroundColor: '#f7f7f7',
              width: 130,
            }}
          >
            <Text style={{ fontSize: 13, color: '#333', textAlign: 'center' }}>
              {sortOrder === 'newest'
                ? 'Newest First'
                : sortOrder === 'oldest'
                ? 'Oldest First'
                : 'A–Z'}
            </Text>
          </TouchableOpacity>

          {/* Modal for dropdown options */}
          <Modal
            visible={dropdownVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    paddingVertical: 10,
                    width: 180,
                    elevation: 5,
                  }}
                >
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
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor:
                          sortOrder === option.value ? '#f0f8ff' : 'white',
                      }}
                    >
                      <Text style={{ fontSize: 14, color: '#333' }}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>

      {/* 🔍 Filter Input */}
      <TextInput
        placeholder="Filter feedback..."
        value={filter}
        onChangeText={setFilter}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 6,
          padding: 8,
          marginTop: 8,
          marginBottom: 10,
        }}
      />

      {/* 📜 Feedback List */}
      {visibleFeedbacks.length === 0 ? (
        <Text>No feedback found</Text>
      ) : (
        <FlatList
          data={visibleFeedbacks}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#f0f0f0',
                padding: 10,
                borderRadius: 6,
                marginVertical: 5,
              }}
            >
              <Text>{item}</Text>
            </View>
          )}
        />
      )}

      {/* ⬅➡ Pagination */}
      {filteredFeedbacks.length > perPage && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 15,
            paddingBottom: 20,
          }}
        >
          <Button
            title="Prev"
            onPress={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          />
          <Text>
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

export default FeedbackList;

import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import FeedbackButton from './button';
import FeedbackInput from './feedback_input';
import FeedbackList from './feedback_list';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';

function MainApp() {
  const { user, logout } = useAuth();
  const userKey = user?.email ?? 'anonymous';

  const [feedback, setFeedback] = useState<string>('');
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<boolean>(true);

  const storageKey = `@feedbacks:${userKey}`;

  // Load feedbacks for current user when component mounts or when user changes
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingFeedbacks(true);
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!mounted) return;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setFeedbacks(parsed);
          else setFeedbacks([]);
        } else {
          setFeedbacks([]);
        }
      } catch (err) {
        console.log('Error loading feedbacks from storage:', err);
        setFeedbacks([]);
      } finally {
        if (mounted) setLoadingFeedbacks(false);
      }
    };
    load();

    // cleanup
    return () => {
      mounted = false;
    };
  }, [storageKey]);

  // Save feedbacks to AsyncStorage helper
  const saveFeedbacks = async (items: string[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(items));
    } catch (err) {
      console.log('Error saving feedbacks to storage:', err);
    }
  };

  // Submit handler — now async so we can persist immediately
  const handleSubmit = async () => {
    const trimmed = feedback.trim();
    if (!trimmed) {
      Alert.alert('Empty Feedback', 'Please enter your feedback before submitting.', [{ text: 'OK' }]);
      return;
    }

    // update local state and persist
    setFeedbacks(prev => {
      const next = [...prev, trimmed];
      // persist (fire-and-forget)
      saveFeedbacks(next);
      return next;
    });

    setFeedback('');
    Alert.alert('Feedback Submitted', 'Feedback submitted successfully!', [{ text: 'OK' }]);
  };

  // When user logs out, clear feedbacks from memory (optional: keep in storage)
  // We'll keep the feedbacks saved in storage for that user; just clear UI list.
  const handleSignOut = async () => {
    await logout(); // this clears @user in AsyncStorage via AuthContext
    setFeedbacks([]); // clear in-memory list to avoid leakage to next user
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Hello, {user?.email ?? 'User'}</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.logout}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <FeedbackInput feedback={feedback} onChangeFeedback={setFeedback} onSubmit={handleSubmit} />
      <FeedbackButton onSubmit={handleSubmit} />

      <View style={styles.listWrap}>
        {loadingFeedbacks ? (
          <Text style={styles.loadingText}>Loading feedbacks…</Text>
        ) : (
          <FeedbackList feedbacks={feedbacks} />
        )}
      </View>
    </View>
  );
}

function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    // While AuthContext checks AsyncStorage for a saved user, show a simple splash.
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  return user ? <MainApp /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    backgroundColor: '#F7FBFF',
  },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 16,
    color: '#023E8A',
    fontWeight: '600',
  },
  logout: {
    color: '#0077B6',
    fontWeight: '600',
  },
  listWrap: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  loading: {
    flex: 1,
    backgroundColor: '#F6FBFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '600',
    textAlign: 'center',
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();

  // shared fields
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // signup-only fields
  const [name, setName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  const validateEmail = (e: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  };

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert('Missing credentials', 'Please enter email and password.');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const ok = await login(trimmedEmail, password);
      if (!ok) {
        Alert.alert('Login failed', 'Invalid credentials. Try password length ≥ 6 or "password".');
      }
      // on success, AuthProvider will set user and app will move forward
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while logging in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Missing name', 'Please enter your name.');
      return;
    }
    if (!trimmedEmail || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill all the fields.');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      // Demo signup - in a real app you'd POST to your API to create the user.
      // Here we reuse `login` to set the user in the AuthContext after "signup".
      // Replace this block with an API call and then set user/token in AuthContext.
      const signupSucceeded = true; // pretend the backend created the user

      if (!signupSucceeded) {
        Alert.alert('Sign up failed', 'Unable to create account. Try again later.');
        return;
      }

      // After successful sign-up, automatically sign the user in (demo).
      const ok = await login(trimmedEmail, password);
      if (ok) {
        Alert.alert('Welcome!', `Account created for ${trimmedName}.`);
      } else {
        Alert.alert('Sign up succeeded but login failed', 'Try signing in manually.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while signing up.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrimary = () => {
    if (mode === 'signin') handleSignIn();
    else handleSignUp();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>{mode === 'signin' ? 'Welcome back' : 'Create account'}</Text>
          <Text style={styles.subtitle}>
            {mode === 'signin' ? 'Sign in to continue' : 'Sign up to start using the app'}
          </Text>

          {mode === 'signup' && (
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType={mode === 'signin' ? 'done' : 'next'}
            onSubmitEditing={mode === 'signin' ? handleSignIn : undefined}
          />

          {mode === 'signup' && (
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handlePrimary}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') : (mode === 'signin' ? 'Sign in' : 'Sign up')}
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.hint}>
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                resetFields();
              }}
            >
              <Text style={styles.toggle}>{mode === 'signin' ? 'Sign up' : 'Sign in'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.demoHint}>
            Tip: this demo accepts password "password" or any password with length ≥ 6. Replace with your backend.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6FBFF',
  },
  card: {
    width: '92%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: '4%',
    marginVertical: 40,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#023E8A', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#0077B6', marginTop: 6, marginBottom: 14, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#E6EEF8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: '#FBFEFF',
  },
  button: {
    marginTop: 18,
    backgroundColor: '#0077B6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  hint: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  demoHint: {
    marginTop: 12,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  row: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle: {
    color: '#0077B6',
    fontWeight: '700',
    marginLeft: 6,
  },
});

export default LoginScreen;

import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveToSecureStore = async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Failed to save ${key} to SecureStore:`, error.message);
    }
  };

  const getFromSecureStore = async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Failed to retrieve ${key} from SecureStore:`, error.message);
      return null;
    }
  };

  const deleteFromSecureStore = async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Failed to delete ${key} from SecureStore:`, error.message);
    }
  };

  const login = async (username, password) => {
  try {
    console.log('Request Payload:', { username, password }); // Debugging log

    const response = await axios.post('https://dummyjson.com/auth/login', {
      username,
      password,
    });

    console.log('Full API Response:', response.data); // Debugging log

    const { refreshToken, id } = response.data;
    const token = response.data.token || refreshToken; // Use refreshToken if token is not available
    if (!token) {
      console.error('Token is undefined in the API response.');
      throw new Error('Login failed: Invalid credentials or missing token.');
    }

    setToken(token);
    setUserId(id);

    // Save token and userId to SecureStore
    await saveToSecureStore('authToken', token);
    await saveToSecureStore('userId', id.toString());

    console.log('Login successful:', { token, userId: id });
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Invalid credentials. Please try again.'
    );
  }
};

  const logout = async () => {
    try {
      setToken(null);
      setUserId(null);

      // Remove token and userId from SecureStore
      await deleteFromSecureStore('authToken');
      await deleteFromSecureStore('userId');

      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const loadAuthState = async () => {
    try {
      const savedToken = await getFromSecureStore('authToken');
      const savedUserId = await getFromSecureStore('userId');

      if (savedToken && savedUserId) {
        setToken(savedToken);
        setUserId(parseInt(savedUserId, 10));
        console.log('Auth state loaded:', { token: savedToken, userId: savedUserId });
      }
    } catch (error) {
      console.error('Failed to load auth state:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ token, userId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
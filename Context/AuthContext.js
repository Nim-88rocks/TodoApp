import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
      });

      const { token, id } = response.data;
      setToken(token);
      setUserId(id);

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userId', id.toString());
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    setToken(null);
    setUserId(null);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userId');
  };

  const loadAuthState = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('authToken');
      const savedUserId = await AsyncStorage.getItem('userId');
      if (savedToken && savedUserId) {
        setToken(savedToken);
        setUserId(parseInt(savedUserId));
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
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

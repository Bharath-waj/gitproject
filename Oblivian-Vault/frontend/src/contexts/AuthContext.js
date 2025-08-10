import React, { createContext, useContext, useState, useEffect } from 'react';
import supabaseService from '../services/supabaseService';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get current user on mount
    const getCurrentUser = async () => {
      try {
        const user = await supabaseService.getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error getting current user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();

    // Listen to auth state changes
    const { data: { subscription } } = supabaseService.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const { user } = await supabaseService.signIn(email, password);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setIsLoading(true);
      const { user } = await supabaseService.signUp(email, password);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabaseService.signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
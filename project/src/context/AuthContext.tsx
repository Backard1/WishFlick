import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('wishflick_user');
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Dream big, achieve bigger! ✨',
      privacy: 'public',
      createdAt: new Date(),
      following: [],
      followers: [],
    };

    localStorage.setItem('wishflick_user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150`,
      privacy: 'public',
      createdAt: new Date(),
      following: [],
      followers: [],
    };

    localStorage.setItem('wishflick_user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const loginWithGoogle = async () => {
    const mockUser: User = {
      id: 'google_user',
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      privacy: 'public',
      createdAt: new Date(),
      following: [],
      followers: [],
    };

    localStorage.setItem('wishflick_user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const loginWithFacebook = async () => {
    const mockUser: User = {
      id: 'facebook_user',
      name: 'Facebook User',
      email: 'user@facebook.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      privacy: 'public',
      createdAt: new Date(),
      following: [],
      followers: [],
    };

    localStorage.setItem('wishflick_user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Guest User',
      email: '',
      privacy: 'public',
      createdAt: new Date(),
      following: [],
      followers: [],
    };

    setAuthState({
      user: guestUser,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('wishflick_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...updates };
    localStorage.setItem('wishflick_user', JSON.stringify(updatedUser));
    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        loginAsGuest,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
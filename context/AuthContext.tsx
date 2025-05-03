import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '@entity';
import api from '@api/client';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  userGUID: string | null;
  login: (token: string, userGUID: string, user: User ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userGUID, setUserGUID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync('authToken');
        if (savedToken) {
          const response = await api.get('/users/auth/check-token');
          if (response.status === 200) {
            setToken(savedToken);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.log('Erro ao verificar token:', error);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const login = async (newToken: string, userGUID: string, user: User) => {
    await SecureStore.setItemAsync('authToken', newToken);
    await SecureStore.setItemAsync('authUser', JSON.stringify(user));
    await SecureStore.setItemAsync('authUserGUID', userGUID);
    setToken(newToken);
    setUserGUID(userGUID);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('authUser');
    await SecureStore.deleteItemAsync('authUserGUID');
    setToken(null);
    setUser(null);
    setUserGUID(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, userGUID, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
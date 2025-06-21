import React, { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '@entity';
import api from '@api/client';

interface AuthContextData {
  signed: boolean;
  token: string | null;
  user: User | null;
  userGUID: string | null;
  signIn: (token: string, userGUID: string, user: User ) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userGUID, setUserGUID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Iniciando verificação de token");
    const checkToken = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync('authToken');
        if (savedToken) {
          const response = await api.get('/users/auth/check-token');
          if (response.status === 200) {
            setToken(savedToken);
            setIsAuthenticated(true);
            console.log("AuthContext: Token válido encontrado");
          }
        } else {
          console.log("AuthContext: Nenhum token encontrado");
        }
      } catch (error) {
        console.log('AuthContext: Erro ao verificar token:', error);
      } finally {
        setLoading(false);
        console.log("AuthContext: Verificação de token concluída");
      }
    };
    checkToken();
  }, []);

  const signIn = useCallback(async (newToken: string, userGUID: string, user: User) => {
    console.log("AuthContext: Realizando login");
    await SecureStore.setItemAsync('authToken', newToken);
    await SecureStore.setItemAsync('authUser', JSON.stringify(user));
    await SecureStore.setItemAsync('authUserGUID', userGUID);
    setToken(newToken);
    setUserGUID(userGUID);
    setUser(user);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    console.log("AuthContext: Realizando logout");
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('authUser');
    await SecureStore.deleteItemAsync('authUserGUID');
    setToken(null);
    setUser(null);
    setUserGUID(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ signed: isAuthenticated, token, user, userGUID, signIn, signOut, loading }}>
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

export default AuthContext;
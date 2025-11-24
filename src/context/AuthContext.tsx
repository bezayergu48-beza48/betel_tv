
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User, ModuleType, PermissionAction } from '../src/types';
import { api } from '../services/mockApi';
import { PERMISSION_MATRIX } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  can: (module: ModuleType, action: PermissionAction) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('betel_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const { user: userData, token } = await api.auth.login(email, pass);
      localStorage.setItem('betel_token', token);
      localStorage.setItem('betel_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout();
    localStorage.removeItem('betel_token');
    localStorage.removeItem('betel_user');
    setUser(null);
  };

  const can = (module: ModuleType, action: PermissionAction): boolean => {
    if (!user) return false;
    const rolePermissions = PERMISSION_MATRIX[user.role];
    if (!rolePermissions) return false;
    
    const modulePermissions = rolePermissions[module];
    if (!modulePermissions) return false;

    return modulePermissions.includes(action);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

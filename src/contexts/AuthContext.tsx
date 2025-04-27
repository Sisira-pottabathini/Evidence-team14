import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the User type
export interface User {
  id: string;
  email: string;
  name: string;
}

// Define the context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('evidenceUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<void> => {
    // In a real app, this would call an API
    // For this demo, we'll simulate with localStorage
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('evidenceUsers') || '[]');
    const userExists = users.some((user: User) => user.email === email);
    
    if (userExists) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
    };
    
    // Save user to "database"
    users.push({ ...newUser, password });
    localStorage.setItem('evidenceUsers', JSON.stringify(users));
    
    // Set current user
    setCurrentUser(newUser);
    localStorage.setItem('evidenceUser', JSON.stringify(newUser));
    
    return Promise.resolve();
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('evidenceUsers') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('evidenceUser', JSON.stringify(userWithoutPassword));
    
    return Promise.resolve();
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('evidenceUser');
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
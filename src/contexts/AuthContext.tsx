
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

// Define types for user and auth context
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data (this would be replaced by actual API calls)
const MOCK_USERS = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('taskUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('taskUser');
      }
    }
  }, []);

  // Login function - in a real app, this would make an API call
  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('taskUser', JSON.stringify(userWithoutPassword));
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid email or password');
      throw new Error('Invalid email or password');
    }
  };

  // Signup function - in a real app, this would make an API call
  const signup = async (name: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would create a new user in the database
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name,
      email
    };
    
    setUser(newUser);
    localStorage.setItem('taskUser', JSON.stringify(newUser));
    toast.success('Account created successfully');
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskUser');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

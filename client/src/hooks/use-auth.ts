import { useState, useEffect, createContext, useContext } from "react";

export type User = {
  id: number;
  username: string;
  subscriptionTier: string;
  isPremium: boolean;
  listingsThisMonth: number;
  listingCredits: number;
  seoEnabled: boolean;
  socialMediaEnabled: boolean;
  videoScriptsEnabled: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
  signOut: () => void;
};

// Create a context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const MOCK_USER: User = {
  id: 1,
  username: "demo_user",
  subscriptionTier: "PRO",
  isPremium: true,
  listingsThisMonth: 3,
  listingCredits: 10,
  seoEnabled: true,
  socialMediaEnabled: true,
  videoScriptsEnabled: false,
};

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate loading user from storage
    setTimeout(() => {
      setUser(MOCK_USER);
      setLoading(false);
    }, 500);
  }, []);
  
  const login = (username: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUser({
        ...MOCK_USER,
        username
      });
      setLoading(false);
    }, 1000);
  };
  
  const register = (username: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUser({
        ...MOCK_USER,
        username,
        isPremium: false,
        subscriptionTier: "BASIC"
      });
      setLoading(false);
    }, 1000);
  };
  
  const signOut = () => {
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    error,
    login,
    register,
    signOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 
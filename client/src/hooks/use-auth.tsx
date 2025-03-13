import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useToast } from "./use-toast";

// Define user types
export type User = {
  id: number;
  username: string;
  subscriptionTier: string;
  isPremium: boolean;
  listingsThisMonth?: number;
  listingCredits?: number;
  seoEnabled?: boolean;
  socialMediaEnabled?: boolean;
  videoScriptsEnabled?: boolean;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  password: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: {
    mutate: (credentials: LoginCredentials) => void;
    isLoading: boolean;
  };
  logoutMutation: {
    mutate: () => void;
    isLoading: boolean;
  };
  registerMutation: {
    mutate: (userData: RegisterCredentials) => void;
    isLoading: boolean;
  };
};

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user for development
const MOCK_USER: User = {
  id: 1,
  username: "demo@example.com",
  subscriptionTier: "free",
  isPremium: false,
  listingsThisMonth: 3,
  listingCredits: 10,
  seoEnabled: true,
  socialMediaEnabled: true,
  videoScriptsEnabled: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [mockUser, setMockUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        setMockUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('mockUser');
      }
    }
    setIsLoading(false);
  }, []);

  const loginMutation = {
    mutate: async (credentials: LoginCredentials) => {
      setIsLoading(true);
      
      try {
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock login logic
        if (credentials.username && credentials.password.length >= 6) {
          // In a real app, this would validate against a backend
          const newUser = { ...MOCK_USER, username: credentials.username };
          setMockUser(newUser);
          localStorage.setItem('mockUser', JSON.stringify(newUser));
          
          toast({
            title: "Success!",
            description: "You have been logged in successfully.",
          });
        } else {
          throw new Error("Invalid credentials. Username required and password must be at least 6 characters.");
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    isLoading: isLoading
  };

  const registerMutation = {
    mutate: async (userData: RegisterCredentials) => {
      setIsLoading(true);
      
      try {
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock register logic
        if (userData.username && userData.password.length >= 6) {
          // In a real app, this would create a user in the backend
          const newUser = { ...MOCK_USER, username: userData.username };
          setMockUser(newUser);
          localStorage.setItem('mockUser', JSON.stringify(newUser));
          
          toast({
            title: "Success!",
            description: "Your account has been created successfully.",
          });
        } else {
          throw new Error("Invalid registration data. Username required and password must be at least 6 characters.");
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    isLoading: isLoading
  };

  const logoutMutation = {
    mutate: async () => {
      setIsLoading(true);
      
      try {
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clear mock user
        setMockUser(null);
        localStorage.removeItem('mockUser');
        
        toast({
          title: "Success!",
          description: "You have been logged out successfully.",
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    isLoading: isLoading
  };

  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
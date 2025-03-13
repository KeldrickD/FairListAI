import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Define user types
export type User = {
  id: number;
  username: string;
  subscriptionTier: string;
  isPremium: boolean;
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
  loginMutation: UseMutationResult<User, Error, LoginCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterCredentials>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user for development
const MOCK_USER: User = {
  id: 1,
  username: "demo@example.com",
  subscriptionTier: "free",
  isPremium: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [mockUser, setMockUser] = useState<User | null>(null);
  
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
  }, []);

  // Mock API call to fetch user
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      // In a real app, this would be an API request
      // For now, return the mock user if logged in
      if (mockUser) {
        return mockUser;
      }
      return null;
    },
    initialData: mockUser,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login logic
      if (credentials.username && credentials.password.length >= 6) {
        // In a real app, this would validate against a backend
        const newUser = { ...MOCK_USER, username: credentials.username };
        setMockUser(newUser);
        localStorage.setItem('mockUser', JSON.stringify(newUser));
        return newUser;
      }
      
      throw new Error("Invalid credentials. Username required and password must be at least 6 characters.");
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterCredentials) => {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock register logic
      if (userData.username && userData.password.length >= 6) {
        // In a real app, this would create a user in the backend
        const newUser = { ...MOCK_USER, username: userData.username };
        setMockUser(newUser);
        localStorage.setItem('mockUser', JSON.stringify(newUser));
        return newUser;
      }
      
      throw new Error("Invalid registration data. Username required and password must be at least 6 characters.");
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear mock user
      setMockUser(null);
      localStorage.removeItem('mockUser');
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success!",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
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
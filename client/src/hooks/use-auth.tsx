import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Define user types
export type User = {
  id: number;
  email: string;
  username: string;
  name?: string;
  role: string;
  subscriptionTier: string;
  isPremium: boolean;
  listingsThisMonth?: number;
  listingCredits?: number;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
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

// Fallback mock user for development if API is not available
const MOCK_USER: User = {
  id: 1,
  email: "demo@example.com",
  username: "demo@example.com",
  role: "user",
  subscriptionTier: "free",
  isPremium: false,
  listingsThisMonth: 3,
  listingCredits: 10,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      
      try {
        // Try to get user from token in localStorage
        const token = localStorage.getItem('accessToken');
        
        if (token) {
          try {
            // Verify token and get user data
            const response = await apiRequest('GET', '/api/auth/me');
            const userData = await response.json();
            setUser(userData);
          } catch (err) {
            // Token might be invalid, try to refresh
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
              try {
                const refreshResponse = await apiRequest('POST', '/api/auth/refresh', { refreshToken });
                const { accessToken } = await refreshResponse.json();
                
                localStorage.setItem('accessToken', accessToken);
                
                // Try again with new token
                const userResponse = await apiRequest('GET', '/api/auth/me');
                const userData = await userResponse.json();
                setUser(userData);
              } catch (refreshErr) {
                // Refresh failed, clear tokens
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
              }
            } else {
              // No refresh token, clear access token
              localStorage.removeItem('accessToken');
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Error loading user:", e);
        // Fallback to mock user in development
        if (process.env.NODE_ENV === 'development') {
          const mockUserData = localStorage.getItem('mockUser');
          if (mockUserData) {
            try {
              setUser(JSON.parse(mockUserData));
            } catch {
              localStorage.removeItem('mockUser');
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const loginMutation = {
    mutate: async (credentials: LoginCredentials) => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Call login API
        const response = await apiRequest('POST', '/api/auth/login', credentials);
        const { user, tokens } = await response.json();
        
        // Store tokens
        localStorage.setItem('accessToken', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        
        setUser(user);
        
        toast({
          title: "Success!",
          description: "You have been logged in successfully.",
        });
      } catch (err) {
        // Fallback to mock login in development
        if (process.env.NODE_ENV === 'development') {
          console.warn("Using mock login in development mode");
          
          // Mock login logic
          if (credentials.username && credentials.password.length >= 6) {
            const mockUser = { ...MOCK_USER, username: credentials.username, email: credentials.username };
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            setUser(mockUser);
            
            toast({
              title: "Success! (Development Mode)",
              description: "You have been logged in with mock data.",
            });
          } else {
            throw new Error("Invalid credentials. Username required and password must be at least 6 characters.");
          }
        } else {
          const error = err instanceof Error ? err : new Error("An unknown error occurred");
          setError(error);
          
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    isLoading: isLoading
  };

  const registerMutation = {
    mutate: async (userData: RegisterCredentials) => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Call register API
        const response = await apiRequest('POST', '/api/auth/register', userData);
        const { user, tokens } = await response.json();
        
        // Store tokens
        localStorage.setItem('accessToken', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        
        setUser(user);
        
        toast({
          title: "Success!",
          description: "Your account has been created successfully.",
        });
      } catch (err) {
        // Fallback to mock register in development
        if (process.env.NODE_ENV === 'development') {
          console.warn("Using mock registration in development mode");
          
          // Mock register logic
          if (userData.username && userData.password.length >= 6) {
            const mockUser = { ...MOCK_USER, username: userData.username, email: userData.email || userData.username };
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            setUser(mockUser);
            
            toast({
              title: "Success! (Development Mode)",
              description: "Your account has been created with mock data.",
            });
          } else {
            throw new Error("Invalid registration data. Username required and password must be at least 6 characters.");
          }
        } else {
          const error = err instanceof Error ? err : new Error("An unknown error occurred");
          setError(error);
          
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: error.message,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    isLoading: isLoading
  };

  const logoutMutation = {
    mutate: async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Call logout API
        await apiRequest('POST', '/api/auth/logout');
        
        // Clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('mockUser'); // Also clear mock user if any
        
        setUser(null);
        
        toast({
          title: "Success!",
          description: "You have been logged out successfully.",
        });
      } catch (err) {
        // In case of error, still log out locally
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('mockUser');
        
        setUser(null);
        
        // Show error toast
        const error = err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        
        toast({
          variant: "destructive",
          title: "Error during logout",
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
        user,
        isLoading,
        error,
        loginMutation,
        registerMutation,
        logoutMutation
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
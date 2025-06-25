import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { type User, type AuthContextType } from '../types/auth.types';
import { authService } from '../services/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    isLoading: auth0Loading,
    isAuthenticated: auth0Authenticated,
    user: auth0User,
    getAccessTokenSilently,
    logout: auth0Logout,
    loginWithRedirect,
    error: auth0Error,
  } = useAuth0();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (auth0Loading) {
          return; // Wait for Auth0 to finish loading
        }

        if (auth0Error) {
          setError(auth0Error.message);
          setIsLoading(false);
          return;
        }

        if (auth0Authenticated && auth0User) {
          // User is authenticated with Auth0, now authenticate with our API
          try {
            const accessToken = await getAccessTokenSilently();
            const loginResponse = await authService.loginWithAuth0Token(accessToken);
            
            if (loginResponse.success && loginResponse.data) {
              setUser(loginResponse.data.user);
              setToken(loginResponse.data.token);
              authService.storeUser(loginResponse.data.user);
              
            }
          } catch (apiError: any) {
            console.error('API authentication failed:', apiError);
            setError(apiError.message || 'Failed to authenticate with API');
            // If API auth fails, logout from Auth0 as well
            await auth0Logout({ logoutParams: { returnTo: window.location.origin } });
          }
        } else {
          // Not authenticated with Auth0, check if we have stored data
          const storedUser = authService.getStoredUser();
          const storedToken = authService.getAuthToken();
          
          if (storedUser && storedToken) {
            // Validate the stored token
            const validation = await authService.validateToken(storedToken);
            if (validation.valid && validation.user) {
              setUser(validation.user);
              setToken(storedToken);
            } else {
              // Token is invalid, clear stored data
              authService.clearStoredUser();
            }
          }
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setError(error.message || 'Authentication initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [auth0Loading, auth0Authenticated, auth0User, auth0Error, getAccessTokenSilently, auth0Logout]);

  const login = async (): Promise<void> => {
    try {
      setError(null);
      await loginWithRedirect();
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      
      // Logout from our API
      await authService.logout();
      
      // Clear local state
      setUser(null);
      setToken(null);
      authService.clearStoredUser();
      
      // Logout from Auth0
      await auth0Logout({ 
        logoutParams: { 
          returnTo: window.location.origin 
        } 
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'Logout failed');
      
      // Even if logout fails, clear local data
      setUser(null);
      setToken(null);
      authService.clearStoredUser();
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
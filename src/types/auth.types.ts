
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  auth0Id?: string;
  userType: 'b2c' | 'b2b';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Company-related fields for b2b users
  companies?: UserCompany[];
  currentCompany?: UserCompany;
}

export interface UserCompany {
  id: string;
  companyId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  company: {
    id: string;
    name: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn: number;
  };
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn: number;
  };
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
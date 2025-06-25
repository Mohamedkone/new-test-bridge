import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { User, UserCompany } from '../types/auth.types';

export interface UserPermissions {
  canAccessDashboard: boolean;
  canAccessLogs: boolean;
  canAccessBridge: boolean;
  canAccessRooms: boolean;
  canAccessVault: boolean;
  canAccessJoin: boolean;
  canAccessCompanies: boolean;
  canManageCompany: boolean;
  canManageUsers: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  userType: 'b2c' | 'b2b';
  currentRole?: string;
}

export const usePermissions = (): UserPermissions => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) {
      return {
        canAccessDashboard: false,
        canAccessLogs: false,
        canAccessBridge: false,
        canAccessRooms: false,
        canAccessVault: false,
        canAccessJoin: false,
        canAccessCompanies: false,
        canManageCompany: false,
        canManageUsers: false,
        isAdmin: false,
        isOwner: false,
        userType: 'b2c',
      };
    }

    const userType = user.userType;
    const currentCompany = user.currentCompany;
    const currentRole = currentCompany?.role;
    
    const isOwner = currentRole === 'owner';
    const isAdmin = currentRole === 'admin' || isOwner;
    const isMember = currentRole === 'member';
    const isViewer = currentRole === 'viewer';

    // Base permissions for all authenticated users
    let permissions: UserPermissions = {
      canAccessDashboard: true,
      canAccessLogs: true,
      canAccessBridge: true,
      canAccessRooms: false,
      canAccessVault: true,
      canAccessJoin: true,
      canAccessCompanies: false,
      canManageCompany: false,
      canManageUsers: false,
      isAdmin: false,
      isOwner: false,
      userType,
      currentRole,
    };

    if (userType === 'b2b') {
      // B2B users have access to most features
      permissions = {
        ...permissions,
        canAccessRooms: true, // B2B users can access rooms
        canAccessCompanies: true,
        isAdmin,
        isOwner,
      };

      // Role-based permissions for B2B users
      if (isOwner) {
        permissions = {
          ...permissions,
          canAccessLogs: true, // Owners can access logs
          canManageCompany: true,
          canManageUsers: true,
        };
      } else if (isAdmin) {
        permissions = {
          ...permissions,
          canAccessLogs: true, // Admins can access logs
          canManageUsers: true,
        };
      }
    } else {
      // B2C users have limited access
      permissions = {
        ...permissions,
        canAccessRooms: false, // B2C users cannot access rooms
        canAccessCompanies: false,
      };
    }

    return permissions;
  }, [user]);
};

export default usePermissions;
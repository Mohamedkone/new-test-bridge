// Environment variables
export const ENV = {
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'LockBridge',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VALIDATE_TOKEN: '/auth/validate-token',
  },
  COMPANIES: {
    BASE: '/companies',
    SEARCH: '/companies/search',
    MEMBERS: (id: string) => `/companies/${id}/members`,
    SETTINGS: (id: string) => `/companies/${id}/settings`,
  },
  STORAGE: {
    BASE: '/storage',
    COMPANY: (companyId: string) => `/storage/company/${companyId}`,
    STATS: (id: string) => `/storage/${id}/stats`,
    TEST: (id: string) => `/storage/${id}/test`,
  },
  ROOMS: {
    BASE: '/rooms',
    JOIN: (id: string) => `/rooms/${id}/join`,
    LOCK: (id: string) => `/rooms/${id}/lock`,
    UNLOCK: (id: string) => `/rooms/${id}/unlock`,
    MEMBERS: (id: string) => `/rooms/${id}/members`,
    FILES: (id: string) => `/rooms/${id}/files`,
  },
  FILES: {
    BASE: '/files',
    UPLOAD_URL: '/files/upload-url',
    COMPLETE_UPLOAD: '/files/complete-upload',
    DOWNLOAD_URL: (id: string) => `/files/${id}/download-url`,
    SHARE: (id: string) => `/files/${id}/share`,
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'lockbridge_auth_token',
  USER_DATA: 'lockbridge_user_data',
  SELECTED_COMPANY: 'lockbridge_selected_company',
  THEME_MODE: 'lockbridge_theme_mode',
} as const;

// Navigation routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  LOGS: '/logs',
  BRIDGE: '/bridge',
  ROOMS: '/rooms',
  VAULT: '/vault',
  JOIN: '/join',
  COMPANIES: '/companies',
  SETTINGS: '/settings',
  PROFILE: '/account',
} as const;

// Company sizes
export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
] as const;

// File upload constraints
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 50 * 1024 * 1024 * 1024, // 50GB
  CHUNK_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/*',
    'video/*',
    'audio/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/*',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
  ],
  PREVIEW_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
  ],
} as const;

// Drawer width for sidebar (updated to match the new design)
export const DRAWER_WIDTH = 220;

// Socket events (matching your backend)
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  FILE_UPLOAD_STARTED: 'file-upload-started',
  FILE_UPLOAD_PROGRESS: 'file-upload-progress',
  FILE_UPLOAD_COMPLETED: 'file-upload-completed',
  FILE_UPLOAD_FAILED: 'file-upload-failed',
  ROOM_LOCKED: 'room-locked',
  ROOM_UNLOCKED: 'room-unlocked',
  FILE_ADDED: 'file-added',
  FILE_UPDATED: 'file-updated',
  FILE_DELETED: 'file-deleted',
} as const;
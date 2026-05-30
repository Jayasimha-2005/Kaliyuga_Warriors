/**
 * Constants used throughout the application
 */

// API endpoints
export const API_ENDPOINTS = {
  LINKS: '/links',
  COLLECTIONS: '/collections',
  USERS: '/users',
  STATS: '/stats'
}

// UI Messages
export const MESSAGES = {
  SUCCESS: 'Operation completed successfully!',
  ERROR: 'An error occurred. Please try again.',
  LOADING: 'Loading...',
  DELETE_CONFIRM: 'Are you sure you want to delete this?',
  LOGIN_REQUIRED: 'Please log in to continue.',
  UNAUTHORIZED: 'You do not have permission to access this resource.'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'link_hub_user',
  AUTH_TOKEN: 'link_hub_auth_token',
  THEME: 'link_hub_theme',
  PREFERENCES: 'link_hub_preferences'
}

// Validation Rules
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_URL_LENGTH: 2048,
  MAX_TITLE_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
}

// Colors (Hex values)
export const COLORS = {
  PRIMARY: '#64b5f6',
  PRIMARY_DARK: '#1976d2',
  SECONDARY: '#7c4dff',
  SUCCESS: '#26c6da',
  ERROR: '#ff6b6b',
  WARNING: '#ffa726',
  INFO: '#64b5f6',
  DARK: '#0f0c29',
  LIGHT: '#ffffff'
}

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 300,
  NORMAL: 500,
  SLOW: 800
}

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  PHONE: /^[\d\s\-\+\(\)]{10,}$/
}

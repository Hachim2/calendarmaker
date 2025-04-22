/**
 * Global application constants
 */

// Application Information
export const APP_NAME = 'Edupro';
export const APP_VERSION = '0.1.0';

// API endpoints and routes
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Authentication
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Date formats
export const DATE_FORMAT = 'MMMM dd, yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = `${DATE_FORMAT} '${TIME_FORMAT}'`;

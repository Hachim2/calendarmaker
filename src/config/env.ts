/**
 * Environment variables configuration
 * 
 * This file handles all environment variables used in the application
 * with proper typing and default values.
 */

// Define the shape of environment variables
interface EnvVariables {
  // App
  NEXT_PUBLIC_APP_URL: string;
  
  // API
  NEXT_PUBLIC_API_BASE_URL?: string;
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  
  // Sanity
  NEXT_PUBLIC_SANITY_PROJECT_ID: string;
  NEXT_PUBLIC_SANITY_DATASET: string;
  NEXT_PUBLIC_SANITY_API_VERSION: string;
}

// Get environment variables with fallbacks
// Note: process.env comes from Next.js and @types/node
// If this file gives type errors, make sure @types/node is installed:
// npm install --save-dev @types/node
export const env: EnvVariables = {
  // App
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // API  
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // Sanity
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
};

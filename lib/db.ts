/**
 * Database Connection Helper (Server-Only)
 * 
 * Uses @neondatabase/serverless for PostgreSQL connection.
 * This module provides a reusable SQL client for all database operations.
 * 
 * IMPORTANT: This file should ONLY be imported in server components
 * and API routes, not in client components.
 */

import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

// Re-export types and constants from shared module for convenience
export { PROGRAMS, type Program, type ProgressRecord } from './programs'

// Lazy initialization to avoid crash if DATABASE_URL is missing at module load
let _sql: NeonQueryFunction<false, false> | null = null

/**
 * Get the SQL client with lazy initialization.
 * Returns null if DATABASE_URL is not configured.
 */
export function getDb(): NeonQueryFunction<false, false> | null {
  if (_sql) return _sql
  
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('[db] DATABASE_URL environment variable is not set')
    return null
  }
  
  _sql = neon(connectionString)
  return _sql
}

/**
 * Check if the database is configured
 */
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL
}

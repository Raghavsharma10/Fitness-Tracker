/**
 * Shared Types and Constants for Fitness Programs
 * 
 * This file contains type definitions and program configurations
 * that can be safely imported by both client and server components.
 * 
 * IMPORTANT: This file does NOT import the database connection,
 * making it safe for client-side use.
 */

/**
 * Type definitions for the progress_records table
 * 
 * The composite key (user_id, program_type, program_id, metric_name)
 * ensures complete data isolation between different programs.
 */
export interface ProgressRecord {
  user_id: string
  program_type: string
  program_id: string
  metric_name: string
  value: number
  updated_at: string
}

/**
 * Program configuration type
 * Maps UI-friendly names to database identifiers
 */
export interface Program {
  id: string
  name: string
  program_type: string
  program_id: string
}

/**
 * Available programs for the demo
 * 
 * Each program has a unique combination of program_type and program_id
 * that forms part of the composite key for data isolation.
 */
export const PROGRAMS: Program[] = [
  {
    id: 'weight_loss',
    name: 'Weight Loss Program',
    program_type: 'weight_loss',
    program_id: 'weight_loss_program'
  },
  {
    id: 'strength',
    name: 'Strength Training Program',
    program_type: 'strength',
    program_id: 'strength_program'
  }
]

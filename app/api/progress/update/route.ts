/**
 * POST /api/progress/update
 *
 * Updates or inserts a fitness progress metric for a specific user and program.
 *
 * ISOLATION STRATEGY:
 * Uses PostgreSQL INSERT ... ON CONFLICT DO UPDATE (UPSERT) pattern when DATABASE_URL is set.
 * With no DATABASE_URL, the same semantics are applied to a local JSON file store.
 */

import { NextResponse } from 'next/server'
import { upsertProgress } from '@/lib/progress-repository'

interface UpdateProgressRequest {
  user_id: string
  program_type: string
  program_id: string
  metric_name: string
  value: number
}

export async function POST(request: Request) {
  try {
    const body: UpdateProgressRequest = await request.json()

    const { user_id, program_type, program_id, metric_name, value } = body

    if (!user_id || !program_type || !program_id || !metric_name || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, program_type, program_id, metric_name, value' },
        { status: 400 }
      )
    }

    if (typeof value !== 'number' || isNaN(value)) {
      return NextResponse.json({ error: 'Value must be a valid number' }, { status: 400 })
    }

    const record = await upsertProgress({
      user_id,
      program_type,
      program_id,
      metric_name,
      value,
    })

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      record,
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}

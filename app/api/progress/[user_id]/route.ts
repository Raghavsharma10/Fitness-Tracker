/**
 * GET /api/progress/:user_id?program_type=X&program_id=Y
 *
 * Retrieves all progress metrics for a specific user and program.
 *
 * ISOLATION GUARANTEE:
 * This endpoint REQUIRES both program_type and program_id query parameters.
 * The WHERE clause filters by ALL components of the composite key,
 * ensuring that ONLY metrics for the specified program are returned.
 */

import { NextResponse } from 'next/server'
import { listProgress } from '@/lib/progress-repository'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params
    const { searchParams } = new URL(request.url)
    const program_type = searchParams.get('program_type')
    const program_id = searchParams.get('program_id')

    if (!program_type || !program_id) {
      return NextResponse.json(
        { error: 'Missing required query parameters: program_type, program_id' },
        { status: 400 }
      )
    }

    const records = await listProgress({
      user_id,
      program_type,
      program_id,
    })

    return NextResponse.json({
      success: true,
      user_id,
      program_type,
      program_id,
      records,
      count: records.length,
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

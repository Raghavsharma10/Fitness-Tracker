import 'server-only'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

import { getDb, isDatabaseConfigured } from '@/lib/db'
import type { ProgressRecord } from '@/lib/programs'

export type ListProgressParams = {
  user_id: string
  program_type: string
  program_id: string
}

export type UpsertProgressParams = ListProgressParams & {
  metric_name: string
  value: number
}

const DATA_DIR = path.join(process.cwd(), '.data')
const DATA_FILE = path.join(DATA_DIR, 'progress-records.json')

/** Serialize concurrent file reads/writes for the demo store */
let fileQueue: Promise<unknown> = Promise.resolve()

function enqueueFileTask<T>(fn: () => Promise<T>): Promise<T> {
  const run = fileQueue.then(fn, fn)
  fileQueue = run.then(
    () => undefined,
    () => undefined
  )
  return run
}

function normalizeRecord(row: Record<string, unknown>): ProgressRecord {
  const updated = row.updated_at
  return {
    user_id: String(row.user_id),
    program_type: String(row.program_type),
    program_id: String(row.program_id),
    metric_name: String(row.metric_name),
    value: Number(row.value),
    updated_at:
      updated instanceof Date
        ? updated.toISOString()
        : typeof updated === 'string'
          ? updated
          : new Date(String(updated)).toISOString(),
  }
}

async function listFromNeon(params: ListProgressParams): Promise<ProgressRecord[]> {
  const sql = getDb()
  if (!sql) throw new Error('Database not configured')

  const rows = await sql`
    SELECT 
      user_id,
      program_type,
      program_id,
      metric_name,
      value,
      updated_at
    FROM progress_records
    WHERE 
      user_id = ${params.user_id}
      AND program_type = ${params.program_type}
      AND program_id = ${params.program_id}
    ORDER BY metric_name ASC
  `

  return (rows as Record<string, unknown>[]).map(normalizeRecord)
}

async function upsertNeon(params: UpsertProgressParams): Promise<ProgressRecord> {
  const sql = getDb()
  if (!sql) throw new Error('Database not configured')

  const result = await sql`
    INSERT INTO progress_records (user_id, program_type, program_id, metric_name, value, updated_at)
    VALUES (${params.user_id}, ${params.program_type}, ${params.program_id}, ${params.metric_name}, ${params.value}, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id, program_type, program_id, metric_name)
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `

  const row = (result as Record<string, unknown>[])[0]
  if (!row) throw new Error('Upsert returned no row')
  return normalizeRecord(row)
}

async function readFileStore(): Promise<ProgressRecord[]> {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map((r) => normalizeRecord(r as Record<string, unknown>))
  } catch (e) {
    const err = e as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return []
    throw e
  }
}

async function writeFileStore(records: ProgressRecord[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8')
}

async function listFromFile(params: ListProgressParams): Promise<ProgressRecord[]> {
  return enqueueFileTask(async () => {
    const all = await readFileStore()
    return all
      .filter(
        (r) =>
          r.user_id === params.user_id &&
          r.program_type === params.program_type &&
          r.program_id === params.program_id
      )
      .sort((a, b) => a.metric_name.localeCompare(b.metric_name))
  })
}

async function upsertFile(params: UpsertProgressParams): Promise<ProgressRecord> {
  return enqueueFileTask(async () => {
    const all = await readFileStore()
    const now = new Date().toISOString()
    const idx = all.findIndex(
      (r) =>
        r.user_id === params.user_id &&
        r.program_type === params.program_type &&
        r.program_id === params.program_id &&
        r.metric_name === params.metric_name
    )
    const row: ProgressRecord = {
      user_id: params.user_id,
      program_type: params.program_type,
      program_id: params.program_id,
      metric_name: params.metric_name,
      value: params.value,
      updated_at: now,
    }
    if (idx >= 0) all[idx] = row
    else all.push(row)
    await writeFileStore(all)
    return row
  })
}

export function usesNeonPersistence(): boolean {
  return isDatabaseConfigured()
}

export async function listProgress(params: ListProgressParams): Promise<ProgressRecord[]> {
  if (usesNeonPersistence()) {
    return listFromNeon(params)
  }
  return listFromFile(params)
}

export async function upsertProgress(params: UpsertProgressParams): Promise<ProgressRecord> {
  if (usesNeonPersistence()) {
    return upsertNeon(params)
  }
  return upsertFile(params)
}

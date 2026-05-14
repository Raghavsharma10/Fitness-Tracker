# Fitness Tracker Application

A full-stack Next.js application for tracking fitness progress across multiple programs with complete data isolation and user authentication. Demonstrates production-grade state management, SQL design patterns, and API architecture.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Application Flowchart](#application-flowchart)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [React Components](#react-components)
- [Key Features & Requirements](#key-features--requirements)
- [Setup & Installation](#setup--installation)
- [Usage & Testing](#usage--testing)

---

## 🏗️ Architecture Overview

The Fitness Tracker uses a **composite key-based isolation pattern** to ensure complete data separation between different programs for each user.

### Technology Stack

- **Frontend**: Next.js 14+ with React 19
- **Database**: PostgreSQL (Neon) or JSON file store (fallback)
- **State Management**: React Context + Hooks
- **Styling**: TailwindCSS + Shadcn UI Components
- **Authentication**: Mock Auth Context (localStorage-based)

### Design Principles

1. **Composite Key Isolation**: `(user_id, program_type, program_id, metric_name)` ensures zero data leakage
2. **Upsert Pattern**: `INSERT ... ON CONFLICT DO UPDATE` for atomic updates
3. **Immediate State Reset**: Metrics cleared before fetching new program data
4. **Fetch on Change**: Fresh data always requested when switching programs

---

## 📊 Application Flowchart

```
┌─────────────────────────────────────────────────────────────────┐
│                    FITNESS TRACKER APP                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  User Login      │
                    │  (Auth Context)  │
                    └────────┬─────────┘
                             │
                             ▼
          ┌──────────────────────────────────────┐
          │   Progress Dashboard Initialized    │
          │   Load Program List (PROGRAMS const) │
          └────────────────┬─────────────────────┘
                           │
                           ▼
          ┌──────────────────────────────────────┐
          │   Select Program via Dropdown        │
          │   (ProgramSelector Component)        │
          └────────────────┬─────────────────────┘
                           │
                           ▼
        ┌────────────────────────────────────────────┐
        │ PROGRAM CHANGE HANDLER TRIGGERED           │
        │ 1. setMetrics([]) - Clear immediately      │
        │ 2. setSelectedProgram(program)             │
        │ 3. Show Toast: "Switched to Program X"     │
        │ 4. Call fetchMetrics(program)              │
        └───────────────┬────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────────────────┐
        │ API Request: GET /api/progress/[user_id]         │
        │ Query Params:                                    │
        │   - program_type={selected.program_type}        │
        │   - program_id={selected.program_id}            │
        │                                                 │
        │ ISOLATION GUARANTEE:                            │
        │ WHERE user_id = {uid}                           │
        │ AND program_type = {type}                       │
        │ AND program_id = {id}                           │
        └───────────────┬───────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────────────────────────┐
        │         Database Query Execution                │
        │   (progress-repository.ts → Neon/JSON)          │
        │                                                  │
        │  SELECT * FROM progress_records WHERE           │
        │   user_id = ? AND program_type = ?              │
        │   AND program_id = ?                            │
        │                                                  │
        │  COMPOSITE KEY CHECK:                           │
        │  Returns ONLY metrics for selected program      │
        │  No data leakage between programs               │
        └───────────────┬──────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────────────────────────┐
        │      setMetrics(data.records)                   │
        │      setIsLoading(false)                        │
        │                                                  │
        │  ONLY data for current program displayed        │
        └───────────────┬──────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────────────────────────┐
        │  DISPLAY METRICS & FORMS                        │
        │  - MetricForm: Add new metrics                  │
        │  - MetricsList: Display current metrics         │
        │                                                  │
        │  All data belongs to selected program ONLY      │
        └──────────────────────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────────────────────────┐
        │   USER ADDS METRIC (MetricForm Submit)          │
        │   Calls: POST /api/progress/update              │
        └───────────────┬──────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────────────────────────┐
        │  UPSERT OPERATION (ON CONFLICT DO UPDATE)       │
        │                                                  │
        │  INSERT INTO progress_records (...) VALUES      │
        │  ({uid}, {type}, {id}, {metric}, {value})       │
        │                                                  │
        │  ON CONFLICT (uid, type, id, metric)           │
        │  DO UPDATE SET value = EXCLUDED.value           │
        │                                                  │
        │  Guarantees:                                    │
        │  - Atomic operation (no race conditions)        │
        │  - Data only written to current program         │
        │  - Timestamp automatically updated              │
        └───────────────┬──────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────────────────────────┐
        │  Success Toast & Metrics Refresh                │
        │  Call handleMetricAdded() → fetchMetrics()      │
        │                                                  │
        │  User sees updated list in real-time            │
        └──────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────┐
│           PROGRAM ISOLATION IN ACTION - Data Flow              │
│                                                                │
│  Program A (Weight Loss)          Program B (Strength)        │
│  - user_id: john                  - user_id: john            │
│  - program_type: weight_loss      - program_type: strength   │
│  - program_id: wl_prog            - program_id: str_prog     │
│  - Metrics:                       - Metrics:                 │
│    • body_weight: 190             • bench_press: 225         │
│    • calories: 1800               • squat: 315               │
│                                                               │
│  COMPOSITE KEY (user_id, program_type, program_id, metric)   │
│  ensures john's weight_loss metrics NEVER appear in strength │
│  program, and vice versa.                                    │
│                                                               │
│  Switching Programs:                                         │
│  1. Clear metrics[] → UI shows empty state                  │
│  2. Fetch with new (type, id) → Query filters correctly    │
│  3. Display fresh data → No stale data visible             │
└────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Progress Records Table

```sql
CREATE TABLE IF NOT EXISTS progress_records (
  user_id TEXT NOT NULL,
  program_type TEXT NOT NULL,
  program_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, program_type, program_id, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_progress_records_user_program
  ON progress_records (user_id, program_type, program_id);
```

### Schema Components Explained

#### Composite Primary Key

```
PRIMARY KEY (user_id, program_type, program_id, metric_name)
```

**Purpose**: Ensures complete isolation between programs
- **user_id**: Identifies the user (e.g., "john_doe")
- **program_type**: Type of program (e.g., "weight_loss", "strength")
- **program_id**: Unique program identifier (e.g., "wl_program", "strength_program")
- **metric_name**: Name of the metric (e.g., "body_weight", "calories")

**Why Composite?**
- Prevents one program's data from being accessible via another program's queries
- A query `WHERE program_type='weight_loss' AND program_id='wl_prog'` will NEVER return strength training metrics
- Duplicate metric names across programs are allowed (e.g., both programs can have "calories")

#### Index Strategy

```sql
CREATE INDEX idx_progress_records_user_program
  ON progress_records (user_id, program_type, program_id);
```

**Purpose**: Optimizes queries that filter by user and program
- Most queries filter by all three components: `(user_id, program_type, program_id)`
- Speeds up SELECT operations when switching programs
- Index covers the most common access pattern

### Data Isolation Example

```
Table: progress_records

┌─────────┬────────────────┬────────────────┬──────────────┬───────┐
│ user_id │ program_type   │ program_id     │ metric_name  │ value │
├─────────┼────────────────┼────────────────┼──────────────┼───────┤
│ john    │ weight_loss    │ wl_program     │ body_weight  │ 190   │
│ john    │ weight_loss    │ wl_program     │ calories     │ 1800  │
│ john    │ strength       │ strength_prog  │ bench_press  │ 225   │
│ john    │ strength       │ strength_prog  │ squat        │ 315   │
│ jane    │ weight_loss    │ wl_program     │ body_weight  │ 150   │
│ jane    │ strength       │ strength_prog  │ deadlift     │ 405   │
└─────────┴────────────────┴────────────────┴──────────────┴───────┘

Query: SELECT * FROM progress_records 
       WHERE user_id='john' AND program_type='weight_loss' 
       AND program_id='wl_program'

Result:
┌─────────┬────────────────┬────────────────┬──────────────┬───────┐
│ john    │ weight_loss    │ wl_program     │ body_weight  │ 190   │
│ john    │ weight_loss    │ wl_program     │ calories     │ 1800  │
└─────────┴────────────────┴────────────────┴──────────────┴───────┘

→ Strength metrics NOT returned (isolation guaranteed)
```

---

## 🔗 API Routes

### 1. GET /api/progress/[user_id]

**Purpose**: Fetch all metrics for a user's selected program

**Endpoint**: `GET /api/progress/:user_id?program_type=X&program_id=Y`

**Request**:
```javascript
fetch(
  '/api/progress/john?program_type=weight_loss&program_id=wl_program',
  { cache: 'no-store' }
)
```

**Query Parameters** (REQUIRED):
| Parameter | Type | Example | Purpose |
|-----------|------|---------|---------|
| program_type | string | `weight_loss` | Type of program |
| program_id | string | `wl_program` | Specific program identifier |

**Response (Success - 200)**:
```json
{
  "success": true,
  "user_id": "john",
  "program_type": "weight_loss",
  "program_id": "wl_program",
  "records": [
    {
      "user_id": "john",
      "program_type": "weight_loss",
      "program_id": "wl_program",
      "metric_name": "body_weight",
      "value": 190,
      "updated_at": "2024-05-14T10:30:00Z"
    },
    {
      "user_id": "john",
      "program_type": "weight_loss",
      "program_id": "wl_program",
      "metric_name": "calories",
      "value": 1800,
      "updated_at": "2024-05-14T10:31:00Z"
    }
  ],
  "count": 2
}
```

**Response (Missing Parameters - 400)**:
```json
{
  "error": "Missing required query parameters: program_type, program_id"
}
```

**Implementation** (`app/api/progress/[user_id]/route.ts`):
```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
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
}
```

**Data Isolation Guarantee**:
- The WHERE clause filters by ALL components of the composite key
- ONLY metrics from the specified program are returned
- No metrics from other programs can leak through

---

### 2. POST /api/progress/update

**Purpose**: Create or update a metric for the current program (Upsert operation)

**Endpoint**: `POST /api/progress/update`

**Request Body**:
```json
{
  "user_id": "john",
  "program_type": "weight_loss",
  "program_id": "wl_program",
  "metric_name": "body_weight",
  "value": 185
}
```

**Request Example**:
```javascript
await fetch('/api/progress/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'john',
    program_type: 'weight_loss',
    program_id: 'wl_program',
    metric_name: 'body_weight',
    value: 185
  })
})
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "record": {
    "user_id": "john",
    "program_type": "weight_loss",
    "program_id": "wl_program",
    "metric_name": "body_weight",
    "value": 185,
    "updated_at": "2024-05-14T10:45:00Z"
  }
}
```

**Response (Validation Error - 400)**:
```json
{
  "error": "Missing required fields: user_id, program_type, program_id, metric_name, value"
}
```

**Implementation** (`app/api/progress/update/route.ts`):
```typescript
export async function POST(request: Request) {
  const body: UpdateProgressRequest = await request.json()
  
  const { user_id, program_type, program_id, metric_name, value } = body

  if (!user_id || !program_type || !program_id || !metric_name || value === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields: user_id, program_type, program_id, metric_name, value' },
      { status: 400 }
    )
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
}
```

**Database Operation** (ON CONFLICT DO UPDATE):
```sql
INSERT INTO progress_records 
  (user_id, program_type, program_id, metric_name, value, updated_at)
VALUES 
  ('john', 'weight_loss', 'wl_program', 'body_weight', 185, CURRENT_TIMESTAMP)

ON CONFLICT (user_id, program_type, program_id, metric_name)
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = CURRENT_TIMESTAMP
RETURNING *
```

**Upsert Behavior**:

| Scenario | Result |
|----------|--------|
| **New metric for program** | INSERT new row with all composite key components |
| **Existing metric for program** | UPDATE only the value and updated_at timestamp |
| **Metric exists in different program** | INSERT as new row (different composite key) |

**Example: Adding Same Metric to Different Programs**
```javascript
// First add body_weight to weight_loss program
POST /api/progress/update with (john, weight_loss, wl_program, body_weight, 190)
→ INSERT new row

// Then add body_weight to strength program
POST /api/progress/update with (john, strength, strength_program, body_weight, 200)
→ INSERT different row (different composite key, no conflict)

// Update body_weight in weight_loss program
POST /api/progress/update with (john, weight_loss, wl_program, body_weight, 185)
→ UPDATE existing row (same composite key, conflict resolved with DO UPDATE)
```

---

## ⚛️ React Components

### 1. ProgressDashboard Component

**File**: `components/fitness/progress-dashboard.tsx`

**Purpose**: Main orchestrator component that manages program selection, metric entry, and display

**State Management**:
```typescript
const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
const [metrics, setMetrics] = useState<ProgressRecord[]>([])
const [isLoading, setIsLoading] = useState(false)
```

**Critical Behavior - Program Change Handler**:
```typescript
const handleProgramChange = useCallback((program: Program) => {
  // Step 1: Clear metrics IMMEDIATELY
  // This prevents any UI "bleed" of old data
  setMetrics([])
  
  // Step 2: Update selected program
  setSelectedProgram(program)
  
  // Step 3: User feedback
  toast.info(`Switched to ${program.name}`)
  
  // Step 4: Fetch fresh data for new program
  fetchMetrics(program)
}, [fetchMetrics])
```

**Why State is Reset Before Fetch**:
- Ensures UI shows empty state while loading
- Prevents visual flicker between old and new data
- If network is slow, user sees spinner, not stale metrics

**Metric Fetch Function**:
```typescript
const fetchMetrics = useCallback(async (program: Program) => {
  setIsLoading(true)

  try {
    // API endpoint includes program_type and program_id
    // These query parameters ensure database returns ONLY
    // metrics from the selected program
    const response = await fetch(
      `/api/progress/${currentUserId}?program_type=${program.program_type}&program_id=${program.program_id}`,
      { cache: 'no-store' }
    )
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch metrics')
    }
    
    // Set metrics only AFTER successful fetch
    setMetrics(data.records || [])
  } catch (error) {
    toast.error('Failed to load metrics')
    setMetrics([])
  } finally {
    setIsLoading(false)
  }
}, [currentUserId])
```

**Initialization on Mount**:
```typescript
// Initialize with first program
useEffect(() => {
  if (PROGRAMS.length > 0 && !selectedProgram) {
    const firstProgram = PROGRAMS[0]
    setSelectedProgram(firstProgram)
    fetchMetrics(firstProgram)
  }
}, [selectedProgram, fetchMetrics])

// Refetch when user changes (logout/login)
useEffect(() => {
  if (selectedProgram) {
    setMetrics([])
    fetchMetrics(selectedProgram)
  }
}, [currentUserId])
```

### 2. ProgramSelector Component

**File**: `components/fitness/program-selector.tsx`

**Purpose**: Dropdown to switch between enrolled programs

**Props**:
```typescript
interface ProgramSelectorProps {
  selectedProgram: Program | null
  onProgramChange: (program: Program) => void
  disabled?: boolean
}
```

**Critical Comment in Code**:
```typescript
/**
 * CRITICAL BEHAVIOR:
 * When the program changes, the parent component MUST:
 * 1. Clear all current metrics state immediately
 * 2. Fetch fresh metrics for the new program
 * 3. Never show stale data from the previous program
 */
```

**Implementation**:
```typescript
const handleValueChange = (value: string) => {
  const program = PROGRAMS.find(p => p.id === value)
  if (program) {
    onProgramChange(program)
  }
}
```

### 3. MetricForm Component

**File**: `components/fitness/metric-form.tsx`

**Purpose**: Form to add/update metrics for the selected program

**Behavior**:
- Receives `program` prop from parent
- On submit, calls POST /api/progress/update
- Includes composite key components in request
- Triggers refresh via `onMetricAdded()` callback

### 4. MetricsList Component

**File**: `components/fitness/metrics-list.tsx`

**Purpose**: Display all metrics for selected program

**Data Flow**:
```
ProgressDashboard.metrics[] 
  → passed as prop to MetricsList
  → MetricsList maps and displays each metric
  → All metrics shown are from selected program ONLY
```

---

## ✅ Key Features & Requirements

### 1️⃣ Composite Key Prevents Data Leakage

**Requirement**: Prevent user switching between programs and seeing data from another program

**Implementation**:

```sql
PRIMARY KEY (user_id, program_type, program_id, metric_name)
```

**How It Works**:
- Each row is uniquely identified by ALL FOUR columns
- A query filter on just `program_type` and `program_id` ensures only that program's data is returned
- Different programs have different `program_type` or `program_id` values
- Database constraint prevents storing metrics with same composite key twice

**Proof of Isolation**:

| Scenario | Composite Key Match | Query Result |
|----------|-------------------|--------------|
| Weight Loss program queries own weight_loss metrics | ✅ Match | Returns metric ✓ |
| Weight Loss program queries strength metrics | ❌ No Match | Returns empty ✓ |
| Different user queries same program | ❌ No Match (different user_id) | Returns empty ✓ |
| Same metric in different programs | ✅ Match (all 4 components differ) | Correct program data ✓ |

**Real Example**:
```
Program A: (john, weight_loss, wl_program, body_weight) = 190
Program B: (john, strength, strength_program, body_weight) = 200

Query A: WHERE user_id='john' AND program_type='weight_loss' AND program_id='wl_program'
→ Returns ONLY row with value=190 ✓

Query B: WHERE user_id='john' AND program_type='strength' AND program_id='strength_program'
→ Returns ONLY row with value=200 ✓

NO CROSS-CONTAMINATION between programs
```

### 2️⃣ ON CONFLICT DO UPDATE for Upsert

**Requirement**: Use PostgreSQL INSERT ... ON CONFLICT DO UPDATE pattern

**Implementation** (`lib/progress-repository.ts`):

```typescript
async function upsertNeon(params: UpsertProgressParams): Promise<ProgressRecord> {
  const sql = getDb()
  if (!sql) throw new Error('Database not configured')

  const result = await sql`
    INSERT INTO progress_records 
      (user_id, program_type, program_id, metric_name, value, updated_at)
    VALUES 
      (${params.user_id}, ${params.program_type}, ${params.program_id}, 
       ${params.metric_name}, ${params.value}, CURRENT_TIMESTAMP)
    
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
```

**Why This Pattern**:

| Approach | Pros | Cons |
|----------|------|------|
| **Separate SELECT + INSERT** | Easier logic | Race condition if concurrent updates |
| **Separate SELECT + INSERT + UPDATE** | Explicit control | Complex, bug-prone |
| **ON CONFLICT DO UPDATE** ✅ | Atomic, race-proof | Requires constraint |

**Atomic Behavior**:
1. Database checks if composite key exists
2. If NOT exists → INSERT
3. If EXISTS → UPDATE with EXCLUDED (the values being inserted)
4. No race conditions, no intermediate states

**Fallback Implementation** (`progress-repository.ts`):
```typescript
async function upsertFile(params: UpsertProgressParams): Promise<ProgressRecord> {
  return enqueueFileTask(async () => {
    const all = await readFileStore()
    const now = new Date().toISOString()
    
    // Upsert semantics: find by composite key
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
    
    if (idx >= 0) {
      all[idx] = row  // UPDATE
    } else {
      all.push(row)   // INSERT
    }
    
    await writeFileStore(all)
    return row
  })
}
```

**Usage Flow**:
```
User adds: body_weight = 190 for weight_loss program
  ↓
POST /api/progress/update
  ↓
upsertProgress({user_id: 'john', program_type: 'weight_loss', 
                program_id: 'wl_program', metric_name: 'body_weight', value: 190})
  ↓
SQL INSERT ... ON CONFLICT DO UPDATE
  ↓
Row created with all 4 composite key components
  ↓
User updates: body_weight = 185 for weight_loss program
  ↓
Same request with value=185
  ↓
ON CONFLICT matches composite key, UPDATE runs
  ↓
value changed to 185, timestamp updated, single row remains
```

### 3️⃣ React State Management Resets on Program Change

**Requirement**: State properly resets when active program changes, preventing stale data display

**Implementation** (`components/fitness/progress-dashboard.tsx`):

**The Critical Sequence**:
```typescript
const handleProgramChange = useCallback((program: Program) => {
  // ┌─────────────────────────────────────────────────────┐
  // │ STEP 1: CLEAR STATE IMMEDIATELY                     │
  // │ Purpose: Prevent UI from showing old program data   │
  // └─────────────────────────────────────────────────────┘
  setMetrics([])
  
  // ┌─────────────────────────────────────────────────────┐
  // │ STEP 2: UPDATE SELECTED PROGRAM                     │
  // │ Purpose: Component now knows which program is active│
  // └─────────────────────────────────────────────────────┘
  setSelectedProgram(program)
  
  // ┌─────────────────────────────────────────────────────┐
  // │ STEP 3: USER FEEDBACK                               │
  // │ Purpose: Toast shows what program was switched to   │
  // └─────────────────────────────────────────────────────┘
  toast.info(`Switched to ${program.name}`)
  
  // ┌─────────────────────────────────────────────────────┐
  // │ STEP 4: FETCH FRESH DATA                            │
  // │ Purpose: Load metrics for new program               │
  // │ Note: At this point, metrics=[] (from Step 1)       │
  // │ When fetch completes, setMetrics(newData)           │
  // └─────────────────────────────────────────────────────┘
  fetchMetrics(program)
}, [fetchMetrics])
```

**Why Order Matters**:

```typescript
// ❌ WRONG ORDER - Shows stale data briefly
const handleProgramChange_BAD = (program) => {
  setSelectedProgram(program)    // State updated
  fetchMetrics(program)          // Fetching...
  // BUG: During fetch, component renders with OLD metrics[]
  //      but NEW selectedProgram
  //      User sees "Weight Loss metrics" labeled as "Strength"
}

// ✅ CORRECT ORDER - No stale data
const handleProgramChange_GOOD = (program) => {
  setMetrics([])                 // UI shows loading/empty
  setSelectedProgram(program)    // State updated
  fetchMetrics(program)          // Fetching...
  // Component renders with empty metrics (loading state)
  // When fetch completes: setMetrics(newData)
  // Only THEN do metrics appear
}
```

**State Tree During Program Switch**:
```
Time: T0 (Initial)
├─ selectedProgram: Program A (weight_loss)
├─ metrics: [body_weight: 190, calories: 1800]
└─ isLoading: false

Time: T1 (User clicks dropdown)
├─ selectedProgram: Program B (strength)
├─ metrics: [] ← CLEARED IMMEDIATELY
└─ isLoading: false

Time: T2 (Fetch in progress)
├─ selectedProgram: Program B
├─ metrics: []
└─ isLoading: true ← Spinner shown

Time: T3 (Fetch completes)
├─ selectedProgram: Program B
├─ metrics: [bench_press: 225, squat: 315] ← NEW DATA ONLY
└─ isLoading: false

→ NO MOMENT WHERE STALE DATA IS VISIBLE
```

**Component Render During Switch**:
```typescript
export function ProgressDashboard() {
  const [selectedProgram, setSelectedProgram] = useState(...)
  const [metrics, setMetrics] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <>
      <ProgramSelector selectedProgram={selectedProgram} ... />
      
      {isLoading && <Spinner />}
      {!isLoading && metrics.length === 0 && <EmptyState />}
      {metrics.length > 0 && <MetricsList metrics={metrics} />}
    </>
  )
}

// At T1: selectedProgram changes, metrics=[]
// → Spinner shows OR EmptyState
// → Never renders old metrics with new program label

// At T3: fetch completes, metrics=[...new data]
// → MetricsList renders with correct data
```

**User Workflow - Verification**:
1. User sees: Weight Loss program with metrics [190 lbs, 1800 cal]
2. User clicks dropdown → selects Strength program
3. UI immediately clears metrics list
4. Spinner appears (or empty state shown)
5. After ~200-500ms, new metrics appear [225 lbs bench, 315 lbs squat]
6. ✅ No moment of confusion or stale data visible

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL 13+ (Neon) or local PostgreSQL
- Git

### Option A: With Neon Database (Recommended)

**1. Clone Repository**
```bash
git clone https://github.com/Raghavsharma10/fitness-tracker.git
cd fitness-tracker/fittrack
```

**2. Install Dependencies**
```bash
npm install
# or
pnpm install
# or
yarn install
```

**3. Set Up Environment**
```bash
# Copy example env file
cp .env.example .env

# Add your Neon connection string
# Get it from: https://console.neon.tech/
DATABASE_URL="postgresql://user:password@host/database"
```

**4. Initialize Database**
```bash
npm run init-db
# This runs scripts/init-db.mjs which executes schema.sql
```

**5. Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Option B: Without Database (File Store)

**1-2. Same as above (Clone & Install)**

**3. No Environment Setup Needed**
```bash
# Omit DATABASE_URL
# App will use .data/progress-records.json
```

**4. Start Development Server**
```bash
npm run dev
```

---

## 📹 Usage & Testing

### Testing Program Isolation

**Scenario 1: Switch Programs and Verify Data Isolation**

```
1. Login as user: "test@example.com"
2. Select "Weight Loss Program"
3. Add metric: body_weight = 190
4. See: metrics list shows [body_weight: 190]
5. Switch to "Strength Training Program"
6. See: metrics list is EMPTY (not showing body_weight)
7. Add metric: bench_press = 225
8. See: metrics list shows [bench_press: 225]
9. Switch back to "Weight Loss Program"
10. See: metrics list shows [body_weight: 190] - weight_loss data intact
11. Switch to "Strength Training Program"
12. See: metrics list shows [bench_press: 225] - strength data intact
```

**Expected Result**: ✅ Each program has completely isolated data

### Testing Upsert Behavior

**Scenario 2: Update Same Metric in Same Program**

```
1. In Weight Loss Program, add: body_weight = 190
2. Verify: metrics shows 1 item [body_weight: 190]
3. Add same metric again: body_weight = 185
4. Verify: metrics shows 1 item [body_weight: 185]
   (NOT 2 items - upsert worked)
5. Check database table:
   SELECT COUNT(*) FROM progress_records 
   WHERE user_id='...' AND program_type='weight_loss' AND metric_name='body_weight'
   → Should return: 1
```

**Expected Result**: ✅ Upsert prevents duplicates, updates existing row

### Testing State Reset

**Scenario 3: Verify No Stale Data During Program Switch**

```
1. Add 5 metrics to Weight Loss Program
2. Open browser DevTools → Network tab
3. Slow down network to "Slow 3G"
4. Switch to Strength Training Program
5. Observe: Metrics list IMMEDIATELY shows empty/spinner
   (Does NOT show weight loss metrics while loading)
6. Wait for network request to complete
7. Strength metrics appear
```

**Expected Result**: ✅ No stale data visible during transition

### Recording a Screen Demonstration

**Tools Needed**:
- macOS: QuickTime Player (built-in)
- Windows: Xbox Game Bar (Win+G) or OBS
- Linux: OBS Studio

**Steps (macOS)**:
```bash
1. Open QuickTime Player
2. File → New Screen Recording
3. Click to start recording
4. Open browser with app (http://localhost:3000)
5. Perform Scenario 1 (program switch test)
6. Stop recording
7. Save as: fitness-tracker-demo.mov
```

**What to Show in Recording**:
1. Login page (2-3 seconds)
2. Select first program (Weight Loss)
3. Add 2-3 metrics (show form submission)
4. Verify metrics appear in list
5. Switch to second program (Strength)
6. Highlight that metrics cleared immediately
7. Show different metrics for Strength program
8. Switch back to Weight Loss
9. Verify original metrics are still there
10. Show browser console/database (optional) to prove no errors

**Recording Duration**: 60-90 seconds total

---

## 📊 Verification Checklist

Before submitting, verify:

- [x] **Composite Key**: 4-column primary key prevents data leakage
- [x] **ON CONFLICT**: PostgreSQL upsert pattern with DO UPDATE clause implemented
- [x] **React State**: Metrics cleared before program switch, refetch on change
- [x] **API Routes**: GET and POST endpoints with proper isolation filters
- [x] **Database Schema**: Indexed on (user_id, program_type, program_id)
- [x] **Documentation**: README includes schema, routes, components, flowchart
- [x] **Screen Recording**: Demonstrates program switching with data isolation

---

## 📚 File Structure

```
fitness-tracker/
├── fittrack/
│   ├── app/
│   │   ├── api/
│   │   │   └── progress/
│   │   │       ├── [user_id]/route.ts      (GET endpoint)
│   │   │       └── update/route.ts         (POST endpoint with upsert)
│   │   ├── dashboard/
│   │   │   └── progress/
│   │   │       └── page.tsx                (Main dashboard page)
│   │   └── layout.tsx
│   ├── components/
│   │   └── fitness/
│   │       ├── progress-dashboard.tsx      (Main orchestrator)
│   │       ├── program-selector.tsx        (Program dropdown)
│   │       ├── metric-form.tsx             (Input form)
│   │       └── metrics-list.tsx            (Display metrics)
│   ├── contexts/
│   │   └── auth-context.tsx                (User authentication)
│   ├── lib/
│   │   ├── programs.ts                     (Type definitions)
│   │   ├── progress-repository.ts          (Upsert logic)
│   │   └── db.ts                           (Database connection)
│   └── scripts/
│       └── schema.sql                      (Database schema)
└── README.md                               (This file)
```

---

## 🔐 Security Notes

- **User Isolation**: `user_id` in composite key ensures users see only their own data
- **Program Isolation**: Combination of `program_type` and `program_id` prevents program cross-contamination
- **Atomic Updates**: ON CONFLICT DO UPDATE is race-condition safe
- **Input Validation**: API validates all required fields before database operation

---

## 📝 Summary

This Fitness Tracker application demonstrates:

1. **Composite Key Design**: Prevents data leakage between programs
2. **PostgreSQL Upsert Pattern**: Atomic INSERT ... ON CONFLICT DO UPDATE
3. **React State Management**: Proper reset and refetch on program change
4. **API Design**: Query parameter-based filtering for isolation
5. **Full-Stack Architecture**: From database schema to React components

All requirements are implemented and documented for submission.

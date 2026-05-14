'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { ProgramSelector } from './program-selector'
import { MetricForm } from './metric-form'
import { MetricsList } from './metrics-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { PROGRAMS, type Program, type ProgressRecord } from '@/lib/programs'

import { useAuth } from '@/contexts/auth-context'

/**
 * Progress Dashboard Component
 * 
 * Main dashboard that orchestrates program selection, metric entry, and metrics display.
 * 
 * CRITICAL STATE MANAGEMENT:
 * When the active program changes:
 * 1. Metrics state is cleared IMMEDIATELY (setMetrics([]))
 * 2. Loading state is set to true
 * 3. Fresh data is fetched for the new program
 * 4. Only after fetch completes are new metrics displayed
 * 
 * This ensures NO STALE DATA from a previous program is ever shown.
 */
export function ProgressDashboard() {
  const { user } = useAuth()
  const currentUserId = user?.id || 'guest'
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [metrics, setMetrics] = useState<ProgressRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Fetch metrics for the current program
   * 
   * ISOLATION: The API endpoint requires program_type and program_id,
   * ensuring we only get metrics for the selected program.
   */
  const fetchMetrics = useCallback(async (program: Program) => {
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/progress/${currentUserId}?program_type=${program.program_type}&program_id=${program.program_id}`,
        { cache: 'no-store' }
      )
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch metrics')
      }
      
      setMetrics(data.records || [])
    } catch (error) {
      toast.error('Failed to load metrics')
      console.error('Error fetching metrics:', error)
      setMetrics([])
    } finally {
      setIsLoading(false)
    }
  }, [currentUserId])

  /**
   * Handle program change
   * 
   * CRITICAL: Clear metrics FIRST, then fetch new data.
   * This prevents any visual "bleed" of old data.
   */
  const handleProgramChange = useCallback((program: Program) => {
    // Step 1: Clear current metrics immediately
    setMetrics([])
    
    // Step 2: Update selected program
    setSelectedProgram(program)
    
    // Step 3: Show toast for user feedback
    toast.info(`Switched to ${program.name}`)
    
    // Step 4: Fetch fresh metrics for new program
    fetchMetrics(program)
  }, [fetchMetrics])

  // Initialize with first program on mount
  useEffect(() => {
    if (PROGRAMS.length > 0 && !selectedProgram) {
      const firstProgram = PROGRAMS[0]
      setSelectedProgram(firstProgram)
      fetchMetrics(firstProgram)
    }
  }, [selectedProgram, fetchMetrics])

  // Refetch when the user changes
  useEffect(() => {
    if (selectedProgram) {
      setMetrics([])
      fetchMetrics(selectedProgram)
    }
  }, [currentUserId])

  // Callback when a metric is added/updated
  const handleMetricAdded = useCallback(() => {
    if (selectedProgram) {
      fetchMetrics(selectedProgram)
    }
  }, [selectedProgram, fetchMetrics])

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Progress Tracker</h2>
            <p className="text-sm text-muted-foreground">
              Track metrics across fitness programs
            </p>
          </div>
        </div>
        <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs">User: {user?.name || 'Guest'}</span>
        </Badge>
      </div>



      {/* Program Selector */}
      <ProgramSelector
        selectedProgram={selectedProgram}
        onProgramChange={handleProgramChange}
        disabled={isLoading}
      />



      {/* Two Column Layout for Form and List on larger screens */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Metric Entry Form */}
        <MetricForm
          program={selectedProgram}
          userId={currentUserId}
          onMetricAdded={handleMetricAdded}
          onSuccess={(msg) => toast.success(msg)}
          onError={(msg) => toast.error(msg)}
        />

        {/* Metrics Display */}
        <MetricsList
          program={selectedProgram}
          metrics={metrics}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

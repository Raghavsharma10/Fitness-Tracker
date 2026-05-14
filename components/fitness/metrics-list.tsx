'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Activity, TrendingUp, Scale, Flame, Dumbbell, BarChart3 } from 'lucide-react'
import type { ProgressRecord, Program } from '@/lib/programs'

interface MetricsListProps {
  program: Program | null
  metrics: ProgressRecord[]
  isLoading: boolean
}

// Map common metric names to icons
function getMetricIcon(metricName: string) {
  const name = metricName.toLowerCase()
  if (name.includes('weight')) return <Scale className="h-5 w-5 text-blue-500" />
  if (name.includes('calories')) return <Flame className="h-5 w-5 text-orange-500" />
  if (name.includes('bench') || name.includes('squat') || name.includes('deadlift')) {
    return <Dumbbell className="h-5 w-5 text-primary" />
  }
  if (name.includes('workout')) return <Activity className="h-5 w-5 text-emerald-500" />
  return <TrendingUp className="h-5 w-5 text-primary" />
}

// Format metric names for display
function formatMetricName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

// Format the timestamp for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Metrics List Component
 * 
 * Displays all progress metrics for the currently selected program.
 * 
 * ISOLATION DISPLAY:
 * - Only shows metrics for the active program
 * - When program changes, this component receives new metrics array
 * - Never displays cached/stale metrics from another program
 */
export function MetricsList({ program, metrics, isLoading }: MetricsListProps) {
  if (!program) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
          <CardDescription>
            Select a program to view metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">No program selected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
        <CardDescription>
          {metrics.length} metric{metrics.length !== 1 ? 's' : ''} for {program.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner className="h-8 w-8 text-primary" />
            <span className="mt-3 text-sm text-muted-foreground">Loading metrics...</span>
          </div>
        ) : metrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
              <Activity className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="font-medium text-muted-foreground">No metrics yet</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Add your first metric using the form
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {metrics.map((metric) => (
              <div
                key={`${metric.program_type}-${metric.program_id}-${metric.metric_name}`}
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-secondary/20 p-4 transition-all duration-200 hover:border-primary/20 hover:bg-secondary/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm transition-transform duration-200 group-hover:scale-105">
                  {getMetricIcon(metric.metric_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">
                    {formatMetricName(metric.metric_name)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Updated {formatDate(metric.updated_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {Number(metric.value).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

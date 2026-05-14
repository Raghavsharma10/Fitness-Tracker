'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Loader2 } from 'lucide-react'
import type { Program } from '@/lib/programs'

interface MetricFormProps {
  program: Program | null
  userId: string
  onMetricAdded: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

/**
 * Metric Entry Form
 * 
 * Allows users to add or update metrics for the currently selected program.
 * 
 * ISOLATION BEHAVIOR:
 * - Submits to /api/progress/update with program_type and program_id
 * - Uses INSERT ... ON CONFLICT DO UPDATE on the backend
 * - Metric is scoped to the specific program via composite key
 */
export function MetricForm({
  program,
  userId,
  onMetricAdded,
  onSuccess,
  onError
}: MetricFormProps) {
  const [metricName, setMetricName] = useState('')
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!program) {
      onError('Please select a program first')
      return
    }

    if (!metricName.trim() || !value.trim()) {
      onError('Please fill in all fields')
      return
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      onError('Value must be a valid number')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          program_type: program.program_type,
          program_id: program.program_id,
          metric_name: metricName.trim().toLowerCase().replace(/\s+/g, '_'),
          value: numValue
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update metric')
      }

      onSuccess(`Metric "${metricName}" updated successfully`)
      setMetricName('')
      setValue('')
      onMetricAdded()
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update metric')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Add New Metric</CardTitle>
        <CardDescription>
          {program 
            ? `Recording for ${program.name}`
            : 'Select a program first'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="metric-name" className="text-sm font-medium">
              Metric Name
            </Label>
            <Input
              id="metric-name"
              placeholder="e.g., bench_press_max"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              disabled={!program || isSubmitting}
              className="h-11 bg-secondary/30 border-border/50 transition-colors focus:bg-background"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="metric-value" className="text-sm font-medium">
              Value
            </Label>
            <Input
              id="metric-value"
              type="number"
              step="any"
              placeholder="e.g., 120"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!program || isSubmitting}
              className="h-11 bg-secondary/30 border-border/50 transition-colors focus:bg-background"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!program || isSubmitting}
            className="h-11 w-full font-medium transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Metric
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PROGRAMS, type Program } from '@/lib/programs'

interface ProgramSelectorProps {
  selectedProgram: Program | null
  onProgramChange: (program: Program) => void
  disabled?: boolean
}

/**
 * Program Selector Component
 * 
 * Allows users to switch between their enrolled fitness programs.
 * 
 * CRITICAL BEHAVIOR:
 * When the program changes, the parent component MUST:
 * 1. Clear all current metrics state immediately
 * 2. Fetch fresh metrics for the new program
 * 3. Never show stale data from the previous program
 */
export function ProgramSelector({
  selectedProgram,
  onProgramChange,
  disabled = false
}: ProgramSelectorProps) {
  const handleValueChange = (value: string) => {
    const program = PROGRAMS.find(p => p.id === value)
    if (program) {
      onProgramChange(program)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="program-select" className="text-sm font-medium">
        Active Program
      </Label>
      <Select
        value={selectedProgram?.id ?? ''}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger id="program-select" className="w-full md:w-[280px]">
          <SelectValue placeholder="Select a program" />
        </SelectTrigger>
        <SelectContent>
          {PROGRAMS.map((program) => (
            <SelectItem key={program.id} value={program.id}>
              {program.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

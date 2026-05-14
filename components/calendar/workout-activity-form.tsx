'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  useWorkoutCalendar, 
  WORKOUT_CATEGORIES, 
  type WorkoutActivity, 
  type WorkoutCategory 
} from '@/contexts/workout-calendar-context'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const workoutFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  notes: z.string().max(500, 'Notes are too long').optional(),
  category: z.enum(['strength', 'cardio', 'flexibility', 'hiit', 'sports', 'rest'] as const),
  completed: z.boolean(),
})

type WorkoutFormValues = z.infer<typeof workoutFormSchema>

interface WorkoutActivityFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
  activity?: WorkoutActivity // For editing existing activity
}

export function WorkoutActivityForm({
  open,
  onOpenChange,
  selectedDate,
  activity,
}: WorkoutActivityFormProps) {
  const { addActivity, updateActivity } = useWorkoutCalendar()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!activity

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      title: activity?.title || '',
      notes: activity?.notes || '',
      category: activity?.category || 'strength',
      completed: activity?.completed || false,
    },
  })

  const onSubmit = async (values: WorkoutFormValues) => {
    setIsSubmitting(true)
    
    try {
      if (isEditing && activity) {
        updateActivity(activity.id, {
          title: values.title,
          notes: values.notes,
          category: values.category as WorkoutCategory,
          completed: values.completed,
        })
      } else {
        addActivity({
          date: selectedDate.toISOString().split('T')[0],
          title: values.title,
          notes: values.notes,
          category: values.category as WorkoutCategory,
          completed: values.completed,
        })
      }
      
      form.reset()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset({
        title: activity?.title || '',
        notes: activity?.notes || '',
        category: activity?.category || 'strength',
        completed: activity?.completed || false,
      })
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Workout' : 'Add Workout'}
          </DialogTitle>
          <DialogDescription>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Morning Run, Chest Day" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORKOUT_CATEGORIES.map((category) => (
                        <SelectItem 
                          key={category.value} 
                          value={category.value}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'h-3 w-3 rounded-full',
                              category.color
                            )} />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about your workout..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Mark as completed
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check this if you&apos;ve already completed this workout
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? 'Saving...' 
                  : isEditing 
                    ? 'Save Changes' 
                    : 'Add Workout'
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

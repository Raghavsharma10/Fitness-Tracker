'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  useWorkoutCalendar, 
  WORKOUT_CATEGORIES,
  type WorkoutActivity 
} from '@/contexts/workout-calendar-context'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { WorkoutActivityForm } from './workout-activity-form'
import { ActivityCard } from './activity-card'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function WorkoutCalendar() {
  const { activities, getActivitiesByDate } = useWorkoutCalendar()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<WorkoutActivity | undefined>()

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  // Get activity counts for each day
  const activityMap = useMemo(() => {
    const map = new Map<string, WorkoutActivity[]>()
    activities.forEach(activity => {
      const existing = map.get(activity.date) || []
      map.set(activity.date, [...existing, activity])
    })
    return map
  }, [activities])

  const selectedDateActivities = getActivitiesByDate(selectedDate)

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const handleToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleAddActivity = () => {
    setEditingActivity(undefined)
    setIsFormOpen(true)
  }

  const handleEditActivity = (activity: WorkoutActivity) => {
    setEditingActivity(activity)
    setIsFormOpen(true)
  }

  const getActivityIndicators = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const dayActivities = activityMap.get(dateStr) || []
    
    // Group by category and show up to 3 indicators
    const categories = [...new Set(dayActivities.map(a => a.category))]
    return categories.slice(0, 3).map(cat => {
      const category = WORKOUT_CATEGORIES.find(c => c.value === cat)
      return category?.color || 'bg-primary'
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* Calendar Grid */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="hidden sm:flex"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous month</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next month</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-px mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px rounded-lg border overflow-hidden bg-border">
            {calendarDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate)
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const indicators = getActivityIndicators(day)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    'relative min-h-[80px] sm:min-h-[100px] p-2 bg-card text-left transition-colors',
                    'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset',
                    !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                    isSelected && 'bg-primary/10 ring-2 ring-primary ring-inset'
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                      isToday(day) && 'bg-primary text-primary-foreground',
                      isSelected && !isToday(day) && 'bg-primary/20 text-primary'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  
                  {/* Activity indicators */}
                  {indicators.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                      {indicators.map((color, idx) => (
                        <div
                          key={idx}
                          className={cn('h-1.5 w-1.5 rounded-full', color)}
                        />
                      ))}
                      {activityMap.get(day.toISOString().split('T')[0])?.length! > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{activityMap.get(day.toISOString().split('T')[0])!.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Category legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            {WORKOUT_CATEGORIES.map((category) => (
              <div key={category.value} className="flex items-center gap-1.5">
                <div className={cn('h-2.5 w-2.5 rounded-full', category.color)} />
                <span className="text-xs text-muted-foreground">
                  {category.label.split('/')[0]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Activities */}
      <Card className="h-fit lg:sticky lg:top-20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                {format(selectedDate, 'EEEE')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, 'MMMM d, yyyy')}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleAddActivity}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedDateActivities.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No workouts scheduled
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-1"
                onClick={handleAddActivity}
              >
                <Plus className="h-4 w-4" />
                Add Workout
              </Button>
            </div>
          ) : (
            selectedDateActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={handleEditActivity}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Workout Activity Form Dialog */}
      <WorkoutActivityForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        selectedDate={selectedDate}
        activity={editingActivity}
      />
    </div>
  )
}

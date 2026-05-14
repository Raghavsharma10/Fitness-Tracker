'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkoutCalendar, WORKOUT_CATEGORIES } from '@/contexts/workout-calendar-context'
import { CalendarClock, ChevronRight } from 'lucide-react'
import { format, parseISO, isToday, isTomorrow } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function UpcomingActivities() {
  const { getUpcomingActivities } = useWorkoutCalendar()
  const upcomingActivities = getUpcomingActivities(5)

  const formatDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'EEE, MMM d')
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <CalendarClock className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">Upcoming Workouts</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcomingActivities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No upcoming workouts scheduled
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click on a date to add a workout
            </p>
          </div>
        ) : (
          <>
            {upcomingActivities.map((activity) => {
              const category = WORKOUT_CATEGORIES.find(c => c.value === activity.category)
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/50"
                >
                  <div className={cn('h-2 w-2 shrink-0 rounded-full', category?.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateLabel(activity.date)}
                    </p>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-xs',
                    'bg-secondary text-secondary-foreground'
                  )}>
                    {category?.label.split('/')[0]}
                  </span>
                </div>
              )
            })}
            
            <Link
              href="/dashboard/calendar"
              className="flex items-center justify-center gap-1 pt-2 text-sm text-primary hover:underline"
            >
              View all workouts
              <ChevronRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}

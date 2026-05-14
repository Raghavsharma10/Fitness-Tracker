'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  useWorkoutCalendar, 
  WORKOUT_CATEGORIES, 
  type WorkoutActivity 
} from '@/contexts/workout-calendar-context'
import { MoreHorizontal, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityCardProps {
  activity: WorkoutActivity
  onEdit: (activity: WorkoutActivity) => void
  variant?: 'default' | 'compact'
}

export function ActivityCard({ activity, onEdit, variant = 'default' }: ActivityCardProps) {
  const { deleteActivity, toggleComplete } = useWorkoutCalendar()

  const category = WORKOUT_CATEGORIES.find(c => c.value === activity.category)

  const handleDelete = () => {
    deleteActivity(activity.id)
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
          'hover:bg-accent/50',
          activity.completed && 'opacity-60'
        )}
      >
        <button
          onClick={() => toggleComplete(activity.id)}
          className="shrink-0"
        >
          {activity.completed ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <div className={cn('h-2 w-2 shrink-0 rounded-full', category?.color)} />
        <span className={cn(
          'flex-1 truncate text-sm',
          activity.completed && 'line-through text-muted-foreground'
        )}>
          {activity.title}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(activity)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-200',
      'hover:shadow-md hover:border-primary/30',
      activity.completed && 'opacity-70'
    )}>
      <div className={cn('absolute left-0 top-0 h-full w-1', category?.color)} />
      <CardContent className="p-4 pl-5">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={activity.completed}
            onCheckedChange={() => toggleComplete(activity.id)}
            className="mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className={cn(
                'font-medium truncate',
                activity.completed && 'line-through text-muted-foreground'
              )}>
                {activity.title}
              </h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => onEdit(activity)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                'bg-secondary text-secondary-foreground'
              )}>
                <div className={cn('h-2 w-2 rounded-full', category?.color)} />
                {category?.label}
              </span>
            </div>
            {activity.notes && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {activity.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

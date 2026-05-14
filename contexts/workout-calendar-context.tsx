'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useAuth } from '@/contexts/auth-context'

export type WorkoutCategory = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'hiit'
  | 'sports'
  | 'rest'

export const WORKOUT_CATEGORIES: { value: WorkoutCategory; label: string; color: string }[] = [
  { value: 'strength', label: 'Strength Training', color: 'bg-orange-500' },
  { value: 'cardio', label: 'Cardio', color: 'bg-red-500' },
  { value: 'flexibility', label: 'Flexibility/Yoga', color: 'bg-emerald-500' },
  { value: 'hiit', label: 'HIIT', color: 'bg-yellow-500' },
  { value: 'sports', label: 'Sports', color: 'bg-blue-500' },
  { value: 'rest', label: 'Rest Day', color: 'bg-slate-500' },
]

export interface WorkoutActivity {
  id: string
  userId: string
  date: string // ISO date string (YYYY-MM-DD)
  title: string
  notes?: string
  category: WorkoutCategory
  completed: boolean
  createdAt: string
  updatedAt: string
}

interface WorkoutCalendarContextType {
  activities: WorkoutActivity[]
  isLoading: boolean
  addActivity: (activity: Omit<WorkoutActivity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  updateActivity: (id: string, updates: Partial<Omit<WorkoutActivity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => void
  deleteActivity: (id: string) => void
  toggleComplete: (id: string) => void
  getActivitiesByDate: (date: Date) => WorkoutActivity[]
  getUpcomingActivities: (limit?: number) => WorkoutActivity[]
}

const WorkoutCalendarContext = createContext<WorkoutCalendarContextType | undefined>(undefined)

const STORAGE_KEY = 'fitness_tracker_workouts'

export function WorkoutCalendarProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [activities, setActivities] = useState<WorkoutActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load activities from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setActivities(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
    }
  }, [activities, isLoading])

  const addActivity = useCallback((
    activity: Omit<WorkoutActivity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) return

    const newActivity: WorkoutActivity = {
      ...activity,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setActivities(prev => [...prev, newActivity])
  }, [user])

  const updateActivity = useCallback((
    id: string,
    updates: Partial<Omit<WorkoutActivity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id
          ? { ...activity, ...updates, updatedAt: new Date().toISOString() }
          : activity
      )
    )
  }, [])

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id))
  }, [])

  const toggleComplete = useCallback((id: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id
          ? { ...activity, completed: !activity.completed, updatedAt: new Date().toISOString() }
          : activity
      )
    )
  }, [])

  const getActivitiesByDate = useCallback((date: Date): WorkoutActivity[] => {
    const dateStr = date.toISOString().split('T')[0]
    return activities
      .filter(activity => activity.date === dateStr && activity.userId === user?.id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }, [activities, user])

  const getUpcomingActivities = useCallback((limit = 5): WorkoutActivity[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]

    return activities
      .filter(activity => 
        activity.date >= todayStr && 
        activity.userId === user?.id &&
        !activity.completed
      )
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit)
  }, [activities, user])

  return (
    <WorkoutCalendarContext.Provider
      value={{
        activities,
        isLoading,
        addActivity,
        updateActivity,
        deleteActivity,
        toggleComplete,
        getActivitiesByDate,
        getUpcomingActivities,
      }}
    >
      {children}
    </WorkoutCalendarContext.Provider>
  )
}

export function useWorkoutCalendar() {
  const context = useContext(WorkoutCalendarContext)
  if (context === undefined) {
    throw new Error('useWorkoutCalendar must be used within a WorkoutCalendarProvider')
  }
  return context
}

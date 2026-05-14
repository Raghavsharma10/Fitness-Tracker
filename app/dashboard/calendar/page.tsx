'use client'

import { DashboardTopHeader } from '@/components/dashboard/dashboard-top-header'
import { WorkoutCalendar } from '@/components/calendar/workout-calendar'

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopHeader 
        title="Workout Calendar"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Workout Calendar' }
        ]}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              Workout Calendar
            </h1>
            <p className="mt-1 text-muted-foreground">
              Plan and track your workout schedule
            </p>
          </div>

          {/* Calendar Component */}
          <WorkoutCalendar />
        </div>
      </main>
    </div>
  )
}

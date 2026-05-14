'use client'

import { DashboardTopHeader } from '@/components/dashboard/dashboard-top-header'
import { StatCard, StatsGrid } from '@/components/dashboard/stat-card'
import { UpcomingActivities } from '@/components/calendar/upcoming-activities'
import { Activity, Flame, Target, Dumbbell } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopHeader 
        title="Dashboard"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              Welcome back!
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here&apos;s an overview of your fitness journey
            </p>
          </div>

          {/* Stats Overview */}
          <section className="mb-8">
            <StatsGrid>
              <StatCard
                title="Active Days"
                value="24"
                change={12}
                trend="up"
                icon={<Activity className="h-6 w-6 text-primary" />}
              />
              <StatCard
                title="Calories Burned"
                value="12,450"
                change={8}
                trend="up"
                icon={<Flame className="h-6 w-6 text-orange-500" />}
                iconBg="bg-orange-500/10"
              />
              <StatCard
                title="Goals Completed"
                value="8/12"
                change={-5}
                trend="down"
                changeLabel="vs last month"
                icon={<Target className="h-6 w-6 text-emerald-500" />}
                iconBg="bg-emerald-500/10"
              />
              <StatCard
                title="Workouts"
                value="32"
                change={15}
                trend="up"
                icon={<Dumbbell className="h-6 w-6 text-primary" />}
              />
            </StatsGrid>
          </section>

          {/* Activities Section */}
          <section className="grid gap-6">
            <UpcomingActivities />
          </section>
        </div>
      </main>
    </div>
  )
}

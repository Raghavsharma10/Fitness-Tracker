import { ProgressDashboard } from '@/components/fitness/progress-dashboard'
import { DashboardTopHeader } from '@/components/dashboard/dashboard-top-header'

export default function ProgressPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopHeader 
        title="Progress Tracker"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Progress Tracker' }]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <ProgressDashboard />
        </div>
      </main>
    </div>
  )
}

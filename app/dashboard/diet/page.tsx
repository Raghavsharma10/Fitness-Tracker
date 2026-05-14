import { DashboardTopHeader } from '@/components/dashboard/dashboard-top-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Utensils } from 'lucide-react'

export default function DietPlansPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopHeader 
        title="Diet Plans"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Diet Plans' }]}
      />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Utensils className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-semibold">Diet Plans Coming Soon</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <CardDescription className="text-sm leading-relaxed">
                We are actively working on a comprehensive meal tracking and diet planning feature. Stay tuned!
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, TrendingUp, Shield } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">New: AI-Powered Insights</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in stagger-1 max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Transform Your{' '}
            <span className="text-primary">Fitness Journey</span>{' '}
            Today
          </h1>

          {/* Subheading */}
          <p className="animate-fade-in stagger-2 mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Track your progress, achieve your goals, and unlock your full potential with our 
            comprehensive fitness tracking platform. Join thousands of athletes reaching their peaks.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in stagger-3 mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in stagger-4 mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>AI-Powered</span>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="animate-slide-up stagger-5 relative mt-16 w-full max-w-4xl">
            <div className="neon-glow overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl">
              <div className="flex items-center gap-2 border-b border-border/50 bg-muted/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <DashboardPreviewCard 
                    title="Weekly Progress"
                    value="+12%"
                    description="vs last week"
                    accent
                  />
                  <DashboardPreviewCard 
                    title="Workouts"
                    value="24"
                    description="this month"
                  />
                  <DashboardPreviewCard 
                    title="Calories Burned"
                    value="18,450"
                    description="total"
                  />
                </div>
                <div className="mt-4 h-32 rounded-lg bg-muted/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardPreviewCard({ 
  title, 
  value, 
  description, 
  accent = false 
}: { 
  title: string
  value: string
  description: string
  accent?: boolean 
}) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-muted/30'}`}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? 'text-primary' : ''}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

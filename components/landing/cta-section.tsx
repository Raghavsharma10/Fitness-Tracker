import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="border-t border-border/50 bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="neon-glow relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 md:p-12">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
              Join thousands of athletes who are already tracking their progress and achieving their goals with FitTrack.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2 px-8">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. Start tracking in minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

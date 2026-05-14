import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: "FitTrack completely transformed how I approach my fitness goals. The analytics are incredible and helped me identify areas where I was slacking.",
    author: "Sarah Johnson",
    role: "Marathon Runner",
    rating: 5
  },
  {
    quote: "As a personal trainer, I recommend FitTrack to all my clients. The multi-program feature is perfect for managing different training phases.",
    author: "Mike Chen",
    role: "Personal Trainer",
    rating: 5
  },
  {
    quote: "The real-time sync across devices is a game changer. I can log my workouts on my phone and review them on my laptop instantly.",
    author: "Emily Rodriguez",
    role: "Crossfit Athlete",
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Loved by Athletes Everywhere
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            See what our community has to say about their experience with FitTrack.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="relative overflow-hidden border-border/50 bg-card/50"
            >
              <CardContent className="p-6">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-pretty text-muted-foreground">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

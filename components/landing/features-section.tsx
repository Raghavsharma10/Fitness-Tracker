import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  Target, 
  Users, 
  Smartphone, 
  Shield, 
  Zap 
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track your progress with detailed charts and insights. Visualize your fitness journey with beautiful, interactive dashboards.'
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set personalized fitness goals and track your progress towards achieving them. Stay motivated with milestone celebrations.'
  },
  {
    icon: Users,
    title: 'Multi-Program Support',
    description: 'Manage multiple fitness programs simultaneously with complete data isolation. Switch between programs seamlessly.'
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access your fitness data anywhere, anytime. Our responsive design works perfectly on all devices.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We use industry-standard security practices to protect your information.'
  },
  {
    icon: Zap,
    title: 'Real-time Sync',
    description: 'Changes sync instantly across all your devices. Never lose track of your progress again.'
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Our comprehensive platform provides all the tools you need to track, analyze, 
            and improve your fitness performance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group relative overflow-hidden border-border/50 bg-card/50 transition-all hover:border-primary/30 hover:shadow-lg dark:hover:shadow-primary/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

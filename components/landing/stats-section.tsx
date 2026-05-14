const stats = [
  {
    value: '50K+',
    label: 'Active Users',
    description: 'Athletes tracking their progress'
  },
  {
    value: '2M+',
    label: 'Workouts Logged',
    description: 'And counting every day'
  },
  {
    value: '99.9%',
    label: 'Uptime',
    description: 'Reliable performance'
  },
  {
    value: '4.9/5',
    label: 'User Rating',
    description: 'From verified reviews'
  }
]

export function StatsSection() {
  return (
    <section id="stats" className="border-y border-border/50 bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            By The Numbers
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Trusted by Athletes Worldwide
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Join a community of fitness enthusiasts who are transforming their health and achieving their goals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="group relative text-center"
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/5 transition-all group-hover:border-primary/40 group-hover:bg-primary/10">
                <span className="text-3xl font-bold text-primary">{stat.value}</span>
              </div>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

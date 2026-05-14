'use client'

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Bell, Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface DashboardTopHeaderProps {
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function DashboardTopHeader({ 
  title = 'Dashboard',
  breadcrumbs = [{ label: 'Dashboard' }]
}: DashboardTopHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 backdrop-blur-lg transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2 px-4">
        {/* Left section: Sidebar trigger and breadcrumbs */}
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={crumb.label}>
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <BreadcrumbLink href={crumb.href || '#'}>
                      {crumb.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Mobile title */}
        <h1 className="font-semibold md:hidden">{title}</h1>

        {/* Right section: Search, notifications, theme toggle */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search bar - hidden on mobile */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-64 pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
            />
          </div>

          {/* Search button for mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Quick add button */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Plus className="h-5 w-5" />
            <span className="sr-only">Quick Add</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            {/* Notification badge */}
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          </Button>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

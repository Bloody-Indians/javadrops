"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/lib/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/student/dashboard",
      label: "Student Portal",
      active: pathname.startsWith("/student"),
    },
    {
      href: "/agent/dashboard",
      label: "Agent Portal",
      active: pathname.startsWith("/agent"),
    },
    {
      href: "/admin/dashboard",
      label: "Admin Portal",
      active: pathname.startsWith("/admin"),
    },
    {
      href: "/marketplace",
      label: "Online Market",
      active: pathname.startsWith("/marketplace"),
    },
    {
      href: "/support",
      label: "Support",
      active: pathname.startsWith("/support"),
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-10 w-10">
            <Image src="/javadrops-logo.png" alt="JavaDrops Logo" fill className="object-contain" />
          </div>
          <span className="hidden font-bold sm:inline-block">JavaDrops</span>
        </Link>
        <nav className="hidden flex-1 md:flex md:justify-center">
          <ul className="flex items-center space-x-1">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-md",
                    route.active ? "text-primary bg-muted" : "text-muted-foreground",
                  )}
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-end space-x-4 flex-1">
          {user ? (
            <UserNav />
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="md:hidden">
              <nav className="flex flex-col gap-4 pt-10">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                      route.active ? "text-primary bg-muted" : "text-muted-foreground",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

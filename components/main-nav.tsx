"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MainNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/aws-training",
      label: "AWS Training",
      active: pathname.startsWith("/aws-training"),
    },
    {
      href: "/student/dashboard",
      label: "Student",
      active: pathname.startsWith("/student"),
    },
    {
      href: "/agent/dashboard",
      label: "Agent",
      active: pathname.startsWith("/agent"),
    },
    {
      href: "/admin/dashboard",
      label: "Admin",
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
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-10 w-10">
            <Image src="/Javadrops.png" alt="JavaDrops Logo" fill className="object-contain" />
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
                    "text-sm font-medium transition-colors hover:text-blue-600 px-4 py-2 rounded-md",
                    route.active ? "text-blue-600 bg-blue-50" : "text-gray-600",
                  )}
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-end space-x-4 flex-1">
          {session ? (
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
"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { createContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export const AuthContext = createContext<{
  user: any
  role: string | null
  loading: boolean
}>({
  user: null,
  role: null,
  loading: true,
})

function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [role, setRole] = useState<string | null>(null)
  const loading = status === "loading"

  useEffect(() => {
    if (session?.user) {
      // Determine role based on session data or fetch from API
      // This is a simplified example
      const path = window.location.pathname
      if (path.startsWith("/admin")) {
        setRole("admin")
      } else if (path.startsWith("/agent")) {
        setRole("agent")
      } else if (path.startsWith("/student")) {
        setRole("student")
      } else {
        setRole("user")
      }
    } else {
      setRole(null)
    }
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        role,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthStateProvider>{children}</AuthStateProvider>
    </SessionProvider>
  )
}

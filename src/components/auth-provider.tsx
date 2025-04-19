"use client"

import type React from "react"

import { SessionProvider, useSession } from "next-auth/react"
import { createContext, useContext } from "react"

const AuthContext = createContext({
  user: null,
  loading: true,
})

// This component uses useSession and must be wrapped by SessionProvider
function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const user = session?.user || null
  const loading = status === "loading"

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Main AuthProvider that wraps everything with SessionProvider first
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

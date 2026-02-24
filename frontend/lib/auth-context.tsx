"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export interface User {
  id: string
  fullName: string
  email: string
  role: string
  department: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "sst_auth_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState(true)

  // Fetch the current user on mount to see if they still have a valid session cookie
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include", // Let browser auto-send the HttpOnly cookie
        })

        if (response.ok) {
          const data = await response.json()
          const backendUser = data.user
          const userData: User = {
            id: backendUser.id || backendUser.email,
            fullName: backendUser.name || backendUser.email,
            email: backendUser.email,
            role: backendUser.role || "staff",
            department: "",
          }
          setUser(userData)
        } else {
          // Cookie expired or missing. Clear user state.
          setUser(null)
          localStorage.removeItem(STORAGE_KEY)
          sessionStorage.removeItem(STORAGE_KEY)
        }
      } catch (err) {
        console.error("Session check failed:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [])

  const signIn = useCallback(
    async (email: string, password: string, remember?: boolean) => {
      setIsLoading(true)
      try {
        // We include credentials: 'include' so that the browser sends and receives the HttpOnly cookie
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        })

        const data = await response.json()

        if (!response.ok) {
          return {
            success: false,
            error: data.error || "Invalid email or password",
          }
        }

        const backendUser = data.user
        const userData: User = {
          id: backendUser.id || email,
          fullName: backendUser.name || email,
          email: backendUser.email || email,
          role: backendUser.role || "staff",
          department: "",
        }

        setUser(userData)

        // Storing the user object only. The Token is safely hidden inside the browser's HttpOnly cookie!
        const storage = remember ? localStorage : sessionStorage
        storage.setItem(STORAGE_KEY, JSON.stringify(userData))

        return { success: true }
      } catch (err) {
        console.error("Login error:", err)
        return {
          success: false,
          error: "Unable to connect to the server. Please try again.",
        }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    try {
      // Tell backend to clear the HttpOnly cookie
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout failed:", err)
    }

    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    window.location.href = "/landing"
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

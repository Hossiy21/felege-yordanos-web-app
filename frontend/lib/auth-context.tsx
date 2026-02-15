"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

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
  signUp: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS = [
  {
    id: "1",
    fullName: "Admin User",
    email: "admin@sst.org",
    password: "admin123",
    role: "Admin",
    department: "Administration",
  },
  {
    id: "2",
    fullName: "Demo User",
    email: "demo@sst.org",
    password: "demo123",
    role: "Management",
    department: "Education",
  },
]

const STORAGE_KEY = "sst_auth_user"
const USERS_KEY = "sst_registered_users"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const getRegisteredUsers = useCallback(() => {
    try {
      const stored = localStorage.getItem(USERS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }, [])

  const signIn = useCallback(
    async (email: string, password: string, remember?: boolean) => {
      // Check demo users
      const demoUser = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )

      if (demoUser) {
        const { password: _, ...userData } = demoUser
        setUser(userData)
        if (remember) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        } else {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        }
        return { success: true }
      }

      // Check registered users
      const registered = getRegisteredUsers()
      const registeredUser = registered.find(
        (u: { email: string; password: string }) =>
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )

      if (registeredUser) {
        const { password: _, ...userData } = registeredUser
        setUser(userData)
        if (remember) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        } else {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        }
        return { success: true }
      }

      return { success: false, error: "Invalid email or password" }
    },
    [getRegisteredUsers]
  )

  const signUp = useCallback(
    async (fullName: string, email: string, password: string) => {
      // Check if email exists in demo users
      const existsInDemo = DEMO_USERS.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      )
      if (existsInDemo) {
        return { success: false, error: "An account with this email already exists" }
      }

      // Check registered users
      const registered = getRegisteredUsers()
      const existsInRegistered = registered.some(
        (u: { email: string }) => u.email.toLowerCase() === email.toLowerCase()
      )
      if (existsInRegistered) {
        return { success: false, error: "An account with this email already exists" }
      }

      const newUser = {
        id: crypto.randomUUID(),
        fullName,
        email,
        password,
        role: "User",
        department: "General",
      }

      registered.push(newUser)
      localStorage.setItem(USERS_KEY, JSON.stringify(registered))

      const { password: _, ...userData } = newUser
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))

      return { success: true }
    },
    [getRegisteredUsers]
  )

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    router.push("/landing")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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

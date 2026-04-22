"use client"

import { useState } from "react"
import { UsersTable, type User } from "@/components/users/users-table"
import { AddUserDialog } from "@/components/users/add-user-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Users, ShieldCheck, Briefcase, UserMinus, RefreshCcw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"

const INITIAL_USERS: User[] = [
  {
    name: "System Admin",
    email: "admin@church.com",
    role: "admin",
    department: "none",
    status: "Active",
    lastLogin: "Feb 26, 2026",
    initials: "SA",
  },
  {
    name: "News Lead",
    email: "news@church.com",
    role: "user",
    department: "news",
    status: "Active",
    lastLogin: "Feb 26, 2026",
    initials: "NL",
  },
  {
    name: "Letter Staff",
    email: "letters@church.com",
    role: "user",
    department: "letters",
    status: "Active",
    lastLogin: "Feb 26, 2026",
    initials: "LS",
  },
]

export default function UserManagementPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddUser = async (newUser: Omit<User, "lastLogin" | "initials" | "status">) => {
    setIsAdding(true)
    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          department: newUser.department,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create user")
      }

      const createdUser = await response.json()

      const user: User = {
        name: createdUser.full_name,
        email: createdUser.email,
        role: createdUser.role,
        department: createdUser.department,
        status: "Active",
        lastLogin: "Never",
        initials: createdUser.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
      }

      setUsers([user, ...users])
    } catch (error) {
      console.error("Error adding user:", error)
      alert("Failed to create user account.")
    } finally {
      setIsAdding(false)
    }
  }

  const totalUsers = users.length
  const admins = users.filter((u) => u.role === "admin").length
  const staff = users.filter((u) => u.role === "user").length
  const inactive = users.filter((u) => u.status === "Inactive").length

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {t("user_mgmt_title")}
          </h1>
          <p className="text-muted-foreground mt-1 max-w-lg">
            Manage your organization's members, roles, and department access from a single dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="group">
            <RefreshCcw className="h-4 w-4 group-active:rotate-180 transition-transform duration-500" />
          </Button>
          <AddUserDialog onAddUser={handleAddUser}>
            <Button
              className="gap-2 bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
              disabled={isAdding}
            >
              <Plus className="h-4 w-4" />
              {isAdding ? "Working..." : t("add_user")}
            </Button>
          </AddUserDialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Members</p>
                <p className="text-3xl font-bold mt-1">{totalUsers}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-blue-500/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Administrators</p>
                <p className="text-3xl font-bold mt-1 text-blue-600 dark:text-blue-400">{admins}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-purple-500/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Staff / Users</p>
                <p className="text-3xl font-bold mt-1 text-purple-600 dark:text-purple-400">{staff}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-red-500/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Inactive</p>
                <p className="text-3xl font-bold mt-1 text-red-600 dark:text-red-400">{inactive}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <UserMinus className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <UsersTable users={users} />
    </div>
  )
}

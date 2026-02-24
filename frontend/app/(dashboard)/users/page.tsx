"use client"

import { useState } from "react"
import { UsersTable, type User } from "@/components/users/users-table"
import { AddUserDialog } from "@/components/users/add-user-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const INITIAL_USERS: User[] = [
  {
    name: "Admin User",
    email: "admin@sst.org",
    role: "Admin",
    department: "Administration",
    status: "Active",
    lastLogin: "Feb 8, 2026",
    initials: "AU",
  },
  {
    name: "Abebe Tadesse",
    email: "abebe@sst.org",
    role: "Management",
    department: "Education",
    status: "Active",
    lastLogin: "Feb 8, 2026",
    initials: "AT",
  },
  {
    name: "Sara Mekonnen",
    email: "sara@sst.org",
    role: "Approver",
    department: "Finance",
    status: "Active",
    lastLogin: "Feb 7, 2026",
    initials: "SM",
  },
  {
    name: "Daniel Kebede",
    email: "daniel@sst.org",
    role: "Executive",
    department: "Administration",
    status: "Active",
    lastLogin: "Feb 6, 2026",
    initials: "DK",
  },
  {
    name: "Helen Girma",
    email: "helen@sst.org",
    role: "Audit",
    department: "Administration",
    status: "Active",
    lastLogin: "Feb 5, 2026",
    initials: "HG",
  },
  {
    name: "Kidus Alemayehu",
    email: "kidus@sst.org",
    role: "Management",
    department: "Education",
    status: "Inactive",
    lastLogin: "Jan 20, 2026",
    initials: "KA",
  },
]

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)

  const handleAddUser = (newUser: Omit<User, "lastLogin" | "initials" | "status">) => {
    const user: User = {
      ...newUser,
      status: "Active",
      lastLogin: "Never",
      initials: newUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
    }
    setUsers([user, ...users])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            User Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage system users and role assignments
          </p>
        </div>
        <AddUserDialog onAddUser={handleAddUser}>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </AddUserDialog>
      </div>
      <UsersTable users={users} />
    </div>
  )
}

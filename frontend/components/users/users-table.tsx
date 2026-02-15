"use client"

import { useState } from "react"
import { Search, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const users = [
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

function getRoleColor(role: string) {
  switch (role) {
    case "Admin":
      return "bg-red-50 text-red-700 border-red-200"
    case "Management":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Approver":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Executive":
      return "bg-slate-100 text-slate-700 border-slate-300"
    case "Audit":
      return "bg-teal-50 text-teal-700 border-teal-200"
    default:
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

export function UsersTable() {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = role === "all" || u.role === role
    return matchSearch && matchRole
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Role</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Management">Management</SelectItem>
            <SelectItem value="Approver">Approver</SelectItem>
            <SelectItem value="Executive">Executive</SelectItem>
            <SelectItem value="Audit">Audit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Role
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Department
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Last Login
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.email}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {user.department}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          user.status === "Active"
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {user.lastLogin}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label={`More options for ${user.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

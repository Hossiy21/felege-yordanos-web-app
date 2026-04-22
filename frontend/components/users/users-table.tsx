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

export interface User {
  name: string
  email: string
  role: string
  department: string
  status: "Active" | "Inactive"
  lastLogin?: string
  initials?: string
  password?: string
}

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

export function UsersTable({ users }: { users: User[] }) {
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
            <SelectItem value="Staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.email}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold uppercase">
                            {user.initials || user.name.slice(0, 2).toUpperCase()}
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
                        className={`text-xs font-normal ${getRoleColor(user.role)}`}
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
                          className={`h-2 w-2 rounded-full ${user.status === "Active"
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            : "bg-gray-400"
                            }`}
                        />
                        <span
                          className={`text-sm font-medium ${user.status === "Active"
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-muted-foreground"
                            }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground font-mono">
                      {user.lastLogin || "Never"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`More options for ${user.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

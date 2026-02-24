"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User } from "./users-table"

export function AddUserDialog({
    children,
    onAddUser,
}: {
    children: React.ReactNode
    onAddUser: (user: Omit<User, "lastLogin" | "initials" | "status">) => void
}) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [department, setDepartment] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAddUser({
            name,
            email,
            role,
            department,
        })
        setOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setName("")
        setEmail("")
        setRole("")
        setDepartment("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Create a new user account and assign a role.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Select onValueChange={setRole} required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Management">Management</SelectItem>
                                <SelectItem value="Approver">Approver</SelectItem>
                                <SelectItem value="Executive">Executive</SelectItem>
                                <SelectItem value="Audit">Audit</SelectItem>
                                <SelectItem value="Staff">Staff</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">
                            Department
                        </Label>
                        <Select onValueChange={setDepartment} required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Administration">Administration</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Youth Ministry">Youth Ministry</SelectItem>
                                <SelectItem value="Choir">Choir</SelectItem>
                                <SelectItem value="IT">IT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

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
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("user")
    const [department, setDepartment] = useState("news")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAddUser({
            name,
            email,
            password,
            role,
            department,
        })
        setOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setName("")
        setEmail("")
        setPassword("")
        setRole("user")
        setDepartment("news")
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
                        Create a new user account and assign a department.
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
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Select onValueChange={setRole} defaultValue="user" required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">
                            Dept
                        </Label>
                        <Select onValueChange={setDepartment} defaultValue="news" required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="news">News</SelectItem>
                                <SelectItem value="graphics">Graphics</SelectItem>
                                <SelectItem value="letters">Letters</SelectItem>
                                <SelectItem value="none">None</SelectItem>
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

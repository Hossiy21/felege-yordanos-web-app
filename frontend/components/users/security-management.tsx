"use client"

import { useState } from 'react'
import { Search, ShieldAlert, ShieldCheck, UserCheck, UserX, Loader2, Info, Lock, Settings2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

interface UserSecurityData {
    id: string
    full_name: string
    email: string
    role: string
    department: string
    is_active: boolean
}

export function SecurityManagement() {
    const [searchEmail, setSearchEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [searchResults, setSearchResults] = useState<UserSecurityData[]>([])

    const handleSearch = async () => {
        if (!searchEmail) return
        setIsLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users?email=${encodeURIComponent(searchEmail)}`, {
                credentials: "include",
            })
            if (response.ok) {
                const data = await response.json()
                setSearchResults(data || [])
            } else {
                toast.error("User not found")
            }
        } catch (error) {
            console.error("Search error:", error)
            toast.error("Failed to fetch users")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdatePermissions = async (userId: string, updates: Partial<UserSecurityData>) => {
        setIsUpdating(userId)
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/update-user`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, ...updates }),
                credentials: "include",
            })

            if (response.ok) {
                setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u))
                toast.success("Security settings updated")
            } else {
                toast.error("Failed to update access")
            }
        } catch (error) {
            console.error("Update error:", error)
            toast.error("An error occurred")
        } finally {
            setIsUpdating(null)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-1">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Access Control Center</h1>
                </div>
                <p className="text-muted-foreground text-lg ml-1">
                    Centralized security hub to grant, revoke, and manage departmental page access.
                </p>
            </div>

            <Card className="border-none bg-card/50 backdrop-blur-md shadow-2xl shadow-primary/5">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Search className="h-5 w-5 text-primary" />
                        Identify Personnel
                    </CardTitle>
                    <CardDescription>Locate a member account to adjust their organizational privileges.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter member email address..."
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                className="pl-9 h-12 bg-background/50 border-primary/10 focus:border-primary/30 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={isLoading} className="h-12 px-8 font-bold shadow-lg shadow-primary/20">
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Identity"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6">
                {searchResults.map((user) => (
                    <Card key={user.id} className={`overflow-hidden border-none bg-card/40 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 ${!user.is_active ? 'opacity-70 bg-muted/20' : ''}`}>
                        <div className={`h-1.5 w-full ${user.is_active ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-destructive to-red-400'}`} />
                        <CardContent className="p-0">
                            <div className="grid lg:grid-cols-[1fr_2fr] divide-y lg:divide-y-0 lg:divide-x divide-border/50">
                                <div className="p-8 space-y-6 bg-muted/10">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-extrabold text-xl tracking-tight">{user.full_name}</h3>
                                            <Badge
                                                variant={user.is_active ? "outline" : "destructive"}
                                                className={user.is_active ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/5 px-3 py-0.5 rounded-full" : "px-3 py-0.5 rounded-full"}
                                            >
                                                {user.is_active ? "Authorized" : "Revoked"}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium opacity-80">{user.email}</p>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-border/50">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Master Toggle</p>
                                        {user.is_active ? (
                                            <Button
                                                variant="destructive"
                                                className="w-full gap-2 font-bold shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02]"
                                                onClick={() => handleUpdatePermissions(user.id, { is_active: false })}
                                                disabled={isUpdating === user.id}
                                            >
                                                <UserX className="h-5 w-5" />
                                                Revoke System Access
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full gap-2 font-bold border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/5 transition-all hover:scale-[1.02]"
                                                onClick={() => handleUpdatePermissions(user.id, { is_active: true })}
                                                disabled={isUpdating === user.id}
                                            >
                                                <UserCheck className="h-5 w-5" />
                                                Restore System Access
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                                                <Settings2 className="h-4 w-4 text-primary" />
                                                Authorization Role
                                            </label>
                                            <Select
                                                defaultValue={user.role}
                                                onValueChange={(val) => handleUpdatePermissions(user.id, { role: val })}
                                                disabled={!user.is_active || isUpdating === user.id}
                                            >
                                                <SelectTrigger className="h-11 bg-background/50 border-primary/5 focus:ring-primary/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Platform Administrator</SelectItem>
                                                    <SelectItem value="user">Operational User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                                Departmental Permission (Assign Page)
                                            </label>
                                            <Select
                                                defaultValue={user.department}
                                                onValueChange={(val) => handleUpdatePermissions(user.id, { department: val })}
                                                disabled={!user.is_active || isUpdating === user.id}
                                            >
                                                <SelectTrigger className="h-11 bg-background/50 border-primary/5 focus:ring-primary/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="news">News & Media Module</SelectItem>
                                                    <SelectItem value="letters">Correspondence & Letters</SelectItem>
                                                    <SelectItem value="graphics">Creative & Design Page</SelectItem>
                                                    <SelectItem value="none">Base Dashboard Access</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <Info className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="text-sm leading-relaxed">
                                            <p className="font-bold text-primary mb-0.5">Permission Policy Note</p>
                                            <p className="text-muted-foreground font-medium">
                                                Granting page access immediately enables specific departmental dashboards.
                                                Revoking access removes all administrative rights across the entire platform.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {searchResults.length === 0 && !isLoading && searchEmail && (
                    <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-border/50 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-muted/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">Account Not Identified</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                            We couldn't find any member matching that email. Please verify the address and try again.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

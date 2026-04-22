"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, LogIn, AlertCircle, ArrowLeft, Cross, Sparkles, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please enter your credentials")
      return
    }

    setLoading(true)
    const result = await signIn(email, password, rememberMe)
    setLoading(false)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Sign in failed")
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden selection:bg-blue-500/30">
      {/* ── Immersive Background (The "Cool" Part) ── */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/cathedral/cathedral-main.jpg" 
          alt="Medhane Alem Cathedral"
          className="w-full h-full object-cover scale-110 blur-[2px] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#001229]/80 via-[#001229]/40 to-[#001229]/80" />
        {/* Subtle motion overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20">
          
          <div className="p-7 pb-8">
            {/* Logo/Icon Area */}
            <div className="flex flex-col items-center mb-6 pt-2">
               <div className="w-12 h-12 bg-[#003366] dark:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
                 <Cross className="h-6 w-6 text-[#FFB800]" />
               </div>
               <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t('sign_in', 'Sign In')}</h1>
               <p className="text-slate-500 text-xs mt-0.5">{t('access_sanctuary', 'Access the digital sanctuary')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 animate-shake">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@felegeyordanos.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</Label>
                  <Link href="/forgot-password" title="Coming Soon" className="text-[10px] font-bold text-blue-600 hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className={cn(
                  "w-full h-11 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] mt-3",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  t('sign_in', 'Sign In')
                )}
              </Button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-[10px] text-slate-400 font-medium">
                {t('need_account', 'Contact administrator for an account')}
              </p>
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-bold text-[#003366] hover:opacity-70 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t('back_to_home', 'Back to Home')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  )
}

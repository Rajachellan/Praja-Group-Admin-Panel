 'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../../services/api'

function Login() {

  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem("username") || localStorage.getItem("email") || localStorage.getItem("name")
    if (token) {
      router.replace('/dashboard')
    }
  }, [router])

  async function loginFun(e:React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
        const res = await api.post('/user/login', { email, password })
        const userName = res.data.name || res.data.email || 'Admin'
        localStorage.setItem("name", res.data.name || userName)
        localStorage.setItem("email", res.data.email || email)
        localStorage.setItem("username", userName)
        toast.success(`Welcome back, ${userName}!`)
        router.push('/dashboard')
    }
    catch(err: any){
        const errMsg = err.response?.data?.message || 'Unable to sign in. Check your credentials and try again.'
        setError(errMsg)
        toast.error(errMsg)
    } finally {
        setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-orange-100/70 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[650px] overflow-hidden bg-[#103c2a] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border-[36px] border-orange-400/20" />
          <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#166534] shadow-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black tracking-[0.2em]">PRAJHA</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-100">Groups Admin</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> Executive workspace
            </div>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight xl:text-6xl">Make every move count.</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-emerald-50/75">One focused workspace for the teams shaping better developments, stronger partnerships, and exceptional places.</p>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <ShieldCheck className="mb-5 h-5 w-5 text-orange-300" />
                <p className="text-sm font-bold">Secure access</p>
                <p className="mt-1 text-xs text-emerald-50/60">Built for your team</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <CheckCircle2 className="mb-5 h-5 w-5 text-orange-300" />
                <p className="text-sm font-bold">Live operations</p>
                <p className="mt-1 text-xs text-emerald-50/60">Data in one place</p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs font-medium text-emerald-50/50">Prajha Groups · Chennai</p>
        </section>

        <section className="flex min-h-[650px] items-center justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#166534] text-white"><Building2 className="h-6 w-6" /></div>
                <div><p className="text-sm font-black tracking-[0.2em] text-[#166534]">PRAJHA</p><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Groups Admin</p></div>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#f37924]">Welcome back</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Sign in to your workspace</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">Access your leads, teams, and group operations.</p>
            </div>

            <form onSubmit={loginFun} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-xs font-bold text-slate-700">Email address</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@prajha.com" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-emerald-100" />
                </span>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold text-slate-700">Password</span>
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-emerald-100" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>

              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{error}</p>}

              <button type="submit" disabled={loading} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#166534] text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#12542a] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Your account is protected with secure authentication
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
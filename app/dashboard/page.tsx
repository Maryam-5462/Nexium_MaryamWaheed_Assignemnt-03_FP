
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import React from 'react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
      } else {
        router.push('/login')
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1b3a] via-[#4c1d95] to-[#0f0c29] text-white px-6 py-8 animate-fadeIn transition-all duration-500">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-purple-300 drop-shadow-lg">Dashboard</h1>
          <p className="text-sm text-gray-300 mt-1">Logged in as <strong>{user?.email}</strong></p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow hover:scale-105 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link
          href="/resume"
          className="bg-white/10 backdrop-blur-xl border border-purple-500 hover:border-purple-400 hover:shadow-purple-500/30 text-white p-6 rounded-2xl shadow-md transition-all duration-300 transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">📄 My Resumes</h2>
          <p className="text-sm text-gray-300">Generate, edit, and manage tailored resumes.</p>
        </Link>

        <Link
          href="/about"
          className="bg-white/10 backdrop-blur-xl border border-purple-500 hover:border-purple-400 hover:shadow-purple-500/30 text-white p-6 rounded-2xl shadow-md transition-all duration-300 transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-2">📘 About</h2>
          <p className="text-sm text-gray-300">Understand how ResumeTailor works for you.</p>
        </Link>
      </section>
    </div>
  )
}

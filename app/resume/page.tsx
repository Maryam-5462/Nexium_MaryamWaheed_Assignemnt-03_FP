
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
export default function ResumePage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1b3a] via-[#4c1d95] to-[#0f0c29] text-white px-6 py-8 animate-fadeIn transition-all duration-500">
      
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-purple-300 drop-shadow-lg">
          Your Resumes
        </h1>
        <p className="flex flex-col sm:flex-row items-center justify-between mb-10">
          Manage and create new resumes with AI assistance.
        </p>
      </header>
<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Link href="/resume/upload" className="bg-white/10 backdrop-blur-xl border border-purple-500 hover:border-purple-400 hover:shadow-purple-500/30 text-white p-6 rounded-2xl shadow-md transition-all duration-300 transform hover:scale-105 block">
    <h3 className="text-2xl font-semibold mb-2">📤 Upload New Resume</h3>
    <p className="text-sm text-gray-300">
      Start tailoring a new resume with job description input.
    </p>
  </Link>
        <Link
  href="/resume/saved"
  className="bg-white/10 backdrop-blur-xl border border-purple-500 hover:border-purple-400 hover:shadow-purple-500/30 text-white p-6 rounded-2xl shadow-md transition-all duration-300 transform hover:scale-105 block"
>
  <h3 className="text-2xl font-semibold mb-2">📂 View Saved Resumes</h3>
  <p className="text-sm text-gray-300">
    Browse or download previously saved resumes.
  </p>
</Link>
      </section>
    </div>
  )
}

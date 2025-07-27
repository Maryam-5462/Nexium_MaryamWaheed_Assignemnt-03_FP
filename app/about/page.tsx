'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function AboutPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-[#1f1b3a] via-[#4c1d95] to-[#0f0c29] text-white px-6 py-10 animate-fadeIn transition-all duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-purple-300 drop-shadow-md mb-2">📘 About ResumeTailor</h1>
        <p className="text-sm text-gray-300">
          Welcome <strong>{user?.email}</strong>, here's what ResumeTailor does for you.
        </p>
      </header>

      <section className="bg-white/10 backdrop-blur-xl border border-purple-500 rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-purple-200 mb-4">What is ResumeTailor?</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          <strong>ResumeTailor</strong> is a smart resume builder designed to help you quickly generate and customize
          resumes tailored to specific job descriptions. By uploading your resume and providing a job post, our AI helps
          you match keywords, optimize formatting, and increase your chances of landing interviews.
        </p>

        <h2 className="text-xl font-semibold text-purple-200 mt-6 mb-2">Key Features</h2>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
          <li>📄 Upload your resume and get smart suggestions.</li>
          <li>🎯 Match your resume with any job description.</li>
          <li>📂 Save, edit, or download tailored versions.</li>
          <li>🌙 Fully supports light/dark mode for a better user experience.</li>
        </ul>

        <h2 className="text-xl font-semibold text-purple-200 mt-6 mb-2">Why Use ResumeTailor?</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Whether you're a fresh graduate or a seasoned professional, ResumeTailor saves you time and helps you make a
          strong impression by aligning your resume with what employers actually look for.
        </p>

        <p className="text-xs text-gray-500 mt-6 italic">
          Made with ❤️ using Next.js, Supabase, and Tailwind CSS.
        </p>
      </section>
    </div>
  )
}

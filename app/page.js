
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session

      if (session?.user) {
        router.replace('/dashboard')
      } else {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="text-center animate-pulse text-xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4">
      <div className="backdrop-blur-lg bg-white/10 p-10 rounded-2xl border border-white/20 shadow-xl max-w-md w-full text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-4">You're not logged in</h1>
        <p className="mb-6 text-gray-300">
          Please log in via the magic link sent to your email.
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
        >
          Go to Login
        </a>
      </div>
    </main>
  )
}

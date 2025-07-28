
// 'use client'

// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import { LogOut } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import React from 'react'

// export default function ResumePage() {
//   const [user, setUser] = useState<any>(null)
//   const router = useRouter()

//   useEffect(() => {
//     const getUser = async () => {
//       const { data } = await supabase.auth.getUser()
//       if (data?.user) {
//         setUser(data.user)
//       } else {
//         router.push('/login')
//       }
//     }
//     getUser()
//   }, [])

//   const handleLogout = async () => {
//     await supabase.auth.signOut()
//     router.push('/login')
//   }

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-200 dark:from-zinc-900 dark:to-black text-gray-900 dark:text-white transition-colors">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white dark:bg-zinc-800 shadow-md px-6 py-8 hidden md:block">
//         <h2 className="text-2xl font-bold mb-8 tracking-tight text-purple-600 dark:text-purple-400">ResumeTailor</h2>
//         <nav className="space-y-4">
//           <a href="/dashboard" className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-purple-500 transition-all hover:pl-2">
//             🏠 Dashboard
//           </a>
//           <a href="/resume" className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-purple-500 transition-all hover:pl-2">
//             📁 My Resumes
//           </a>
//           <a href="/profile" className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-purple-500 transition-all hover:pl-2">
//             ⚙️ Settings
//           </a>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 md:p-12 animate-fadeIn">
//         <header className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Welcome 👋</h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               Logged in as <span className="font-semibold">{user?.email}</span>
//             </p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition-all hover:scale-105"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </header>

//         <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-6 md:p-10 transition-all transform hover:shadow-purple-500/20">
//           <h2 className="text-2xl font-semibold mb-4 text-purple-700 dark:text-purple-400">Your Resumes</h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
//             This is where all your tailored resumes will appear. Use the AI features to generate stunning resumes customized for each job.
//           </p>

//           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer">
//               <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300">Upload New Resume</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400">Start tailoring a new resume with job description input.</p>
//             </div>
//             <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer">
//               <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300">View Saved Resumes</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400">Manage previously tailored resumes here.</p>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }
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

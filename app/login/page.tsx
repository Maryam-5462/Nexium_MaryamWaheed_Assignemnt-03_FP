'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage('Error sending link: ' + error.message)
    } else {
      setMessage('Check your email for the login link!')
      // After login, Supabase will restore session and homepage will redirect
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4">
      <div className="backdrop-blur-lg bg-white/10 p-10 rounded-2xl border border-white/20 shadow-xl w-full max-w-md animate-fade-in-up text-center">
        <h1 className="text-3xl font-bold mb-6">Login with Magic Link</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold rounded-lg mb-4"
        >
          Send Login Link
        </button>
        {message && (
          <p className="text-sm text-gray-300">{message}</p>
        )}
      </div>
    </main>
  )
}

// 'use client'

// import { useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import React from 'react'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')

//   const handleLogin = async () => {
//     const { error } = await supabase.auth.signInWithOtp({ email })
//     if (error) {
//       setMessage('Error sending link: ' + error.message)
//     } else {
//       setMessage('Check your email for the login link!')
//     }
//   }

//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4">
//       <div className="backdrop-blur-lg bg-white/10 p-10 rounded-2xl border border-white/20 shadow-xl w-full max-w-md animate-fade-in-up text-center">
//         <h1 className="text-3xl font-bold mb-6">Login with Magic Link</h1>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           className="w-full px-4 py-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button
//           onClick={handleLogin}
//           className="w-full py-3 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold rounded-lg mb-4"
//         >
//           Send Login Link
//         </button>
//         {message && (
//           <p className="text-sm text-gray-300">{message}</p>
//         )}
//       </div>
//     </main>
//   )
// }

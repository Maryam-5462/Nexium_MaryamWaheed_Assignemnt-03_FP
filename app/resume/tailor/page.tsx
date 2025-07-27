"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TailorResumePage() {
  const [jobDesc, setJobDesc] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [tailored, setTailored] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const title = searchParams.get('title') 

  useEffect(() => {
    if (!title) return

    fetch(`/api/get-resume?title=${title}`)
      .then(res => res.json())
      .then(data => setResumeText(data.resume || ''))
      .catch(err => console.error('Error fetching resume:', err))
  }, [title])

  const handleTailor = async () => {
    if (!jobDesc || !resumeText) return alert('Both fields are required')
    setLoading(true)

    const res = await fetch('https://your-n8n-webhook-url.com/webhook/gpt-tailor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobDescription: jobDesc,
        resume: resumeText
      })
    })

    const data = await res.json()
    setTailored(data.tailoredResume || 'Error: No output')
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1f1b3a] to-[#0f0c29] text-white">
      <h1 className="text-3xl font-bold mb-4">🧠 Tailor Your Resume with AI</h1>

      <textarea
        className="w-full h-32 p-3 rounded bg-white/10 text-white placeholder-gray-300 mb-4"
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button
        onClick={handleTailor}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded mb-6"
      >
        {loading ? 'Tailoring...' : 'Tailor Resume'}
      </button>

      {tailored && (
        <div className="bg-white/10 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">🎯 Tailored Resume:</h2>
          <pre className="whitespace-pre-wrap text-sm">{tailored}</pre>
        </div>
      )}
    </div>
  )
}

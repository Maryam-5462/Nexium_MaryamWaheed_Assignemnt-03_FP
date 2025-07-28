"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function TailorResumeContent() {
  const [jobDesc, setJobDesc] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [tailored, setTailored] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const title = searchParams.get('title')

  useEffect(() => {
    if (!title) {
      setError('No resume title provided')
      return
    }

    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/resume/get?title=${encodeURIComponent(title)}`)
        if (!res.ok) throw new Error('Failed to fetch resume')
        const data = await res.json()
        setResumeText(data.text || '')
      } catch (err) {
        console.error('Error fetching resume:', err)
        setError('Failed to load resume')
      }
    }

    fetchResume()
  }, [title])

  const handleTailor = async () => {
    if (!jobDesc.trim() || !resumeText.trim()) {
      setError('Both job description and resume are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jobDesc,
          resume: resumeText
        })
      })

      if (!res.ok) throw new Error('Tailoring failed')
      const data = await res.json()
      setTailored(data.tailoredText || 'No output generated')
    } catch (err) {
      console.error('Tailoring error:', err)
      setError('Failed to tailor resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1f1b3a] to-[#0f0c29] text-white">
      <h1 className="text-3xl font-bold mb-4">🧠 Tailor Your Resume with AI</h1>
      
      {error && (
        <div className="p-3 mb-4 bg-red-500/20 border border-red-500 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block mb-2 font-medium">Job Description:</label>
        <textarea
          className="w-full h-32 p-3 rounded bg-white/10 text-white placeholder-gray-300"
          placeholder="Paste the job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
      </div>

      <button
        onClick={handleTailor}
        disabled={loading || !resumeText}
        className={`px-6 py-3 rounded-lg mb-6 font-medium transition-colors
          ${loading || !resumeText ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Tailoring...
          </span>
        ) : 'Tailor Resume'}
      </button>

      {tailored && (
        <div className="bg-white/10 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🎯 Tailored Resume</h2>
            <button 
              onClick={() => navigator.clipboard.writeText(tailored)}
              className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded"
            >
              Copy
            </button>
          </div>
          <div className="whitespace-pre-wrap bg-black/20 p-4 rounded">
            {tailored}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TailorResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f1b3a] to-[#0f0c29]">
        <div className="animate-pulse text-white">Loading resume editor...</div>
      </div>
    }>
      <TailorResumeContent />
    </Suspense>
  )
}
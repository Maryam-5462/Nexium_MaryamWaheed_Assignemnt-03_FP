
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import jsPDF from 'jspdf'

export default function SavedResumesPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResumes = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to view resumes.')
        return
      }

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching resumes:', error.message)
      } else {
        setResumes(data)
      }

      setLoading(false)
    }

    fetchResumes()
  }, [])

  const filteredResumes = resumes.filter((resume) =>
    resume.title?.toLowerCase().includes(search.toLowerCase())
  )

  const downloadPDF = (title: string, content: string) => {
    const doc = new jsPDF()
    doc.text(content, 10, 10)
    doc.save(`${title || 'resume'}.pdf`)
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1f1b3a] to-[#0f0c29] text-white">
      <h1 className="text-3xl font-bold mb-6">📂 Saved Resumes</h1>

      <input
        type="text"
        placeholder="Search resumes by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 p-2 mb-6 text-black rounded bg-white/80 placeholder-gray-700"
      />

      {loading ? (
        <p className="text-lg">Loading...</p>
      ) : filteredResumes.length === 0 ? (
        <p className="text-gray-300">No resumes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white/10 backdrop-blur-xl border border-purple-500 hover:border-purple-400 hover:shadow-purple-500/30 text-white p-6 rounded-2xl shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold mb-2">{resume.title}</h2>
              <p className="text-sm text-gray-300 mb-4">
                {new Date(resume.created_at).toLocaleString()}
              </p>
              <pre className="text-sm whitespace-pre-wrap text-gray-100 mb-4 max-h-40 overflow-auto border border-purple-400 rounded p-2">
                {resume.content}
              </pre>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
                  onClick={() => navigator.clipboard.writeText(resume.content)}
                >
                  📋 Copy
                </button>
                <button
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded"
                  onClick={() => downloadPDF(resume.title, resume.content)}
                >
                  📄 PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

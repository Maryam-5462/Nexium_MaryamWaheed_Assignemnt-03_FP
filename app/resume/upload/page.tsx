
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import jsPDF from "jspdf"

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [tailoredText, setTailoredText] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        alert("You are not logged in")
        return
      }
      setUserId(data.user.id)
    }
    fetchUser()
  }, [])

  const downloadAsTxt = () => {
    const element = document.createElement("a")
    const file = new Blob([tailoredText], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `tailored-resume-${title || 'untitled'}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadAsPdf = () => {
    const doc = new jsPDF()
    const lines = doc.splitTextToSize(tailoredText, 180)
    doc.text(lines, 10, 10)
    doc.save(`tailored-resume-${title || 'untitled'}.pdf`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (!file || !userId || !title || !description) {
        throw new Error("Please fill in all fields and upload a file")
      }

      const filePath = `${userId}/${Date.now()}_${file.name}`
      const { error: uploadErr } = await supabase.storage
        .from("resumes")
        .upload(filePath, file)

      if (uploadErr) throw new Error("File upload failed")

      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resumes/${filePath}`

      const { error: insertError } = await supabase
        .from("resumes")
        .insert({
          user_id: userId,
          title,
          description,
          content: fileUrl,
        })

      if (insertError) throw new Error("Error saving file record")

      const webhookRes = await fetch("http://localhost:5678/webhook/resume-tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_url: fileUrl,
          job_description: description,
          user_id: userId,
        }),
      })

      if (!webhookRes.ok) {
        throw new Error(`Webhook failed with status ${webhookRes.status}`)
      }

      const rawText = await webhookRes.text()
      let text = ""

      try {
        const parsed = JSON.parse(rawText)
        text = parsed.answer || parsed.response?.answer || parsed.data?.answer
      } catch (_) {
        console.log("Standard JSON parse failed, trying regex fallback")
      }

      if (!text) {
        const match = rawText.match(/"answer"\s*:\s*"([^"]*)"/)
        if (match?.[1]) text = match[1]
      }

      // Approach 3: Last resort - find the longest string between quotes
      if (!text) {
        const potentialAnswers = rawText.match(/"([^"]*)"/g) || [];
        if (potentialAnswers.length > 0) {
          // Find the longest string that looks like a paragraph
          text = potentialAnswers
            .map(s => s.replace(/"/g, ''))
            .reduce((longest, current) => 
              current.length > longest.length ? current : longest, "");
        }
      }

      if (!text) throw new Error("Could not extract answer from the server response")

      setTailoredText(text)

      const saveRes = await fetch("/api/save-tailored-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          title,
          tailored_text: text,
        }),
      })

      if (!saveRes.ok) {
        throw new Error("Failed to save tailored resume")
      }

      alert("✅ Resume processed and saved successfully!")
    } catch (error: any) {
      console.error("❌ Error:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Job Title (e.g. Frontend Intern)"
          className="w-full p-2 bg-gray-800 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Job Description"
          className="w-full p-2 bg-gray-800 rounded min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div>
          <label className="block mb-2 text-sm font-medium">
            Resume File (PDF, DOC, DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 bg-gray-800 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {tailoredText && (
        <div className="mt-8 bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Tailored Resume</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(tailoredText)}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                Copy
              </button>
              <button
                onClick={downloadAsTxt}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                Download .txt
              </button>
              <button
                onClick={downloadAsPdf}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                Download .pdf
              </button>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded whitespace-pre-wrap text-gray-100 font-mono text-sm">
            {tailoredText}
          </div>
        </div>
      )}
    </div>
  )
}

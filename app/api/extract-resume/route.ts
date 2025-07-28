// import { NextResponse } from 'next/server'
// import { MongoClient } from 'mongodb'
// import pdfParse from 'pdf-parse'

// const mongoUrl = process.env.MONGODB_URI as string
// const client = new MongoClient(mongoUrl)

// export async function POST(req: Request) {
//   const formData = await req.formData()
//   const file = formData.get('file') as File
//   const userId = formData.get('user_id') as string
//   const title = formData.get('title') as string

//   if (!file || !userId) {
//     return NextResponse.json({ error: 'Missing data' }, { status: 400 })
//   }

//   const buffer = Buffer.from(await file.arrayBuffer())
//   const pdfData = await pdfParse(buffer)

//   const resumeText = pdfData.text

//   await client.connect()
//   const db = client.db('resume_tailor')
//   const resumes = db.collection('resumes')

//   await resumes.insertOne({
//     user_id: userId,
//     title,
//     content: resumeText,
//     created_at: new Date()
//   })

//   return NextResponse.json({ success: true, textLength: resumeText.length })
// }
import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

// Critical configuration to prevent build-time issues
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs' // Explicitly use Node.js runtime
export const fetchCache = 'force-no-store' // Prevent any caching behavior

// Isolate PDF parsing to prevent build-time processing
async function parsePdfBuffer(buffer: Buffer) {
  // Dynamic import to prevent bundling during build
  const { default: pdf } = await import('pdf-parse')
  return pdf(buffer)
}

const uri = process.env.MONGODB_URI!
const dbName = process.env.MONGODB_DB!

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const user_id = formData.get('user_id') as string | null
    const title = formData.get('title') as string | null

    // Validate required fields
    if (!file || !user_id || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are accepted' },
        { status: 400 }
      )
    }

    // Process PDF
    const buffer = Buffer.from(await file.arrayBuffer())
    const text = await parsePdfBuffer(buffer)

    // Database operations
    const client = await MongoClient.connect(uri)
    try {
      const db = client.db(dbName)
      const collection = db.collection('full_texts')

      const result = await collection.insertOne({
        user_id,
        title,
        text: text.text,
        created_at: new Date(),
        updated_at: new Date()
      })

      return NextResponse.json({
        success: true,
        text: text.text,
        documentId: result.insertedId
      })
    } finally {
      await client.close()
    }
  } catch (error) {
    console.error('API Error:', error)

    // Handle different error types
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Processing failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    )
  }
}

// Add this to prevent static generation attempts
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
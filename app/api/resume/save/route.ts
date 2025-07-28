// import { NextRequest, NextResponse } from 'next/server'
// import clientPromise from '@/lib/mongodb'

// export async function POST(req: NextRequest) {
//   try {
//     const { fullText } = await req.json()

//     if (!fullText) {
//       return NextResponse.json({ error: 'No full text provided' }, { status: 400 })
//     }

//     const client = await clientPromise
//     const db = client.db(process.env.MONGODB_DB)
//     const collection = db.collection('full_texts')

//     const result = await collection.insertOne({
//       content: fullText,
//       createdAt: new Date()
//     })

//     return NextResponse.json({ message: 'Saved to MongoDB', id: result.insertedId })
//   } catch (err) {
//     console.error('MongoDB save error:', err)
//     return NextResponse.json({ error: 'Failed to save to MongoDB' }, { status: 500 })
//   }
// }
// /app/api/resume/save/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// Required configuration to prevent build issues
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

export async function POST(req: Request) {
  try {
    // Validate request content type
    const contentType = req.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      )
    }

    const body = await req.json()
    const { user_id, title, text } = body

    // Validate required fields
    if (!user_id || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id or text' },
        { status: 400 }
      )
    }

    // Database operations
    const client = await clientPromise
    const db = client.db('resume_tailor')
    const collection = db.collection('full_texts')

    const result = await collection.insertOne({
      user_id,
      title: title || 'Tailored Resume',
      text,
      source: 'tailored',
      created_at: new Date(),
      updated_at: new Date()
    })

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      timestamp: new Date()
    })

  } catch (err) {
    console.error('❌ MongoDB Save Error:', err)
    return NextResponse.json(
      { 
        error: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    )
  }
}
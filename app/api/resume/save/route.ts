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
import { MongoClient } from 'mongodb'

// Critical configuration
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

const uri = process.env.MONGODB_URI!

export async function POST(req: Request) {
  let client;
  try {
    const body = await req.json()
    const { user_id, title, text } = body

    if (!user_id || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    client = new MongoClient(uri)
    await client.connect()
    const db = client.db('resume_tailor')
    const collection = db.collection('full_texts')

    const result = await collection.insertOne({
      user_id,
      title: title || 'Untitled Resume',
      text,
      created_at: new Date(),
      updated_at: new Date()
    })

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId
    })

  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  } finally {
    if (client) {
      await client.close().catch(console.error)
    }
  }
}
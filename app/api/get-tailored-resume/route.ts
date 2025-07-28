import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

// Critical configuration to prevent build issues
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

const uri = process.env.MONGODB_URI || ''

export async function GET(req: NextRequest) {
  let client;
  try {
    // Validate input
    const userId = req.nextUrl.searchParams.get('user_id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user_id parameter' },
        { status: 400 }
      )
    }

    // Database operations
    client = new MongoClient(uri)
    await client.connect()
    
    const db = client.db('resume_tailor')
    const collection = db.collection('tailored_resumes')

    const record = await collection.findOne({ 
      user_id: userId 
    })

    return NextResponse.json({
      tailored_text: record?.tailored_text || ''
    })

  } catch (err) {
    console.error('Database Error:', err)
    return NextResponse.json(
      { 
        error: 'Failed to fetch resume',
        details: process.env.NODE_ENV === 'development' ? err : undefined
      },
      { status: 500 }
    )
  } finally {
    if (client) {
      await client.close().catch(console.error)
    }
  }
}

// Optional: Add POST handler if needed
export async function POST() {
  return NextResponse.json(
    { error: 'Method not implemented' },
    { status: 501 }
  )
}
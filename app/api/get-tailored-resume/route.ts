import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const client = new MongoClient(uri)

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('user_id')
    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    await client.connect()
    const db = client.db('resume_tailor') // same as above
    const collection = db.collection('tailored_resumes')

    const record = await collection.findOne({ user_id: userId })

    if (!record) {
      return NextResponse.json({ tailored_text: '' }, { status: 200 })
    }

    return NextResponse.json({ tailored_text: record.tailored_text })
  } catch (err) {
    console.error('MongoDB Read Error:', err)
    return NextResponse.json({ error: 'MongoDB Error', details: err }, { status: 500 })
  } finally {
    await client.close()
  }
}

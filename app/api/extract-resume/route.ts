

import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import pdf from 'pdf-parse'

const uri = process.env.MONGODB_URI!
const dbName = process.env.MONGODB_DB!

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const user_id = formData.get('user_id') as string
  const title = formData.get('title') as string

  if (!file || !user_id || !title) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const text = await pdf(buffer)

  try {
    const client = await new MongoClient(uri).connect()
    const db = client.db(dbName)
    const collection = db.collection('full_texts')

    await collection.insertOne({
      user_id,
      title,
      text: text.text,
      created_at: new Date()
    })

    client.close()
    return NextResponse.json({ text: text.text })
  } catch (error) {
    console.error("MongoDB error:", error)
    return NextResponse.json({ error: 'MongoDB insert failed' }, { status: 500 })
  }
}

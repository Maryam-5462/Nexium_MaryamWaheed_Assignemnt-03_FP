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

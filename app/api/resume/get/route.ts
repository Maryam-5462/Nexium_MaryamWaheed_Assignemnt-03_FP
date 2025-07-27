// import { NextResponse } from 'next/server'
// import { MongoClient } from 'mongodb'

// const uri = process.env.MONGODB_URI!
// const client = new MongoClient(uri)

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url)
//   const userId = searchParams.get('user_id') || ''

//   if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })

//   await client.connect()
//   const db = client.db('resume_tailor')
//   const collection = db.collection('full_texts')

//   const result = await collection.findOne({ user_id: userId }, { sort: { createdAt: -1 } })

//   if (!result) return NextResponse.json({ error: 'No resume found' }, { status: 404 })

//   return NextResponse.json({ text: result.text })
// }
// // /app/api/resume/get/route.ts
// import { NextResponse } from 'next/server'
// import clientPromise from '@/lib/mongodb'

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const user_id = searchParams.get('user_id')

//     if (!user_id) {
//       return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
//     }

//     const client = await clientPromise
//     const db = client.db('resume_tailor')
//     const collection = db.collection('full_texts')

//     const result = await collection.findOne(
//       { user_id, source: 'tailored' },
//       { sort: { created_at: -1 } }
//     )

//     if (!result) {
//       return NextResponse.json({ text: '' }) // No tailored resume yet
//     }

//     return NextResponse.json({ text: result.text })
//   } catch (err) {
//     console.error('❌ Error fetching tailored resume:', err)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }
// /app/api/resume/get/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('resume_tailor')
    const collection = db.collection('full_texts')

    const result = await collection.findOne(
      { user_id }, // Removed: source: 'tailored'
      { sort: { created_at: -1 } }
    )

    return NextResponse.json({ text: result?.text || '' })
  } catch (err) {
    console.error('❌ Error fetching resume:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

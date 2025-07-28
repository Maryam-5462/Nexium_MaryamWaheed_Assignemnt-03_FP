import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// Critical configuration to prevent build issues
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id parameter' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('resume_tailor')
    const collection = db.collection('full_texts')

    const result = await collection.findOne(
      { user_id },
      { 
        sort: { created_at: -1 },
        projection: { _id: 0, text: 1 }
      }
    )

    return NextResponse.json({ 
      text: result?.text || '',
      timestamp: new Date()
    })

  } catch (err) {
    console.error('Database Error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    )
  }
}
// /app/api/resume/get/route.ts
// import { NextResponse } from 'next/server'
// import clientPromise from '@/lib/mongodb'

// // Required configuration to prevent build issues
// export const dynamic = 'force-dynamic'
// export const runtime = 'nodejs'
// export const fetchCache = 'force-no-store'

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const user_id = searchParams.get('user_id')

//     // Validate required parameter
//     if (!user_id) {
//       return NextResponse.json(
//         { error: 'Missing required parameter: user_id' },
//         { status: 400 }
//       )
//     }

//     // Database operations
//     const client = await clientPromise
//     const db = client.db('resume_tailor')
//     const collection = db.collection('full_texts')

//     const result = await collection.findOne(
//       { user_id },
//       { 
//         sort: { created_at: -1 },
//         projection: { _id: 0, text: 1 } // Only return text field
//       }
//     )

//     return NextResponse.json({ 
//       text: result?.text || '',
//       timestamp: new Date()
//     })

//   } catch (err) {
//     console.error('❌ MongoDB Fetch Error:', err)
//     return NextResponse.json(
//       { 
//         error: 'Database operation failed',
//         details: process.env.NODE_ENV === 'development' ? err.message : undefined
//       },
//       { status: 500 }
//     )
//   }
// }
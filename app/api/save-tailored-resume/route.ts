// /app/api/save-tailored-resume/route.ts
import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const { user_id, tailored_text, title } = await req.json()

    if (!user_id || !tailored_text || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("resume_tailor")
    const collection = db.collection("tailored_resumes")

    await collection.insertOne({
      user_id,
      title,
      tailored_text,
      created_at: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("❌ Failed to save tailored resume:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

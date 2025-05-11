import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

// In a real implementation, this would connect to a database
const codeSnippets: Record<string, { code: string; language: string; createdAt: Date }> = {}

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json()

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 })
    }

    // Generate a short ID for the snippet
    const id = nanoid(8)

    // Store the snippet (in a real app, this would be in a database)
    codeSnippets[id] = {
      code,
      language,
      createdAt: new Date(),
    }

    // Return the URL for the snippet
    return NextResponse.json({
      id,
      url: `/s/${id}`,
      status: "success",
    })
  } catch (error) {
    console.error("Error sharing code:", error)
    return NextResponse.json({ error: "Failed to share code" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Snippet ID is required" }, { status: 400 })
    }

    const snippet = codeSnippets[id]

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...snippet,
      status: "success",
    })
  } catch (error) {
    console.error("Error retrieving code snippet:", error)
    return NextResponse.json({ error: "Failed to retrieve code snippet" }, { status: 500 })
  }
}

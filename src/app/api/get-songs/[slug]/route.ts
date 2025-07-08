import { NextResponse } from "next/server"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }

  try {
    const song = await db.song.findUnique({
      where: {
        id: params.slug,
        userId: session.user.id
      }
    })

    if (!song) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ song })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch song" },
      { status: 500 }
    )
  }
}
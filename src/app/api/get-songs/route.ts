import { NextResponse } from "next/server"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

export async function GET() {
  const session = await auth()

  if(!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }

  try {
    const songs = await db.song.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ songs });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch songs. ${error as string}` },
      { status: 500 }
    )
  }
}

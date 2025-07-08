import Link from "next/link"
import { db } from "~/server/db"
import { auth } from "~/server/auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth()

  if (!session?.user?.id) {
    return redirect("/login")
  }

  const songs = await db.song.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100
          dark:from-slate-800 dark:via-indigo-800 dark:to-purple-900">
      <div className="flex">
        <div className="flex flex-col w-full overflow-y-hidden mt-0 md:mt-4 border-b">
          <div className="flex justify-between py-4 px-6 items-center">
            <div className="py-1.5">
              <h1 className="font-serif font-light max-w-full line-clamp-1 break-all select-none whitespace-pre-wrap text-[28px] lg:text-[40px]">Library</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6">
        {songs.map((song) => (
          <Link
            key={song.id}
            href={`/dashboard/library/${song.id}`}
            className="p-4 border rounded-lg hover:bg-gray-500 transition-colors"
          >
            <h2 className="text-xl font-semibold">{song.title}</h2>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm">
                Created: {new Date(song.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}

        {songs.length === 0 && (
          <p className="text-gray-500 mt-4">No songs found.</p>
        )}
      </div>
    </div>
  )
}

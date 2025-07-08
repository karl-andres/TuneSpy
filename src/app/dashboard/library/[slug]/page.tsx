"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Spinner } from "@radix-ui/themes"

interface ChordData {
  start: number
  end: number
  chord: string
}

interface Song {
  id: string
  title: string
  labData: ChordData[]
  createdAt: string
}

export default function Page() {
  const params = useParams()
  const [song, setSong] = useState<Song | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchSong() {
      try {
        const res = await fetch(`/api/get-songs/${params.slug}`)
        if (!res.ok) {
          throw new Error("Failed to fetch song")
        }
        const data = await res.json()
        // Parse the labData if it's a string
        const parsedSong = {
          ...data.song,
          labData: typeof data.song.labData === 'string' 
            ? JSON.parse(data.song.labData) 
            : data.song.labData
        }
        setSong(parsedSong)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load song")
      }
    }

    void fetchSong()
  }, [params.slug])

  if (error) return (
    <div className="p-6">
      <div className="text-red-500">{error}</div>
    </div>
  )

  if (!song) return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100
          dark:from-slate-800 dark:via-indigo-800 dark:to-purple-900 flex justify-center items-center gap-4">
      <div>Loading...</div>
      <Spinner size="3" />
    </div>
  )

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100
          dark:from-slate-800 dark:via-indigo-800 dark:to-purple-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{song.title}</h1>
        <p className="text-gray-500">
          Created: {new Date(song.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Chord Progression</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Start Time</th>
                <th className="text-left p-2">End Time</th>
                <th className="text-left p-2">Chord</th>
                <th className="text-left p-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {song.labData.map((chord, index) => (
                <tr key={index} className="border-b hover:bg-gray-500">
                  <td className="p-2">{chord.start.toFixed(2)}s</td>
                  <td className="p-2">{chord.end.toFixed(2)}s</td>
                  <td className="p-2 font-mono">{chord.chord}</td>
                  <td className="p-2">{(chord.end - chord.start).toFixed(2)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
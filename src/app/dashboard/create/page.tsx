'use client'

import { useState } from 'react'
import { Upload, Music, AudioLines, PlayCircle, Download, Clock } from 'lucide-react'

interface ChordData {
  start: number
  end: number
  chord: string
}

interface ApiResponse {
  lab_data: ChordData[]
}

export default function ChordRecognitionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [useLargeVocab, setUseLargeVocab] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<ChordData[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResults(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select an audio file')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio_file', file)
      formData.append('use_large_vocabulary', useLargeVocab.toString())

      const response = await fetch('http://127.0.0.1:8000/recognize-chords/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process audio file')
      }

      const data: ApiResponse = await response.json()
      setResults(data.lab_data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(1)
    return `${mins}:${secs.padStart(4, '0')}`
  }

  const downloadResults = () => {
    if (!results) return

    const labContent = results
      .map(chord => `${chord.start.toFixed(3)} ${chord.end.toFixed(3)} ${chord.chord}`)
      .join('\n')

    const blob = new Blob([labContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file?.name?.split('.')[0] || 'chords'}.lab`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">hi</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            AI Chord Recognition
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Upload your audio file and let our advanced BTC model analyze and identify chord progressions with high accuracy.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <div>
              <label className="block text-white font-medium mb-4">
                Audio File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".wav,.mp3"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
                <div className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                  ${file 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5'
                  }
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {file ? (
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white mb-2">
                        Drop your audio file here or click to browse
                      </p>
                      <p className="text-gray-400 text-sm">
                        Supports MP3 and WAV files
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vocabulary Option */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLargeVocab}
                  onChange={(e) => setUseLargeVocab(e.target.checked)}
                  disabled={isProcessing}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-2"
                />
                <div>
                  <span className="text-white font-medium">
                    Use Large Vocabulary
                  </span>
                  <p className="text-gray-400 text-sm">
                    Enables recognition of 170 chord types instead of just major/minor
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || isProcessing}
              className={`
                w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-3
                ${!file || isProcessing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg hover:shadow-purple-500/25'
                }
              `}
            >
              {isProcessing ? (
                <>
                  <AudioLines className="w-5 h-5 animate-pulse" />
                  Processing Audio...
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  Analyze Chords
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Music className="w-6 h-6 text-purple-400" />
                Chord Analysis Results
              </h3>
              <button
                onClick={downloadResults}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download .lab
              </button>
            </div>

            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {results.map((chord, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-sm">
                        {formatTime(chord.start)} - {formatTime(chord.end)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold text-lg">
                      {chord.chord}
                    </span>
                    <p className="text-gray-400 text-sm">
                      {(chord.end - chord.start).toFixed(1)}s duration
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {results.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No chords detected in the audio file.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
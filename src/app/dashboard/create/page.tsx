"use client";

import { useState } from "react";
import { chordsResponseSchema } from "~/schemas";
import { Upload, Sparkles, Music } from 'lucide-react';

export default function Page() {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/recognize-chords", {
        method: "POST",
        body: formData,
      });

      const jsonResult = await response.json();
      const result = chordsResponseSchema.parse(jsonResult)

      if (!response.ok || !result.success) {
        setErrorMessage(result.error || "An unexpected error occurred");
      } else {
        setSuccessMessage("Chords detected and song saved successfully! Please navigate to the library tab to view your songs.");
      }
    } catch (err) {
      setErrorMessage("Unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false)
    const files = e.dataTransfer.files;
    if (files.length > 0 && (files[0].type === 'audio/wav' || files[0].type === 'audio/mp3')) {
      setSelectedFile(files[0]);
      const fileInput = document.getElementById('audio_file');
      fileInput.files = files;
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100
            dark:from-slate-800 dark:via-indigo-800 dark:to-purple-900">
      {/* Header */}
      <div className="flex">
        <div className="flex flex-col w-full overflow-y-hidden mt-0 md:mt-4 border-b">
          <div className="flex justify-between py-4 px-6 items-center">
            <div className="py-1.5">
              <h1 className="font-serif font-light max-w-full line-clamp-1 break-all select-none whitespace-pre-wrap text-[28px] lg:text-[40px]">Create</h1>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="p-6 max-w-2-xl mx-auto">
        <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl dark:shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-4 shadow-lg">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif mb-2">Upload Song</h1>
            <p className="text-lg">Transcribe chord progressions from your audio using AI</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="audio_file" className="block text-sm font-semibold mb-3">
                Audio File (WAV or MP3)
              </label>
              <div className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                    dragOver
                      ? 'border-blue-400 bg-blue-50'
                      : selectedFile
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('audio_file')?.click()}
                onChange={handleFileChange}
              >
                <input
                  id="audio_file"
                  name="audio_file"
                  type="file"
                  accept=".wav,.mp3"
                  required
                  className="hidden"
                />
                <div className="flex flex-col items-center space-y-4">
                  <div className={`p-4 rounded-full transition-all duration-300 ${
                    selectedFile 
                      ? 'bg-green-100 ring-4 ring-green-200'  
                      : 'bg-gray-100 group-hover:bg-blue-100 group-hover:ring-4 group-hover:ring-blue-200'
                  }`}>
                    <Upload className={`w-8 h-8 transition-colors text-gray-800 ${
                      selectedFile ? 'text-green-600' : 'group-hover:text-blue-600'
                    }`} />
                  </div>
                  {selectedFile ? (
                    <div className="space-y-2">
                      <p className="text-green-700 font-semibold text-lg">{selectedFile.name}</p>
                      <p className="text-green-600 text-sm">Ready to Process {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-semibold text-lg">Drop your audio file here</p>
                      <p>or click to browse for a WAV or MP3</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <label htmlFor="use_large_vocabulary" className="cursor-pointer">
              <div className="mb-4 flex items-start space-x-4 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-black/50 dark:to-purple-50 border border-gray-200">
                <div className="relative mt-1">
                  <input
                    id="use_large_vocabulary"
                    name="use_large_vocabulary"
                    value="true"
                    type="checkbox"
                    className="peer sr-only"
                  />
                  <input name="use_large_vocabulary" value="false" type="hidden" />
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-md peer-checked:bg-blue-500 peer-checked:border-transparent transition-all cursor-pointer shadow-sm hover:shadow-md"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-4 h-4 opacity-0 peer-checked:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <label htmlFor="use_large_vocabulary" className="cursor-pointer">
                  <span className="font-semibold text-base block">Use extended chord vocabulary</span>
                  <span className="text-sm mt-1 block">Detect complex jazz chords, extensions, and advanced harmonic structures</span>
                </label>
              </div>
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed bg-gradient-to-r text-white from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-500 shadow-lg hover:shadow-xl disabled:shadow-md focus:ring-4 focus:ring-blue-200">
              {isPending ? "Processing..." : "Detect Chords"}
            </button>

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-600 text-sm">{successMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
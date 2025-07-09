'use client'

import { Button } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from 'next/link';

const welcomeMessages = [
  "Discover Chords",
  "Detect Harmony", 
  "Analyze Music",
  "Decode Audio",
  "Find Progressions",
  "Identify Notes",
  "Explore Sound"
];

export default function Page() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % welcomeMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="text-3xl font-bold text-white">TuneSpy</h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 items-center"
        >
          <button className="px-6 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
            <Link href="/signin">Login</Link>
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-300">
            <Link href="/signup">Get Started</Link>
          </button>
        </motion.div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.h2
              key={welcomeMessages[index]}
              className="text-center text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {welcomeMessages[index]}
            </motion.h2>
          </AnimatePresence>
        <div className="mt-10 w-full max-w-md space-y-6">
          <motion.p 
            className="text-center text-xl md:text-2xl text-white/80 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            An advanced AI-powered chord detection tool. Upload your music, 
            and let the deep learning algorithms identify every chord.
          </motion.p>
          <div className="flex justify-center align-items">
            <Button size="3" variant="classic">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>


    </div>
  );
};
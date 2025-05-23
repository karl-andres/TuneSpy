'use client';

import Link from "next/link";
import { Button, Text } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const welcomeMessages = [
  "Welcome",
  "Bienvenido",
  "Bienvenue",
  "Willkommen",
  "ようこそ",
  "환영합니다",
  "欢迎",
  "Bem-vindo",
  "Добро пожаловать"
];

export default function Page() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % welcomeMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [])

  return (
    <div>
      {/* Top Nav Bar */}
      <div className="flex justify-around gap-4 p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 drop-shadow-xl/25  drop-shadow-purple-500">
        {/* Left Side */}
        <div className="flex gap-4 items-center">
          <Text size="6" weight="bold" className="text-white">TuneSpy</Text>
        </div>
        {/* Right Side */}
        <div className="flex gap-4 items-center">
          <Button variant="surface" size="3" asChild>
            <Link href="/signup">Register</Link>
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <AnimatePresence>
            <motion.h1 
              key={welcomeMessages[index]}
              className="text-center text-2xl font-semibold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6}}
            >
              {welcomeMessages[index]}
            </motion.h1>
          </AnimatePresence>
          <p className="text-center text-lg">This is the main content area.</p>
        </div>
      </div>
    </div>
  );
};
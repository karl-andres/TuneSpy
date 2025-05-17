'use client'

import { register } from "../actions/auth";
import Link from 'next/link';
import { useActionState } from 'react';

export default function Page() {
    const [errorMessage, formAction, isPending] = useActionState(
      register,
      undefined
    )

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-semibold text-gray-900">
            Sign Up
        </h1>
        <form action={formAction} className="space-y-4">
          <div className="relative h-fit">
            <input 
              className="rounded-md w-full border border-gray-300 text-sm px-3 pb-1 pt-7 focus:border-black focus:outline-none"
              type="email"
              name="email"
              required
            />
            <label className="absolute left-3 top-2 text-[12px]">
              EMAIL
            </label>
          </div>
          <div className="relative h-fit">
            <input 
              className="rounded-md w-full border border-gray-300 text-sm px-3 pb-1 pt-7 focus:border-black focus:outline-none"
              type="password"
              name="password"
              required
              minLength={8}
            />
            <label className="absolute left-3 top-2 text-[12px]">
              PASSWORD
            </label>
          </div>

          <button type="submit" className="w-full rounded-md bg-black text-white text-sm py-2 font-medium hover:bg-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300">
            Register
          </button>

          {errorMessage && (<p className="text-center text-sm text-red-500">{errorMessage}</p>)}
        </form>
         <p className="text-center text-xs text-gray-600">
            Have an account?{" "}
            <Link href="/signin" className="text-blue-400 hover:text-blue-600">
              Login
            </Link>
        </p>
      </div>
    </div>
  )
}
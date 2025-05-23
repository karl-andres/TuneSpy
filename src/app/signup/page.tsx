"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "../actions/auth";

export default function Page() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined,
  );
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-semibold">
          Sign up
        </h1>
        <form action={formAction} className="space-y-4">
          <div className="relative h-fit">
            <input
              className="w-full rounded-md border border-gray-300 px-3 pb-1 pt-7 text-sm focus:border-black dark:focus:border-white focus:outline-none"
              type="email"
              name="email"
              required
            />
            <label className="absolute left-3 top-2 text-[12px]">EMAIL</label>
          </div>

          <div className="relative h-fit">
            <input
              className="w-full rounded-md border border-gray-300 px-3 pb-1 pt-7 text-sm focus:border-black dark:focus:border-white focus:outline-none"
              type="password"
              name="password"
              required
              minLength={8}
            />
            <label className="absolute left-3 top-2 text-[12px]">
              PASSWORD
            </label>
          </div>

          <button
            disabled={isPending}
            className="w-full rounded-md bg-black dark:bg-white py-2 text-sm font-medium text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isPending ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-xs">
            Have an account?{" "}
            <Link className="text-blue-400 hover:text-blue-600" href="/signin">
              Sign in
            </Link>
          </p>

          {errorMessage && (
            <p className="text-center text-sm text-red-500">{errorMessage}</p>
          )}
        </form>
        <div className="flex justify-center">
          <button
            disabled={isPending}
            className="w-16 rounded-md bg-black dark:bg-white py-2 text-sm font-medium text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Link href="/">Back</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

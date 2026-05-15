"use client";

import { useState } from "react";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: FormData) => Promise<{ error?: string }>;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await onSubmit(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            </svg>
          </div>
          <span className="text-sm font-medium tracking-wide text-white">
            LAKSHAN ENTERPRISES
          </span>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8">
          <h1 className="mb-1 text-xl font-medium text-white">
            {mode === "login" ? "Welcome back" : "Register your shop"}
          </h1>
          <p className="mb-6 text-sm text-neutral-400">
            {mode === "login"
              ? "Sign in to place and track your orders."
              : "Create an account to start ordering from our catalog."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <>
                <AuthInput
                  label="Shop name"
                  name="shop_name"
                  placeholder="e.g. Sri Optical, Chennai"
                  required
                />
                <AuthInput
                  label="Owner name"
                  name="owner_name"
                  placeholder="Your full name"
                  required
                />
                <AuthInput
                  label="Phone number"
                  name="phone"
                  type="tel"
                  placeholder="+91 98400 00000"
                  required
                />
                <AuthInput label="City" name="city" placeholder="e.g. Chennai" required />
              </>
            )}

            <AuthInput
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
            <AuthInput
              label="Password"
              name="password"
              type="password"
              minLength={8}
              placeholder="Minimum 8 characters"
              required
            />

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-950 px-3 py-2.5">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-white py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-white hover:underline">
                  Register your shop
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/auth/login" className="text-white hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

function AuthInput({ label, name, ...props }: AuthInputProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs text-neutral-400">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
        {...props}
      />
    </div>
  );
}

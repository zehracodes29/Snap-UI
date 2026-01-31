
'use client';
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col items-center justify-center p-6 font-sans">

      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#002b00] to-[#003800] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.15)]">
          <span className="text-[#00ff88] font-extrabold text-lg">SNAP UI</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-[#00ff88] tracking-wide">
          Welcome to SnapUI
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          AI-powered UI & Code Generation
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <Link
          href="/signin"
          className="px-6 py-3 rounded-xl border border-[#233922] bg-transparent text-[#00ff88] font-semibold hover:shadow-[0_0_14px_rgba(0,255,136,0.14)] transition-all duration-200"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 rounded-xl bg-[#00ff88] text-black font-semibold shadow-[0_0_15px_rgba(0,255,136,0.25)] hover:shadow-[0_0_25px_rgba(0,255,136,0.35)] transition-all duration-200"
        >
          Sign Up
        </Link>
      </div>

      <div className="mt-6">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-[#f6ff00] text-black font-semibold shadow-[0_0_15px_rgba(246,255,0,0.25)] hover:shadow-[0_0_25px_rgba(246,255,0,0.35)] transition-all duration-200"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-10 text-xs text-gray-500">
        v1.0 • Build 2025
      </div>
    </div>
  );
}


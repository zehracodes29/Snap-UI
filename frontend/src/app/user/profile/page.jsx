'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Bint Zehra',
    email: 'zehra@example.com',
    role: 'Frontend Developer',
    bio: "I build AI-powered UIs and neat developer tools.",
    location: 'India',
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  function openEdit() {
    setDraft(profile);
    setEditing(true);
  }

  async function saveProfile() {
    setSaving(true);
    // simulate saving (replace with axios/fetch to your API)
    await new Promise((r) => setTimeout(r, 800));
    setProfile(draft);
    setSaving(false);
    setEditing(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((d) => ({ ...d, [name]: value }));
  }

  return (
    <div className="min-h-screen bg-[#080808] text-gray-200 font-sans p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2b002b] to-[#3b003b] flex items-center justify-center shadow-[0_0_20px_rgba(255,45,149,0.12)]">
              <span className="text-[#ff2d95] font-extrabold">SNAP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#ff2d95]">Profile</h1>
              <p className="text-sm text-gray-400">Account settings & personal info</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="px-3 py-2 rounded-lg bg-[#0b0b0b] border border-[#1a1a1a] text-[#ffcfe6] hover:shadow-[0_0_12px_rgba(255,45,149,0.06)]">
              Dashboard
            </Link>
            <button
              onClick={() => setShowLogout(true)}
              className="px-3 py-2 rounded-lg bg-[#f6ff00] text-black font-semibold shadow-[0_6px_18px_rgba(246,255,0,0.12)] hover:brightness-95"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Profile card */}
        <div className="rounded-2xl p-6 bg-gradient-to-b from-[#0b0b0b] to-[#111111] border border-[#111] shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <div className="md:flex md:items-start md:gap-6">
            {/* Avatar & quick stats */}
            <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-[#2a002a] flex items-center justify-center text-2xl font-bold text-[#ff2d95] shadow-[0_0_18px_rgba(255,45,149,0.08)]">
                  {profile.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
                <button
                  className="absolute -right-2 -bottom-2 bg-[#050505] p-2 rounded-full shadow-[0_6px_18px_rgba(255,45,149,0.12)]"
                  title="Change avatar"
                >
                  ✎
                </button>
              </div>

              <div className="w-full md:w-40 space-y-2 text-center md:text-left">
                <div className="text-xs text-gray-400">Member since</div>
                <div className="text-sm font-semibold text-yellow-400">Nov 2024</div>
              </div>
            </div>

            {/* Main details */}
            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-semibold text-white">{profile.name}</div>
                  <div className="text-sm text-gray-400">{profile.role} • <span className="text-yellow-400">{profile.location}</span></div>
                  <div className="text-xs text-gray-500 mt-2">{profile.email}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openEdit}
                    className="px-3 py-2 rounded-md border border-[#1a1a1a] text-[#ffcfe6] hover:shadow-[0_0_12px_rgba(255,45,149,0.06)]"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigator.clipboard?.writeText(profile.email)}
                    className="px-3 py-2 rounded-md bg-[#ff2d95] bg-opacity-10 text-[#0b0b0b] border border-[#5b003b] hover:shadow-[0_0_10px_rgba(255,45,149,0.08)]"
                  >
                    Copy Email
                  </button>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-300">
                <div className="font-medium text-[#ff2d95] mb-2">About</div>
                <div className="text-gray-300">{profile.bio}</div>
              </div>

              {/* quick stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#060606] border border-[#1a1a1a] text-center">
                  <div className="text-xs text-gray-400">Projects</div>
                  <div className="text-lg font-bold text-[#f6ff00]">12</div>
                </div>
                <div className="p-3 rounded-lg bg-[#060606] border border-[#1a1a1a] text-center">
                  <div className="text-xs text-gray-400">UI Generated</div>
                  <div className="text-lg font-bold text-[#ff2d95]">128</div>
                </div>
                <div className="p-3 rounded-lg bg-[#060606] border border-[#1a1a1a] text-center">
                  <div className="text-xs text-gray-400">Time Saved</div>
                  <div className="text-lg font-bold text-yellow-400">~34h</div>
                </div>
              </div>
            </div>
          </div>

          {/* activity */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-[#ff2d95] mb-3">Recent Activity</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-3 h-3 rounded-full bg-[#ff2d95] shadow-[0_0_8px_rgba(255,45,149,0.12)]"></div>
                <div>
                  Generated dashboard UI • <span className="text-xs text-gray-400">Nov 12, 2025</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-3 h-3 rounded-full bg-[#f6ff00] shadow-[0_0_8px_rgba(246,255,0,0.12)]"></div>
                <div>
                  Saved template “Login Page” • <span className="text-xs text-gray-400">Nov 10, 2025</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* small utilities */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 bg-[#050505] border border-[#1a1a1a]">
            <div className="text-xs text-gray-400">Plan</div>
            <div className="text-lg font-semibold text-white">Pro</div>
            <div className="mt-2 text-sm text-gray-300">Up to 500 generations / month</div>
          </div>

          <div className="rounded-2xl p-4 bg-[#050505] border border-[#1a1a1a]">
            <div className="text-xs text-gray-400">API Key</div>
            <div className="text-lg font-semibold text-white">••••••••••••••</div>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 rounded-md bg-[#ff2d95] bg-opacity-10 text-[#050505] border border-[#5b003b]">Reveal</button>
              <button className="px-3 py-1 rounded-md bg-[#f6ff00] text-black">Regenerate</button>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-[#050505] border border-[#1a1a1a]">
            <div className="text-xs text-gray-400">Security</div>
            <div className="text-lg font-semibold text-white">2FA</div>
            <div className="mt-2 text-sm text-gray-300">Enabled</div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center mt-4">
          v1.0 • Build 2025 • © YourCompany
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(false)} />
          <div className="relative w-full max-w-md rounded-2xl p-6 bg-gradient-to-b from-[#0b0b0b] to-[#111111] border border-[#111] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <h3 className="text-lg font-semibold text-[#ff2d95] mb-3">Edit Profile</h3>

            <div className="space-y-3">
              <input name="name" value={draft.name} onChange={handleChange} className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200" placeholder="Full name" />
              <input name="email" value={draft.email} onChange={handleChange} className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200" placeholder="Email address" />
              <input name="role" value={draft.role} onChange={handleChange} className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200" placeholder="Role" />
              <textarea name="bio" value={draft.bio} onChange={handleChange} className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200 resize-none" rows={3} placeholder="Short bio" />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-md border border-[#1a1a1a] text-gray-300">Cancel</button>
              <button onClick={saveProfile} disabled={saving} className="px-4 py-2 rounded-md bg-[#f6ff00] text-black font-semibold shadow-[0_6px_18px_rgba(246,255,0,0.12)]">
                {saving ? 'Saving...' : 'Save profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout confirm */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowLogout(false)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6 bg-gradient-to-b from-[#0b0b0b] to-[#111111] border border-[#111] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-300">Are you sure you want to log out?</p>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowLogout(false)} className="px-4 py-2 rounded-md border border-[#1a1a1a] text-gray-300">Cancel</button>
              <button onClick={() => { /* implement logout */ alert('Logged out'); setShowLogout(false); }} className="px-4 py-2 rounded-md bg-[#f6ff00] text-black font-semibold">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

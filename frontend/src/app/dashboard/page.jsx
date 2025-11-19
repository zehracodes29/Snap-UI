'use client';
import React, { useState } from "react";

// Single-file React component for a neon Black-Green-Yellow themed dashboard.
// Uses Tailwind CSS classes (assumes Tailwind is configured in the project).
// Default export is the Dashboard component.

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [recentProjects, setRecentProjects] = useState([
    { id: 1, title: "Admin Dashboard UI", type: "UI", date: "2025-11-12", status: "Completed" },
    { id: 2, title: "Auth Boilerplate", type: "Code", date: "2025-11-10", status: "In progress" },
    { id: 3, title: "Landing Page (Hero)", type: "UI", date: "2025-11-08", status: "Completed" },
  ]);

  const templates = [
    { id: 1, name: "Login Page", tag: "UI" },
    { id: 2, name: "CRUD API", tag: "Code" },
    { id: 3, name: "Dashboard Layout", tag: "UI" },
  ];

  function handleGenerate(type) {
    // Placeholder for generation action (call your AI service here)
    alert(`Generating ${type} for: ${prompt || "<empty prompt>"}`);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 rounded-full bg-gradient-to-br from-[#002b00] to-[#003800] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.12)]">
            <span className="text-[#00ff88] font-extrabold">SNAP UI</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#00ff88]">AI Code & UI Generator</h1>
            <p className="text-sm text-gray-400">Generate production-ready code & interfaces instantly</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-3 py-2 rounded-md bg-transparent border border-[#2a2a2a] hover:shadow-[0_0_12px_rgba(246,255,0,0.12)]">Docs</button>
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 rounded-md bg-[#00ff88] bg-opacity-10 text-[#0c0c0c] hover:shadow-[0_0_12px_rgba(0,255,136,0.18)]">Generate</button>
          </div>
        </div>
      </header>

      {/* Main grid */}
      <main className="grid grid-cols-12 gap-6">
        {/* Left column (8 cols) */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          {/* Hero / Quick Actions */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-[#070707] to-[#0f0f0f] border border-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#00ff88]">Welcome back 👋</h2>
                <p className="text-sm text-gray-400">Start a new generation or continue your recent projects.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg border border-[#233922] bg-transparent text-[#00ff88] hover:shadow-[0_0_14px_rgba(0,255,136,0.14)]">New Project</button>
                <button className="px-4 py-2 rounded-lg bg-[#f6ff00] text-black font-semibold shadow-[0_6px_20px_rgba(246,255,0,0.12)]">Generate Now</button>
              </div>
            </div>

            {/* Quick action cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickCard title="Generate UI" subtitle="Create interface from prompt" onClick={()=>handleGenerate('UI')} icon="🖥️"/>
              <QuickCard title="Generate Code" subtitle="Boilerplate & functions" onClick={()=>handleGenerate('Code')} icon="⚙️"/>
              <QuickCard title="Templates" subtitle="Start from template" onClick={()=>alert('Open templates')} icon="📁"/>
            </div>
          </div>

          {/* Prompt box */}
          <div className="rounded-2xl p-5 border border-[#141414] bg-[#070707]">
            <label className="text-sm text-gray-400">Quick Prompt</label>
            <div className="mt-3 flex gap-3">
              <input value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Describe what you want (e.g. 'responsive dashboard with sidebar')" className="flex-1 bg-transparent border border-[#222] rounded-md px-4 py-3 focus:outline-none focus:shadow-[0_0_12px_rgba(0,255,136,0.12)]" />
              <button onClick={()=>handleGenerate('UI')} className="px-4 py-2 rounded-md bg-[#00ff88] bg-opacity-10 text-[#060606] font-semibold border border-[#0f4a20]">Generate UI</button>
              <button onClick={()=>handleGenerate('Code')} className="px-4 py-2 rounded-md bg-[#f6ff00] text-black font-semibold">Generate Code</button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Tip: short, specific prompts produce better results.</p>
          </div>

          {/* Recent Projects */}
          <div className="rounded-2xl p-5 border border-[#141414] bg-gradient-to-b from-[#060606] to-[#0b0b0b]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#00ff88]">Recent Projects</h3>
              <button className="text-sm text-yellow-400">See all</button>
            </div>

            <div className="space-y-3">
              {recentProjects.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-[#080808] p-3 rounded-lg border border-[#1a1a1a]">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[#001f00] shadow-[0_0_12px_rgba(0,255,136,0.06)]">{p.type === 'UI' ? 'UI' : '<>'}</div>
                      <div>
                        <div className="font-semibold">{p.title}</div>
                        <div className="text-xs text-gray-400">{p.date} • <span className="text-yellow-400">{p.status}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-1 rounded-md text-sm border border-[#222]">Open</button>
                    <button className="px-2 py-1 rounded-md text-sm text-red-400">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="rounded-2xl p-5 border border-[#141414] bg-[#070707]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#00ff88]">Saved Templates</h3>
              <button className="text-sm text-yellow-400">Manage</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {templates.map(t => (
                <div key={t.id} className="p-3 rounded-lg border border-[#1a1a1a] bg-[#080808]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.tag}</div>
                    </div>
                    <div className="text-yellow-400">⋯</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Right column (4 cols) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* Activity timeline */}
          <div className="rounded-2xl p-5 border border-[#141414] bg-[#070707]">
            <h3 className="text-lg font-semibold text-[#00ff88] mb-3">Activity</h3>
            <div className="space-y-4">
              <ActivityItem text="Generated React Dashboard UI" date="Nov 12, 2025"/>
              <ActivityItem text="Saved template 'Login Page'" date="Nov 10, 2025"/>
              <ActivityItem text="Edited project 'Auth Boilerplate'" date="Nov 08, 2025"/>
            </div>
          </div>

          {/* Analytics (simple) */}
          <div className="rounded-2xl p-5 border border-[#141414] bg-[#070707]">
            <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Quick Analytics</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="UI Generated" value="128"/>
              <StatCard label="Code Generated" value="256"/>
              <StatCard label="Templates" value="12"/>
              <StatCard label="Time Saved" value="~34h"/>
            </div>
          </div>

          {/* Suggestions */}
          <div className="rounded-2xl p-4 border border-[#141414] bg-[#070707]">
            <h4 className="text-sm font-semibold text-[#00ff88]">AI Suggestions</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><span className="text-yellow-400">•</span> Try: "Mobile-first dashboard layout"</li>
              <li className="flex items-start gap-2"><span className="text-yellow-400">•</span> Use: "prefill form with validation"</li>
            </ul>
          </div>

          {/* Footer small */}
          <div className="text-xs text-gray-500">
            <div>v1.0 • Build 2025</div>
            <div>© YourCompany</div>
          </div>
        </aside>
      </main>
    </div>
  );
}


/* ---------- Subcomponents ---------- */

function QuickCard({ title, subtitle, onClick, icon }){
  return (
    <button onClick={onClick} className="flex flex-col items-start p-4 rounded-xl border border-[#1a1a1a] bg-[#050505] hover:shadow-[0_0_12px_rgba(0,255,136,0.08)]">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-white">{title}</div>
      <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
    </button>
  );
}

function ActivityItem({ text, date }){
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-3 h-3 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.12)]"></div>
      <div className="text-sm text-gray-300">
        <div>{text}</div>
        <div className="text-xs text-gray-500">{date}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value }){
  return (
    <div className="p-3 rounded-lg bg-[#080808] border border-[#1a1a1a]">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-xl font-bold text-[#f6ff00]">{value}</div>
    </div>
  );
}

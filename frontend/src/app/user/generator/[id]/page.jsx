'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GeneratorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const templates = [
    "Responsive dashboard using React & Tailwind",
    "Login page with dark theme",
    "E-commerce product grid",
    "Chat app UI with animations"
  ];

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt!');
      return;
    }
    async function handleNewProjectClick() {
  try {
    const res = await fetch(`${API_BASE}/project/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    router.push(`/user/generator/${data.projectId}`);

  } catch (error) {
    console.error('Error:', error);
  }
}


    setError('');
    setLoading(true);
    setGeneratedCode('');

    try {
      const res = await fetch(`http://localhost:4000/project/new`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
});




      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');

      setGeneratedCode(data.generatedCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200">
      {/* Navbar */}
      <nav className="w-full bg-[#111111] py-4 px-6 flex justify-between items-center sticky top-0 z-50 border-b border-[#222] shadow-md transition-all duration-300">
        <h1 
          className="text-2xl font-bold text-[#f6ff00] cursor-pointer hover:text-yellow-400 transition-colors"
          onClick={() => router.push('/dashboard')}
        >
          SNAP Generator
        </h1>
        <div className="flex space-x-6">
          <button 
            className="text-[#bfffc4] font-medium hover:text-green-400 transition-colors"
            onClick={() => router.push('/dashboard')}
          >Dashboard</button>
          <button 
            className="text-[#bfffc4] font-medium hover:text-green-400 transition-colors"
            onClick={() => router.push('/user/project-manager')}
          >Project Manager</button>
          <button 
            className="text-[#bfffc4] font-medium hover:text-green-400 transition-colors"
            onClick={() => router.push('/user/profile')}
          >Profile</button>
        </div>
      </nav>

      {/* Generator Section */}
      <section className="flex flex-col items-center justify-center mt-12 px-4">
        <h2 className="text-3xl text-[#f6ff00] font-bold mb-6">AI Code Generator</h2>
        <form 
          onSubmit={handleGenerate} 
          className="w-full max-w-3xl flex flex-col gap-4 p-6 bg-[#111] border border-[#222] rounded-xl shadow-md"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full p-4 bg-[#0f0f0f] border border-[#222] rounded-lg text-[#bfffc4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f6ff00]"
            rows={5}
          />

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#f6ff00] text-black rounded-lg font-bold hover:bg-yellow-400 transition-all"
            >
              {loading ? 'Generating...' : 'Generate Code'}
            </button>
            {error && <p className="text-red-500 font-medium">{error}</p>}
          </div>
        </form>

        {/* Generated Code */}
        {generatedCode && (
          <pre className="mt-6 w-full max-w-3xl p-4 bg-[#111] border border-[#222] rounded-lg text-sm text-[#bfffc4] overflow-x-auto shadow-inner">
            {generatedCode}
          </pre>
        )}
      </section>

      {/* Templates Section */}
      <section className="mt-12 px-4 mb-12">
        <h3 className="text-2xl text-[#bfffc4] font-bold mb-4">Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {templates.map((temp, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-[#111] border border-[#222] rounded-lg cursor-pointer hover:scale-105 hover:border-[#f6ff00] transition-transform"
              onClick={() => setPrompt(temp)}
            >
              {temp}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

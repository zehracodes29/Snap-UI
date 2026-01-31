'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

export default function GeneratorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const templates = [
    "Responsive dashboard using React & Tailwind",
    "Login page with dark theme",
    "E-commerce product grid",
    "Chat app UI with animations"
  ];

  // Primary generator: calls backend that returns JSON { data: { generatedCode: '...' } }
  async function handleGenerate(e) {
    e.preventDefault();
    setError('');
    setGeneratedCode('');
    setCopied(false);

    if (!prompt.trim()) {
      setError('Please enter a prompt!');
      return;
    }

    setLoading(true);
    try {
      // Use correct API endpoint with /api
      const url = `${API_BASE}/api/generate`;
      console.log('POST ->', url, { prompt });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      // Read raw text first to detect errors
      const raw = await res.text();
      console.log('Raw response (first 800 chars):', raw.slice(0, 800));

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(raw);
      } catch (parseErr) {
        throw new Error(`Backend returned non-JSON: ${raw.slice(0, 500)}`);
      }

      // Check response status
      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      // Extract code from backend response structure
      // Backend returns: { ok: true, data: { _id, prompt, generatedCode, createdAt } }
      const code = 
        data?.data?.generatedCode || 
        data?.generatedCode || 
        data?.code || 
        '';

      if (!code) {
        console.error('Full response:', data);
        throw new Error('No generatedCode found in response');
      }

      setGeneratedCode(code);
      console.log('✅ Code generated successfully');

    } catch (err) {
      console.error('Generate error:', err);
      setError(err.message || 'Unknown error during generation');
    } finally {
      setLoading(false);
    }
  }

  // Copy generated code to clipboard
  function handleCopyCode() {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Download code as HTML file
  function handleDownloadCode() {
    if (generatedCode) {
      const element = document.createElement('a');
      const file = new Blob([generatedCode], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = `generated-${Date.now()}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
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
        <p className="text-gray-400 mb-6 max-w-2xl text-center">Project ID: <span className="text-[#bfffc4] font-mono">{id}</span></p>

        <form
          onSubmit={handleGenerate}
          className="w-full max-w-3xl flex flex-col gap-4 p-6 bg-[#111] border border-[#222] rounded-xl shadow-md"
        >
          <div>
            <label className="block text-sm font-semibold text-[#bfffc4] mb-2">
              Describe what you want to generate:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a responsive navbar with logo and navigation menu..."
              className="w-full p-4 bg-[#0f0f0f] border border-[#222] rounded-lg text-[#bfffc4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f6ff00] transition"
              rows={5}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-900 bg-opacity-30 border border-red-600 rounded-lg text-red-400">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#f6ff00] text-black rounded-lg font-bold hover:bg-yellow-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Code'}
            </button>

            <button
              type="button"
              onClick={() => {
                setPrompt('');
                setGeneratedCode('');
                setError('');
                setCopied(false);
              }}
              disabled={loading}
              className="px-4 py-2 border border-[#333] rounded-lg text-sm text-[#bfffc4] hover:bg-[#0f0f0f] transition-all disabled:opacity-60"
            >
              Clear
            </button>
          </div>        </form>
                    <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              onClick={async () => {
                try {
                  const url = `${API_BASE}/generate`;
                  console.log('Testing URL:', url);
                  const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: 'test' }),
                  });
                  const data = await res.json();
                  console.log('Response:', data);
                  alert(`Status: ${res.status}\n\n${JSON.stringify(data, null, 2)}`);
                } catch (err) {
                  alert(`Error: ${err.message}`);
                }
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded text-sm"
            >
              Test Backend Connection
            </button>
          </div>

        {/* Generated Code Preview */}
        {generatedCode && (
          <div className="mt-8 w-full max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#f6ff00]">Generated Code</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
                >
                  {copied ? '✓ Copied' : 'Copy Code'}
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition"
                >
                  Download
                </button>
              </div>
            </div>

            {/* Code preview */}
            <pre className="p-4 bg-[#0a0a0a] border border-[#222] rounded-lg text-xs text-[#bfffc4] overflow-x-auto shadow-inner max-h-96">
              <code>{generatedCode}</code>
            </pre>

            {/* Live preview */}
            <div className="mt-6 p-6 bg-white rounded-lg border border-[#222]">
              <h4 className="text-sm font-bold text-black mb-4">Live Preview</h4>
              <div className="overflow-auto max-h-96 bg-gray-50 rounded">
                <div dangerouslySetInnerHTML={{ __html: generatedCode }} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Templates Section */}
      <section className="mt-16 px-4 mb-12">
        <h3 className="text-2xl text-[#bfffc4] font-bold mb-4 text-center">Quick Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {templates.map((temp, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(temp)}
              className="p-4 bg-[#111] border border-[#222] rounded-lg cursor-pointer hover:scale-105 hover:border-[#f6ff00] hover:bg-[#1a1a1a] transition-all duration-200 text-left"
            >
              <p className="text-sm text-[#bfffc4] font-medium">{temp}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 px-6 border-t border-[#222] text-center text-gray-500 text-sm">
        <p>SNAP UI Generator • Powered by AI • v1.0</p>
      </footer>
    </div>
  );
}
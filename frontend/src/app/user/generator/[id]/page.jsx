'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

export default function GeneratorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'preview'

  const iframeRef = useRef(null);

  const templates = [
    "Responsive dashboard using React & Tailwind",
    "Login page with dark theme",
    "E-commerce product grid",
    "Chat app UI with animations"
  ];

  // Update iframe content when generatedCode changes
  useEffect(() => {
    if (iframeRef.current && generatedCode && activeTab === 'preview') {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      iframeDoc.open();
      iframeDoc.write(generatedCode);
      iframeDoc.close();
    }
  }, [generatedCode, activeTab]);

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
      const url = `${API_BASE}/api/generate`;
      console.log('POST ->', url, { prompt });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const raw = await res.text();
      console.log('Raw response (first 800 chars):', raw.slice(0, 800));

      let data;
      try {
        data = JSON.parse(raw);
      } catch (parseErr) {
        throw new Error(`Backend returned non-JSON: ${raw.slice(0, 500)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

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
      setActiveTab('preview'); // Auto-switch to preview
      console.log('✅ Code generated successfully');

    } catch (err) {
      console.error('Generate error:', err);
      setError(err.message || 'Unknown error during generation');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyCode() {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

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
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-[#111111] py-4 px-6 flex justify-between items-center border-b border-[#222] shadow-md">
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

      {/* Main Content - Split Screen Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-[#222] bg-[#0a0a0a]">
          {/* Editor Header */}
          <div className="p-6 border-b border-[#222]">
            <h2 className="text-2xl text-[#f6ff00] font-bold mb-2">AI Code Generator</h2>
            <p className="text-gray-400 text-sm">Project ID: <span className="text-[#bfffc4] font-mono">{id}</span></p>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#bfffc4] mb-2">
                  Describe what you want to generate:
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a responsive navbar with logo and navigation menu..."
                  className="w-full p-4 bg-[#0f0f0f] border border-[#222] rounded-lg text-[#bfffc4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f6ff00] transition min-h-[200px] resize-y"
                  rows={8}
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
                  className="px-6 py-3 bg-[#f6ff00] text-black rounded-lg font-bold hover:bg-yellow-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    '✨ Generate Code'
                  )}
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
                  className="px-4 py-3 border border-[#333] rounded-lg text-sm text-[#bfffc4] hover:bg-[#0f0f0f] transition-all disabled:opacity-60"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Quick Templates */}
            <div className="mt-8">
              <h3 className="text-lg text-[#bfffc4] font-bold mb-3">Quick Templates</h3>
              <div className="grid grid-cols-1 gap-2">
                {templates.map((temp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(temp)}
                    className="p-3 bg-[#111] border border-[#222] rounded-lg text-left hover:border-[#f6ff00] hover:bg-[#1a1a1a] transition-all duration-200"
                  >
                    <p className="text-sm text-[#bfffc4]">{temp}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#0a0a0a]">
          {/* Preview Header */}
          <div className="p-6 border-b border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-[#f6ff00]">
                {generatedCode ? 'Generated Output' : 'Preview'}
              </h3>

              {generatedCode && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1 rounded text-sm transition ${activeTab === 'code'
                      ? 'bg-[#f6ff00] text-black font-medium'
                      : 'bg-[#111] text-[#bfffc4] border border-[#222] hover:bg-[#1a1a1a]'
                      }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded text-sm transition ${activeTab === 'preview'
                      ? 'bg-[#f6ff00] text-black font-medium'
                      : 'bg-[#111] text-[#bfffc4] border border-[#222] hover:bg-[#1a1a1a]'
                      }`}
                  >
                    Preview
                  </button>
                </div>
              )}
            </div>

            {generatedCode && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            )}
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!generatedCode ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <svg className="w-24 h-24 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <p className="text-lg font-medium">No code generated yet</p>
                  <p className="text-sm mt-2">Enter a prompt and click "Generate Code"</p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'code' ? (
                  <div className="h-full">
                    <pre className="p-4 bg-[#0f0f0f] border border-[#222] rounded-lg text-xs text-[#bfffc4] overflow-auto shadow-inner font-mono max-h-[calc(100vh-300px)] whitespace-pre-wrap break-words">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-[#222] overflow-hidden h-full">
                    <div className="p-2 bg-gray-100 border-b border-gray-300 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs text-gray-600 ml-2">Live Preview</span>
                    </div>
                    <div className="bg-white overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                      <iframe
                        ref={iframeRef}
                        title="Live Preview"
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full border-0"
                        style={{ minHeight: '500px', height: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

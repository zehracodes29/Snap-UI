'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';

export default function GeneratorPage() {
  const { id } = useParams(); // project id from URL
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt!');
      return;
    }

    setError('');
    setLoading(true);
    setGeneratedCode('');

    try {
      const res = await fetch(`http://localhost:4000/api/projects/${id}/generated`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
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
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6">
      <form onSubmit={handleGenerate} className="space-y-4 max-w-3xl mx-auto">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt (e.g., responsive dashboard using React & Tailwind)"
          className="w-full p-4 bg-[#080808] border border-[#1a1a1a] rounded-lg text-gray-200"
          rows={5}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#f6ff00] text-black rounded-lg font-semibold"
        >
          {loading ? 'Generating...' : 'Generate Code'}
        </button>
        {error && <p className="text-red-400">{error}</p>}
      </form>

      {generatedCode && (
        <pre className="mt-6 p-4 bg-[#030303] border border-[#1a1a1a] rounded-lg text-sm text-[#bfffc4] overflow-x-auto">
          {generatedCode}
        </pre>
      )}
    </div>
  );
}

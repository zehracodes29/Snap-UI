// File: frontend/src/app/new-project/page.jsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage(){
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('UI');
  const [status, setStatus] = useState('Planned');

  function handleSubmit(e){
    e.preventDefault();
    const today = new Date().toISOString().slice(0,10);
    const newProject = {
      id: Date.now(),
      title: title || 'Untitled Project',
      type,
      status,
      date: today,
    };

    // persist to localStorage so Dashboard can read it (simple demo approach)
    try{
      const raw = localStorage.getItem('recentProjects');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(newProject);
      localStorage.setItem('recentProjects', JSON.stringify(arr));
    }catch(e){
      console.error('could not save project', e);
    }

    // navigate back to dashboard
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#00ff88]">New Project</h1>
            <p className="text-sm text-gray-400">Create a project that will appear in your dashboard.</p>
          </div>
          <div>
            <button onClick={()=>router.push('/')} className="px-3 py-2 rounded-md border border-[#222] text-sm">Back</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#070707] border border-[#141414] rounded-2xl p-6">
          <label className="text-sm text-gray-400">Project Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g. Marketing Dashboard" className="w-full mt-2 mb-4 px-4 py-3 rounded-md bg-transparent border border-[#222] focus:outline-none" />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400">Type</label>
              <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full mt-2 px-3 py-2 bg-transparent border border-[#222] rounded-md">
                <option value="UI">UI</option>
                <option value="Code">Code</option>
                <option value="Fullstack">Fullstack</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400">Status</label>
              <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full mt-2 px-3 py-2 bg-transparent border border-[#222] rounded-md">
                <option>Planned</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#00ff88] text-black font-semibold">Create Project</button>
            <button type="button" onClick={()=>{setTitle(''); setType('UI'); setStatus('Planned');}} className="px-4 py-2 rounded-lg border border-[#222]">Reset</button>
          </div>
        </form>

        <p className="mt-4 text-sm text-gray-500">Note: This demo saves projects in browser localStorage. Replace with your backend API to persist projects across devices.</p>
      </div>
    </div>
  );
}

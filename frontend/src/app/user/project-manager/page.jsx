'use client';
import axios from "axios";
import React, { useState } from "react";

/**
 * ProjectManagerPage
 * - New Project modal
 * - Edit Project modal
 * - Neon icons on cards
 * - Optimistic updates with axios calls
 *
 * Paste into a page (e.g. pages/user/project-manager.jsx or app/...).
 */

export default function ProjectManagerPage() {
  const [projects, setProjects] = useState([
    {
      id: Date.now() - 10000,
      name: "Landing Page Generator",
      framework: "React",
      createdAt: new Date(),
      status: "Completed",
    },
  ]);

  // modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // new project form
  const [newName, setNewName] = useState("");
  const [newFramework, setNewFramework] = useState("React");
  const [newStatus, setNewStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);

  // edit form
  const [editProject, setEditProject] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // helper: small neon doc icon (returns JSX)
  const NeonDocIcon = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="4" width="10" height="14" rx="1.2" />
      <rect x="9" y="7" width="8" height="12" rx="1" transform="translate(0)" />
      <path d="M8 9h6" />
      <path d="M8 12h4" />
    </svg>
  );

  // Create project (from modal)
  const handleCreateProject = async () => {
    if (!newName.trim()) {
      alert("Please enter a project name");
      return;
    }

    const newEntry = {
      id: Date.now(),
      name: newName.trim(),
      framework: newFramework || "Unknown",
      createdAt: new Date(),
      status: newStatus || "Draft",
    };

    // optimistic update
    setProjects(prev => [newEntry, ...prev]);
    setIsNewModalOpen(false);
    // clear form
    setNewName("");
    setNewFramework("React");
    setNewStatus("Draft");

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || ""}/project`, newEntry);
      // optionally reconcile id with server response (if server returns id)
      // if (res?.data?.id) { ... }
    } catch (err) {
      console.error("Create failed:", err);
      // rollback
      setProjects(prev => prev.filter(p => p.id !== newEntry.id));
      alert("Failed to save project to server. See console.");
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEdit = (project) => {
    setEditProject({ ...project }); // clone
    setIsEditModalOpen(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editProject || !editProject.name.trim()) {
      alert("Project name required");
      return;
    }

    const updated = { ...editProject, name: editProject.name.trim() };

    // optimistic update
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setIsEditModalOpen(false);

    try {
      setSavingEdit(true);
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || ""}/project/${updated.id}`, updated);
      // success
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update on server. Changes kept locally.");
      // optionally reload from server or revert
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmed = confirm("Delete this project?");
    if (!confirmed) return;

    // optimistic remove
    const prev = projects;
    setProjects(prevState => prevState.filter(p => p.id !== id));

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || ""}/project/${id}`);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete on server. Restoring locally.");
      setProjects(prev); // rollback restore
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#002b00] to-[#003800] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.12)]">
              <span className="text-[#00ff88] font-extrabold">SNAP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#00ff88]">Project Manager</h1>
              <p className="text-sm text-gray-400">Manage and track your generated UI projects</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f6ff00] text-black font-semibold shadow-[0_6px_18px_rgba(246,255,0,0.12)] hover:brightness-95 transition"
            >
              + New Project
            </button>
          </div>
        </header>

        {/* Filter / quick actions bar (optional) */}
        <div className="rounded-2xl p-4 bg-gradient-to-b from-[#070707] to-[#0f0f0f] border border-[#111]">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-400">You have <span className="text-yellow-400 font-medium">{projects.length}</span> projects</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setProjects(prev => [...prev].sort((a,b)=> a.name.localeCompare(b.name)))} className="px-3 py-1 rounded-md border border-[#1a1a1a] text-[#bfffc4] hover:shadow-[0_0_12px_rgba(0,255,136,0.06)]">Sort A→Z</button>
              <button onClick={() => setProjects([])} className="px-3 py-1 rounded-md border border-[#1a1a1a] text-yellow-400 hover:brightness-95">Clear</button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length > 0 ? (
            projects.map((p) => (
              <div key={p.id} className="rounded-xl p-5 bg-[#060606] border border-[#1a1a1a] shadow-[0_6px_18px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_30px_rgba(0,255,136,0.04)] transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-[#001f00] flex items-center justify-center shadow-[0_0_12px_rgba(0,255,136,0.06)] text-sm font-semibold text-[#00ff88]">
                      {/* initial or small icon */}
                      <NeonDocIcon className="w-6 h-6 text-yellow-400" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                      <div className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${p.status === 'Completed' ? 'bg-[#002b00] text-[#00ff88]' : 'bg-[#261b00] text-[#f6ff00]'}`}>
                      {p.status}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-300">
                  <div>Framework: <span className="font-medium text-gray-100">{p.framework}</span></div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="px-3 py-2 rounded-md border border-[#222] bg-transparent text-[#bfffc4] hover:shadow-[0_0_12px_rgba(0,255,136,0.06)]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-2 rounded-md text-red-400 bg-transparent border border-[#222] hover:bg-[#1a0000] transition"
                    >
                      Delete
                    </button>
                  </div>

                  <button
                    onClick={() => alert(`Viewing project: ${p.name}`)}
                    className="px-3 py-2 rounded-md bg-[#00ff88] bg-opacity-10 text-[#070707] border border-[#0f4a20] hover:shadow-[0_0_10px_rgba(0,255,136,0.08)]"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl p-8 bg-[#050505] border border-[#1a1a1a] text-center text-gray-400">
              No projects yet. Create one with <span className="text-yellow-400 font-medium">+ New Project</span>.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 text-center mt-4">
          v1.0 • Build 2025 • © YourCompany
        </div>
      </div>

      {/* New Project Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsNewModalOpen(false)}></div>
          <div className="relative w-full max-w-lg rounded-2xl p-6 bg-gradient-to-b from-[#070707] to-[#0f0f0f] border border-[#111] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <h3 className="text-lg font-semibold text-[#00ff88] mb-3">Create New Project</h3>

            <div className="space-y-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Project name"
                className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={newFramework}
                  onChange={(e) => setNewFramework(e.target.value)}
                  placeholder="Framework (React/Vue/Next...)"
                  className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200 focus:outline-none"
                />
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200 focus:outline-none">
                  <option>Draft</option>
                  <option>In progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setIsNewModalOpen(false)} className="px-4 py-2 rounded-md border border-[#1a1a1a] text-gray-300">Cancel</button>
              <button onClick={handleCreateProject} disabled={loading} className="px-4 py-2 rounded-md bg-[#f6ff00] text-black font-semibold shadow-[0_6px_18px_rgba(246,255,0,0.12)]">
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative w-full max-w-lg rounded-2xl p-6 bg-gradient-to-b from-[#070707] to-[#0f0f0f] border border-[#111] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <h3 className="text-lg font-semibold text-[#00ff88] mb-3">Edit Project</h3>

            <div className="space-y-3">
              <input
                value={editProject.name}
                onChange={(e) => setEditProject(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Project name"
                className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={editProject.framework}
                  onChange={(e) => setEditProject(prev => ({ ...prev, framework: e.target.value }))}
                  placeholder="Framework"
                  className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200 focus:outline-none"
                />
                <select value={editProject.status} onChange={(e) => setEditProject(prev => ({ ...prev, status: e.target.value }))} className="w-full bg-[#080808] border border-[#1a1a1a] rounded-lg px-4 py-3 text-gray-200 focus:outline-none">
                  <option>Draft</option>
                  <option>In progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-md border border-[#1a1a1a] text-gray-300">Cancel</button>
              <button onClick={handleSaveEdit} disabled={savingEdit} className="px-4 py-2 rounded-md bg-[#00ff88] text-black font-semibold shadow-[0_6px_18px_rgba(0,255,136,0.08)]">
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

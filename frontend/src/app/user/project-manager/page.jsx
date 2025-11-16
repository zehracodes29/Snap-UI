"use client";
import axios from "axios";
import React, { useState } from "react";

export default function ProjectManagerPage() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Landing Page Generator",
      framework: "React",
      createdAt: new Date(),
      status: "Completed",
    },
  ]);

  const [newProject, setNewProject] = useState("");

  const handleAddProject = () => {
    if (!newProject.trim()) {
      alert("Enter a project name");
      return;
    }

    const newEntry = {
      
      name: newProject,
    };

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/project`, newEntry)

    setNewProject("");
  };

  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleView = (project) => {
    alert(`Viewing project: ${project.name}`);
  };

  return (
    <div className="min-h-screen bg-black py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-green-200 text-center mb-2">
          Project Manager
        </h1>
        <p className="text-green-200 text-center mb-10">
          Manage and track your generated UI projects
        </p>

        {/* Add Project Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8">
          <input
            type="text"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            style={{ backgroundColor: "#000000", color: "#9AE6B4" }}
            placeholder="Enter project name..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleAddProject}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Add Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length > 0 ? (
            projects.map((p) => (
              <div
                key={p.id}
                className="bg-green-200 border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-800">
                  Framework: <span className="font-medium">{p.framework}</span>
                </p>
                <p className="text-sm text-gray-800">
                  Status: <span className="font-medium">{p.status}</span>
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  Created: {new Date(p.createdAt).toLocaleDateString()}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleView(p)}
                    className="text-gray-800 hover:underline text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No projects yet. Add one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
// src/pages/dashboard/CreateWork.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateWork() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:4000/api/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, code }),
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        console.error("Failed to create work");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Work</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4"
      >
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Project Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-violet-500 outline-none"
            placeholder="Enter project name"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Code (HTML/React)
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-lg p-2 h-60 focus:ring-2 focus:ring-violet-500 outline-none"
            placeholder="Paste your code here..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
        >
          Save Work
        </button>
      </form>
    </div>
  );
}

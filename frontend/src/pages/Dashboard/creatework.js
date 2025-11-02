import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateWork() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) navigate("/dashboard");
      else alert("Failed to create work");
    } catch (err) {
      console.error("Error creating work:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New Work</h1>
        <input
          type="text"
          placeholder="Title"
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
        >
          Create
        </button>
      </form>
    </div>
  );
}

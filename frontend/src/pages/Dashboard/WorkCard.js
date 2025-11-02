// src/pages/dashboard/WorkCard.jsx
import { Edit, Trash2 } from "lucide-react";

export default function WorkCard({ work }) {
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Delete this work?")) return;

    try {
      await fetch(`http://localhost:4000/api/works/${work._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload(); // refresh dashboard
    } catch (err) {
      console.error("Error deleting work:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition">
      <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
        {work.preview ? (
          <img
            src={work.preview}
            alt={work.title}
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          "No Preview"
        )}
      </div>

      <h3 className="font-semibold text-gray-800 truncate">{work.title}</h3>
      <p className="text-sm text-gray-500 mb-3">
        Last edited {new Date(work.updatedAt).toLocaleDateString()}
      </p>

      <div className="flex justify-end gap-3 mt-auto">
        <button className="text-violet-600 hover:text-violet-800">
          <Edit size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

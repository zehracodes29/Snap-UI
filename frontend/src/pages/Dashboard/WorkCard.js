export default function WorkCard({ work }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-800">{work.title}</h3>
      <p className="text-gray-500 mt-2 text-sm line-clamp-3">
        {work.description || "No description provided."}
      </p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Last updated: {new Date(work.updatedAt).toLocaleDateString()}
        </span>
        <button className="text-violet-600 font-medium hover:underline">
          View
        </button>
      </div>
    </div>
  );
}

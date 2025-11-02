import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddWorkCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/dashboard/create")}
      className="cursor-pointer flex items-center justify-center h-48 bg-white rounded-xl border-2 border-dashed border-violet-300 hover:border-violet-500 transition"
    >
      <div className="text-violet-500 flex flex-col items-center">
        <Plus size={32} />
        <span className="mt-2 font-medium">New Work</span>
      </div>
    </div>
  );
}

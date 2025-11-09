"use client";
import { useEffect, useState } from "react";
import WorkCard from "./WorkCard";
import AddWorkCard from "./AddWorkCard";

export default function Dashboard() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    async function fetchWorks() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/works", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWorks(data);
      } catch (err) {
        console.error("Error fetching works:", err);
      }
    }
    fetchWorks();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome back 👋 Your Projects
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AddWorkCard />
        {works.length > 0 ? (
          works.map((work) => <WorkCard key={work._id} work={work} />)
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No works yet. Click “+” to start creating.
          </p>
        )}
      </div>
    </div>
  );
}

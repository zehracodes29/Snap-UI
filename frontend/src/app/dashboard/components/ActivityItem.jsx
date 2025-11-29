'use client';
import React from 'react';

export default function ActivityItem({ text, date }){
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-3 h-3 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.12)]"></div>
      <div className="text-sm text-gray-300">
        <div>{text}</div>
        <div className="text-xs text-gray-500">{date}</div>
      </div>
    </div>
  );
}

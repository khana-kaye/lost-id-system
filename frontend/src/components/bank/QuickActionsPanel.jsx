import React from "react";

export default function QuickActionsPanel({ actions }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3 text-gray-800">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((q, i) => (
          <button
            key={i}
            onClick={q.action}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left cursor-pointer"
          >
            <span className="text-xl">{q.emoji}</span>
            <div>
              <div className="font-semibold text-gray-800 text-sm">{q.label}</div>
              <div className="text-xs text-gray-500">{q.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
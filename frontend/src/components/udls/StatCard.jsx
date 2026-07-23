import React from "react";

export function StatCard({ stat }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-sm">
      <div className="text-xs text-gray-500">{stat.label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
      <div
        className={`text-xs mt-1 font-medium ${
          stat.positive ? "text-emerald-700" : "text-rose-700"
        }`}
      >
        {stat.delta}
      </div>
    </div>
  );
}
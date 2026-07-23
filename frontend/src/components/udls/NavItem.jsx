import React from "react";

export function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl border-0 text-left text-xs transition-colors cursor-pointer ${
        active
          ? "bg-slate-900 text-white font-semibold"
          : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-normal"
      }`}
    >
      <span className="text-sm w-4 text-center">{item.emoji}</span>
      <span className="flex-1 truncate">{item.label}</span>

      {item.badge !== null && item.badge !== undefined && (
        <span className="text-[10px] bg-red-500 text-white rounded-full px-2 py-0.5 font-bold">
          {item.badge}
        </span>
      )}
    </button>
  );
}
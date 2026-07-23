import React from "react";

export function QuickActionBtn({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer text-left group"
    >
      <span className="text-xl">{item.emoji}</span>
      <div>
        <div className="text-xs font-semibold text-gray-900 group-hover:text-black">
          {item.label}
        </div>
        <div className="text-[11px] text-gray-500">{item.desc}</div>
      </div>
    </button>
  );
}
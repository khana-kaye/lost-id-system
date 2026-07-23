import React from "react";

export function AccessDenied({ onNavigateHome }) {
  return (
    <div className="p-10 text-center max-w-md mx-auto">
      <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900">🔐 Access Denied</h2>
        <p className="mt-2 text-sm text-gray-600">
          You are not authorized to access the UDLS portal.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-black transition-colors cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
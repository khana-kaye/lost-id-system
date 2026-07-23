import React from "react";

export default function RecentReportsPanel({ reports, statusStyles, onSelectReport }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-3 text-gray-800">Recent ATM Reports</h3>
      {reports.length === 0 ? (
        <p className="text-sm text-gray-500">No recent reports.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {reports.map((r, i) => {
            const s = statusStyles[r.status] || statusStyles["Pending"];
            return (
              <button
                key={r.id || i}
                type="button"
                className="w-full flex justify-between items-center py-2.5 px-1 hover:bg-gray-50 rounded-md transition text-left"
                onClick={() => onSelectReport(r)}
              >
                <div>
                  <div className="font-semibold text-gray-800">{r.card_holder}</div>
                  <div className="text-xs text-gray-500">{r.account_number}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.color}`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
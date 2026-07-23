import React from "react";

export default function ReportsTable({ reports, statusStyles, onSelectReport, onBack }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">All ATM Reports</h3>
        
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-gray-500">No ATM reports available.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {reports.map((r, i) => {
            const s = statusStyles[r.status] || statusStyles["Pending"];
            return (
              <button
                key={r.id || i}
                type="button"
                className="w-full flex justify-between items-center py-3 px-2 hover:bg-gray-50 rounded-lg transition text-left"
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
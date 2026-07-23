import React from "react";

const STATUS_STYLE = {
  "under review": {
    label: "Under Review",
    className: "bg-amber-100 text-amber-800",
  },
  cleared: {
    label: "Cleared",
    className: "bg-emerald-100 text-emerald-800",
  },
  "confirmed fraud": {
    label: "Confirmed Fraud",
    className: "bg-rose-100 text-rose-800",
  },
  "under investigation": {
    label: "Under Investigation",
    className: "bg-indigo-100 text-indigo-800",
  },
};

export function RecentReportsTable({ reports }) {
  if (!reports || reports.length === 0) {
    return (
      <div className="p-4 text-xs text-gray-500 text-center">
        No recent reports available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left">
        <tbody className="divide-y divide-gray-100">
          {reports.map((r, i) => {
            const statusInfo = STATUS_STYLE[r.status] || {
              label: r.status,
              className: "bg-gray-100 text-gray-700",
            };

            return (
              <tr key={r.id || i} className="hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-medium text-gray-900">
                  {r.name}
                </td>
                <td className="py-2.5 px-3 text-gray-600 font-mono">
                  {r.plate || r.license}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
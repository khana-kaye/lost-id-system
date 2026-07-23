import React from "react";

export default function FreezeManagementTable({ reports, onToggleStatus, onBack }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Freeze Card Management</h3>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl mb-5 text-sm">
        <div className="font-bold text-blue-900 mb-1">Automatic Protection</div>
        <div className="text-slate-600 leading-relaxed">
          ATM cards reported missing are automatically frozen for customer safety. Use the controls below to freeze or unfreeze cards directly.
        </div>
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-gray-500">No ATM reports available.</p>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="p-3.5 px-4 font-semibold">Card Holder</th>
                <th className="p-3.5 px-4 font-semibold">Account</th>
                <th className="p-3.5 px-4 font-semibold">Case</th>
                <th className="p-3.5 px-4 font-semibold">Card</th>
                <th className="p-3.5 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => {
                const isFrozen = report.card_status === "Frozen";
                return (
                  <tr key={report.id} className="hover:bg-gray-50/50">
                    <td className="p-4 px-4 font-medium text-gray-800">{report.card_holder}</td>
                    <td className="p-4 px-4 text-gray-600">{report.account_number}</td>
                    <td className="p-4 px-4 text-gray-600">{report.status}</td>
                    <td className="p-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isFrozen ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {report.card_status || "Active"}
                      </span>
                    </td>
                    <td className="p-4 px-4">
                      <button
                        onClick={() => onToggleStatus(report)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-white transition ${
                          isFrozen ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {isFrozen ? "Unfreeze Card" : "Freeze Card"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
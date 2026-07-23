import React from "react";

export default function AuditLogsTable({ logs, loading, onBack }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Bank Audit Logs</h3>
        
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-500">No audit logs found.</p>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="p-3.5 px-4 font-semibold">User</th>
                <th className="p-3.5 px-4 font-semibold">Action</th>
                <th className="p-3.5 px-4 font-semibold">Target</th>
                <th className="p-3.5 px-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50">
                  <td className="p-4 px-4 font-medium text-gray-800">{log.user}</td>
                  <td className="p-4 px-4 text-gray-700">{log.action}</td>
                  <td className="p-4 px-4 text-gray-500">{log.target || "-"}</td>
                  <td className="p-4 px-4 text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
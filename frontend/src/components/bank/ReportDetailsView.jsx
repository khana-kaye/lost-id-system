import React from "react";

export default function ReportDetailsView({ report, statusStyles, onBack }) {
  const s = statusStyles[report.status] || statusStyles["Pending"];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Report Details</h3>
        <button
          onClick={onBack}
          className="px-3.5 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-sm text-gray-700 transition"
        >
          Back
        </button>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 text-sm divide-y divide-gray-200">
        <div className="grid grid-cols-[120px_1fr] gap-2 py-2.5">
          <span className="text-gray-500 font-semibold">Card Holder:</span>
          <span className="text-gray-800">{report.card_holder}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-2 py-2.5">
          <span className="text-gray-500 font-semibold">Account Number:</span>
          <span className="text-gray-800">{report.account_number}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-2 py-2.5">
          <span className="text-gray-500 font-semibold">Bank Name:</span>
          <span className="text-gray-800">{report.bank_name}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-2 py-2.5">
          <span className="text-gray-500 font-semibold">Card Type:</span>
          <span className="text-gray-800">{report.card_type}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-2 py-2.5">
          <span className="text-gray-500 font-semibold">Reason:</span>
          <span className="text-gray-800">{report.reason}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-2 py-2.5 items-center">
          <span className="text-gray-500 font-semibold">Status:</span>
          <div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block ${s.bg} ${s.color}`}>
              {s.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
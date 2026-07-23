import React from "react";

export default function ReportForm({ formData, onChange, onSubmit, loading }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-gray-800">Report Lost ATM</h3>
      <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <input
          type="text"
          name="card_holder"
          placeholder="Card Holder Name"
          value={formData.card_holder}
          onChange={onChange}
          className="p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="account_number"
          placeholder="Account Number"
          value={formData.account_number}
          onChange={onChange}
          className="p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="bank_name"
          placeholder="Bank Name"
          value={formData.bank_name}
          onChange={onChange}
          className="p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="card_type"
          placeholder="Card Type"
          value={formData.card_type}
          onChange={onChange}
          className="p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason for reporting lost ATM"
          value={formData.reason}
          onChange={onChange}
          className="p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
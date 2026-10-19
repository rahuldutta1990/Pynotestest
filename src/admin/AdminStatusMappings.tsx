import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';

export const AdminStatusMappings: React.FC = () => {
  const [mappings, setMappings] = useState<any[]>([]);
  const [unmappedStatuses, setUnmappedStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  // Form
  const [rawStatus, setRawStatus] = useState('');
  const [internalStatus, setInternalStatus] = useState('in_transit');
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [isException, setIsException] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/logistics/status-mappings');
      setMappings(res.mappings || []);
      setUnmappedStatuses(res.unmapped_statuses || []);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawStatus.trim()) return;
    setSubmitting(true);
    setMsg(null);
    try {
      await adminFetch('/logistics/status-mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_status: rawStatus.trim(),
          internal_status: internalStatus,
          notify_customer: notifyCustomer,
          is_exception: isException,
        }),
      });
      setMsg(`Mapping for "${rawStatus.toUpperCase()}" saved.`);
      setRawStatus('');
      setNotifyCustomer(false);
      setIsException(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickMap = (status: string) => {
    setRawStatus(status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-[#0B3561]">Courier Status Mappings</h2>
          <p className="text-xs text-[#3C5D81]">
            Map raw courier webhook statuses into PyNotes internal normalized lifecycle stages.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
          {msg}
        </div>
      )}

      {/* Unmapped Statuses Alert */}
      {unmappedStatuses.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-heading font-bold text-xs uppercase">
            <span>⚠️</span> Unmapped Statuses Discovered from Real Courier Scans ({unmappedStatuses.length})
          </div>
          <p className="text-xs text-amber-900">
            Click any raw status below to create a normalized mapping:
          </p>
          <div className="flex flex-wrap gap-2">
            {unmappedStatuses.map(s => (
              <button
                key={s}
                onClick={() => handleQuickMap(s)}
                className="bg-white border border-amber-300 text-amber-900 text-xs font-mono font-bold px-3 py-1 rounded-lg hover:bg-amber-100 transition"
              >
                + Map "{s}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Mapping Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-sm text-[#0B3561]">Create or Update Status Mapping</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#0B3561] mb-1">Raw Courier Status (Exact / Uppercase) *</label>
            <input
              type="text"
              required
              value={rawStatus}
              onChange={e => setRawStatus(e.target.value.toUpperCase())}
              placeholder="e.g. OUT FOR DELIVERY"
              className="w-full px-3 py-2 border border-[#0B3561]/20 rounded-xl font-mono uppercase"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0B3561] mb-1">Target Internal Status *</label>
            <select
              value={internalStatus}
              onChange={e => setInternalStatus(e.target.value)}
              className="w-full px-3 py-2 border border-[#0B3561]/20 rounded-xl font-bold text-[#0B3561]"
            >
              <option value="ready_to_ship">ready_to_ship</option>
              <option value="shipped">shipped</option>
              <option value="picked_up">picked_up</option>
              <option value="in_transit">in_transit</option>
              <option value="out_for_delivery">out_for_delivery</option>
              <option value="delivered">delivered</option>
              <option value="attempt_failed">attempt_failed (Exception)</option>
              <option value="rto_initiated">rto_initiated (Exception)</option>
              <option value="rto_delivered">rto_delivered (Exception)</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="notify"
              checked={notifyCustomer}
              onChange={e => setNotifyCustomer(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="notify" className="font-bold text-[#0B3561] cursor-pointer">
              Notify Customer on Trigger
            </label>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="exception"
              checked={isException}
              onChange={e => setIsException(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="exception" className="font-bold text-rose-600 cursor-pointer">
              Flag as Exception
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#0B3561] text-[#FFD54A] font-heading font-black text-xs px-6 py-2.5 rounded-xl hover:bg-[#071E38] transition disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Mapping Rule'}
        </button>
      </form>

      {/* Mappings Table */}
      <div className="bg-white rounded-2xl border border-[#0B3561]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs">Loading mappings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAFC] border-b border-[#0B3561]/10 font-heading font-bold text-[#0B3561]">
                <tr>
                  <th className="p-3.5">Raw Status (Uppercase)</th>
                  <th className="p-3.5">Internal Normalized Status</th>
                  <th className="p-3.5">Customer Notification</th>
                  <th className="p-3.5">Exception Flag</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3561]/5">
                {mappings.map(m => (
                  <tr key={m.raw_status} className="hover:bg-[#F7FAFC]/80">
                    <td className="p-3.5 font-mono font-bold text-[#0B3561]">{m.raw_status}</td>
                    <td className="p-3.5">
                      <span className="bg-[#DDF3F4] text-[#0B3561] px-2 py-0.5 rounded-md font-mono font-bold text-[10px]">
                        {m.internal_status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {m.notify_customer ? (
                        <span className="text-emerald-700 font-bold">✓ Enabled</span>
                      ) : (
                        <span className="text-slate-400">Disabled</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {m.is_exception ? (
                        <span className="text-rose-600 font-bold">🚨 Yes</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setRawStatus(m.raw_status);
                          setInternalStatus(m.internal_status);
                          setNotifyCustomer(!!m.notify_customer);
                          setIsException(!!m.is_exception);
                        }}
                        className="text-[#12A5B0] font-bold hover:underline"
                      >
                        Edit Rule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

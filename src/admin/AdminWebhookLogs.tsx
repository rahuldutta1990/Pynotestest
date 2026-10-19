import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';

export const AdminWebhookLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [replayingId, setReplayingId] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/logistics/webhook-logs');
      setLogs(res || []);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleReplay = async (id: string) => {
    setReplayingId(id);
    setActionMsg(null);
    try {
      const res = await adminFetch(`/logistics/webhook-logs/${id}/replay`, { method: 'POST' });
      setActionMsg(res.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setReplayingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-[#0B3561]">Courier Webhook Ingestion Logs</h2>
          <p className="text-xs text-[#3C5D81]">
            Inspect all incoming Shiprocket courier updates, verify token signatures, and replay payloads on demand.
          </p>
        </div>
        <button
          onClick={loadLogs}
          className="bg-[#0B3561] text-[#FFD54A] font-heading font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#071E38] transition"
        >
          Refresh Logs 🔄
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
          {actionMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#0B3561]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs">Loading webhook logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#3C5D81]">No webhook records found yet.</div>
        ) : (
          <div className="divide-y divide-[#0B3561]/10">
            {logs.map((log: any) => (
              <div key={log.id} className="p-4 sm:p-6 space-y-3 hover:bg-[#F7FAFC]/50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                        log.headers_ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.headers_ok ? '✓ Token Verified' : '✕ Token Rejected'}
                    </span>
                    <span className="font-mono text-[#0B3561] font-bold">ID: {log.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#9DAEC0] font-mono text-[11px]">
                      {new Date(log.received_at).toLocaleString()}
                    </span>
                    {log.headers_ok && (
                      <button
                        onClick={() => handleReplay(log.id)}
                        disabled={replayingId === log.id}
                        className="bg-[#12A5B0] text-white px-3 py-1 rounded-lg font-bold text-[10px] hover:brightness-105 disabled:opacity-50"
                      >
                        {replayingId === log.id ? 'Replaying...' : 'Replay Webhook ↻'}
                      </button>
                    )}
                  </div>
                </div>

                {log.error && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                    Error: {log.error}
                  </p>
                )}

                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48">
                  <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

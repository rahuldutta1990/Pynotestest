import React, { useState, useEffect } from 'react';

interface HealthData {
  status: string;
  database?: {
    active_store: string;
    connected_to_remote_firestore: boolean;
    project_id: string;
    database_id: string;
  };
  secrets?: Record<string, 'set' | 'not set'>;
  integrations?: Record<string, boolean>;
}

export const AdminEnvStatusPage: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to fetch health status');
      setHealth(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const secrets = health?.secrets || {};
  const integrations = health?.integrations || {};
  const database = health?.database;

  const totalSecrets = Object.keys(secrets).length;
  const setSecretsCount = Object.values(secrets).filter(v => v === 'set').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Environment Variables Status</h2>
          <p className="text-xs text-[#3C5D81]">
            Real-time status of backend environment secrets and integration readiness reported by /api/health.
          </p>
        </div>
        <button
          onClick={fetchHealthStatus}
          disabled={loading}
          className="bg-[#0B3561] text-white font-heading font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#071E38] shadow-md disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {error && (
        <div className="bg-[#C0392B]/10 border border-[#C0392B]/30 text-[#C0392B] p-4 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#3C5D81] tracking-wider">Active Database Store</span>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${database?.connected_to_remote_firestore ? 'bg-[#13834D]' : 'bg-[#E67E22]'}`} />
            <span className="font-heading font-bold text-lg text-[#0B3561]">
              {database?.active_store || 'Unknown'}
            </span>
          </div>
          <p className="text-[11px] text-[#3C5D81]">Project: {database?.project_id || 'N/A'}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#3C5D81] tracking-wider">Secrets Configured</span>
          <div className="font-heading font-bold text-2xl text-[#0B3561]">
            {setSecretsCount} <span className="text-sm font-normal text-[#3C5D81]">/ {totalSecrets} set</span>
          </div>
          <p className="text-[11px] text-[#3C5D81]">
            {setSecretsCount === totalSecrets ? 'All production secrets configured' : 'Some optional/required secrets are unset'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#3C5D81] tracking-wider">Integrations Health</span>
          <div className="font-heading font-bold text-2xl text-[#0B3561]">
            {Object.values(integrations).filter(Boolean).length} <span className="text-sm font-normal text-[#3C5D81]">/ {Object.keys(integrations).length} active</span>
          </div>
          <p className="text-[11px] text-[#3C5D81]">Razorpay, Shiprocket, SMTP & Auth status</p>
        </div>
      </div>

      {/* Secrets Table */}
      <div className="bg-white rounded-3xl border border-[#0B3561]/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#0B3561]/10 flex justify-between items-center">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">Environment Variables (Secrets)</h3>
          <span className="text-xs text-[#3C5D81]">Never reveals secret values, only set/unset state</span>
        </div>

        <div className="divide-y divide-[#0B3561]/5">
          {Object.keys(secrets).length === 0 && !loading && (
            <div className="p-6 text-center text-xs text-[#3C5D81]">No secret data received from server.</div>
          )}
          {Object.entries(secrets).map(([key, state]) => {
            const isSet = state === 'set';
            return (
              <div key={key} className="p-4 sm:px-6 flex items-center justify-between hover:bg-[#F7FAFC] transition">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${isSet ? 'bg-[#13834D]' : 'bg-[#C0392B]'}`} />
                  <span className="font-mono font-bold text-xs text-[#0B3561]">{key}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    isSet ? 'bg-[#DDF3F4] text-[#071E38]' : 'bg-[#C0392B]/10 text-[#C0392B]'
                  }`}>
                    {state}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integrations Status */}
      <div className="bg-white rounded-3xl border border-[#0B3561]/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#0B3561]/10">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">External Integrations Readiness</h3>
        </div>

        <div className="divide-y divide-[#0B3561]/5">
          {Object.entries(integrations).map(([key, active]) => (
            <div key={key} className="p-4 sm:px-6 flex items-center justify-between hover:bg-[#F7FAFC] transition">
              <span className="font-heading font-bold text-xs uppercase text-[#0B3561] tracking-wider">{key.replace('_', ' ')}</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                active ? 'bg-[#13834D] text-white' : 'bg-[#C0392B]/10 text-[#C0392B]'
              }`}>
                {active ? 'Ready / Active' : 'Not Configured'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

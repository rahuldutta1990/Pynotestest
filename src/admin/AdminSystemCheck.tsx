import React, { useState } from 'react';
import { adminFetch } from '../lib/api';

export const AdminSystemCheck: React.FC = () => {
  const [results, setResults] = useState<{ id: number; title: string; pass: boolean; details: string }[] | null>(null);
  const [running, setRunning] = useState(false);

  const runSystemCheck = async () => {
    setRunning(true);
    try {
      const res = await adminFetch('/system-check', { method: 'POST' });
      setResults(res.tests);
    } catch (err: any) {
      alert(err.message || 'System check failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Owner Automated System Check</h2>
          <p className="text-xs text-[#3C5D81]">
            Runs the 10 required stock & order invariants against real server logic using a isolated temporary test product.
          </p>
        </div>
        <button
          onClick={runSystemCheck}
          disabled={running}
          className="bg-[#0B3561] text-white font-heading font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#071E38] shadow-md disabled:opacity-50"
        >
          {running ? 'Running 10 Automated Invariant Tests...' : 'Run Full System Check'}
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-3xl border border-[#0B3561]/10 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#0B3561]/10 pb-3">
            <h3 className="font-heading font-bold text-base text-[#0B3561]">Invariants Test Report</h3>
            <span className="text-xs font-bold text-[#13834D]">
              {results.filter(r => r.pass).length} / {results.length} PASSED
            </span>
          </div>

          <div className="space-y-3">
            {results.map(test => (
              <div
                key={test.id}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-4 text-xs ${
                  test.pass
                    ? 'bg-[#DDF3F4]/50 border-[#12A5B0]/30 text-[#0B3561]'
                    : 'bg-[#C0392B]/10 border-[#C0392B]/30 text-[#C0392B]'
                }`}
              >
                <div>
                  <span className="font-heading font-bold block text-sm">
                    Test #{test.id}: {test.title}
                  </span>
                  <p className="text-[#3C5D81] mt-0.5">{test.details}</p>
                </div>
                <span className={`font-bold px-3 py-1 rounded-full uppercase text-[10px] ${test.pass ? 'bg-[#13834D] text-white' : 'bg-[#C0392B] text-white'}`}>
                  {test.pass ? 'PASS' : 'FAIL'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

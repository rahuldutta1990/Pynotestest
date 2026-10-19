import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';

export const AdminLogisticsReports: React.FC = () => {
  const [reports, setReports] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Test Runner State
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any | null>(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/logistics/reports');
      setReports(data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleRunTests = async () => {
    setTesting(true);
    setTestResults(null);
    try {
      const res = await adminFetch('/logistics/run-tests', { method: 'POST' });
      setTestResults(res);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-[#0B3561]">Logistics Reports & Automated Test Suite</h2>
          <p className="text-xs text-[#3C5D81]">
            Track delivery days, compare Cash on Delivery vs Prepaid RTO %, and execute the 14-point logistics test runner.
          </p>
        </div>
        <button
          onClick={handleRunTests}
          disabled={testing}
          className="bg-[#12A5B0] text-white font-heading font-black text-xs px-5 py-3 rounded-2xl hover:brightness-105 shadow-md flex items-center gap-2 transition disabled:opacity-50"
        >
          {testing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Running Verification Tests...</span>
            </>
          ) : (
            <span>⚡ Run Automated 14-Point Test Suite</span>
          )}
        </button>
      </div>

      {/* METRICS CARDS */}
      {loading || !reports ? (
        <div className="p-8 text-center text-xs">Loading analytics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-[#3C5D81] uppercase tracking-wider block">Average Delivery Speed</span>
            <div className="text-3xl font-heading font-black text-[#0B3561]">
              {reports.average_delivery_days} <span className="text-sm font-normal text-[#3C5D81]">Days</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">From parcel creation to doorstep scan</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-[#3C5D81] uppercase tracking-wider block">Prepaid RTO Rate</span>
            <div className="text-3xl font-heading font-black text-emerald-600">
              {reports.prepaid?.rto_rate_percent || 0}%
            </div>
            <p className="text-[11px] text-[#3C5D81]">{reports.prepaid?.rto} RTOs out of {reports.prepaid?.total} orders</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-[#3C5D81] uppercase tracking-wider block">COD RTO Rate</span>
            <div className="text-3xl font-heading font-black text-amber-600">
              {reports.cod?.rto_rate_percent || 0}%
            </div>
            <p className="text-[11px] text-[#3C5D81]">{reports.cod?.rto} RTOs out of {reports.cod?.total} orders</p>
          </div>
        </div>
      )}

      {/* Courier Breakdown Table */}
      {reports?.courier_performance && Object.keys(reports.courier_performance).length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-[#0B3561]/10 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-sm text-[#0B3561]">Courier Partner Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAFC] font-heading font-bold text-[#0B3561]">
                <tr>
                  <th className="p-3">Courier</th>
                  <th className="p-3">Total Shipped</th>
                  <th className="p-3">Delivered</th>
                  <th className="p-3">RTO Returns</th>
                  <th className="p-3">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3561]/5">
                {Object.entries(reports.courier_performance).map(([cName, perf]: any) => {
                  const rate = perf.total > 0 ? ((perf.delivered / perf.total) * 100).toFixed(1) : '100.0';
                  return (
                    <tr key={cName}>
                      <td className="p-3 font-bold text-[#0B3561]">{cName}</td>
                      <td className="p-3 font-mono">{perf.total}</td>
                      <td className="p-3 font-mono text-emerald-600 font-bold">{perf.delivered}</td>
                      <td className="p-3 font-mono text-rose-600 font-bold">{perf.rto}</td>
                      <td className="p-3 font-bold text-[#12A5B0]">{rate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUTOMATED TEST SUITE EXECUTION RESULTS */}
      {testResults && (
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#0B3561]/15 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#0B3561]/10 pb-4">
            <div>
              <span className="text-xs font-bold text-[#12A5B0] uppercase tracking-wider block">
                Verification Report
              </span>
              <h3 className="font-heading font-black text-2xl text-[#0B3561]">
                Automated Logistics Test Results
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">
                {testResults.passed} Passed
              </span>
              {testResults.failed > 0 && (
                <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-black text-xs">
                  {testResults.failed} Failed
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAFC] font-heading font-bold text-[#0B3561]">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">Test Requirement Description</th>
                  <th className="p-3 w-28 text-center">Result</th>
                  <th className="p-3">Execution Outcome Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3561]/5">
                {testResults.results?.map((t: any) => (
                  <tr key={t.test_id} className="hover:bg-[#F7FAFC]/80">
                    <td className="p-3 text-center font-mono font-bold text-[#0B3561]">{t.test_id}</td>
                    <td className="p-3 font-bold text-[#0B3561]">{t.title}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase ${
                          t.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#3C5D81] font-mono text-[11px] leading-relaxed">{t.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

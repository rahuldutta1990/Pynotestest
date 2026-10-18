import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';

export const AdminInventory: React.FC = () => {
  const [reconcileData, setReconcileData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReconcile = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/inventory/reconcile');
      setReconcileData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReconcile();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Inventory Ledger & Reconciliation</h2>
        <p className="text-xs text-[#3C5D81]">
          Verifies that every book's current <code className="font-mono">stock_qty</code> matches the sum of all its <code className="font-mono">stock_ledger</code> movement deltas.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#0B3561]/10 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#0B3561]/10 pb-3">
          <h3 className="font-heading font-bold text-base text-[#0B3561]">Stock Reconciliation Status</h3>
          <button
            onClick={loadReconcile}
            className="bg-[#12A5B0] text-[#071E38] font-heading font-bold text-xs px-4 py-2 rounded-xl"
          >
            Run Reconcile Check
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-[#3C5D81] py-4 text-center">Checking stock_ledger invariants...</p>
        ) : reconcileData.length === 0 ? (
          <div className="p-4 bg-[#DDF3F4] text-[#0B3561] font-bold text-xs rounded-2xl border border-[#12A5B0]/30 text-center">
            ✓ Perfect Reconciliation! Zero differences found between stock_qty and stock_ledger sum across all books.
          </div>
        ) : (
          <div className="bg-[#C0392B]/10 p-4 rounded-2xl border border-[#C0392B]/30 space-y-2 text-xs text-[#C0392B]">
            <span className="font-bold">⚠️ Stock Discrepancies Found:</span>
            {reconcileData.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>Book: {item.slug}</span>
                <span>DB Stock: {item.stock_qty} | Ledger Sum: {item.ledger_sum}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

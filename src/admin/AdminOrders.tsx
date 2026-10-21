import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [courierFilter, setCourierFilter] = useState('all');
  const [exceptionsOnly, setExceptionsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Modal Details
  const [selectedOrderNo, setSelectedOrderNo] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal Actions State
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [showCreateShipment, setShowCreateShipment] = useState(false);
  const [selectedItemsForShipment, setSelectedItemsForShipment] = useState<any[]>([]);
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [replacementReason, setReplacementReason] = useState('');
  const [showReplacementModal, setShowReplacementModal] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (paymentFilter !== 'all') params.set('payment_method', paymentFilter);
      if (courierFilter !== 'all') params.set('courier', courierFilter);
      if (exceptionsOnly) params.set('exceptions_only', 'true');
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await adminFetch(`/logistics/orders?${params.toString()}`);
      setOrders(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter, courierFilter, exceptionsOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const loadOrderDetail = async (no: string) => {
    setSelectedOrderNo(no);
    setDetailLoading(true);
    setActionMsg(null);
    try {
      const res = await adminFetch(`/logistics/orders/${no}`);
      setOrderDetail(res);
      // Pre-select all items by default for split shipment option
      if (res.order?.items) {
        setSelectedItemsForShipment(res.order.items.map((i: any) => ({ ...i, qty: i.qty })));
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateShipment = async () => {
    if (!selectedOrderNo) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      const res = await adminFetch(`/orders/${selectedOrderNo}/create-shipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_items: selectedItemsForShipment,
        }),
      });
      setActionMsg(`Shipment created successfully! AWB: ${res.shipment?.awb} (${res.shipment?.courier_name})`);
      setShowCreateShipment(false);
      loadOrderDetail(selectedOrderNo);
      loadOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSyncShipment = async (shipmentId: string) => {
    setActionLoading(true);
    try {
      const res = await adminFetch(`/shipments/${shipmentId}/sync`, {
        method: 'POST',
      });
      setActionMsg(`Tracking synced: ${res.synced_scans} scan(s) ingested. Status: ${res.current_status}`);
      if (selectedOrderNo) loadOrderDetail(selectedOrderNo);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelShipment = async (shipmentId: string) => {
    if (!confirm('Are you sure you want to cancel this shipment? This will call Shiprocket Cancel API first.')) return;
    setActionLoading(true);
    try {
      await adminFetch(`/shipments/${shipmentId}/cancel`, {
        method: 'POST',
      });
      setActionMsg('Shipment cancelled successfully via Shiprocket API.');
      if (selectedOrderNo) loadOrderDetail(selectedOrderNo);
      loadOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleManualDelivered = async () => {
    if (!selectedOrderNo || !overrideReason.trim()) {
      alert('A reason is mandatory for manual delivery overrides.');
      return;
    }
    setActionLoading(true);
    try {
      await adminFetch(`/orders/${selectedOrderNo}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: overrideReason }),
      });
      setActionMsg('Order manually marked as Delivered and audited.');
      setShowOverrideModal(false);
      setOverrideReason('');
      loadOrderDetail(selectedOrderNo);
      loadOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateReplacement = async () => {
    if (!selectedOrderNo || !replacementReason.trim()) {
      alert('A reason is required to create a replacement order.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminFetch(`/orders/${selectedOrderNo}/replacement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: replacementReason }),
      });
      setActionMsg(`Replacement order ${res.replacement_order_no} created successfully!`);
      setShowReplacementModal(false);
      setReplacementReason('');
      loadOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-[#0B3561]">Logistics & Order Fulfilment</h2>
          <p className="text-xs text-[#3C5D81]">
            Live Shiprocket courier integrations, AWB generation, split shipments, tracking webhooks, and exception management.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, AWB, Phone, or Email..."
            className="flex-1 px-4 py-2.5 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl text-xs font-medium focus:outline-none focus:border-[#12A5B0]"
          />
          <button
            type="submit"
            className="bg-[#0B3561] text-[#FFD54A] font-heading font-black px-6 py-2.5 rounded-xl text-xs hover:bg-[#071E38] transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl font-bold text-[#0B3561] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending_cod_confirmation">Pending COD Confirmation</option>
            <option value="ready_to_ship">Ready to Ship</option>
            <option value="shipped">Shipped</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out For Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="attempt_failed">Attempt Failed</option>
            <option value="rto_initiated">RTO Initiated</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Method filter */}
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="px-3 py-2 bg-[#F7FAFC] border border-[#0B3561]/15 rounded-xl font-bold text-[#0B3561] focus:outline-none"
          >
            <option value="all">All Payment Methods</option>
            <option value="prepaid">Prepaid (Razorpay / UPI)</option>
            <option value="cod">Cash on Delivery (COD)</option>
          </select>

          {/* Exceptions Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-[#F7FAFC] border border-[#0B3561]/15 px-3 py-2 rounded-xl font-bold text-[#0B3561]">
            <input
              type="checkbox"
              checked={exceptionsOnly}
              onChange={e => setExceptionsOnly(e.target.checked)}
              className="rounded text-[#12A5B0]"
            />
            <span className="text-rose-600">🚨 Exceptions & Stuck Only</span>
          </label>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#0B3561]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#3C5D81]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#3C5D81]">No matching orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAFC] border-b border-[#0B3561]/10 font-heading font-bold text-[#0B3561]">
                <tr>
                  <th className="p-3.5">Order No</th>
                  <th className="p-3.5">Customer & Phone</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Courier & AWB</th>
                  <th className="p-3.5">Alerts</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3561]/5">
                {orders.map(o => (
                  <tr key={o.order_no} className="hover:bg-[#F7FAFC]/80 transition">
                    <td className="p-3.5 font-mono font-bold text-[#0B3561]">
                      {o.order_no}
                      {o.is_replacement && (
                        <span className="block text-[9px] text-[#12A5B0] font-bold">REPLACEMENT</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#0B3561]">{o.ship_name || o.email}</div>
                      <div className="text-[10px] text-[#3C5D81]">{o.ship_phone || o.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                        o.payment_method === 'cod' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {o.payment_method}
                      </span>
                      <div className="text-[10px] font-bold text-[#0B3561] mt-0.5">
                        ₹{((o.total_paise || 0) / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-black uppercase text-[10px] text-[#0B3561] bg-[#DDF3F4] px-2 py-0.5 rounded-md">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {o.awb ? (
                        <div>
                          <span className="font-bold text-[#0B3561] block">{o.courier || 'Shiprocket'}</span>
                          <span className="font-mono text-[10px] text-[#12A5B0]">{o.awb}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No AWB yet</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {o.stuck_alert ? (
                        <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          ⚠️ {o.stuck_alert}
                        </span>
                      ) : o.is_exception ? (
                        <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          🚨 Exception
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[10px]">✓ Normal</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => loadOrderDetail(o.order_no)}
                        className="bg-[#0B3561] text-[#FFD54A] font-heading font-black px-3 py-1.5 rounded-xl hover:bg-[#071E38] transition"
                      >
                        Manage ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAILS & LOGISTICS DRAWER/MODAL */}
      {selectedOrderNo && (
        <div className="fixed inset-0 z-50 bg-[#071E38]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-[#0B3561]/15 overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#0B3561]/10 pb-4">
              <div>
                <span className="text-xs font-bold text-[#12A5B0] uppercase">Shiprocket Logistics Manager</span>
                <h3 className="font-heading font-black text-2xl text-[#0B3561]">Order #{selectedOrderNo}</h3>
              </div>
              <button
                onClick={() => { setSelectedOrderNo(null); setOrderDetail(null); }}
                className="w-8 h-8 rounded-full bg-[#F7FAFC] flex items-center justify-center font-bold text-[#0B3561] hover:bg-[#DDF3F4]"
              >
                ✕
              </button>
            </div>

            {actionMsg && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                {actionMsg}
              </div>
            )}

            {detailLoading || !orderDetail ? (
              <div className="p-12 text-center text-xs">Loading logistics details...</div>
            ) : (
              <div className="space-y-6">
                {/* Actions Top Toolbar */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {/* Create Shipment Button */}
                  {(orderDetail.order.status === 'confirmed' ||
                    orderDetail.order.status === 'ready_to_ship' ||
                    orderDetail.order.status === 'partially_shipped') && (
                    <button
                      onClick={() => setShowCreateShipment(!showCreateShipment)}
                      className="bg-[#0B3561] text-[#FFD54A] font-heading font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#071E38] transition"
                    >
                      {showCreateShipment ? 'Cancel Shipment Form' : '📦 Create Shipment (Shiprocket)'}
                    </button>
                  )}

                  {/* Manual Mark Delivered */}
                  {orderDetail.order.status !== 'delivered' && (
                    <button
                      onClick={() => setShowOverrideModal(true)}
                      className="bg-emerald-600 text-white font-heading font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition"
                    >
                      ✓ Mark Delivered (Manual Override)
                    </button>
                  )}

                  {/* Replacement Order */}
                  <button
                    onClick={() => setShowReplacementModal(true)}
                    className="bg-[#12A5B0] text-white font-heading font-bold text-xs px-4 py-2.5 rounded-xl hover:brightness-105 transition"
                  >
                    🔄 Create Replacement Order
                  </button>
                </div>

                {/* Create Shipment Form (Supports Split Shipments) */}
                {showCreateShipment && (
                  <div className="p-6 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/15 space-y-4 animate-fadeIn">
                    <h4 className="font-heading font-bold text-sm text-[#0B3561]">
                      Shipment Creation & Split Shipment Selector
                    </h4>
                    <p className="text-xs text-[#3C5D81]">
                      Select which items and quantities are packed into this shipment parcel.
                    </p>
                    <div className="space-y-2">
                      {selectedItemsForShipment.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-[#0B3561]/10">
                          <span className="font-bold text-[#0B3561]">{item.title}</span>
                          <div className="flex items-center gap-2">
                            <span>Ship Qty:</span>
                            <input
                              type="number"
                              min={0}
                              max={item.qty}
                              value={item.qty}
                              onChange={e => {
                                const newQty = Number(e.target.value);
                                const updated = [...selectedItemsForShipment];
                                updated[idx].qty = newQty;
                                setSelectedItemsForShipment(updated);
                              }}
                              className="w-16 px-2 py-1 border border-[#0B3561]/20 rounded-lg text-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleCreateShipment}
                      disabled={actionLoading}
                      className="bg-[#0B3561] text-[#FFD54A] font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-[#071E38] transition disabled:opacity-50"
                    >
                      {actionLoading ? 'Creating in Shiprocket...' : 'Confirm & Request AWB'}
                    </button>
                  </div>
                )}

                {/* Shipments List */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-xs text-[#0B3561] uppercase tracking-wider">
                    Shipment Parcels ({orderDetail.shipments?.length || 0})
                  </h4>
                  {orderDetail.shipments?.length === 0 ? (
                    <p className="text-xs text-[#3C5D81] italic">No shipments created for this order yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {orderDetail.shipments.map((s: any) => (
                        <div key={s.id} className="p-4 bg-white rounded-2xl border border-[#0B3561]/10 shadow-sm space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#0B3561]">{s.courier_name}</span>
                            <span className="bg-[#DDF3F4] text-[#0B3561] px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                              {s.status}
                            </span>
                          </div>
                          <p className="font-mono text-[#3C5D81]">AWB: <strong>{s.awb}</strong></p>
                          <div className="flex gap-2 pt-2">
                            {s.label_url && (
                              <a
                                href={s.label_url}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-[#F7FAFC] border border-[#0B3561]/15 px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#0B3561] hover:bg-[#DDF3F4]"
                              >
                                Print Label 📄
                              </a>
                            )}
                            <button
                              onClick={() => handleSyncShipment(s.id)}
                              disabled={actionLoading}
                              className="bg-[#12A5B0] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:brightness-105"
                            >
                              Sync Now 🔄
                            </button>
                            <button
                              onClick={() => handleCancelShipment(s.id)}
                              disabled={actionLoading}
                              className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-rose-100"
                            >
                              Cancel Shipment ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timeline Scans */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-xs text-[#0B3561] uppercase tracking-wider">
                    Tracking Events Timeline ({orderDetail.events?.length || 0})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 border border-[#0B3561]/10 p-3 rounded-2xl bg-[#F7FAFC]">
                    {orderDetail.events?.map((ev: any, i: number) => (
                      <div key={i} className="text-xs bg-white p-2.5 rounded-xl border border-[#0B3561]/5 flex justify-between items-start">
                        <div>
                          <span className="font-bold text-[#0B3561] block">{ev.activity}</span>
                          <span className="text-[10px] text-[#3C5D81]">{ev.location} • Source: {ev.source}</span>
                        </div>
                        <span className="text-[10px] text-[#9DAEC0] font-mono">
                          {new Date(ev.event_time).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Status Audit Trail */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-xs text-[#0B3561] uppercase tracking-wider">
                    Order Status Audit Trail
                  </h4>
                  <div className="max-h-40 overflow-y-auto divide-y divide-[#0B3561]/5 bg-[#F7FAFC] rounded-2xl border border-[#0B3561]/10 text-xs">
                    {orderDetail.audits?.map((a: any, i: number) => (
                      <div key={i} className="p-2.5 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-[#0B3561]">
                            {a.old_status} → {a.new_status}
                          </span>
                          <span className="text-[10px] text-[#3C5D81] block">
                            By: {a.changed_by} {a.reason ? `• ${a.reason}` : ''}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#9DAEC0] font-mono">
                          {new Date(a.time).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw Webhook Payloads for this Order */}
                {orderDetail.raw_webhooks?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-xs text-[#0B3561] uppercase tracking-wider">
                      Received Webhook Payloads ({orderDetail.raw_webhooks.length})
                    </h4>
                    <div className="max-h-36 overflow-y-auto bg-slate-900 text-emerald-400 p-3 rounded-2xl font-mono text-[10px]">
                      {orderDetail.raw_webhooks.map((w: any, idx: number) => (
                        <div key={idx} className="mb-2 pb-2 border-b border-slate-800">
                          <div>Received: {new Date(w.received_at).toLocaleString()}</div>
                          <pre>{JSON.stringify(w.payload, null, 2)}</pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Delivered Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-[#071E38]/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#0B3561]">Manual Delivery Override</h3>
            <p className="text-xs text-[#3C5D81]">
              Audited action: Please supply the official proof or customer confirmation reason.
            </p>
            <textarea
              rows={3}
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
              placeholder="e.g. Customer verified package receipt via WhatsApp / physical proof submitted."
              className="w-full p-3 border border-[#0B3561]/20 rounded-xl text-xs"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="flex-1 py-2.5 border border-[#0B3561]/20 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleManualDelivered}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                Submit Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replacement Order Modal */}
      {showReplacementModal && (
        <div className="fixed inset-0 z-50 bg-[#071E38]/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#0B3561]">Create Replacement Order</h3>
            <p className="text-xs text-[#3C5D81]">
              Creates a ₹0 order for lost or damaged parcels while preserving original order audit history.
            </p>
            <textarea
              rows={3}
              value={replacementReason}
              onChange={e => setReplacementReason(e.target.value)}
              placeholder="e.g. Courier declared parcel lost in transit / book damaged on delivery."
              className="w-full p-3 border border-[#0B3561]/20 rounded-xl text-xs"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowReplacementModal(false)}
                className="flex-1 py-2.5 border border-[#0B3561]/20 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReplacement}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-[#12A5B0] text-white rounded-xl text-xs font-bold hover:brightness-105"
              >
                Generate Replacement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

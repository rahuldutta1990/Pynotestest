import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { Order } from '../types';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [courierName, setCourierName] = useState('Shiprocket / Bluedart');
  const [awbNumber, setAwbNumber] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/orders');
      setOrders(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleMarkShipped = async (orderNo: string) => {
    if (!awbNumber.trim()) {
      alert('Please enter AWB Number');
      return;
    }
    try {
      await adminFetch(`/orders/${orderNo}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier: courierName, awb: awbNumber }),
      });
      setActionMsg(`Order #${orderNo} marked as Shipped. Invoice generated.`);
      loadOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMarkDelivered = async (orderNo: string) => {
    try {
      await adminFetch(`/orders/${orderNo}/deliver`, { method: 'POST' });
      setActionMsg(`Order #${orderNo} marked as Delivered.`);
      loadOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRefund = async (orderNo: string) => {
    const restock = confirm('Restock returned books back into inventory?');
    try {
      await adminFetch(`/orders/${orderNo}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restock }),
      });
      setActionMsg(`Order #${orderNo} refunded.`);
      loadOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  let filteredOrders = orders;
  if (filterStatus !== 'all') {
    filteredOrders = filteredOrders.filter(o => o.status === filterStatus);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredOrders = filteredOrders.filter(
      o => o.order_no.toLowerCase().includes(q) || o.ship_phone.includes(q) || o.ship_name.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Order Fulfilment Management</h2>
          <p className="text-xs text-[#3C5D81]">Manage orders, confirm COD, generate GST invoices, and update shipping tracking.</p>
        </div>
      </div>

      {actionMsg && (
        <div className="bg-[#DDF3F4] text-[#0B3561] font-bold text-xs p-3 rounded-xl border border-[#12A5B0]/30">
          {actionMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#0B3561]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search by Order #, Name, or Mobile..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 bg-[#F7FAFC] border border-[#0B3561]/20 rounded-xl text-xs text-[#0B3561]"
        />

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'processing', 'shipped', 'delivered', 'awaiting_confirmation', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold whitespace-nowrap uppercase ${
                filterStatus === st ? 'bg-[#0B3561] text-white' : 'bg-[#F7FAFC] text-[#0B3561] hover:bg-[#DDF3F4]'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#0B3561]/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0B3561] text-white font-heading font-bold">
              <th className="p-4">Order #</th>
              <th className="p-4">Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B3561]/10 font-body">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#3C5D81]">Loading orders...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#3C5D81]">No matching orders found.</td>
              </tr>
            ) : (
              filteredOrders.map(ord => (
                <tr key={ord.order_no} className="hover:bg-[#F7FAFC]">
                  <td className="p-4 font-mono font-bold text-[#0B3561]">{ord.order_no}</td>
                  <td className="p-4 text-[#3C5D81]">{new Date(ord.placed_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="font-bold text-[#0B3561] block">{ord.ship_name}</span>
                    <span className="text-[10px] text-[#3C5D81]">{ord.ship_phone}</span>
                  </td>
                  <td className="p-4 uppercase font-bold text-[#12A5B0]">{ord.payment_method}</td>
                  <td className="p-4">
                    <span className="bg-[#DDF3F4] text-[#0B3561] font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4 font-display font-black text-sm text-[#0B3561]">
                    ₹{(ord.total_paise / 100).toFixed(2)}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="bg-[#0B3561] text-white font-bold px-3 py-1.5 rounded-lg text-[11px]"
                    >
                      Details & Ship
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail & Action Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#071E38]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#0B3561]/10 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#0B3561]/10 pb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#0B3561]">Order #{selectedOrder.order_no}</h3>
                <span className="text-xs text-[#3C5D81]">Status: {selectedOrder.status.toUpperCase()}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-[#0B3561] hover:bg-[#DDF3F4] rounded-lg">
                ✕
              </button>
            </div>

            {/* Address & Contact */}
            <div className="bg-[#F7FAFC] p-4 rounded-2xl border border-[#0B3561]/10 text-xs space-y-1">
              <span className="font-bold text-[#0B3561] block">Customer Delivery Details:</span>
              <p className="text-[#3C5D81] font-bold">{selectedOrder.ship_name} ({selectedOrder.ship_phone})</p>
              <p className="text-[#3C5D81]">{selectedOrder.ship_line1}, {selectedOrder.ship_line2}</p>
              <p className="text-[#3C5D81]">{selectedOrder.ship_city}, {selectedOrder.ship_state} - {selectedOrder.ship_pincode}</p>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#0B3561] block">Ordered Items:</span>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between p-2 bg-[#F7FAFC] rounded-lg border border-[#0B3561]/5">
                  <span>{it.title} x {it.qty}</span>
                  <span className="font-bold text-[#0B3561]">₹{(it.line_total_paise / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Fulfilment Action Form */}
            {selectedOrder.status === 'processing' && (
              <div className="p-4 bg-[#DDF3F4] rounded-2xl border border-[#12A5B0]/30 space-y-3 text-xs">
                <h4 className="font-heading font-bold text-[#0B3561]">Mark Shipped & Assign Courier</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0B3561] mb-1">Courier Partner</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={e => setCourierName(e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-[#0B3561]/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#0B3561] mb-1">AWB Tracking Number *</label>
                    <input
                      type="text"
                      required
                      value={awbNumber}
                      onChange={e => setAwbNumber(e.target.value)}
                      placeholder="e.g. AWB987654321"
                      className="w-full p-2 bg-white rounded-lg border border-[#0B3561]/20 font-mono font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleMarkShipped(selectedOrder.order_no)}
                  className="w-full bg-[#0B3561] text-white font-heading font-bold py-2.5 rounded-xl hover:bg-[#071E38]"
                >
                  Mark Shipped & Assign AWB
                </button>
              </div>
            )}

            {selectedOrder.status === 'shipped' && (
              <button
                onClick={() => handleMarkDelivered(selectedOrder.order_no)}
                className="w-full bg-[#13834D] text-white font-heading font-bold py-3 rounded-xl text-xs hover:brightness-105"
              >
                Mark Delivered to Customer
              </button>
            )}

            {selectedOrder.status === 'processing' && (
              <div className="pt-4 border-t border-[#0B3561]/5 flex justify-between items-center">
                <p className="text-[10px] text-[#3C5D81]">Paid via Razorpay: {selectedOrder.razorpay_payment_id || 'N/A'}</p>
                <button
                  onClick={() => handleRefund(selectedOrder.order_no)}
                  className="text-red-600 font-bold text-[10px] uppercase hover:underline"
                >
                  Issue Refund
                </button>
              </div>
            )}

            {selectedOrder.payment_status === 'refunded' && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-[10px] font-bold text-center">
                This order has been refunded.
              </div>
            )}

            <div className="pt-2 text-[9px] text-[#9DAEC0] text-center italic">
              Note: EMI and Cardless EMI refunds are processed by banks and may take 5-7 working days.
            </div>

            {selectedOrder.invoice_no && (
              <div className="pt-2 text-center">
                <a
                  href={`/api/invoice/${selectedOrder.order_no}?t=admin`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#12A5B0] hover:underline"
                >
                  Print Official GST Invoice ({selectedOrder.invoice_no}) ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

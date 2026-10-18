import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { Product } from '../types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [stockDeltaReason, setStockDeltaReason] = useState('manual');
  const [stockDeltaQty, setStockDeltaQty] = useState(0);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/products');
      setProducts(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (editingProduct.slug) {
        await adminFetch(`/products/${editingProduct.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        });
      } else {
        await adminFetch('/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        });
      }
      alert('Product saved successfully!');
      setEditingProduct(null);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleAdjustStock = async (slug: string) => {
    if (stockDeltaQty === 0) return;
    try {
      await adminFetch(`/products/${slug}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: stockDeltaQty, reason: stockDeltaReason }),
      });
      alert('Stock adjusted and recorded in stock_ledger!');
      setStockDeltaQty(0);
      loadProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading font-bold text-2xl text-[#0B3561]">Products & Bundles Catalogue</h2>
          <p className="text-xs text-[#3C5D81]">Manage 13 printed subject books and multi-book study bundles.</p>
        </div>
        <button
          onClick={() =>
            setEditingProduct({
              type: 'book',
              title: '',
              slug: '',
              sku: '',
              short_desc: '',
              description: '',
              mrp_paise: 79900,
              price_paise: 49900,
              stock_qty: 50,
              low_stock_threshold: 5,
              weight_g: 450,
              hsn_code: '4901',
              gst_rate_bp: 0,
              status: 'active',
              sort_order: 0,
              images: [],
            })
          }
          className="bg-[#0B3561] text-white font-heading font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#071E38]"
        >
          + Add New Product
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#0B3561]/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0B3561] text-white font-heading font-bold">
              <th className="p-4">Type</th>
              <th className="p-4">Title / Slug</th>
              <th className="p-4">MRP</th>
              <th className="p-4">Sale Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B3561]/10 font-body">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#3C5D81]">Loading Catalogue...</td>
              </tr>
            ) : (
              products.map(prod => (
                <tr key={prod.slug} className="hover:bg-[#F7FAFC]">
                  <td className="p-4">
                    <span className="uppercase font-bold text-[10px] bg-[#DDF3F4] text-[#0B3561] px-2 py-0.5 rounded">
                      {prod.type}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#0B3561]">
                    {prod.title}
                    <span className="block font-mono text-[10px] text-[#9DAEC0]">{prod.slug}</span>
                  </td>
                  <td className="p-4 font-mono text-[#9DAEC0] line-through">₹{(prod.mrp_paise / 100).toFixed(2)}</td>
                  <td className="p-4 font-display font-black text-sm text-[#0B3561]">
                    ₹{(prod.price_paise / 100).toFixed(2)}
                  </td>
                  <td className="p-4 font-bold">
                    {prod.type === 'bundle' ? (
                      <span className="text-[#12A5B0]">Derived</span>
                    ) : (
                      <span className={prod.stock_qty <= prod.low_stock_threshold ? 'text-[#C0392B]' : 'text-[#13834D]'}>
                        {prod.stock_qty} copies
                      </span>
                    )}
                  </td>
                  <td className="p-4 uppercase text-[10px] font-bold">{prod.status}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingProduct(prod)}
                      className="bg-[#0B3561] text-white font-bold px-3 py-1.5 rounded-lg text-[11px]"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-[#071E38]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto border border-[#0B3561]/10 shadow-2xl text-xs"
          >
            <div className="flex justify-between items-center border-b border-[#0B3561]/10 pb-3">
              <h3 className="font-heading font-bold text-base text-[#0B3561]">
                {editingProduct.slug ? `Edit Product: ${editingProduct.title}` : 'Add New Book Product'}
              </h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="p-1 text-[#0B3561]">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full p-2 bg-[#F7FAFC] border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Slug (URL Key) *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.slug || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                  className="w-full p-2 bg-[#F7FAFC] border rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">MRP (in Paise, e.g. 79900 = Rs. 799) *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.mrp_paise || 0}
                  onChange={e => setEditingProduct({ ...editingProduct, mrp_paise: Number(e.target.value) })}
                  className="w-full p-2 bg-[#F7FAFC] border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Sale Price (in Paise, e.g. 49900 = Rs. 499) *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.price_paise || 0}
                  onChange={e => setEditingProduct({ ...editingProduct, price_paise: Number(e.target.value) })}
                  className="w-full p-2 bg-[#F7FAFC] border rounded-lg font-mono"
                />
              </div>
            </div>

            {editingProduct.type === 'book' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock_qty || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, stock_qty: Number(e.target.value) })}
                    className="w-full p-2 bg-[#F7FAFC] border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Badge Text (e.g. "HOT PRODUCT")</label>
                  <input
                    type="text"
                    value={editingProduct.badge_text || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, badge_text: e.target.value })}
                    className="w-full p-2 bg-[#F7FAFC] border rounded-lg"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Short Description *</label>
              <textarea
                rows={2}
                value={editingProduct.short_desc || ''}
                onChange={e => setEditingProduct({ ...editingProduct, short_desc: e.target.value })}
                className="w-full p-2 bg-[#F7FAFC] border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0B3561] text-white font-heading font-bold py-3 rounded-xl hover:bg-[#071E38]"
            >
              Save Product Details
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

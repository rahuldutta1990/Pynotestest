import React, { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { Coupon } from '../types';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/coupons');
      setCoupons(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Coupons...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Coupons</h2>
      <button className="bg-blue-500 text-white p-2 rounded">Create Coupon</button>
      <div className="border rounded">
        {coupons.map(coupon => (
          <div key={coupon.id} className="p-4 border-b">
            {coupon.code} - {coupon.status}
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Review } from '../types';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'reviews'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, 'reviews', id), { status: 'approved' });
  };

  const handleReject = async (id: string) => {
    await updateDoc(doc(db, 'reviews', id), { status: 'rejected' });
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Review Management</h2>
      {reviews.map(r => (
        <div key={r.id} className="p-4 border rounded shadow-sm">
          <div className="font-bold">{r.display_name} ({r.rating}/5)</div>
          <div className="text-sm">{r.body}</div>
          <div className="text-xs text-gray-500">Status: {r.status}</div>
          <div className="flex gap-2 mt-2">
            {r.status !== 'approved' && (
                <button onClick={() => handleApprove(r.id)} className="bg-green-500 text-white p-1 px-3 rounded text-sm">Approve</button>
            )}
            {r.status !== 'rejected' && (
                <button onClick={() => handleReject(r.id)} className="bg-red-500 text-white p-1 px-3 rounded text-sm">Reject</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

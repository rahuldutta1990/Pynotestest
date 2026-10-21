import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Review } from '../types';

export const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Review[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    });

    return () => unsubscribe();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">What Our Students Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.slice(0, 3).map(t => (
          <div key={t.id} className="p-6 border rounded-xl shadow-sm bg-white">
            <p className="italic text-gray-700">"{t.body}"</p>
            <div className="font-bold mt-4 text-[#0B3561]">- {t.display_name}</div>
            <div className="text-xs text-gray-500">Rating: {t.rating}/5</div>
          </div>
        ))}
      </div>
    </section>
  );
};

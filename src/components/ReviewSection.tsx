import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Review } from '../types';

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', body: '' });

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('product_id', '==', productId),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(data);
    });

    return () => unsubscribe();
  }, [productId]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === 'highest') return b.rating - a.rating;
    if (sort === 'lowest') return a.rating - b.rating;
    return 0;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    await addDoc(collection(db, 'reviews'), {
      product_id: productId,
      user_id: auth.currentUser.uid,
      display_name: auth.currentUser.displayName || 'Anonymous',
      rating: newReview.rating,
      title: newReview.title,
      body: newReview.body,
      status: 'pending',
      created_at: serverTimestamp()
    });
    
    setShowForm(false);
    setNewReview({ rating: 5, title: '', body: '' });
    alert('Review submitted for admin approval!');
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <select onChange={(e) => setSort(e.target.value as any)} className="p-2 border rounded">
          <option value="newest">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 text-white p-2 rounded">
        Write a Review
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
          <input type="number" min="1" max="5" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})} className="block w-full p-2 border" />
          <input type="text" placeholder="Title" value={newReview.title} onChange={e => setNewReview({...newReview, title: e.target.value})} className="block w-full p-2 border" />
          <textarea placeholder="Your Review" value={newReview.body} onChange={e => setNewReview({...newReview, body: e.target.value})} className="block w-full p-2 border" />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">Submit</button>
        </form>
      )}

      <div className="space-y-4">
        {sortedReviews.map(review => (
          <div key={review.id} className="p-4 border rounded">
            <h3 className="font-bold">{review.title} ({review.rating}/5)</h3>
            <p>{review.body}</p>
            <small>By {review.display_name} on {new Date(review.created_at).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </section>
  );
};

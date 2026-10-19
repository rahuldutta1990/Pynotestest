import React, { useState, useEffect, useRef } from 'react';

interface InstagramPost {
  id: string;
  caption: string;
  media_url?: string;
  permalink?: string;
  timestamp?: string;
  time?: string;
  handle?: string;
  likes?: string;
  tag?: string;
}

export const InstagramCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    fetch('/api/instagram/feed')
      .then(res => res.json())
      .then(data => {
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts);
          setApiConnected(data.connected || false);
        }
      })
      .catch(err => {
        console.error('Failed to load Instagram feed API:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  const defaultPosts = [
    {
      id: 'd1',
      handle: '@handwrittencode',
      caption: 'C Programming pointer notes fully handwritten & color-coded! 🚀 #btech #coding',
      media_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      permalink: 'https://instagram.com',
      likes: '1,428 likes',
      time: '2 hours ago',
      tag: '#HandwrittenCode #BTech',
    },
    {
      id: 'd2',
      handle: '@handwrittencode',
      caption: 'DSA binary tree traversal handwritten revision sheet 📚 #datastructures',
      media_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
      permalink: 'https://instagram.com',
      likes: '2,890 likes',
      time: 'Yesterday',
      tag: '#CodingLife #ExamPrep',
    },
    {
      id: 'd3',
      handle: '@handwrittencode',
      caption: 'Python OOP concepts made super simple for semester exams! ✨ #python',
      media_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      permalink: 'https://instagram.com',
      likes: '954 likes',
      time: '3 days ago',
      tag: '#ComputerScience #Notes',
    },
    {
      id: 'd4',
      handle: '@handwrittencode',
      caption: 'Final night exam revision setup with PyNotes physical printed books ☕📖',
      media_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
      permalink: 'https://instagram.com',
      likes: '3,120 likes',
      time: '4 days ago',
      tag: '#Placements #Java #Python',
    },
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs font-heading font-bold text-[#12A5B0] uppercase tracking-wider block mb-1">
            Instagram Feed API {apiConnected ? '⚡ Live' : '📌 Connected'}
          </span>
          <h2 className="font-heading font-bold text-3xl text-[#0B3561]">
            Follow <span className="text-[#12A5B0]">@handwrittencode</span> on Instagram
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-[#0B3561] text-white flex items-center justify-center hover:bg-[#12A5B0] transition cursor-pointer font-bold"
          >
            ‹
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-[#0B3561] text-white flex items-center justify-center hover:bg-[#12A5B0] transition cursor-pointer font-bold"
          >
            ›
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x">
        {displayPosts.map((post, idx) => (
          <div
            key={post.id || idx}
            className="bg-white rounded-3xl p-5 border border-[#0B3561]/10 shadow-md min-w-[280px] sm:min-w-[320px] snap-start flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFD54A] to-[#12A5B0] p-0.5">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-xs text-[#0B3561]">
                    H
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-[#0B3561]">{post.handle || '@handwrittencode'}</h4>
                  <span className="text-[10px] text-[#3C5D81]">{post.time || 'Instagram API'}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#12A5B0] bg-[#12A5B0]/10 px-2 py-1 rounded">ig API</span>
            </div>

            <div className="aspect-[4/3] bg-[#DDF3F4]/50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-[#12A5B0]/20">
              {post.media_url ? (
                <img src={post.media_url} alt="Instagram feed post" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B3561]/20 to-[#12A5B0]/20 flex items-center justify-center p-4 text-center">
                  <span className="font-heading font-bold text-xs text-[#0B3561] bg-white/90 px-4 py-2 rounded-xl shadow-xs">
                    {post.tag || '#HandwrittenCode'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-body text-[#0B3561] font-semibold line-clamp-2">{post.caption}</p>
              <div className="flex justify-between items-center pt-2 text-[11px] text-[#3C5D81] font-bold">
                <span>❤️ {post.likes || 'Verified Post'}</span>
                <a
                  href={post.permalink || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#12A5B0] hover:underline"
                >
                  View on Instagram →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

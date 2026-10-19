import React, { useRef } from 'react';

export const InstagramCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  const posts = [
    {
      handle: '@priya_codes',
      caption: 'Finally aced my C programming practicals thanks to these handwritten notes! 💻✨',
      likes: '1,428 likes',
      time: '2 hours ago',
      tag: '#HandwrittenCode #BTech',
    },
    {
      handle: '@rohit_dev',
      caption: 'Clean color-coded syntax makes revision 10x faster before exams. Highly recommended! 🔥',
      likes: '2,890 likes',
      time: 'Yesterday',
      tag: '#CodingLife #ExamPrep',
    },
    {
      handle: '@sneha_cs',
      caption: 'The visual diagrams are a game changer. No more reading 800-page textbooks! 📚',
      likes: '954 likes',
      time: '3 days ago',
      tag: '#ComputerScience #Notes',
    },
    {
      handle: '@amit_iit',
      caption: 'Got my placement bundle delivered today. The print quality is top notch! 🚀',
      likes: '3,120 likes',
      time: '4 days ago',
      tag: '#Placements #Java #Python',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs font-heading font-bold text-[#12A5B0] uppercase tracking-wider block mb-1">
            Real Student Stories
          </span>
          <h2 className="font-heading font-bold text-3xl text-[#0B3561]">
            Loved on Instagram <span className="text-[#12A5B0]">@handwrittencode</span>
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
        {posts.map((post, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-5 border border-[#0B3561]/10 shadow-md min-w-[280px] sm:min-w-[320px] snap-start flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFD54A] to-[#12A5B0] p-0.5">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-xs text-[#0B3561]">
                    {post.handle[1].toUpperCase()}
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-[#0B3561]">{post.handle}</h4>
                  <span className="text-[10px] text-[#3C5D81]">{post.time}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#12A5B0]">ig</span>
            </div>

            <div className="aspect-[4/3] bg-[#DDF3F4]/50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-[#12A5B0]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B3561]/20 to-[#12A5B0]/20 flex items-center justify-center p-4 text-center">
                <span className="font-heading font-bold text-xs text-[#0B3561] bg-white/90 px-4 py-2 rounded-xl shadow-xs">
                  {post.tag}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-body text-[#0B3561] font-semibold">{post.caption}</p>
              <div className="flex justify-between items-center pt-2 text-[11px] text-[#3C5D81] font-bold">
                <span>❤️ {post.likes}</span>
                <span className="text-[#12A5B0]">Verified Student</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

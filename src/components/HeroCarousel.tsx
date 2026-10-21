import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { HeroBannerItem } from '../types';
import { PenUnderlineSVG } from './Icons';

interface HeroCarouselProps {
  banners: HeroBannerItem[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#0B3561]/10 bg-white min-h-[500px]">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, type: 'bullets' }}
        navigation={true}
        className="h-[500px] sm:h-[560px]"
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={banner.id || idx} className="relative w-full h-full">
            {/* Background Image */}
            {banner.image && (
              <img
                src={banner.image}
                alt={banner.headline}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}
            {/* Overlay for 0.05 opacity requirement */}
            <div className="absolute inset-0 bg-white/95 z-[1]" />
            
            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full p-6 sm:p-12 lg:p-16 flex items-center justify-center lg:justify-start">
              <div className="max-w-2xl space-y-5 sm:space-y-6 text-center lg:text-left text-[#0B3561]">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/30 text-[#92400E] text-xs font-heading font-semibold shadow-xs">
                  <span>{banner.badge}</span>
                </div>
                <h1 className="font-heading font-black text-3xl sm:text-5xl xl:text-6xl tracking-tight leading-[1.12]">
                    {banner.headline.includes('Handwritten') ? (
                      <>
                        {banner.headline.split('Handwritten')[0]}
                        <span className="relative inline-block text-[#12A5B0] font-handwriting italic font-bold">
                          Handwritten
                          <PenUnderlineSVG className="absolute left-0 right-0 -bottom-2 w-full h-3" color="#12A5B0" />
                        </span>
                        {banner.headline.split('Handwritten')[1]}
                      </>
                    ) : (
                      banner.headline
                    )}
                </h1>
                <p className="font-body text-base sm:text-lg text-[#3C5D81] leading-relaxed">
                  {banner.writeup}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <a href={banner.cta_link} className="px-8 py-4 bg-[#0B3561] text-white font-bold rounded-xl hover:bg-[#12A5B0] transition">
                    {banner.cta_text}
                  </a>
                  {banner.secondary_cta_text && (
                    <Link to={banner.secondary_cta_link || '#'} className="px-8 py-4 bg-[#FAF7F0] text-[#0B3561] font-bold rounded-xl hover:bg-white transition">
                      {banner.secondary_cta_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

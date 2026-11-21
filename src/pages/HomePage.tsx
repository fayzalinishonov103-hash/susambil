import React from 'react';
import { useApp } from '../context/AppContext';
import { DESTINATIONS, TRANSPORT_ROUTES } from '../data/mockData';
import { getLocalizedDestination } from '../i18n/translations';
import { 
  MapPin, 
  Train, 
  Sparkles, 
  ArrowRight, 
  Heart,
  ShieldCheck,
  Zap,
  Globe2
} from 'lucide-react';
import { LiveSearch } from '../components/common/LiveSearch';
import { InteractiveMap } from '../components/common/InteractiveMap';
import { ReviewsSection } from '../components/common/ReviewsSection';

export const HomePage: React.FC = () => {
  const { 
    language, 
    setCurrentPage, 
    formatPrice, 
    openBookingModal, 
    toggleFavorite, 
    isFavorite,
    destinations,
    t 
  } = useApp();

  const displayDests = destinations && destinations.length > 0 ? destinations : DESTINATIONS;

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION - Minimalist, Cinematic, High Impact with Live Autocomplete Search */}
      <section className="relative min-h-[580px] flex items-center justify-center text-white px-4 sm:px-8 py-16 overflow-hidden">
        {/* Background photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=2000&q=85')`
          }}
        >
          {/* Subtle clean emerald overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B3327] via-[#124C3A]/85 to-[#0B3327]/90" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Slogan Badge */}
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#C8A66A] px-3 py-1 rounded-full bg-[#C8A66A]/10 border border-[#C8A66A]/30">
            {t('hero_badge')}
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight leading-[1.08] text-white">
            “{t('slogan')}”
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#E9DCC5]/90 font-light leading-relaxed">
            {t('slogan_sub')}
          </p>

          {/* Instant Intelligent Live Search Bar with Dropdown Autocomplete */}
          <div className="max-w-2xl mx-auto pt-2">
            <LiveSearch 
              placeholder={t('search_placeholder') || 'Shahar, poyezd, mehmonxona yoki gid qidiring...'} 
              className="shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* 2. TOP DESTINATIONS - Clean Grid with 15-Language Names */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#124C3A]">
              {t('popular_destinations')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('popular_dest_sub')}
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentPage('destinations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#124C3A] hover:text-[#C8A66A] flex items-center gap-1 transition"
          >
            <span>{t('view_all')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayDests.slice(0, 4).map((dest) => {
            const localized = getLocalizedDestination(
              dest.id, 
              language, 
              dest.name[language] || dest.name.uz || dest.name.en, 
              dest.tagline[language] || dest.tagline.uz || dest.tagline.en
            );

            return (
              <div
                key={dest.id}
                onClick={() => {
                  setCurrentPage('destinations');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image_url}
                    alt={localized.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(dest.id);
                    }}
                    className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition ${
                      isFavorite(dest.id) ? 'bg-rose-500 text-white' : 'bg-black/30 text-white'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <div className="absolute bottom-3 left-3 text-white pr-3">
                    <h3 className="font-heading font-bold text-lg leading-tight">
                      {localized.name}
                    </h3>
                    <span className="text-[10px] text-[#E9DCC5] font-light line-clamp-1">
                      {localized.tagline}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between text-xs border-t border-slate-50">
                  <span className="text-slate-400">{t('daily_cost')}</span>
                  <span className="font-bold text-[#124C3A]">
                    {formatPrice(dest.estimated_daily_cost_usd)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE GEOGRAPHIC MAP OF UZBEKISTAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <InteractiveMap />
      </section>

      {/* 4. SPEED & SIMPLICITY: AFROSIYOB TICKETS */}
      <section className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#124C3A]">
                {t('afrosiyob_title')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('afrosiyob_sub')}
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentPage('transport');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#124C3A] hover:text-[#C8A66A] flex items-center gap-1 transition"
            >
              <span>{t('view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TRANSPORT_ROUTES.slice(0, 3).map((route) => (
              <div 
                key={route.id}
                className="rounded-2xl p-5 border border-slate-200/80 hover:border-[#124C3A] transition bg-[#FAF9F6] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-2">
                    <span className="flex items-center gap-1.5 text-[#124C3A]">
                      <Train className="w-3.5 h-3.5" />
                      <span>{route.carrier_code || 'Afrosiyob'}</span>
                    </span>
                    <span>{route.duration}</span>
                  </div>

                  <h3 className="font-heading font-bold text-slate-900 text-lg">
                    {route.origin_city} → {route.destination_city}
                  </h3>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <div className="font-heading font-black text-xl text-[#124C3A]">
                    {formatPrice(route.price_usd)}
                  </div>
                  <button
                    onClick={() => openBookingModal({
                      itemType: 'transport',
                      itemId: route.id,
                      itemTitle: `${route.carrier} (${route.origin_city} → ${route.destination_city})`,
                      priceUsd: route.price_usd
                    })}
                    className="px-4 py-2 rounded-xl bg-[#124C3A] text-white font-bold text-xs hover:bg-[#165743] transition"
                  >
                    {t('book_ticket')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY SUSAMBIL - 3 PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#124C3A]">
            {t('why_susambil')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#124C3A]/10 text-[#124C3A] flex items-center justify-center mx-auto">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">{t('why_1_title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('why_1_desc')}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#C8A66A]/20 text-[#C8A66A] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-[#124C3A]" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">{t('why_2_title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('why_2_desc')}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#124C3A]/10 text-[#124C3A] flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">{t('why_3_title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('why_3_desc')}</p>
          </div>
        </div>
      </section>

      {/* 6. REAL TOURIST REVIEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <ReviewsSection />
      </section>

      {/* 7. SMART PLANNER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-3xl bg-[#124C3A] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold text-[#C8A66A] uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Smart Travel Planner</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              {t('planner_cta_title')}
            </h2>
            <p className="text-xs text-[#E9DCC5]/80 leading-relaxed">
              {t('planner_cta_desc')}
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-2xl bg-[#C8A66A] hover:bg-[#DFBF85] text-[#124C3A] font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap"
          >
            {t('planner_cta_btn')}
          </button>
        </div>
      </section>
    </div>
  );
};

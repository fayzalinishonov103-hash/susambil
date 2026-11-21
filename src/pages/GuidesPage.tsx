import React, { useState } from 'react';
import { Star, CheckCircle, Globe, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Guide } from '../types';

const LANGUAGE_FILTERS = [
  { key: 'all', label: 'Barchasi' },
  { key: 'Uzbek', label: "O'zbekcha" },
  { key: 'English', label: 'English' },
  { key: 'Russian', label: 'Русский' },
  { key: 'Français', label: 'Français' },
  { key: 'German', label: 'Deutsch' },
  { key: 'Japanese', label: '日本語' },
  { key: 'Korean', label: '한국어' },
  { key: 'Chinese', label: '中文' },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={
          star <= Math.round(rating)
            ? 'fill-[#C8A66A] text-[#C8A66A]'
            : 'fill-gray-200 text-gray-200'
        }
      />
    ))}
  </div>
);

export const GuidesPage: React.FC = () => {
  const { guides, openBookingModal, formatPrice, language, t } = useApp();
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  const filteredGuides: Guide[] = guides.filter((guide) => {
    if (languageFilter === 'all') return true;
    return guide.languages.some(l => l.toLowerCase() === languageFilter.toLowerCase());
  });

  const handleBook = (guide: Guide) => {
    openBookingModal({
      itemType: 'guide',
      itemId: guide.id,
      itemTitle: `${guide.name} (${guide.city})`,
      priceUsd: guide.daily_rate_usd,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#124C3A] to-[#1c6c53] py-12 px-4 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#C8A66A]/20 text-[#C8A66A] text-xs font-heading font-semibold uppercase tracking-widest mb-2">
          {t('verified')}
        </span>
        <h1 className="font-heading font-black text-3xl md:text-5xl text-white mb-2">
          {t('guides_title')}
        </h1>
        <p className="text-[#E9DCC5]/80 max-w-xl mx-auto text-sm">
          {t('guides_sub')}
        </p>
      </section>

      {/* Language Filter */}
      <section className="sticky top-16 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">
          <Globe size={16} className="text-[#124C3A] shrink-0" />
          {LANGUAGE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setLanguageFilter(f.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold transition-colors ${
                languageFilter === f.key
                  ? 'bg-[#124C3A] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Guide Cards */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {filteredGuides.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p className="text-base font-semibold">Bu tilda tasdiqlangan gidlar topilmadi</p>
            <p className="text-xs text-slate-400 mt-1">Filtrni almashtirib ko‘ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between border border-slate-100 gap-4"
              >
                {/* Avatar + Verified */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={guide.photo_url}
                      alt={guide.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#124C3A]/10"
                    />
                    {guide.is_verified && (
                      <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle
                          size={16}
                          className="text-emerald-600 fill-emerald-100"
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-bold text-base text-gray-900 truncate">
                        {guide.name}
                      </h3>
                    </div>
                    <p className="text-xs font-semibold text-[#124C3A]">
                      {guide.city} • {guide.experience_years} {t('guides_experience')}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <StarRating rating={guide.rating} />
                      <span className="text-xs text-slate-400">
                        ({guide.reviews_count} {t('reviews_count')})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-1.5">
                  {guide.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-0.5 rounded-lg bg-[#E9DCC5]/50 text-[#124C3A] text-[11px] font-heading font-semibold"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Bio excerpt */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {typeof guide.bio === 'string'
                    ? guide.bio
                    : guide.bio[language as keyof typeof guide.bio] ||
                      guide.bio['uz'] ||
                      guide.bio['en']}
                </p>

                {/* Specialization pills */}
                {guide.specialization && guide.specialization.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {guide.specialization.slice(0, 2).map((spec, i) => (
                      <span key={i} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        • {spec}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-heading font-bold text-[#C8A66A]">
                      {formatPrice(guide.daily_rate_usd)}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/ {t('per_person') || 'kun'}</span>
                  </div>
                  <button
                    onClick={() => handleBook(guide)}
                    className="px-4 py-2 bg-[#124C3A] hover:bg-[#0e3b2d] text-white text-xs font-heading font-bold rounded-xl transition shadow-sm"
                  >
                    {t('book_now')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GuidesPage;

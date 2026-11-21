import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOURS } from '../data/mockData';
import { TourCategory } from '../types';
import { Clock, Users, Star, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { DemoNotice } from '../components/common/DemoNotice';

export const ToursPage: React.FC = () => {
  const { language, formatPrice, openBookingModal, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<TourCategory | 'all'>('all');
  const [expandedTourId, setExpandedTourId] = useState<string | null>(null);

  const categories: { id: TourCategory | 'all'; label: string }[] = [
    { id: 'all', label: t('tours_all') || 'Barchasi' },
    { id: 'historical', label: t('tours_history') || 'Tarixiy' },
    { id: 'ecotourism', label: t('tours_eco') || 'Ekoturizm' },
    { id: 'gastronomic', label: t('tours_food') || 'Gastronomiya' },
    { id: 'adventure', label: t('tours_adventure') || 'Sarguzasht' },
    { id: 'workshops', label: t('tours_crafts') || 'Hunarmandchilik' },
  ];

  const filtered = selectedCategory === 'all'
    ? TOURS
    : TOURS.filter(tour => tour.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#E9DCC5]/20">
      <DemoNotice />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#124C3A] to-[#1a6b52] py-10 px-4 text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
          {t('sec_tours_title') || 'Turlar va Tajribalar'}
        </h1>
        <p className="text-[#E9DCC5]/80 text-sm max-w-xl mx-auto">
          {t('sec_tours_sub') || "O'zbekiston bo'ylab professional gidlar va unutilmas sayohatlar"}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-[#124C3A] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => {
            const isExpanded = expandedTourId === tour.id;
            return (
              <div
                key={tour.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-[#C8A66A]/40 transition flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.image_url}
                    alt={tour.title[language] || tour.title.uz}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#124C3A] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {tour.city}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-[#124C3A]">
                    <Star className="w-3.5 h-3.5 fill-[#C8A66A] text-[#C8A66A]" />
                    <span>{tour.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 gap-4">
                  <div>
                    <h2 className="font-heading font-semibold text-lg text-slate-900 leading-snug">
                      {tour.title[language] || tour.title.uz || tour.title.en}
                    </h2>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {tour.overview[language] || tour.overview.uz || tour.overview.en}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#C8A66A]" />
                      <span>{tour.duration_label[language] || tour.duration_label.uz || tour.duration_label.en}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#C8A66A]" />
                      <span>{tour.group_size}</span>
                    </span>
                  </div>

                  {/* Accordion Program Toggle */}
                  {tour.itinerary.length > 0 && (
                    <div className="pt-1">
                      <button
                        onClick={() => setExpandedTourId(isExpanded ? null : tour.id)}
                        className="text-xs font-semibold text-[#124C3A] hover:text-[#C8A66A] flex items-center justify-between w-full py-1.5 transition"
                      >
                        <span>{isExpanded ? t('tours_program_hide') : t('tours_program_view')}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                          {tour.itinerary.map((step) => (
                            <div key={step.day} className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                              <span className="font-bold text-[#124C3A] block">
                                {step.day}-kun: {step.title[language] || step.title.uz || step.title.en}
                              </span>
                              <p className="text-slate-600 mt-1 leading-relaxed">
                                {step.description[language] || step.description.uz || step.description.en}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* What is included */}
                  {(tour.included[language] || tour.included.uz) && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {t('tours_included')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(tour.included[language] || tour.included.uz || tour.included.en || []).slice(0, 3).map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price & Action */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t('transport_selected_price') || 'Narxi'}</span>
                      <div className="font-heading font-bold text-xl text-[#124C3A]">
                        {formatPrice(tour.price_usd)}
                        <span className="text-xs font-normal text-slate-400"> / {t('per_person') || 'kishi'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        openBookingModal({
                          itemType: 'tour',
                          itemId: tour.id,
                          itemTitle: tour.title[language] || tour.title.uz || tour.title.en,
                          priceUsd: tour.price_usd,
                        })
                      }
                      className="bg-[#124C3A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0e3b2d] transition shadow-sm"
                    >
                      {t('book_now') || 'Bron qilish'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg font-heading">{t('tours_not_found') || 'Ushbu toifada turlar topilmadi'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

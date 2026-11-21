import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getLocalizedDestination } from '../i18n/translations';
import { Search, Heart } from 'lucide-react';
import { InteractiveMap } from '../components/common/InteractiveMap';

export const DestinationsPage: React.FC = () => {
  const { destinations, language, formatPrice, toggleFavorite, isFavorite, setCurrentPage, t } = useApp();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const regions: { id: string; label: string }[] = [
    { id: 'all', label: t('hotel_types_all') || 'Barchasi' },
    { id: 'silk_road', label: 'Ipak yo\'li' },
    { id: 'oasis', label: 'Vohalar' },
    { id: 'mountains', label: 'Tog\'lar' },
    { id: 'hidden_valley', label: 'Yashirin vodiylar' },
    { id: 'desert', label: 'Sahro' },
  ];

  const filtered = destinations.filter((dest) => {
    const localized = getLocalizedDestination(
      dest.id,
      language,
      dest.name[language] || dest.name.uz || dest.name.en,
      dest.tagline[language] || dest.tagline.uz || dest.tagline.en
    );
    const matchRegion = selectedRegion === 'all' || dest.region === selectedRegion;
    const matchSearch =
      localized.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      localized.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#124C3A]">
          {t('sec_destinations_title')}
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          {t('sec_destinations_sub')}
        </p>
      </div>

      {/* Interactive Map */}
      <InteractiveMap />

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedRegion === reg.id
                  ? 'bg-[#124C3A] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t('search_placeholder') || 'Shahar qidirish...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dest) => {
          const localized = getLocalizedDestination(
            dest.id,
            language,
            dest.name[language] || dest.name.uz || dest.name.en,
            dest.tagline[language] || dest.tagline.uz || dest.tagline.en
          );

          return (
            <div
              key={dest.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.image_url}
                  alt={localized.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <button
                  onClick={() => toggleFavorite(dest.id)}
                  className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm transition ${
                    isFavorite(dest.id) ? 'bg-rose-500 text-white' : 'bg-black/30 text-white'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A66A] block mb-0.5">
                    {dest.region.replace(/_/g, ' ')}
                  </span>
                  <h3 className="font-heading font-bold text-xl leading-tight">{localized.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {localized.tagline}
                </p>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                    {t('must_see') || 'Borishga arziydi'}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(dest.must_see[language] || dest.must_see.uz || dest.must_see.en)
                      ?.slice(0, 3)
                      .map((item, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-[#124C3A] text-[11px] font-medium"
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400">{t('daily_cost') || 'Kunlik xarajat'}:</span>
                    <div className="font-heading font-black text-lg text-[#124C3A]">
                      {formatPrice(dest.estimated_daily_cost_usd)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPage('planner');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#124C3A] text-white font-bold text-xs hover:bg-[#165743] transition"
                  >
                    {t('plan_trip') || 'Reja tuzish'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

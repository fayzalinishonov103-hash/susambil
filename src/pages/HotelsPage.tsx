import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCOMMODATIONS } from '../data/mockData';
import { Accommodation, AccommodationType } from '../types';
import { Star, MapPin, Heart, Search } from 'lucide-react';
import { DemoNotice } from '../components/common/DemoNotice';
import { BookingRequestModal } from '../components/modals/BookingRequestModal';

const CITIES = ['Barchasi', 'Samarqand', 'Buxoro', 'Xiva', 'Toshkent', "Farg'ona"];
const TYPES: { id: AccommodationType | 'all'; label: string }[] = [
  { id: 'all', label: 'Barchasi' },
  { id: 'boutique_hotel', label: 'Mehmonxona' },
  { id: 'madrassah_hotel', label: 'Madrasah' },
  { id: 'guesthouse', label: 'Mehmonxona (kichik)' },
  { id: 'hostel', label: 'Hostel' },
  { id: 'yurt_camp', label: 'Yurt lager' },
];

const CITY_FILTER_MAP: Record<string, string> = {
  Barchasi: 'all',
  Samarqand: 'samarkand',
  Buxoro: 'bukhara',
  Xiva: 'khiva',
  Toshkent: 'tashkent',
  "Farg'ona": "farg'ona",
};

export const HotelsPage: React.FC = () => {
  const { language, formatPrice, toggleFavorite, isFavorite, openBookingModal, t } = useApp();
  const [selectedCity, setSelectedCity] = useState<string>('Barchasi');
  const [selectedType, setSelectedType] = useState<AccommodationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const typesList: { id: AccommodationType | 'all'; label: string }[] = [
    { id: 'all', label: t('hotel_types_all') || 'Barchasi' },
    { id: 'boutique_hotel', label: t('hotel_types_hotel') || 'Mehmonxona' },
    { id: 'madrassah_hotel', label: t('hotel_types_madrasah') || 'Madrasah Mehmonxona' },
    { id: 'guesthouse', label: t('hotel_types_guesthouse') || 'Mehmon uyi' },
    { id: 'hostel', label: t('hotel_types_hostel') || 'Hostel' },
    { id: 'yurt_camp', label: t('hotel_types_yurt') || 'O‘tov lager' },
  ];

  const filtered = ACCOMMODATIONS.filter((hotel: Accommodation) => {
    const cityKey = CITY_FILTER_MAP[selectedCity] ?? 'all';
    const matchCity =
      cityKey === 'all' || hotel.city.toLowerCase().includes(cityKey.toLowerCase());
    const matchType = selectedType === 'all' || hotel.type === selectedType;
    const hName = hotel.name[language] || hotel.name.uz || hotel.name.en || '';
    const matchSearch =
      hName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchType && matchSearch;
  });

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.round(rating) ? 'fill-[#C8A66A] text-[#C8A66A]' : 'text-slate-200'
        }`}
      />
    ));

  return (
    <div className="min-h-screen bg-[#E9DCC5]/20">
      <DemoNotice />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#124C3A] to-[#1a6b52] py-10 px-4 text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
          {t('nav_hotels')}
        </h1>
        <p className="text-[#E9DCC5]/80 text-sm max-w-xl mx-auto">
          {t('sec_hotels_sub')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Filter Row */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 items-center">
          {/* City dropdown */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30 bg-white"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c === 'Barchasi' ? (t('hotel_types_all') || 'Barchasi') : c}
              </option>
            ))}
          </select>

          {/* Type dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as AccommodationType | 'all')}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30 bg-white"
          >
            {typesList.map((tp) => (
              <option key={tp.id} value={tp.id}>
                {tp.label}
              </option>
            ))}
          </select>

          {/* Search input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30"
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500">
          {filtered.length} {t('hotels_found')}
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hotel: Accommodation) => (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-[#C8A66A]/40 transition-all duration-200 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={hotel.image_url}
                  alt={hotel.name[language] || hotel.name.uz}
                  className="w-full h-full object-cover"
                />
                {/* City badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 bg-[#124C3A] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    <MapPin className="w-3 h-3" />
                    {hotel.city}
                  </span>
                </div>
                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(hotel.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition"
                  aria-label="Sevimlilar"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(hotel.id)
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1 gap-3">
                <div>
                  <h3 className="font-heading font-semibold text-[#124C3A] text-base leading-snug">
                    {hotel.name[language] || hotel.name.uz || hotel.name.en}
                  </h3>
                  <div className="flex items-center gap-1 mt-1.5">
                    {renderStars(hotel.rating)}
                    <span className="text-xs text-slate-400 ml-1">
                      ({hotel.reviews_count})
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-[#C8A66A] font-heading font-bold text-lg">
                      {formatPrice(hotel.price_per_night_usd)}
                    </span>
                    <span className="text-slate-400 text-xs ml-1">
                      / {t('per_night')}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      openBookingModal({
                        itemType: 'hotel',
                        itemId: hotel.id,
                        itemTitle: hotel.name[language] || hotel.name.uz || hotel.name.en,
                        priceUsd: hotel.price_per_night_usd,
                      })
                    }
                    className="bg-[#124C3A] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#0e3b2d] transition"
                  >
                    {t('book_now')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg font-heading">{t('hotels_not_found')}</p>
            <p className="text-sm mt-1">{t('hotels_filter_hint')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

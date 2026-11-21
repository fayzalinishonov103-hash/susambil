import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Compass, Calendar, DollarSign, ArrowRight, X, Info } from 'lucide-react';
import { getLocalizedDestination } from '../../i18n/translations';

interface MapCity {
  id: string;
  name: string;
  region: string;
  x: number; // percentage coordinate 0-100
  y: number; // percentage coordinate 0-100
  destId: string;
  mustSee: string;
  dailyCost: number;
}

const CITIES: MapCity[] = [
  { id: 'tashkent', name: 'Toshkent', region: 'Poytaxt', x: 74, y: 35, destId: 'dest-tashkent', mustSee: 'Hazrati Imom, Chorsu', dailyCost: 55 },
  { id: 'samarkand', name: 'Samarqand', region: 'Ipak yo‘li', x: 62, y: 58, destId: 'dest-samarkand', mustSee: 'Registon, Shohi Zinda', dailyCost: 65 },
  { id: 'bukhara', name: 'Buxoro', region: 'Qadimiy shahar', x: 48, y: 64, destId: 'dest-bukhara', mustSee: 'Po-i-Kalyon, Ark qal‘asi', dailyCost: 50 },
  { id: 'khiva', name: 'Xiva', region: 'Ochiq osmon ostidagi muzey', x: 26, y: 52, destId: 'dest-khiva', mustSee: 'Ichan Qal‘a, Kalta Minora', dailyCost: 45 },
  { id: 'fergana', name: 'Farg‘ona', region: 'Vodiy o‘lkasi', x: 88, y: 44, destId: 'dest-fergana', mustSee: 'Rishton kulolchiligi, Marg‘ilon ipagi', dailyCost: 40 },
  { id: 'termez', name: 'Termiz', region: 'Janubiy gavhar', x: 67, y: 88, destId: 'dest-termez', mustSee: 'Fayoztepa, Sulton Saodat', dailyCost: 35 },
  { id: 'chimgan', name: 'Chimyon & Amirsoy', region: 'Tog‘ kurorti', x: 81, y: 24, destId: 'dest-chimgan', mustSee: 'Chorvoq suv ombori, Tog‘-chang‘i', dailyCost: 75 },
  { id: 'aral', name: 'Mo‘ynoq (Orol)', region: 'Qoraqalpog‘iston', x: 12, y: 22, destId: 'dest-aral-sea', mustSee: 'Kemalar qabristoni, Ustyurt', dailyCost: 60 },
];

export const InteractiveMap: React.FC<{
  activeRoute?: string[];
  onSelectCity?: (destId: string) => void;
}> = ({ activeRoute, onSelectCity }) => {
  const { language, formatPrice, setCurrentPage, t } = useApp();
  const [selectedCity, setSelectedCity] = useState<MapCity | null>(CITIES[1]); // Default Samarkand
  const [showRoute, setShowRoute] = useState(true);

  const handleCityClick = (city: MapCity) => {
    setSelectedCity(city);
    if (onSelectCity) {
      onSelectCity(city.destId);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Map Control Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 to-amber-50/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#124C3A] text-[#C8A66A] flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>O‘zbekiston Interaktiv Sayyohlik Xaritasi</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#124C3A] font-semibold">
                Jonli GPS
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Shaharni bosing va masofa, diqqatga sazovor joylar hamda xarajatlarni ko‘ring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRoute(!showRoute)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              showRoute
                ? 'bg-[#124C3A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-[#C8A66A]" />
            <span>Ipak yo‘li tezyurar marshruti</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[380px] sm:h-[460px] bg-[#FAF8F5] overflow-hidden select-none border-b border-slate-100">
        {/* Subtle Map Grid lines */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(#124C3A 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />

        {/* Realistic SVG Uzbekistan Outline Contour & Topography */}
        <svg 
          viewBox="0 0 1000 600" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-25"
        >
          {/* Desert Area (Kyzylkum) */}
          <path 
            d="M 280 200 Q 400 150 550 240 T 700 280 L 600 380 Q 450 360 300 320 Z" 
            fill="#E9DCC5" 
            opacity="0.6"
          />
          {/* Mountain Regions */}
          <path 
            d="M 720 120 Q 820 140 920 220 L 890 320 Q 780 260 740 220 Z" 
            fill="#124C3A" 
            opacity="0.12"
          />
          {/* Main territory silhouette */}
          <path 
            d="M 50 160 Q 150 100 250 120 T 450 160 Q 600 140 750 180 T 940 260 Q 980 340 880 380 T 780 400 Q 720 540 680 580 T 580 480 Q 520 420 440 430 T 260 380 Q 180 360 80 280 Z" 
            fill="#124C3A" 
            opacity="0.06" 
            stroke="#124C3A" 
            strokeWidth="3" 
            strokeDasharray="6 6"
          />
        </svg>

        {/* Animated Silk Road Railway & Highway Path */}
        {showRoute && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C8A66A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#124C3A" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* Main Spine: Tashkent -> Samarkand -> Bukhara -> Khiva */}
            <path
              d="M 74% 35% Q 68% 48% 62% 58% T 48% 64% T 26% 52%"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="3.5"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
            {/* Spurs: Tashkent -> Fergana & Samarkand -> Termez */}
            <path
              d="M 74% 35% Q 82% 40% 88% 44%"
              fill="none"
              stroke="#C8A66A"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 62% 58% Q 64% 75% 67% 88%"
              fill="none"
              stroke="#C8A66A"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          </svg>
        )}

        {/* City Markers & Interactive Pins */}
        {CITIES.map((city) => {
          const isSelected = selectedCity?.id === city.id;
          const localized = getLocalizedDestination(city.destId, language, city.name, city.region);

          return (
            <div
              key={city.id}
              onClick={() => handleCityClick(city)}
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              {/* Pulsating Radar on Selected */}
              {isSelected && (
                <div className="absolute inset-0 -m-3 rounded-full bg-[#124C3A]/20 animate-ping pointer-events-none" />
              )}

              {/* Pin Icon */}
              <div 
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl shadow-md border transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#124C3A] text-white scale-110 ring-4 ring-[#C8A66A]/40 border-[#C8A66A]'
                    : 'bg-white/95 text-slate-800 hover:scale-105 border-slate-200 hover:border-[#124C3A]'
                }`}
              >
                <div 
                  className={`w-3 h-3 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-[#C8A66A]' : 'bg-[#124C3A]'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="font-heading font-bold text-xs whitespace-nowrap">
                  {localized.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Floating Selected City Quick View Card (Bottom Left) */}
        {selectedCity && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl z-30 animate-fade-in space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A66A] block">
                  {selectedCity.region}
                </span>
                <h4 className="font-heading font-black text-lg text-slate-900 leading-tight">
                  {getLocalizedDestination(selectedCity.destId, language, selectedCity.name, '').name}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedCity(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#124C3A] flex-shrink-0" />
              <span>{selectedCity.mustSee}</span>
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">{t('daily_cost') || 'Kunlik xarajat:'}</span>
                <span className="font-heading font-bold text-[#124C3A] text-sm">
                  ~{formatPrice(selectedCity.dailyCost)} / {t('planner_day_label') || 'kun'}
                </span>
              </div>
              <button
                onClick={() => {
                  setCurrentPage('planner');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#124C3A] text-white font-bold text-xs hover:bg-[#165743] transition flex items-center gap-1"
              >
                <span>{t('plan_trip') || 'Reja tuzish'}</span>
                <ArrowRight className="w-3 h-3 text-[#C8A66A]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Route Leg Distance/Duration Info Bar */}
      <div className="p-3 bg-slate-50 flex flex-wrap items-center justify-around gap-2 text-xs text-slate-600 font-medium">
        <span>🚆 Toshkent ➔ Samarqand: <strong>2h 10m</strong> (Afrosiyob)</span>
        <span className="hidden sm:inline text-slate-300">•</span>
        <span>🚆 Samarqand ➔ Buxoro: <strong>1h 35m</strong></span>
        <span className="hidden sm:inline text-slate-300">•</span>
        <span>🚆 Buxoro ➔ Xiva: <strong>6h 00m</strong></span>
        <span className="hidden sm:inline text-slate-300">•</span>
        <span>✈️ Toshkent ➔ Urganch: <strong>1h 30m</strong></span>
      </div>
    </div>
  );
};

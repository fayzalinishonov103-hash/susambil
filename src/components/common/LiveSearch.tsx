import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DESTINATIONS, ACCOMMODATIONS, TRANSPORT_ROUTES, TOURS } from '../../data/mockData';
import { 
  Search, 
  MapPin, 
  Hotel, 
  Train, 
  Compass, 
  User, 
  ArrowRight, 
  X, 
  Sparkles 
} from 'lucide-react';
import { getLocalizedDestination } from '../../i18n/translations';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'destination' | 'hotel' | 'transport' | 'tour' | 'guide';
  price?: number;
  badge?: string;
  targetPage: any;
}

export const LiveSearch: React.FC<{
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}> = ({ placeholder, className = '', autoFocus = false }) => {
  const { language, formatPrice, setCurrentPage, guides, t } = useApp();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getResults = (): SearchResultItem[] => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // 1. Destinations
    DESTINATIONS.forEach((d) => {
      const loc = getLocalizedDestination(d.id, language, d.name[language] || d.name.uz, d.tagline[language] || d.tagline.uz);
      if (loc.name.toLowerCase().includes(q) || loc.tagline.toLowerCase().includes(q) || d.region.includes(q)) {
        results.push({
          id: d.id,
          title: loc.name,
          subtitle: loc.tagline,
          type: 'destination',
          price: d.estimated_daily_cost_usd,
          badge: d.region.replace('_', ' '),
          targetPage: 'destinations',
        });
      }
    });

    // 2. Hotels
    ACCOMMODATIONS.forEach((h) => {
      const name = h.name[language] || h.name.uz;
      if (name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)) {
        results.push({
          id: h.id,
          title: name,
          subtitle: `${h.city} • ${h.rating} ★ (${h.reviews_count} sharh)`,
          type: 'hotel',
          price: h.price_per_night_usd,
          badge: h.type.replace('_', ' '),
          targetPage: 'hotels',
        });
      }
    });

    // 3. Transport
    TRANSPORT_ROUTES.forEach((r) => {
      const routeStr = `${r.origin_city} ${r.destination_city} ${r.carrier}`.toLowerCase();
      if (routeStr.includes(q)) {
        results.push({
          id: r.id,
          title: `${r.origin_city} → ${r.destination_city}`,
          subtitle: `${r.carrier} • ${r.duration} • ${r.departure_time}`,
          type: 'transport',
          price: r.price_usd,
          badge: r.type,
          targetPage: 'transport',
        });
      }
    });

    // 4. Tours
    TOURS.forEach((tour) => {
      const title = tour.title[language] || tour.title.uz;
      if (title.toLowerCase().includes(q) || tour.city.toLowerCase().includes(q)) {
        results.push({
          id: tour.id,
          title,
          subtitle: `${tour.city} • ${tour.duration_label[language] || tour.duration_label.uz}`,
          type: 'tour',
          price: tour.price_usd,
          badge: tour.category,
          targetPage: 'tours',
        });
      }
    });

    // 5. Guides
    guides.forEach((g) => {
      const bioText = g.bio[language] || g.bio.uz || '';
      if (g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q) || bioText.toLowerCase().includes(q)) {
        results.push({
          id: g.id,
          title: `${g.name} (${g.city})`,
          subtitle: `${g.languages.slice(0, 3).join(', ')} • ${g.experience_years} yil tajriba`,
          type: 'guide',
          price: g.daily_rate_usd,
          badge: 'Gid',
          targetPage: 'guides',
        });
      }
    });

    return results.slice(0, 8); // Top 8 matches
  };

  const results = getResults();

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');
    setCurrentPage(item.targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'destination':
        return <MapPin className="w-3.5 h-3.5 text-[#C8A66A]" />;
      case 'hotel':
        return <Hotel className="w-3.5 h-3.5 text-blue-500" />;
      case 'transport':
        return <Train className="w-3.5 h-3.5 text-emerald-600" />;
      case 'tour':
        return <Compass className="w-3.5 h-3.5 text-purple-500" />;
      case 'guide':
        return <User className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          autoFocus={autoFocus}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder || t('search_placeholder') || 'Shahar, poyezd, mehmonxona yoki gid qidiring...'}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200/90 bg-white/95 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30 shadow-sm transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating Autocomplete Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden animate-fade-in max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              <Search className="w-5 h-5 mx-auto mb-1 text-slate-300" />
              <span>"{query}" bo‘yicha hech narsa topilmadi.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="p-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                <span>Topilgan natijalar ({results.length})</span>
                <span className="text-[#C8A66A]">Jonli qidiruv</span>
              </div>
              {results.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="w-full p-3 text-left hover:bg-slate-50 flex items-center justify-between gap-3 transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-bold text-xs text-slate-900 truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.price !== undefined && (
                      <span className="font-heading font-black text-xs text-[#124C3A]">
                        {formatPrice(item.price)}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#124C3A] group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

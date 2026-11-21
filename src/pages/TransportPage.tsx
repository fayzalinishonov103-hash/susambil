import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSPORT_ROUTES } from '../data/mockData';
import { TransportType } from '../types';
import { Train, Plane, Car, Clock, Info, ArrowRight } from 'lucide-react';

export const TransportPage: React.FC = () => {
  const { formatPrice, openBookingModal, t } = useApp();
  const [activeTab, setActiveTab] = useState<TransportType | 'all'>('all');
  const [selectedClassMap, setSelectedClassMap] = useState<Record<string, number>>({});

  const tabs: { id: TransportType | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: t('transport_all') || 'Barchasi', icon: Clock },
    { id: 'train', label: t('transport_trains') || 'Poyezdlar', icon: Train },
    { id: 'flight', label: t('transport_flights') || 'Parvozlar', icon: Plane },
    { id: 'transfer', label: t('transport_transfers') || 'Transferlar', icon: Car },
    { id: 'car_rental', label: t('transport_car_rental') || 'Avto-ijara', icon: Car },
  ];

  const filtered = activeTab === 'all'
    ? TRANSPORT_ROUTES
    : TRANSPORT_ROUTES.filter(r => r.type === activeTab);

  const handleSelectClass = (routeId: string, index: number) => {
    setSelectedClassMap(prev => ({ ...prev, [routeId]: index }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#124C3A]">
          {t('sec_transport_title') || 'Transport'}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {t('sec_transport_sub') || "Poyezd, parvoz va transferlar"}
        </p>
      </div>

      {/* API Notice */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs text-amber-800">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span>
          {t('transport_api_notice') || "API tayyor: railway.uz va Silk Avia GDS ulangandan so'ng real mavjudlik va narxlar ko'rsatiladi. Hozir demo rejimda ishlayapti."}
        </span>
      </div>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#124C3A] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Routes */}
      <div className="space-y-4">
        {filtered.map((route) => {
          const selectedClassIndex = selectedClassMap[route.id] || 0;
          const selectedClass = route.class_options[selectedClassIndex] || route.class_options[0];
          const activePrice = selectedClass ? selectedClass.price_usd : route.price_usd;

          return (
            <div
              key={route.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 transition space-y-5"
            >
              {/* Route Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A66A]">
                    {route.type} • {route.frequency}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mt-0.5">
                    {route.origin_city} → {route.destination_city}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{route.carrier} {route.carrier_code && `• ${route.carrier_code}`}</p>
                </div>

                {/* Times */}
                <div className="flex items-center gap-4 py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-heading font-black">
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-400 font-normal font-sans">{t('transport_departure') || 'Chiqish'}</span>
                    <span className="text-slate-900">{route.departure_time}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-normal font-sans">{route.duration}</div>
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-400 font-normal font-sans">{t('transport_arrival') || 'Yetib borish'}</span>
                    <span className="text-slate-900">{route.arrival_time}</span>
                  </div>
                </div>
              </div>

              {/* Class Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {route.class_options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectClass(route.id, idx)}
                    className={`p-3 rounded-xl text-left border text-xs transition ${
                      selectedClassIndex === idx
                        ? 'border-[#124C3A] bg-emerald-50 ring-1 ring-[#124C3A]/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{opt.name}</span>
                      <span className="text-[#124C3A] font-bold">{formatPrice(opt.price_usd)}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {opt.features.slice(0, 2).join(' • ')}
                    </div>
                  </button>
                ))}
              </div>

              {/* Booking Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">{t('transport_selected_price') || 'Tanlangan narx'}</span>
                  <span className="font-heading font-black text-2xl text-[#124C3A]">
                    {formatPrice(activePrice)}
                  </span>
                </div>
                <button
                  onClick={() => openBookingModal({
                    itemType: 'transport',
                    itemId: route.id,
                    itemTitle: `${route.carrier} — ${route.origin_city} → ${route.destination_city}`,
                    priceUsd: activePrice,
                  })}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#124C3A] text-white font-bold text-xs hover:bg-[#165743] transition"
                >
                  <span>{t('book_ticket')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C8A66A]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

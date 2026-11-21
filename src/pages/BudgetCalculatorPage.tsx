import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, Calendar, Users, Hotel, Compass, Utensils, Train, ArrowRight } from 'lucide-react';
import { DemoNotice } from '../components/common/DemoNotice';

export const BudgetCalculatorPage: React.FC = () => {
  const { formatPrice, setCurrentPage, showToast, t } = useApp();

  const [days, setDays] = useState<number>(5);
  const [travelers, setTravelers] = useState<number>(2);
  const [stayStyle, setStayStyle] = useState<'budget' | 'comfort' | 'luxury'>('comfort');
  const [transportType, setTransportType] = useState<'budget' | 'standard' | 'premium'>('standard');
  const [diningStyle, setDiningStyle] = useState<'local' | 'mix' | 'fine'>('mix');

  // Rates in USD per person per day
  const stayDailyCosts = { budget: 20, comfort: 50, luxury: 120 };
  const transportDailyCosts = { budget: 10, standard: 25, premium: 60 };
  const foodDailyCosts = { local: 15, mix: 30, fine: 65 };
  const activitiesDailyCost = 25;

  const totalStayCost = stayDailyCosts[stayStyle] * days * travelers;
  const totalTransportCost = transportDailyCosts[transportType] * days * travelers;
  const totalFoodCost = foodDailyCosts[diningStyle] * days * travelers;
  const totalActivitiesCost = activitiesDailyCost * days * travelers;

  const grandTotal = totalStayCost + totalTransportCost + totalFoodCost + totalActivitiesCost;
  const perPersonTotal = Math.round(grandTotal / travelers);

  const handleSaveBudget = () => {
    showToast('Hisoblangan byudjet saqlandi!');
  };

  return (
    <div className="min-h-screen bg-[#E9DCC5]/20">
      <DemoNotice />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#124C3A] to-[#1a6b52] py-10 px-4 text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
          {t('budget_title') || 'Smart Byudjet Kalkulyatori'}
        </h1>
        <p className="text-[#E9DCC5]/80 text-sm max-w-xl mx-auto">
          {t('budget_sub') || "O'zbekistonga sayohatingiz xarajatlarini aniq hisoblang va rejalashtiring"}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders & Parameters (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="font-heading font-semibold text-lg text-[#124C3A] pb-3 border-b border-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#C8A66A]" />
              <span>{t('budget_params')}</span>
            </h2>

            {/* Days Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-slate-800">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C8A66A]" />
                  <span>{t('budget_days')}:</span>
                </span>
                <span className="text-[#124C3A] font-heading font-bold text-base">{days}</span>
              </div>
              <input
                type="range"
                min={1}
                max={21}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-[#124C3A] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1</span>
                <span>10</span>
                <span>21</span>
              </div>
            </div>

            {/* Travelers Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-slate-800">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C8A66A]" />
                  <span>{t('budget_travelers')}:</span>
                </span>
                <span className="text-[#124C3A] font-heading font-bold text-base">{travelers}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full accent-[#124C3A] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Accommodation Tier */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Hotel className="w-4 h-4 text-[#C8A66A]" />
                <span>{t('budget_stay')}:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'budget', label: 'Tejamkor', sub: 'Hostel/Guest' },
                    { id: 'comfort', label: 'Qulay', sub: '3-4★ Mehmonxona' },
                    { id: 'luxury', label: 'Premium', sub: '5★ / Butik' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStayStyle(opt.id)}
                    className={`p-3 rounded-xl border text-center transition ${
                      stayStyle === opt.id
                        ? 'border-[#124C3A] bg-[#124C3A]/5 text-[#124C3A] font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Tier */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Train className="w-4 h-4 text-[#C8A66A]" />
                <span>{t('budget_transport')}:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'budget', label: 'Avtobus / Poyezd', sub: 'Standard' },
                    { id: 'standard', label: 'Afrosiyob', sub: 'Comfort' },
                    { id: 'premium', label: 'VIP Transfer', sub: 'Luxury' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTransportType(opt.id)}
                    className={`p-3 rounded-xl border text-center transition ${
                      transportType === opt.id
                        ? 'border-[#124C3A] bg-[#124C3A]/5 text-[#124C3A] font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Food Style */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#C8A66A]" />
                <span>{t('budget_food')}:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'local', label: 'Standard', sub: 'Choyxona / Osh' },
                    { id: 'mix', label: 'Comfort', sub: 'Kafelar / Restoran' },
                    { id: 'fine', label: 'Fine Dining', sub: 'Premium' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDiningStyle(opt.id)}
                    className={`p-3 rounded-xl border text-center transition ${
                      diningStyle === opt.id
                        ? 'border-[#124C3A] bg-[#124C3A]/5 text-[#124C3A] font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#124C3A] text-white rounded-2xl p-6 shadow-sm border border-[#C8A66A]/30 space-y-5">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-[#C8A66A]">
                  {t('budget_total')}
                </span>
                <div className="text-3xl font-heading font-bold text-white mt-1">
                  {formatPrice(grandTotal)}
                </div>
                <p className="text-xs text-[#E9DCC5]/80 mt-1">
                  {t('budget_per_person')} {formatPrice(perPersonTotal)}
                </p>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#E9DCC5] flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-[#C8A66A]" />
                    <span>{t('nav_hotels')}:</span>
                  </span>
                  <span className="font-semibold text-white">{formatPrice(totalStayCost)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#E9DCC5] flex items-center gap-2">
                    <Train className="w-4 h-4 text-[#C8A66A]" />
                    <span>{t('nav_transport')}:</span>
                  </span>
                  <span className="font-semibold text-white">{formatPrice(totalTransportCost)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#E9DCC5] flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#C8A66A]" />
                    <span>{t('tours_food')}:</span>
                  </span>
                  <span className="font-semibold text-white">{formatPrice(totalFoodCost)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#E9DCC5] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#C8A66A]" />
                    <span>{t('nav_tours')}:</span>
                  </span>
                  <span className="font-semibold text-white">{formatPrice(totalActivitiesCost)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={handleSaveBudget}
                  className="w-full bg-[#C8A66A] text-slate-900 font-semibold text-xs py-3 rounded-xl hover:bg-[#b89559] transition shadow-sm"
                >
                  {t('budget_save_btn')}
                </button>
                <button
                  onClick={() => setCurrentPage('planner')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span>{t('nav_planner')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Box */}
            <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
              {t('budget_note')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

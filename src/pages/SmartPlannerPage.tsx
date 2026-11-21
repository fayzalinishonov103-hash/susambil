import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Users,
  Heart,
  UserCheck,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  Landmark,
  Leaf,
  Utensils,
  Compass,
  BookOpen,
  Sun,
  Coffee,
  Moon,
  Building,
  Printer,
} from 'lucide-react';
import { CustomItineraryDay } from '../types';

const DESTINATIONS = ['Samarqand', "Buxoro", 'Xiva', 'Toshkent', "Farg'ona", 'Termiz'];

const DAILY_ACTIVITIES: Record<string, { morning: string; afternoon: string; evening: string; hotel: string }> = {
  Samarqand: {
    morning: "Registon maydoni — uch madrasaning tonggi nuri ostidagi sehrli manzarasi.",
    afternoon: "Shohi Zinda majmuasi va Bibi Xonim masjidiga ziyorat.",
    evening: "Platan restoranida samarqandcha qatlamli osh va mahalliy vino.",
    hotel: "Bibikhanum Heritage Guesthouse",
  },
  Buxoro: {
    morning: "Po-i-Kalyon minorasi va qadimiy savdo gurvonlari (Toqi Sarrofon).",
    afternoon: "Buxoro qal'asi va suzani kashtchilik ustaxonalari.",
    evening: "Lyabi-Hovuz atrofida ko'k choy va halva bilan dam olish.",
    hotel: "Rumi Heritage Guesthouse",
  },
  Xiva: {
    morning: "Ichan Qal'a: Kalta Minora va 218 o'yma ustunli Juma masjidi.",
    afternoon: "Tosh Hovli saroyi va loy tandirda non yopayotgan novvoylar.",
    evening: "Ichan Qal'a devorlaridan kechki quyosh botishini tomosha qilish.",
    hotel: "Arkanchi Hotel Xiva",
  },
  Toshkent: {
    morning: "Toshkent metropoliteni (Kosmonavtlar, Alisher Navoiy) va Hazrati Imom majmuasi.",
    afternoon: "Qadimiy Chorsu bozorida ziravor va tandirli somsa.",
    evening: "Toshkent City bog'ida raqs fontanlari yonida sayr.",
    hotel: "Hotel O'zbekiston Classic",
  },
  "Farg'ona": {
    morning: "Farg'ona vodiysi — ipakchilik an'analari va hunarmandchilik bilan tanishish.",
    afternoon: "Rishton kulolchilik ustaxonasi va ko'k-ko'k kanizak buyumlari.",
    evening: "Vodiy bo'ylab sayr, mahalliy oila uyida kechki ovqat.",
    hotel: "Farg'ona Qo'nalgoh",
  },
  Termiz: {
    morning: "Qadimiy Termiz — Budda monastiri (Kara Tepa) va arxeologik muzey.",
    afternoon: "Sulton Saodat maqbarasi va Al-Hakim at-Termiziy ziyoratgohi.",
    evening: "Amudaryo sohilida shom, mahalliy baliqli ovqat.",
    hotel: "Termiz Sharq Mehmonxonasi",
  },
};

function generatePlan(
  destinations: string[],
  startDate: string,
  endDate: string,
  budget: number
): CustomItineraryDay[] {
  if (!startDate || !endDate || destinations.length === 0) return [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
  const days: CustomItineraryDay[] = [];
  const style = budget < 300 ? 'budget' : budget < 800 ? 'standard' : 'luxury';
  const estPerDay = style === 'budget' ? 35 : style === 'standard' ? 75 : 170;

  for (let i = 0; i < totalDays; i++) {
    const destIndex = Math.min(Math.floor((i / totalDays) * destinations.length), destinations.length - 1);
    const city = destinations[destIndex] ?? 'Samarqand';
    const acts = DAILY_ACTIVITIES[city] ?? DAILY_ACTIVITIES['Samarqand'];
    const transport = i > 0 && destinations[destIndex] !== destinations[destIndex - 1 < 0 ? 0 : destIndex - 1]
      ? `${city}ga sayohat`
      : undefined;

    days.push({
      day_number: i + 1,
      city,
      morning: acts.morning,
      afternoon: acts.afternoon,
      evening: acts.evening,
      hotel_suggestion: acts.hotel,
      transport_note: transport,
      est_budget_usd: estPerDay,
    });
  }
  return days;
}

type TravelerType = 'yakka' | 'juft' | 'oila' | 'guruh';
type Interest = 'Tarix' | 'Madaniyat' | 'Tabiat' | 'Gastro' | 'Sarguzasht';

export const SmartPlannerPage: React.FC = () => {
  const { t, showToast, openBookingModal } = useApp();

  const [step, setStep] = useState<number>(1);
  const [travelerType, setTravelerType] = useState<TravelerType>('yakka');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [budget, setBudget] = useState<number>(500);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<CustomItineraryDay[]>([]);

  const TRAVELER_TYPES: { id: TravelerType; label: string; icon: React.ReactNode }[] = [
    { id: 'yakka', label: t('planner_traveler_solo') || 'Yakka', icon: <User className="w-6 h-6" /> },
    { id: 'juft', label: t('planner_traveler_couple') || 'Juft', icon: <Heart className="w-6 h-6" /> },
    { id: 'oila', label: t('planner_traveler_family') || 'Oila', icon: <Users className="w-6 h-6" /> },
    { id: 'guruh', label: t('planner_traveler_group') || 'Guruh', icon: <UserCheck className="w-6 h-6" /> },
  ];

  const INTERESTS: { id: Interest; label: string; icon: React.ReactNode }[] = [
    { id: 'Tarix', label: t('planner_interest_history') || 'Tarix', icon: <Landmark className="w-4 h-4" /> },
    { id: 'Madaniyat', label: t('planner_interest_culture') || 'Madaniyat', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Tabiat', label: t('planner_interest_nature') || 'Tabiat', icon: <Leaf className="w-4 h-4" /> },
    { id: 'Gastro', label: t('planner_interest_food') || 'Gastro', icon: <Utensils className="w-4 h-4" /> },
    { id: 'Sarguzasht', label: t('planner_interest_adventure') || 'Sarguzasht', icon: <Compass className="w-4 h-4" /> },
  ];

  const STEPS = [
    { num: 1, title: t('planner_step_1') || 'Siz haqingizda' },
    { num: 2, title: t('planner_step_2') || "Qayerga?" },
    { num: 3, title: t('planner_step_3') || 'Qachon?' },
    { num: 4, title: t('planner_step_4') || 'Byudjet' },
    { num: 5, title: t('planner_step_5') || 'Reja' },
  ];

  const durationDays: number = (() => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(0, Math.round(diff / 86400000) + 1);
  })();

  const toggleDestination = (d: string) => {
    setDestinations((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const toggleInterest = (i: Interest) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const canProceed = (): boolean => {
    if (step === 1) return true;
    if (step === 2) return destinations.length > 0;
    if (step === 3) return !!startDate && !!endDate && endDate >= startDate;
    if (step === 4) return budget > 0;
    return true;
  };

  const handleNext = () => {
    if (step === 4) {
      const plan = generatePlan(destinations, startDate, endDate, budget);
      setGeneratedPlan(plan);
    }
    if (step < 5) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleBooking = () => {
    openBookingModal({
      itemType: 'tour',
      itemId: `custom-${Date.now()}`,
      itemTitle: `${durationDays}-${t('planner_day_label') || 'kun'} sayohat rejasi`,
      priceUsd: budget,
    });
  };

  const Stepper = () => (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, idx) => {
        const done = step > s.num;
        const active = step === s.num;
        return (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  done
                    ? 'bg-[#124C3A] text-white'
                    : active
                    ? 'bg-[#124C3A] text-white ring-4 ring-[#124C3A]/20'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium hidden sm:block ${
                  active ? 'text-[#124C3A]' : 'text-slate-400'
                }`}
              >
                {s.title}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-14 mx-1 mt-[-12px] ${
                  step > s.num ? 'bg-[#124C3A]' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const StepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900">{STEPS[0].title}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('planner_travel_type') || 'Sayohat turini tanlang'}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TRAVELER_TYPES.map((tt) => (
                <button
                  key={tt.id}
                  type="button"
                  onClick={() => setTravelerType(tt.id)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                    travelerType === tt.id
                      ? 'border-[#124C3A] bg-[#124C3A]/5 text-[#124C3A]'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {tt.icon}
                  <span className="font-heading font-semibold text-sm">{tt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900">{STEPS[1].title}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('planner_select_cities') || "Borishni xohlagan shaharlarni belgilang"}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DESTINATIONS.map((d) => {
                const selected = destinations.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDestination(d)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selected
                        ? 'border-[#124C3A] bg-[#124C3A]/5 text-[#124C3A]'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        selected ? 'bg-[#124C3A] border-[#124C3A]' : 'border-slate-300'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {d}
                  </button>
                );
              })}
            </div>
            {destinations.length === 0 && (
              <p className="text-xs text-amber-600">{t('planner_select_min') || 'Kamida bitta shahar tanlang'}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900">{STEPS[2].title}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('planner_set_dates') || 'Sayohat sanalarini belgilang'}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('planner_start_date') || 'Boshlanish'}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30 focus:border-[#124C3A] transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('planner_end_date') || 'Tugash'}</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30 focus:border-[#124C3A] transition"
                />
              </div>
            </div>
            {durationDays > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#E9DCC5]/50 text-[#124C3A]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold">{durationDays} {t('planner_days_trip') || 'kun sayohat'}</span>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900">{STEPS[3].title}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('planner_set_budget') || "Byudjet va qiziqishlaringizni belgilang"}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-[#C8A66A]" /> {t('planner_budget_label') || 'Byudjet'}
                </span>
                <span className="font-heading font-bold text-[#124C3A] text-lg">${budget}</span>
              </div>
              <input
                type="range"
                min={50}
                max={3000}
                step={50}
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full accent-[#124C3A] cursor-pointer"
              />
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: t('planner_budget_economy') || 'Tejamkor', value: 200 },
                  { label: t('planner_budget_optimal') || 'Optimal', value: 500 },
                  { label: t('planner_budget_premium') || 'Premium', value: 1500 },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setBudget(preset.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                      budget === preset.value
                        ? 'bg-[#124C3A] text-white border-[#124C3A]'
                        : 'border-slate-200 text-slate-600 hover:border-[#124C3A]/40'
                    }`}
                  >
                    {preset.label} ${preset.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">{t('planner_interests') || 'Qiziqishlar'}</span>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const selected = interests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition ${
                        selected
                          ? 'bg-[#124C3A] text-white border-[#124C3A]'
                          : 'border-slate-200 text-slate-600 hover:border-[#124C3A]/40'
                      }`}
                    >
                      {interest.icon}
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-heading font-bold text-slate-900">{STEPS[4].title}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {durationDays} {t('planner_day_label') || 'kun'} · {destinations.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition print:hidden"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C8A66A]" />
                  <span>PDF / Chop etish</span>
                </button>
                <button
                  type="button"
                  onClick={handleBooking}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A66A] text-white font-heading font-semibold text-sm hover:brightness-105 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  {t('planner_booking_request') || 'Bron so\'rovi'}
                </button>
              </div>
            </div>

            {generatedPlan.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>{t('planner_no_plan') || "Reja yaratilmadi. Oldingi bosqichlarga qayting."}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedPlan.map((day) => (
                  <div
                    key={day.day_number}
                    className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-[#C8A66A] transition"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-[#124C3A] text-[#C8A66A] font-heading font-bold text-sm flex items-center justify-center">
                          {day.day_number}
                        </span>
                        <div>
                          <h3 className="font-heading font-semibold text-slate-900">
                            {day.day_number}-{t('planner_day_label') || 'kun'}: {day.city}
                          </h3>
                          <span className="text-xs text-slate-400">
                            ~${day.est_budget_usd}{t('planner_per_day') || '/kun'}
                          </span>
                        </div>
                      </div>
                      {day.transport_note && (
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-[#124C3A] font-medium">
                          {day.transport_note}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {[
                        { icon: <Sun className="w-3.5 h-3.5" />, label: t('planner_morning') || 'Ertalab', text: day.morning },
                        { icon: <Coffee className="w-3.5 h-3.5" />, label: t('planner_afternoon') || 'Tushda', text: day.afternoon },
                        { icon: <Moon className="w-3.5 h-3.5" />, label: t('planner_evening') || 'Kechqurun', text: day.evening },
                      ].map((slot) => (
                        <div key={slot.label} className="p-3 rounded-xl bg-slate-50 space-y-1">
                          <span className="font-semibold text-[#124C3A] flex items-center gap-1 uppercase tracking-wide">
                            {slot.icon} {slot.label}
                          </span>
                          <p className="text-slate-600 leading-relaxed">{slot.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                      <Building className="w-4 h-4 text-[#C8A66A]" />
                      <span>
                        {t('planner_hotel_suggest') || 'Tavsiya'}: <strong>{day.hotel_suggestion}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#124C3A] px-4 py-10 text-center">
        <h1 className="font-heading font-bold text-3xl text-white">{t('planner_hero_title') || 'Aqlli Rejalashtirish'}</h1>
        <p className="text-[#E9DCC5] text-sm mt-2">{t('planner_hero_sub') || "O'zingizga mos sayohat rejasini yarating"}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Stepper />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <StepContent />

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition ${
                step === 1
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> {t('planner_back') || 'Orqaga'}
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-heading font-semibold transition ${
                  canProceed()
                    ? 'bg-[#124C3A] text-white hover:bg-[#0d3a2c]'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {t('planner_next') || 'Davom etish'} <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { showToast(t('planner_saved_toast') || 'Reja muvaffaqiyatli saqlandi!'); }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8A66A] text-white text-sm font-heading font-semibold hover:brightness-105 transition"
              >
                <CheckCircle className="w-4 h-4" /> {t('planner_save_plan') || 'Rejani saqlash'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PartnerForm {
  partnerType: string;
  companyName: string;
  contact: string;
  phone: string;
  email: string;
  description: string;
}

interface MockPartner {
  id: number;
  name: string;
  type: string;
  rating: number;
  status: 'Faol' | 'Tekshirilmoqda';
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PARTNERS: MockPartner[] = [
  { id: 1, name: 'Grand Samarkand Hotel', type: 'Mehmonxona', rating: 4.8, status: 'Faol' },
  { id: 2, name: 'Silk Road Tours', type: 'Tur operator', rating: 4.6, status: 'Faol' },
  { id: 3, name: 'Uzbek Express Transport', type: 'Transport', rating: 4.3, status: 'Faol' },
  { id: 4, name: 'Rustam Qodirov', type: 'Gid', rating: 4.9, status: 'Tekshirilmoqda' },
  { id: 5, name: 'Bukhara Heritage Inn', type: 'Mehmonxona', rating: 4.5, status: 'Faol' },
];

const KPI_CARDS = [
  { label: "Ko'rishlar", value: '1,240', color: 'text-[#124C3A]' },
  { label: 'Bronlar', value: '48', color: 'text-[#C8A66A]' },
  { label: 'Daromad', value: '$2,400', color: 'text-[#124C3A]' },
  { label: 'Reyting', value: '4.8', color: 'text-[#C8A66A]' },
];

const PARTNER_TYPES = ['Mehmonxona', 'Tur operator', 'Transport', 'Gid'];

type Tab = 'register' | 'partners' | 'stats';

const TABS: { key: Tab; label: string }[] = [
  { key: 'register', label: "📋 Ro'yxatdan o'tish" },
  { key: 'partners', label: '✅ Tasdiqlangan hamkorlar' },
  { key: 'stats', label: '📊 Statistika' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const EMPTY_FORM: PartnerForm = {
  partnerType: 'Mehmonxona',
  companyName: '',
  contact: '',
  phone: '',
  email: '',
  description: '',
};

export const PartnerDashboardPage: React.FC = () => {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('register');
  const [form, setForm] = useState<PartnerForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Arizangiz muvaffaqiyatli yuborildi!');
    setTimeout(() => {
      setForm(EMPTY_FORM);
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Page header */}
      <div
        className="w-full py-10 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #124C3A 0%, #1a6b51 100%)' }}
      >
        <h1 className="font-heading text-3xl font-bold text-white">
          Hamkor paneli
        </h1>
        <p className="text-[#E9DCC5] text-sm mt-1">
          Susambil hamkorlik tizimiga xush kelibsiz
        </p>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-5 py-3.5 text-sm font-medium transition border-l-4 ${
                  activeTab === tab.key
                    ? 'border-[#124C3A] bg-[#124C3A]/5 text-[#124C3A]'
                    : 'border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* ── Tab 1: Registration form ── */}
          {activeTab === 'register' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="font-heading text-xl font-bold text-[#124C3A] mb-6">
                Hamkor sifatida ro'yxatdan o'tish
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Partner type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Hamkor turi
                  </label>
                  <select
                    name="partnerType"
                    value={form.partnerType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm"
                  >
                    {PARTNER_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kompaniya nomi
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Kompaniya nomini kiriting"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm"
                  />
                </div>

                {/* Contact person */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mas'ul shaxs
                  </label>
                  <input
                    type="text"
                    name="contact"
                    required
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="To'liq ism"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm"
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+998 90 000 00 00"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="info@company.uz"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tavsif
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Kompaniyangiz haqida qisqacha ma'lumot..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-3 rounded-xl bg-[#124C3A] hover:bg-[#0e3d2d] text-white font-heading font-semibold text-sm transition disabled:opacity-60"
                >
                  {submitted ? '✓ Ariza yuborildi' : 'Ariza yuborish'}
                </button>
              </form>
            </div>
          )}

          {/* ── Tab 2: Verified partners ── */}
          {activeTab === 'partners' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="font-heading text-xl font-bold text-[#124C3A] mb-6">
                Tasdiqlangan hamkorlar
              </h2>
              <div className="space-y-3">
                {MOCK_PARTNERS.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-[#FAF7F2]"
                  >
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {partner.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#124C3A]/10 text-[#124C3A] text-xs font-medium">
                          {partner.type}
                        </span>
                        <span className="text-xs text-[#C8A66A] font-semibold">
                          ★ {partner.rating}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        partner.status === 'Faol'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {partner.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab 3: Stats ── */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="font-heading text-xl font-bold text-[#124C3A] mb-6">
                Statistika
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {KPI_CARDS.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center"
                  >
                    <div
                      className={`font-heading text-3xl font-bold ${kpi.color} mb-1`}
                    >
                      {kpi.value}
                    </div>
                    <div className="text-sm text-slate-500">{kpi.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

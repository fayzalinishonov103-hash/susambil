import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  MapPin,
  Plus,
  Compass,
  Check,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { Destination, Guide, DestinationRegion } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { 
    bookings, 
    updateBookingStatus, 
    formatPrice, 
    currentUser, 
    loginAdmin, 
    destinations, 
    addDestination, 
    guides, 
    updateGuideStatus, 
    addGuide,
    showToast 
  } = useApp();

  // If user is not admin, show Admin Login Gate
  const [adminInputUser, setAdminInputUser] = useState('');
  const [adminInputPass, setAdminInputPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Admin Tab Navigation
  const [activeTab, setActiveTab] = useState<'kpi' | 'bookings' | 'guides' | 'destinations'>('kpi');

  // New Destination Form State
  const [newDestNameUz, setNewDestNameUz] = useState('');
  const [newDestNameEn, setNewDestNameEn] = useState('');
  const [newDestRegion, setNewDestRegion] = useState<DestinationRegion>('silk_road');
  const [newDestTaglineUz, setNewDestTaglineUz] = useState('');
  const [newDestDescUz, setNewDestDescUz] = useState('');
  const [newDestImg, setNewDestImg] = useState('');
  const [newDestCost, setNewDestCost] = useState('50');
  const [newDestMustSee, setNewDestMustSee] = useState('');
  const [showDestForm, setShowDestForm] = useState(false);

  // New Guide Form State
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [newGuideName, setNewGuideName] = useState('');
  const [newGuideCity, setNewGuideCity] = useState('Samarqand');
  const [newGuideLangs, setNewGuideLangs] = useState('Uzbek, English, Russian');
  const [newGuideRate, setNewGuideRate] = useState('45');
  const [newGuidePhone, setNewGuidePhone] = useState('+998 90 ');
  const [newGuidePhoto, setNewGuidePhoto] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

  const isAdmin = currentUser?.role === 'admin';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(adminInputUser, adminInputPass);
  };

  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestNameUz || !newDestImg) {
      showToast('Iltimos, manzil nomi va rasm URL manzilini kiriting!');
      return;
    }

    const mustSeeList = newDestMustSee 
      ? newDestMustSee.split(',').map(s => s.trim()) 
      : ['Tarixiy obidalar', 'Mahalliy bozor'];

    const newDest: Destination = {
      id: 'dest-' + Date.now(),
      slug: newDestNameUz.toLowerCase().replace(/\s+/g, '-'),
      name: {
        uz: newDestNameUz,
        en: newDestNameEn || newDestNameUz,
        ru: newDestNameUz,
      },
      region: newDestRegion,
      tagline: {
        uz: newDestTaglineUz || 'Go‘zal O‘zbekiston maskani',
        en: 'Scenic destination in Uzbekistan',
      },
      description: {
        uz: newDestDescUz || 'Betakror tarix va boy madaniyatga ega ajoyib turistik manzil.',
        en: 'A wonderful heritage destination in Uzbekistan.',
      },
      image_url: newDestImg,
      gallery: [newDestImg],
      best_season: 'Yil bo‘yi',
      must_see: {
        uz: mustSeeList,
        en: mustSeeList,
      },
      local_food: {
        uz: ['Milliy osh', 'Somsa'],
        en: ['Local Plov', 'Somsa'],
      },
      estimated_daily_cost_usd: Number(newDestCost) || 50,
      latitude: 41.0,
      longitude: 69.0,
    };

    addDestination(newDest);
    setShowDestForm(false);
    setNewDestNameUz('');
    setNewDestNameEn('');
    setNewDestDescUz('');
    setNewDestImg('');
    setNewDestMustSee('');
  };

  const handleAddGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideName) return;

    const newG: Guide = {
      id: 'guide-' + Date.now(),
      name: newGuideName,
      city: newGuideCity,
      photo_url: newGuidePhoto,
      languages: newGuideLangs.split(',').map(l => l.trim()),
      experience_years: 5,
      daily_rate_usd: Number(newGuideRate) || 40,
      rating: 5.0,
      reviews_count: 1,
      specialization: ['Tarix', 'Madaniyat'],
      bio: {
        uz: 'Professional ekskursiyachi va sertifikatlangan mahalliy gid.',
        en: 'Certified local professional tour guide.',
      },
      is_verified: true,
      status: 'approved',
      phone: newGuidePhone,
    };

    addGuide(newG);
    setShowGuideForm(false);
    setNewGuideName('');
  };

  // If NOT ADMIN -> Show Secure Login Gate
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAF8F5]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#124C3A] text-[#C8A66A] flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-heading font-black text-2xl text-slate-900">
              Susambil Admin Konsoli
            </h1>
            <p className="text-xs text-slate-500">
              Faqat rasmiy ma’murlar uchun himoyalangan boshqaruv paneli
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Admin Login</label>
              <input
                type="text"
                required
                placeholder="Loginni kiriting"
                value={adminInputUser}
                onChange={(e) => setAdminInputUser(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Admin Parol</label>
              <div className="relative">
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={adminInputPass}
                  onChange={(e) => setAdminInputPass(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#124C3A] hover:bg-[#0e3b2d] text-white font-heading font-bold text-xs shadow-md transition"
            >
              Konsolga kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN IS AUTHENTICATED
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const totalVolumeUsd = bookings.reduce((acc, b) => acc + b.total_price_usd, 0);
  const pendingGuides = guides.filter(g => g.status === 'pending' || !g.is_verified);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#124C3A] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#C8A66A]" />
            <span>Rasmiy Boshqaruv Markazi</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
            Susambil Admin Paneli
          </h1>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'kpi' ? 'bg-[#124C3A] text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Statistika
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3.5 py-2 rounded-xl transition relative ${
              activeTab === 'bookings' ? 'bg-[#124C3A] text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Buyurtmalar
            {pendingBookings.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">
                {pendingBookings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-3.5 py-2 rounded-xl transition relative ${
              activeTab === 'guides' ? 'bg-[#124C3A] text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Gidlarni tasdiqlash
            {pendingGuides.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {pendingGuides.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'destinations' ? 'bg-[#124C3A] text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Joylar qo‘shish
          </button>
        </div>
      </div>

      {/* 1. KPI TAB */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Jami buyurtmalar</span>
              <div className="text-2xl font-heading font-black text-slate-900 mt-1">{bookings.length}</div>
              <span className="text-[11px] text-amber-600 font-semibold">{pendingBookings.length} ta kutilmoqda</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Umumiy hajm</span>
              <div className="text-2xl font-heading font-black text-emerald-700 mt-1">{formatPrice(totalVolumeUsd)}</div>
              <span className="text-[11px] text-slate-400">Platforma aylanmasi</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Faol Gidlar</span>
              <div className="text-2xl font-heading font-black text-[#124C3A] mt-1">{guides.length}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Barchasi litsenziyalangan</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Sayyohlik manzillari</span>
              <div className="text-2xl font-heading font-black text-[#C8A66A] mt-1">{destinations.length}</div>
              <span className="text-[11px] text-slate-400">O‘zbekiston hududlari</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Foydalanuvchilar Buyurtmalari ({bookings.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Xizmat turi</th>
                  <th className="py-3 px-4">Mijoz</th>
                  <th className="py-3 px-4">Sana</th>
                  <th className="py-3 px-4">Narxi</th>
                  <th className="py-3 px-4">Holati</th>
                  <th className="py-3 px-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div>{b.item_title}</div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{b.item_type}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{b.customer_name}</div>
                      <div className="text-[11px] text-slate-400">{b.customer_phone || b.customer_email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{b.start_date}</div>
                      <div className="text-[10px] text-slate-400">{b.guests_count} kishi</div>
                    </td>
                    <td className="py-3.5 px-4 font-heading font-bold text-[#124C3A]">
                      {formatPrice(b.total_price_usd)}
                    </td>
                    <td className="py-3.5 px-4">
                      {b.status === 'confirmed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          <Check className="w-3 h-3" /> Tasdiqlangan
                        </span>
                      ) : b.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                          <Clock className="w-3 h-3" /> Kutilmoqda
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                          <XCircle className="w-3 h-3" /> Bekor qilingan
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {b.status !== 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-[#124C3A] text-white text-[11px] font-bold hover:bg-[#0e3b2d] transition"
                        >
                          Tasdiqlash
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-bold hover:bg-rose-100 transition"
                        >
                          Bekor
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. GUIDES VERIFICATION TAB */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Gidlar Ma’lumotlar Bazasi va Tasdiqlash
              </h2>
              <p className="text-xs text-slate-500">
                Litsenziyaga ega gidlarni tekshirish va tizimda tasdiqlash
              </p>
            </div>
            <button
              onClick={() => setShowGuideForm(!showGuideForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#124C3A] text-white text-xs font-bold hover:bg-[#0e3b2d] transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Gid Qo‘shish</span>
            </button>
          </div>

          {/* New Guide Form */}
          {showGuideForm && (
            <form onSubmit={handleAddGuide} className="bg-white p-6 rounded-3xl border border-[#C8A66A]/40 shadow-md space-y-4 animate-fade-in">
              <h3 className="font-heading font-bold text-sm text-[#124C3A]">Yangi Gid Qo‘shish Formasi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gid Ismi-Familiyasi</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Anvar Qodirov"
                    value={newGuideName}
                    onChange={(e) => setNewGuideName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Shahar</label>
                  <select
                    value={newGuideCity}
                    onChange={(e) => setNewGuideCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Samarqand">Samarqand</option>
                    <option value="Buxoro">Buxoro</option>
                    <option value="Xiva">Xiva</option>
                    <option value="Toshkent">Toshkent</option>
                    <option value="Farg‘ona">Farg‘ona</option>
                    <option value="Termiz">Termiz</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tillar (vergul bilan)</label>
                  <input
                    type="text"
                    value={newGuideLangs}
                    onChange={(e) => setNewGuideLangs(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kunlik narxi ($)</label>
                  <input
                    type="number"
                    value={newGuideRate}
                    onChange={(e) => setNewGuideRate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefon raqam</label>
                  <input
                    type="text"
                    value={newGuidePhone}
                    onChange={(e) => setNewGuidePhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rasm URL</label>
                  <input
                    type="text"
                    value={newGuidePhoto}
                    onChange={(e) => setNewGuidePhoto(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGuideForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#124C3A] text-white text-xs font-bold hover:bg-[#0e3b2d]"
                >
                  Saqlash va Tasdiqlash
                </button>
              </div>
            </form>
          )}

          {/* Guides Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={guide.photo_url}
                    alt={guide.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-bold text-sm text-slate-900 truncate">
                        {guide.name}
                      </h3>
                      {guide.is_verified && (
                        <span title="Tasdiqlangan">
                          <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100 flex-shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#124C3A] font-semibold">{guide.city}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {guide.languages.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <span className="font-bold text-[#C8A66A]">${guide.daily_rate_usd} / kun</span>
                  <div className="flex items-center gap-1.5">
                    {guide.is_verified ? (
                      <button
                        onClick={() => updateGuideStatus(guide.id, 'suspended', false)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-semibold hover:bg-rose-100 transition"
                      >
                        To‘xtatish
                      </button>
                    ) : (
                      <button
                        onClick={() => updateGuideStatus(guide.id, 'approved', true)}
                        className="px-3 py-1 rounded-lg bg-[#124C3A] text-white text-[11px] font-bold hover:bg-[#0e3b2d] transition"
                      >
                        Tasdiqlash
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DESTINATIONS MANAGEMENT TAB */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Joylar va Lokatsiyalarni Boshqarish
              </h2>
              <p className="text-xs text-slate-500">
                O‘zbekiston xaritasi va ro‘yxatiga yangi qadimiy yoki yashirin joylarni qo‘shish
              </p>
            </div>
            <button
              onClick={() => setShowDestForm(!showDestForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#124C3A] text-white text-xs font-bold hover:bg-[#0e3b2d] transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Joy Qo‘shish</span>
            </button>
          </div>

          {/* New Destination Form */}
          {showDestForm && (
            <form onSubmit={handleAddDestination} className="bg-white p-6 rounded-3xl border border-[#C8A66A]/40 shadow-md space-y-4 animate-fade-in">
              <h3 className="font-heading font-bold text-sm text-[#124C3A]">
                Yangi Turistik Manzil Ma’lumotlari
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Manzil Nomi (O‘zbekcha)</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Shahrisabz Oqsaroy"
                    value={newDestNameUz}
                    onChange={(e) => setNewDestNameUz(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Manzil Nomi (English)</label>
                  <input
                    type="text"
                    placeholder="Shakhrisabz Ak-Saray"
                    value={newDestNameEn}
                    onChange={(e) => setNewDestNameEn(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mintaqa / Hudud</label>
                  <select
                    value={newDestRegion}
                    onChange={(e) => setNewDestRegion(e.target.value as DestinationRegion)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="silk_road">Ipak Yo‘li (Samarqand, Buxoro, Xiva)</option>
                    <option value="mountains">Tog‘lar (Zomin, Chimyon, Boysun)</option>
                    <option value="oasis">Voha (Toshkent, Qarshi)</option>
                    <option value="hidden_valley">Yashirin Vodiy (Farg‘ona, Namangan)</option>
                    <option value="desert">Sahro va Kanyonlar (Mo‘ynoq, Qizilqum)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Qisqa shior / Tagline</label>
                  <input
                    type="text"
                    placeholder="Amir Temur tug‘ilgan zamin"
                    value={newDestTaglineUz}
                    onChange={(e) => setNewDestTaglineUz(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kunlik taxminiy xarajat ($)</label>
                  <input
                    type="number"
                    value={newDestCost}
                    onChange={(e) => setNewDestCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rasm URL manzili</label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newDestImg}
                    onChange={(e) => setNewDestImg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">Must-See Obidalar (vergul bilan ajrating)</label>
                  <input
                    type="text"
                    placeholder="Oqsaroy, Dorut Tilovat, Ko‘k Gumbaz"
                    value={newDestMustSee}
                    onChange={(e) => setNewDestMustSee(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">To‘liq Tavsifi</label>
                  <textarea
                    rows={3}
                    placeholder="Manzil haqida batafsil qiziqarli ma’lumot..."
                    value={newDestDescUz}
                    onChange={(e) => setNewDestDescUz(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDestForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#124C3A] text-white text-xs font-bold hover:bg-[#0e3b2d]"
                >
                  Saqlash va Saytga Chiqarish
                </button>
              </div>
            </form>
          )}

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div key={dest.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
                <div className="relative h-44">
                  <img
                    src={dest.image_url}
                    alt={dest.name.uz}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#124C3A] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {dest.region}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900">{dest.name.uz}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{dest.description.uz}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                    <span className="font-bold text-[#C8A66A]">${dest.estimated_daily_cost_usd} / kun</span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                      Faol ro‘yxatda
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

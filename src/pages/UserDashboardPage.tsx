import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DESTINATIONS, ACCOMMODATIONS, TOURS } from '../data/mockData';
import { 
  User, 
  Calendar, 
  Heart, 
  Bookmark, 
  Clock, 
  CheckCircle, 
  Shield, 
  ShieldCheck, 
  Lock, 
  Key, 
  Smartphone, 
  Globe, 
  LogOut, 
  Trash2, 
  Settings,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  QrCode
} from 'lucide-react';
import { UserRole, BookingRequest } from '../types';
import { ETicketModal } from '../components/modals/ETicketModal';

export const UserDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    updateBookingStatus,
    favorites, 
    savedItineraries, 
    toggleFavorite, 
    formatPrice, 
    setCurrentPage, 
    switchRole,
    updateUserProfile,
    showToast,
    language,
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'itineraries' | 'security' | 'profile'>('bookings');
  const [selectedTicketBooking, setSelectedTicketBooking] = useState<BookingRequest | null>(null);

  // Profile Edit States
  const [editName, setEditName] = useState(currentUser?.full_name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+998 90 123-45-67');
  const [editCountry, setEditCountry] = useState(currentUser?.country || 'O\'zbekiston');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80');

  // Security States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'Windows 11 • Chrome 132',
      location: 'Toshkent, O\'zbekiston',
      ip: '178.218.201.45',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'Apple iPhone 15 • Safari Mobile',
      location: 'Samarqand, O\'zbekiston',
      ip: '84.54.120.18',
      lastActive: '2h ago',
      isCurrent: false,
    }
  ]);

  const favDestinations = DESTINATIONS.filter(d => favorites.includes(d.id));
  const favHotels = ACCOMMODATIONS.filter(h => favorites.includes(h.id));

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      showToast(t('dashboard_password_hint') || 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak!');
      return;
    }
    showToast(t('dashboard_save_password') || 'Xavfsizlik paroli muvaffaqiyatli yangilandi!');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast(t('dashboard_revoke') || 'Sessiya bekor qilindi!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Sidebar */}
        <aside className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
          {/* User Profile Summary */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-slate-100">
            <div className="relative">
              <img
                src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={currentUser?.full_name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#124C3A]/20"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-bold text-base text-slate-900 truncate">
                {currentUser?.full_name}
              </h2>
              <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-[#124C3A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A66A]" />
                <span className="capitalize">{currentUser?.role}</span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {[
              { id: 'bookings', label: t('dashboard_bookings'), icon: Calendar, badge: bookings.length },
              { id: 'favorites', label: t('dashboard_favorites'), icon: Heart, badge: favorites.length },
              { id: 'itineraries', label: t('dashboard_itineraries'), icon: Bookmark, badge: savedItineraries.length },
              { id: 'security', label: t('dashboard_security'), icon: Shield, badge: '2FA' },
              { id: 'profile', label: t('dashboard_profile'), icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-[#124C3A] text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8A66A]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Role Switcher */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {t('dashboard_role_switch') || "Sinov uchun rol o'zgartirish:"}
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {(['traveler', 'guide', 'partner', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`py-1.5 px-2 rounded-xl text-center capitalize font-semibold transition ${
                    currentUser?.role === r
                      ? 'bg-[#124C3A]/10 text-[#124C3A] border border-[#124C3A]/30 font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Content */}
        <main className="lg:col-span-8 space-y-6">
          
          {/* TAB: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="font-heading font-black text-xl text-slate-900">
                    {t('dashboard_my_bookings') || 'Mening Buyurtmalarim'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t('dashboard_bookings_desc') || "Siz band qilgan poyezdlar, mehmonxonalar va turlar holati."}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {bookings.length} {t('dashboard_orders') || 'ta buyurtma'}
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-slate-200 space-y-3">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold">{t('dashboard_no_bookings') || "Hozircha buyurtmalar yo'q."}</p>
                  <button
                    onClick={() => setCurrentPage('destinations')}
                    className="px-4 py-2 rounded-xl bg-[#124C3A] text-white text-xs font-bold"
                  >
                    {t('dashboard_choose_trip') || 'Sayohatni tanlash'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400">#{booking.id}</span>
                          {booking.status === 'confirmed' ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>{t('dashboard_confirmed') || 'Tasdiqlangan'}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{t('dashboard_pending') || 'Kutilmoqda'}</span>
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-bold text-base text-slate-900">{booking.item_title}</h3>
                        <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                          <span>{t('dashboard_date') || 'Sana'}: <strong>{booking.start_date}</strong></span>
                          <span>{t('dashboard_guests') || 'Sayyoh'}: <strong>{booking.guests_count} {t('dashboard_persons') || 'kishi'}</strong></span>
                        </div>
                      </div>
                      <div className="text-right border-t sm:border-t-0 pt-2 sm:pt-0 flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 block uppercase">{t('dashboard_price') || 'Qiymati'}</span>
                        <span className="font-heading font-black text-xl text-[#124C3A]">
                          {formatPrice(booking.total_price_usd)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedTicketBooking(booking)}
                          className="mt-2.5 px-3 py-1.5 rounded-xl bg-[#124C3A] hover:bg-[#165743] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#C8A66A]" />
                          <span>E-Chipta & Vaucher</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="font-heading font-black text-xl text-slate-900">
                    {t('dashboard_saved_title') || 'Saqlangan Sevimlilar'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t('dashboard_saved_desc') || "Sizga yoqqan shaharlar, mehmonxonalar va turlar."}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {favorites.length} {t('dashboard_saved') || 'ta saqlangan'}
                </span>
              </div>

              {favorites.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-slate-200">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold">{t('dashboard_no_saved') || "Hech narsa saqlanmagan."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favDestinations.map(d => (
                    <div key={d.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                      <img src={d.image_url} alt={d.name[language]} className="w-full h-36 object-cover" />
                      <div className="p-3.5 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{d.name[language]}</div>
                          <span className="text-xs text-slate-400">{d.region}</span>
                        </div>
                        <button onClick={() => toggleFavorite(d.id)} className="text-rose-500 p-1">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {favHotels.map(h => (
                    <div key={h.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                      <img src={h.image_url} alt={h.name[language]} className="w-full h-36 object-cover" />
                      <div className="p-3.5 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{h.name[language]}</div>
                          <span className="text-xs text-slate-400">{h.city}</span>
                        </div>
                        <button onClick={() => toggleFavorite(h.id)} className="text-rose-500 p-1">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ITINERARIES */}
          {activeTab === 'itineraries' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="font-heading font-black text-xl text-slate-900">
                    {t('dashboard_itineraries_title') || 'Smart Planner Marshrutlari'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t('dashboard_itineraries_desc') || "Siz uchun yaratilgan shaxsiy kunma-kun sayohat rejalari."}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage('planner')}
                  className="px-3 py-1.5 rounded-xl bg-[#124C3A] text-white text-xs font-bold"
                >
                  {t('dashboard_new_plan') || '+ Yangi reja'}
                </button>
              </div>

              {savedItineraries.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-slate-200 space-y-3">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold">{t('dashboard_no_itineraries') || "Saqlangan marshrutlar yo'q."}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedItineraries.map((itin) => (
                    <div key={itin.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-heading font-bold text-slate-900 text-base">{itin.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {itin.days?.map(d => d.city).join(' → ') || 'O\'zbekiston'} • {itin.duration_days} {t('planner_day_label') || 'kunlik'}
                          </p>
                        </div>
                        <span className="font-heading font-black text-lg text-[#124C3A]">
                          {formatPrice(itin.total_cost_usd || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('dashboard_security_title') || 'Kuchaytirilgan Xavfsizlik Markazi'}</span>
                </div>
                <h2 className="font-heading font-black text-2xl text-slate-900 mt-1">
                  {t('dashboard_security_heading') || "Hisobingiz va Shaxsiy Ma'lumotlar Himoyasi"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('dashboard_security_desc') || "Ikki bosqichli autentifikatsiya, faol sessiyalar va shifrlash nazorati."}
                </p>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">{t('dashboard_protection_level') || 'Himoya darajasi: Yuqori (98%)'}</span>
                  <span>{t('dashboard_protection_desc') || "Hisobingiz 256-bitli SSL shifrlash va 2FA himoyasi ostida."}</span>
                </div>
              </div>

              {/* 2FA Toggle */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#124C3A]" />
                    <span className="font-bold text-sm text-slate-900">{t('dashboard_2fa') || 'Ikki Bosqichli Himoya (2FA)'}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t('dashboard_2fa_desc') || "Har safar yangi qurilmadan kirganda telefoningizga tasdiqlash kodi so'raladi."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(twoFactorEnabled ? '2FA off' : '2FA on');
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    twoFactorEnabled ? 'bg-[#124C3A]' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#124C3A]" />
                    <span className="font-bold text-sm text-slate-900">{t('dashboard_active_sessions') || 'Faol Qurilmalar va Sessiyalar'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {activeSessions.length} {t('dashboard_active_devices') || 'ta faol qurilma'}
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  {activeSessions.map((sess) => (
                    <div key={sess.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <span>{sess.device}</span>
                          {sess.isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {t('dashboard_current') || 'Joriy'}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {sess.location} • IP: {sess.ip}
                        </div>
                        <div className="text-[10px] text-slate-400">{sess.lastActive}</div>
                      </div>
                      {!sess.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(sess.id)}
                          className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>{t('dashboard_revoke') || 'Chiqarish'}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Password Change */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#124C3A]" />
                  <span className="font-bold text-sm text-slate-900">{t('dashboard_password_update') || 'Parolni Yangilash'}</span>
                </div>
                <form onSubmit={handlePasswordUpdate} className="space-y-3 text-xs max-w-md">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{t('dashboard_current_password') || 'Amaldagi parol'}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{t('dashboard_new_password') || 'Yangi mustahkam parol'}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('dashboard_password_hint') || 'Kamida 8 ta belgi'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#124C3A] text-white font-bold text-xs hover:bg-[#165743] transition"
                  >
                    {t('dashboard_save_password') || 'Parolni saqlash'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-xl space-y-6 text-xs animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-heading font-bold text-base text-slate-900">
                    {t('dashboard_profile_title') || "Shaxsiy Ma'lumotlarni Tahrirlash"}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {t('dashboard_profile_desc') || "Ism, aloqa vositalari va bio ma'lumotlaringizni yangilang"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#124C3A]/20">
                  <img src={editAvatar} alt={editName} className="w-full h-full object-cover" />
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUserProfile({
                    full_name: editName,
                    email: editEmail,
                    phone: editPhone,
                    country: editCountry,
                    bio: editBio,
                    avatar_url: editAvatar,
                  });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{t('dashboard_full_name') || "To'liq Ism"}</label>
                    <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{t('dashboard_email') || 'Email'}</label>
                    <input type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{t('dashboard_phone') || 'Telefon'}</label>
                    <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{t('dashboard_country') || 'Mamlakat / Shahar'}</label>
                    <input type="text" value={editCountry} onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('dashboard_avatar') || 'Avatar URL'}</label>
                  <input type="text" value={editAvatar} onChange={(e) => setEditAvatar(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30" />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('dashboard_bio') || "O'zingiz haqingizda (Bio)"}</label>
                  <textarea rows={3} value={editBio} onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30" />
                </div>

                <div className="pt-2">
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#124C3A] hover:bg-[#0e3b2d] text-white font-heading font-bold text-xs shadow-md transition">
                    {t('dashboard_save') || "O'zgarishlarni Saqlash"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Official E-Ticket & Voucher Modal */}
      <ETicketModal
        booking={selectedTicketBooking}
        isOpen={!!selectedTicketBooking}
        onClose={() => setSelectedTicketBooking(null)}
        onPaid={(id) => {
          updateBookingStatus(id, 'confirmed');
          if (selectedTicketBooking) {
            setSelectedTicketBooking({ ...selectedTicketBooking, status: 'confirmed' });
          }
        }}
      />
    </div>
  );
};

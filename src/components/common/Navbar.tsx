import React, { useState } from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import { 
  Compass, 
  Globe, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  ChevronDown,
  DollarSign,
  PhoneCall
} from 'lucide-react';
import { Language, Currency } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    currency,
    setCurrency,
    currentPage, 
    setCurrentPage, 
    currentUser, 
    logout,
    openAuthModal,
    t 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [currDropdown, setCurrDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const navLinks: { id: AppPage; label: string }[] = [
    { id: 'home', label: t('nav_home') || 'Bosh sahifa' },
    { id: 'destinations', label: t('nav_destinations') || 'Yo‘nalishlar' },
    { id: 'transport', label: t('nav_transport') || 'Transport' },
    { id: 'hotels', label: t('nav_hotels') || 'Mehmonxonalar' },
    { id: 'tours', label: t('nav_tours') || 'Turlar' },
    { id: 'guides', label: t('nav_guides') || 'Gidlar' },
    { id: 'planner', label: t('nav_planner') || 'Smart Planner' },
  ];

  const handleNav = (page: AppPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setUserDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      {/* Top Emergency & Assistance Bar */}
      <div className="bg-[#0c3327] text-[#E9DCC5] py-1.5 px-4 text-[11px] font-medium border-b border-[#C8A66A]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">
              {t('emergency_title') || 'Sayyohlar xavfsizligi: 1173 (Turizm politsiyasi) • 103 (Tez yordam)'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[#E9DCC5]/80">
            <span>Toshkent: +998 71 200-00-88</span>
            <button
              onClick={() => openAuthModal({ tab: 'admin' })}
              className="text-[#C8A66A] hover:underline flex items-center gap-1 font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin kirish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#124C3A]/95 backdrop-blur-md text-white border-b border-[#C8A66A]/20 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#C8A66A] flex items-center justify-center text-[#124C3A] font-black shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[2.4]" />
            </div>
            <span className="font-heading font-black text-xl tracking-wider text-white">
              SUSAMBIL
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold tracking-wide">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'text-white bg-white/10 font-bold'
                      : 'text-[#E9DCC5]/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrDropdown(!currDropdown);
                  setLangDropdown(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-[#E9DCC5] transition"
                title="Valyutani tanlash"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-[#C8A66A]" />
              </button>

              {currDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-28 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1 z-50 text-xs font-semibold"
                  onMouseLeave={() => setCurrDropdown(false)}
                >
                  {(['USD', 'UZS', 'EUR'] as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setCurrDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 transition flex items-center justify-between ${
                        currency === curr ? 'font-bold text-[#124C3A]' : 'text-slate-600'
                      }`}
                    >
                      <span>{curr}</span>
                      <span className="text-[10px] text-slate-400">
                        {curr === 'USD' ? '$' : curr === 'UZS' ? 'so‘m' : '€'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 15-Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdown(!langDropdown);
                  setCurrDropdown(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-[#E9DCC5] transition"
              >
                <span>{currentLangMeta.flag}</span>
                <span className="uppercase">{currentLangMeta.code}</span>
                <ChevronDown className="w-3 h-3 text-[#C8A66A]" />
              </button>

              {langDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 text-xs max-h-80 overflow-y-auto"
                  onMouseLeave={() => setLangDropdown(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    15 ta Tilni Tanlang
                  </div>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 hover:bg-emerald-50 transition flex items-center justify-between ${
                        language === l.code ? 'font-bold text-[#124C3A] bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </span>
                      <span className="text-[10px] uppercase text-slate-400">{l.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth State Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition border border-white/10"
                >
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser.full_name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="max-w-[100px] truncate">{currentUser.full_name}</span>
                  <ChevronDown className="w-3 h-3 text-[#C8A66A]" />
                </button>

                {userDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-semibold"
                    onMouseLeave={() => setUserDropdown(false)}
                  >
                    <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1">
                      <div className="font-bold text-slate-900 truncate">{currentUser.full_name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-[#124C3A] text-[10px] font-bold capitalize">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 transition flex items-center gap-2 text-slate-700"
                    >
                      <User className="w-3.5 h-3.5 text-[#124C3A]" />
                      <span>Shaxsiy Kabinet</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 transition flex items-center gap-2 text-[#C8A66A] font-bold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Boshqaruv</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 transition flex items-center gap-2 text-rose-600"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Chiqish</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal({ tab: 'login' })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8A66A] hover:bg-[#b89559] text-slate-900 text-xs font-heading font-bold shadow-sm transition"
              >
                <User className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Kirish / Ro‘yxat</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => openAuthModal({ tab: 'login' })}
              className="p-2 rounded-lg bg-white/10 text-xs text-white"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#124C3A] border-t border-white/10 p-4 space-y-3 animate-fade-in">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                    currentPage === link.id
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-[#E9DCC5]/80 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              {/* Language Picker on Mobile */}
              <div className="flex flex-wrap gap-1">
                {SUPPORTED_LANGUAGES.slice(0, 6).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2 py-1 rounded text-xs ${
                      language === l.code ? 'bg-[#C8A66A] text-slate-900 font-bold' : 'bg-white/5 text-white'
                    }`}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    closeAuthModal, 
    authModalPrompt, 
    authModalTab, 
    login, 
    loginAdmin, 
    registerUser,
    switchRole,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>(authModalTab || 'login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+998 ');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('traveler');
  const [showPassword, setShowPassword] = useState(false);

  // Admin state
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  if (!authModalOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, text: 'Juda zaif', color: 'bg-rose-500' };
    if (pass.length < 8) return { score: 2, text: 'O‘rtacha', color: 'bg-amber-500' };
    const hasNum = /\d/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    if (hasNum && hasUpper) return { score: 3, text: 'Kuchli parol', color: 'bg-emerald-500' };
    return { score: 2, text: 'Yaxshi', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(regPassword);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    login(loginEmail);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    registerUser({
      full_name: regName,
      email: regEmail,
      phone: regPhone,
      role: regRole,
    });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(adminUser, adminPass);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={closeAuthModal}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#124C3A] to-[#1c6c53] p-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C8A66A] flex items-center justify-center text-[#124C3A]">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base">SUSAMBIL</h3>
              <p className="text-[11px] text-[#E9DCC5]/80">
                {t('auth_secure_system') || 'Xavfsiz avtorizatsiya tizimi'}
              </p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Prompt Banner (if triggered by Booking) */}
        {authModalPrompt && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-3 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{authModalPrompt}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'login'
                ? 'bg-white text-[#124C3A] font-bold border-b-2 border-[#124C3A]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('auth_tab_login') || 'Kirish'}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'register'
                ? 'bg-white text-[#124C3A] font-bold border-b-2 border-[#124C3A]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('auth_tab_register') || 'Ro‘yxatdan o‘tish'}
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 text-center transition flex items-center justify-center gap-1 ${
              activeTab === 'admin'
                ? 'bg-white text-[#C8A66A] font-bold border-b-2 border-[#C8A66A]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('auth_tab_admin') || 'Admin'}</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 1. LOGIN TAB */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('auth_email_phone') || 'Email yoki Telefon'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="example@mail.uz"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('auth_password') || 'Parol'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#124C3A] hover:bg-[#0e3b2d] text-white font-heading font-semibold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>{t('auth_login_btn') || 'Tizimga kirish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Accounts */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                  Tezkor kirish (Demo akkauntlar):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => switchRole('traveler')}
                    className="p-2 rounded-xl border border-slate-200 hover:border-[#124C3A] text-slate-700 text-[11px] font-medium text-center transition hover:bg-slate-50"
                  >
                    {t('auth_traveler') || 'Sayohatchi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole('guide')}
                    className="p-2 rounded-xl border border-slate-200 hover:border-[#124C3A] text-slate-700 text-[11px] font-medium text-center transition hover:bg-slate-50"
                  >
                    {t('auth_guide') || 'Gid'}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole('partner')}
                    className="p-2 rounded-xl border border-slate-200 hover:border-[#124C3A] text-slate-700 text-[11px] font-medium text-center transition hover:bg-slate-50"
                  >
                    {t('auth_partner') || 'Hamkor'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 2. REGISTER TAB */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('auth_full_name') || 'To‘liq ismingiz'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Alisher Navoiy"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('dashboard_email') || 'Email manzil'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="alisher@mail.uz"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('dashboard_phone') || 'Telefon raqam'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('auth_password') || 'Parol'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={t('dashboard_password_hint') || "Kamida 8 ta belgi"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#124C3A]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regPassword && (
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <div className="flex gap-1 flex-1 max-w-[140px]">
                      <div className={`h-1 flex-1 rounded ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                      <div className={`h-1 flex-1 rounded ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                      <div className={`h-1 flex-1 rounded ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                    </div>
                    <span className="font-semibold text-slate-600">{strength.text}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('auth_user_role') || 'Foydalanuvchi toifasi'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'traveler', label: t('auth_traveler') || 'Sayohatchi' },
                    { id: 'guide', label: t('auth_guide') || 'Gid' },
                    { id: 'partner', label: t('auth_partner') || 'Hamkor' },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setRegRole(role.id as UserRole)}
                      className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition ${
                        regRole === role.id
                          ? 'bg-[#124C3A] text-white border-[#124C3A]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-[#124C3A] hover:bg-[#0e3b2d] text-white font-heading font-semibold text-xs shadow-md transition"
              >
                {t('auth_register_btn') || 'Hisob yaratish va davom etish'}
              </button>
            </form>
          )}

          {/* 3. ADMIN TAB */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="bg-[#124C3A]/5 border border-[#124C3A]/20 rounded-2xl p-3.5 text-xs text-[#124C3A] flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#C8A66A] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Himoyalangan Boshqaruv Paneli</span>
                  <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">
                    Faqat rasmiy ma’murlar uchun xavfsiz tizimga kirish oynasi.
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Admin Login</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Loginni kiriting"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C8A66A]/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Admin Parol</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C8A66A]/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#C8A66A] hover:bg-[#b89559] text-slate-900 font-heading font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>{t('auth_admin_btn') || 'Admin panelga kirish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

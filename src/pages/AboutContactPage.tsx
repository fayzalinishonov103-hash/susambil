import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted: boolean;
}

export const AboutContactPage: React.FC = () => {
  const { showToast, t } = useApp();

  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    submitted: false,
  });

  const PILLARS = [
    { emoji: '🧭', title: t('about_platform') || 'Yagona platforma', desc: t('about_platform_desc') || 'Barcha sayohat xizmatlari bir joyda' },
    { emoji: '🌿', title: t('about_local') || 'Mahalliy tajriba', desc: t('about_local_desc') || "Haqiqiy O'zbekiston madaniyatini kashf eting" },
    { emoji: '💡', title: t('about_smart') || 'Aqlli rejalashtirish', desc: t('about_smart_desc') || 'AI-asosida shaxsiy sayohat rejalari' },
    { emoji: '🤝', title: t('about_trust') || 'Ishonchli hamkorlar', desc: t('about_trust_desc') || 'Tekshirilgan mehmonxona va gidlar' },
  ];

  const STATS = [
    { value: '50+', label: t('about_cities_stat') || 'Shaharlar' },
    { value: '500+', label: t('about_partners_stat') || 'Hamkorlar' },
    { value: '10,000+', label: t('about_travelers_stat') || 'Sayohatchilar' },
  ];

  const TEAM = [
    { name: 'Alisher Nazarov', role: 'Asoschi & CEO' },
    { name: 'Malika Yusupova', role: 'Mahsulot direktori' },
    { name: 'Bobur Toshmatov', role: 'Texnologiya rahbari' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, submitted: true }));
    showToast(t('about_sent_toast') || "Xabaringiz yuborildi!");
    setTimeout(() => {
      setForm({ name: '', email: '', subject: '', message: '', submitted: false });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <section
        className="w-full py-20 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #124C3A 0%, #1a6b51 100%)' }}
      >
        <h1 className="font-heading text-4xl font-bold text-white mb-3">
          {t('about_title')}
        </h1>
        <p className="text-[#E9DCC5] text-lg mb-2">
          {t('about_sub')}
        </p>
        <p className="text-[#C8A66A] text-sm font-medium tracking-wide">
          Discover Uzbekistan. Your Journey, One Platform.
        </p>
      </section>

      {/* Mission pillars */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-4 items-start shadow-sm">
              <span className="text-3xl">{p.emoji}</span>
              <div>
                <h3 className="font-heading font-semibold text-[#124C3A] text-base mb-1">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4" style={{ backgroundColor: '#124C3A' }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-heading text-3xl font-bold text-[#C8A66A]">{s.value}</div>
              <div className="text-[#E9DCC5] text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-[#124C3A] text-center mb-8">
          {t('about_team') || 'Jamoa'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <div key={member.name} className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#E9DCC5] mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-[#124C3A] font-bold">{member.name.charAt(0)}</span>
              </div>
              <div className="font-heading font-semibold text-slate-900">{member.name}</div>
              <div className="text-xs text-slate-500 mt-1">{member.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="font-heading text-xl font-bold text-[#124C3A] mb-6">
            {t('about_contact') || "Bog'lanish"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('about_name') || 'Ism'}
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder={t('about_name_placeholder') || 'Ismingiz'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('about_subject') || 'Mavzu'}
              </label>
              <input
                type="text"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder={t('about_subject_placeholder') || 'Xabar mavzusi'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('about_message') || 'Xabar'}
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder={t('about_message_placeholder') || "Xabaringizni yozing..."}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A] text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={form.submitted}
              className="w-full py-3 rounded-xl bg-[#124C3A] hover:bg-[#0e3d2d] text-white font-heading font-semibold text-sm transition disabled:opacity-60"
            >
              {form.submitted ? `✓ ${t('about_sent') || 'Yuborildi'}` : (t('about_send') || 'Yuborish')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

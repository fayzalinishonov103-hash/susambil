import React from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import { Compass, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, t } = useApp();

  const handleNav = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links: { label: string; page: AppPage }[] = [
    { label: t('nav_destinations'), page: 'destinations' },
    { label: t('nav_transport'), page: 'transport' },
    { label: t('nav_hotels'), page: 'hotels' },
    { label: t('nav_tours'), page: 'tours' },
    { label: t('nav_guides'), page: 'guides' },
    { label: t('nav_hidden'), page: 'hidden' },
    { label: t('nav_planner'), page: 'planner' },
    { label: t('nav_budget'), page: 'budget' },
    { label: t('nav_about'), page: 'about' },
    { label: t('nav_partner') || 'Hamkorlar', page: 'partner' },
  ];

  return (
    <footer className="bg-[#0B3327] text-[#E9DCC5] border-t border-[#C8A66A]/15 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C8A66A] flex items-center justify-center text-[#124C3A]">
                <Compass className="w-5 h-5 stroke-[2.4]" />
              </div>
              <span className="font-heading font-black text-xl text-white tracking-wider">SUSAMBIL</span>
            </div>
            <p className="text-xs text-[#E9DCC5]/70 leading-relaxed max-w-xs">
              {t('footer_desc') || "O'zbekiston bo'ylab sayohat — poyezddan tortib gidgacha, hammasi bitta platformada."}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E9DCC5]/60">
              <Phone className="w-3.5 h-3.5 text-[#C8A66A]" />
              <span>{t('footer_tourist_police') || 'Tur politsiyasi'}: <strong className="text-white">1173</strong> (24/7)</span>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              {t('footer_services') || 'Xizmatlar'}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {links.map((l) => (
                <button
                  key={l.page}
                  onClick={() => handleNav(l.page)}
                  className="text-xs text-left text-[#E9DCC5]/70 hover:text-white transition"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              {t('footer_contact') || 'Aloqa'}
            </h4>
            <div className="space-y-3 text-xs text-[#E9DCC5]/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C8A66A] flex-shrink-0 mt-0.5" />
                <span>Amir Temur xiyoboni 4, Toshkent, O'zbekiston</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C8A66A] flex-shrink-0" />
                <span>contact@susambil.travel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#E9DCC5]/40">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} SUSAMBIL Travel Platform. {t('footer_rights') || 'Barcha huquqlar himoyalangan.'}</span>
            <a 
              href="/presentation.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#C8A66A] hover:text-white font-medium flex items-center gap-1 transition"
            >
              <span>📊</span> Loyiha Taqdimoti (Pitch Deck)
            </a>
          </div>
          <span className="text-[#E9DCC5]/30">Montserrat • React • TypeScript • Supabase</span>
        </div>
      </div>
    </footer>
  );
};

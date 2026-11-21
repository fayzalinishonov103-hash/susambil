import React from 'react';
import { MapPin, Eye, Compass, Camera, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HiddenPlace {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  tags: string[];
}

const HIDDEN_PLACES: HiddenPlace[] = [
  {
    id: 'hp-1',
    name: "Nurata tog' ko'llari",
    region: 'Navoiy viloyati',
    description: "Nurota qal'asi etagida joylashgan muqaddas buloqlar va tog' ko'llari — asrlar mobaynida ziyoratchilarni o'ziga jalb etib kelgan.",
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=900&q=80',
    tags: ['Tabiat', 'Ziyorat'],
  },
  {
    id: 'hp-2',
    name: "Aydarkul ko'li",
    region: 'Navoiy viloyati',
    description: "Qizilqum cho'lining yuragida joylashgan ulkan sun'iy ko'l. Ov qushlari va cho'l cho'milish joyi sifatida mashhur.",
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    tags: ["Cho'l", "Ko'l"],
  },
  {
    id: 'hp-3',
    name: "Chimyon qishlog'i",
    region: 'Toshkent viloyati',
    description: "Tyanshan tog'larining etagida joylashgan bu qishloq qishda qor, yozda yashil yaylovlari bilan sayyohlarni hayratga soladi.",
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    tags: ["Tog'", 'Dam olish'],
  },
  {
    id: 'hp-4',
    name: "Surxon qo'riqxonasi",
    region: 'Surxondaryo viloyati',
    description: "O'zbekistonning eng janubiy mintaqasida joylashgan bu qo'riqxona noyob flora va faunaning makoni.",
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80',
    tags: ['Tabiat', "Qo'riqxona"],
  },
  {
    id: 'hp-5',
    name: "Farg'ona vodiysi sharsharalari",
    region: "Farg'ona viloyati",
    description: "Vodiy tog'larida yashiringan ko'plab sharsharalar — qo'shni qishloqlar aholisi uchun muqaddas dam olish maskanlari.",
    image: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=900&q=80',
    tags: ['Sharshara', 'Yurish'],
  },
  {
    id: 'hp-6',
    name: "Ustyurt platosi",
    region: "Qoraqalpog'iston",
    description: "Mars manzarasiga o'xshash bu tekislik qadimiy karvon yo'llari, gilamsimon chayonlar va cheksiz osmon bilan safari manzili.",
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80',
    tags: ["Cho'l", 'Safari'],
  },
];

export const HiddenUzbekistanPage: React.FC = () => {
  const { setCurrentPage, t } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#124C3A] via-[#1a6b52] to-[#0e3d2e] min-h-[45vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-[#C8A66A]/20 text-[#C8A66A] text-xs font-heading font-semibold uppercase tracking-widest mb-3">
            {t('nav_hidden')}
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-3 leading-tight">
            {t('hidden_title')}
          </h1>
          <p className="text-[#E9DCC5]/80 text-base md:text-lg max-w-xl mx-auto">
            {t('hidden_sub')}
          </p>
        </div>
      </section>

      {/* Hidden Gem Cards */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="font-heading font-bold text-2xl text-[#124C3A] mb-8 text-center">
          {t('hidden_gems_heading') || '6 ta yashirin durdonamiz'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HIDDEN_PLACES.map((place) => (
            <div
              key={place.id}
              className="relative rounded-2xl overflow-hidden h-96 group shadow-sm hover:shadow-md transition"
            >
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <span className="inline-flex items-center gap-1 self-start px-2.5 py-1 rounded-full bg-[#124C3A]/90 text-white text-xs font-heading font-medium mb-2">
                  <MapPin size={11} />
                  {place.region}
                </span>
                <h3 className="font-heading font-bold text-white text-xl leading-tight mb-1">
                  {place.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {place.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-[#C8A66A]/90 text-white text-[11px] font-heading">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-white/80 text-xs leading-relaxed line-clamp-2 mb-3">
                  {place.description}
                </p>
                <button
                  onClick={() => setCurrentPage('destinations')}
                  className="self-start inline-flex items-center gap-1 text-xs text-[#C8A66A] font-heading font-semibold hover:text-white transition-colors"
                >
                  {t('hidden_read_more') || "Ko'proq o'qish"} <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Hidden Places */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#124C3A] text-center mb-10">
            {t('hidden_why_title') || 'Nima uchun yashirin joylar?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Eye size={28} className="text-[#C8A66A]" />,
                title: t('hidden_why_1_title') || 'Haqiqiy tajriba',
                text: t('hidden_why_1_desc') || "Turistik qolipdan chiqib, mahalliy hayotning haqiqiy qirralarini his eting.",
              },
              {
                icon: <Compass size={28} className="text-[#C8A66A]" />,
                title: t('hidden_why_2_title') || 'Noyob marshrut',
                text: t('hidden_why_2_desc') || "Har bir joy boshqasiga o'xshamaydi — O'zbekistonning yashirin geografiyasini kashf eting.",
              },
              {
                icon: <Camera size={28} className="text-[#C8A66A]" />,
                title: t('hidden_why_3_title') || 'Unutilmas suratlar',
                text: t('hidden_why_3_desc') || "So'lim tabiat va ko'hna inshootlar fotograflar uchun beqiyos imkoniyat yaratadi.",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E9DCC5]/60 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-semibold text-lg text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#124C3A] py-14 px-4 text-center">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-3">
          {t('hidden_cta_title') || "O'z sarguzashtingizni boshlang"}
        </h2>
        <p className="text-[#E9DCC5]/80 mb-8 max-w-lg mx-auto text-sm">
          {t('hidden_cta_desc') || "Orzuingizdagi sayohatni rejalashtiring — biz har bir qadamda yoningizda!"}
        </p>
        <button
          onClick={() => setCurrentPage('planner')}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8A66A] hover:bg-[#b8955a] text-white font-heading font-semibold rounded-xl transition-colors shadow-sm"
        >
          {t('hidden_cta_btn') || 'Rejalashtirish'} <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
};

export default HiddenUzbekistanPage;

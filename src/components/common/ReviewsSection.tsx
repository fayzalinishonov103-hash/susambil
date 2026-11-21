import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, MessageSquare, Plus, CheckCircle, ShieldCheck, User, Globe, Heart } from 'lucide-react';

export interface TouristReview {
  id: string;
  author: string;
  country: string;
  flag: string;
  rating: number;
  date: string;
  itemTitle: string;
  comment: string;
  verified: boolean;
  likes: number;
}

const INITIAL_REVIEWS: TouristReview[] = [
  {
    id: 'rev-1',
    author: 'Alexander Wright',
    country: 'United Kingdom',
    flag: '🇬🇧',
    rating: 5,
    date: '14 Noyabr, 2026',
    itemTitle: 'Afrosiyob Tezyurar poyezdi & Registon turi',
    comment: 'Susambil orqali Toshkentdan Samarqandga Afrosiyob chiptasini va shahar gidini bron qildik. Hammasi a’lo darajada tashkil etilgan, vaucher darhol QR-kod bilan berildi!',
    verified: true,
    likes: 24,
  },
  {
    id: 'rev-2',
    author: 'Clara Dubois',
    country: 'France',
    flag: '🇫🇷',
    rating: 5,
    date: '02 Noyabr, 2026',
    itemTitle: 'Buxoro Butik Mehmonxonasi & Tarixiy Sayr',
    comment: 'Buxorodagi qadimiy madrasa-oteldagi muhit shunchaki sehrli edi. Gidimiz Rustam ingliz va fransuz tillarida mukammal so‘zladi. Haqiqiy Ipak yo‘li ruhi!',
    verified: true,
    likes: 19,
  },
  {
    id: 'rev-3',
    author: 'Kenji Takahashi',
    country: 'Japan',
    flag: '🇯🇵',
    rating: 5,
    date: '28 Oktyabr, 2026',
    itemTitle: 'Xiva Ichan Qal‘a & Chimyon safari',
    comment: 'Smart Planner yordamida butun 7 kunlik marshrutimizni bir daqiqada rejalashtirdik. Xarajatlar kalkulyatorda qanday hisoblangan bo‘lsa, shunday bo‘lib chiqdi.',
    verified: true,
    likes: 31,
  },
  {
    id: 'rev-4',
    author: 'Madina Ismoilova',
    country: 'O‘zbekiston',
    flag: '🇺🇿',
    rating: 5,
    date: '20 Oktyabr, 2026',
    itemTitle: 'Zomin & Farg‘ona vodiysi gastro-turi',
    comment: 'Oila bilan Farg‘ona vodiysiga sayohat qildik. Rishton kulolchilik ustaxonasi va mahalliy mehmondo‘stlik unutilmas xotira bo‘lib qoldi. Rahmat Susambil jamoasiga!',
    verified: true,
    likes: 42,
  },
];

export const ReviewsSection: React.FC<{
  targetTitle?: string;
}> = ({ targetTitle }) => {
  const { currentUser, showToast } = useApp();

  const [reviews, setReviews] = useState<TouristReview[]>(() => {
    try {
      const saved = localStorage.getItem('susambil_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [newAuthor, setNewAuthor] = useState(currentUser?.full_name || '');
  const [newCountry, setNewCountry] = useState(currentUser?.country || 'O‘zbekiston');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newTitle, setNewTitle] = useState(targetTitle || 'Afrosiyob & Ipak yo‘li sayohati');

  const saveReviews = (newList: TouristReview[]) => {
    setReviews(newList);
    try {
      localStorage.setItem('susambil_reviews', JSON.stringify(newList));
    } catch {}
  };

  const handleLike = (id: string) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r));
    saveReviews(updated);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) {
      showToast('Iltimos, ismingiz va sharhingizni kiriting!');
      return;
    }

    const newRev: TouristReview = {
      id: 'rev-' + Date.now(),
      author: newAuthor,
      country: newCountry,
      flag: newCountry.toLowerCase().includes('uz') ? '🇺🇿' : '🌍',
      rating: newRating,
      date: 'Bugun',
      itemTitle: newTitle,
      comment: newComment,
      verified: true,
      likes: 1,
    };

    saveReviews([newRev, ...reviews]);
    setShowModal(false);
    setNewComment('');
    showToast('Sharhingiz muvaffaqiyatli chop etildi!');
  };

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter((r) => r.rating === filterRating);

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#C8A66A] tracking-wider block">
            Haqiqiy Sayyohlar Fikri
          </span>
          <h3 className="font-heading font-black text-2xl text-slate-900 mt-1">
            Sayohatchilarning jonli sharhlari
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            O‘zbekistonga tashrif buyurgan xalqaro va mahalliy mehmonlarimiz taassurotlari
          </p>
        </div>

        {/* Aggregate Score & Add Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#124C3A]/5 px-3.5 py-2 rounded-2xl border border-[#124C3A]/15">
            <div className="text-center">
              <span className="font-heading font-black text-xl text-[#124C3A]">{avgRating}</span>
              <div className="flex text-[#C8A66A] text-xs">
                {'★'.repeat(5)}
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              ({reviews.length} ta sharh)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#124C3A] text-white text-xs font-bold hover:bg-[#165743] transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#C8A66A]" />
            <span>Sharh qoldirish</span>
          </button>
        </div>
      </div>

      {/* Rating Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterRating('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition ${
            filterRating === 'all'
              ? 'bg-[#124C3A] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Barchasi ({reviews.length})
        </button>
        {[5, 4, 3].map((star) => (
          <button
            key={star}
            onClick={() => setFilterRating(star)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1 ${
              filterRating === star
                ? 'bg-[#124C3A] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{star}</span>
            <Star className="w-3 h-3 fill-[#C8A66A] text-[#C8A66A]" />
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-sm text-[#124C3A] shadow-sm">
                    {rev.flag}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading font-bold text-xs text-slate-900">{rev.author}</h4>
                      {rev.verified && (
                        <span title="Tasdiqlangan sayyoh" className="text-emerald-600 flex items-center">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{rev.country} • {rev.date}</span>
                  </div>
                </div>

                <div className="flex text-[#C8A66A] text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#124C3A] block mb-1">
                  {rev.itemTitle}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[10px]">O‘zbekiston safari tajribasi</span>
              <button
                type="button"
                onClick={() => handleLike(rev.id)}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-500 transition text-[11px] font-semibold"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{rev.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-heading font-black text-lg text-slate-900">
                Sayohat bo‘yicha sharhingiz
              </h4>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ism va Familiya</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Ismingiz"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mamlakat / Shahar</label>
                <input
                  type="text"
                  required
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="O‘zbekiston, Toshkent"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Baho (Yulduzcha)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1 transition ${
                        newRating >= s
                          ? 'border-[#C8A66A] bg-amber-50 text-amber-900'
                          : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      <span>{s}</span>
                      <Star className="w-3.5 h-3.5 fill-[#C8A66A] text-[#C8A66A]" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Qaysi xizmat haqida</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sharh matni</label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Sayohat qanday o‘tdi? Boshqa sayyohlar uchun tavsiyalaringiz..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#124C3A] text-white font-bold hover:bg-[#165743] transition shadow-md"
                >
                  Chop etish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

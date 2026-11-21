import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Users, Phone, Mail, User, CheckCircle, Info } from 'lucide-react';

export const BookingRequestModal: React.FC = () => {
  const {
    bookingModalOpen,
    bookingModalData,
    closeBookingModal,
    createBooking,
    currentUser,
    formatPrice,
    t
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!bookingModalOpen || !bookingModalData) return null;

  const totalPrice = bookingModalData.priceUsd * guestsCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      createBooking({
        user_id: currentUser?.id || 'demo-user',
        item_type: bookingModalData.itemType,
        item_id: bookingModalData.itemId,
        item_title: bookingModalData.itemTitle,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        start_date: startDate,
        end_date: endDate || undefined,
        guests_count: guestsCount,
        total_price_usd: totalPrice,
        status: 'pending',
        special_requests: specialRequests,
        is_demo: true,
      });
      setSubmitting(false);
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={closeBookingModal}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#124C3A] text-white px-6 py-5 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8A66A]">
              {t('booking_modal_title') || "Bron so'rovi"}
            </span>
            <h3 className="font-heading font-bold text-base text-white mt-0.5 leading-snug">
              {bookingModalData.itemTitle}
            </h3>
          </div>
          <button onClick={closeBookingModal} className="text-white/60 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Notice */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 text-[11px] text-amber-800 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{t('booking_demo_notice') || "Demo bron — hech qanday to'lov olinmaydi."}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t('about_name') || 'Ism va Familiya'}
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t('booking_guests_count') || 'Sayyohlar soni'}
              </label>
              <div className="relative">
                <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min={1}
                  max={30}
                  required
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t('dashboard_phone') || 'Telefon'}
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t('booking_start_date') || 'Boshlanish sanasi'}
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t('booking_end_date') || 'Tugash sanasi (ixtiyoriy)'}
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {t('booking_special_requests') || 'Maxsus talablar (ixtiyoriy)'}
            </label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Ovqat xususiyati, maxsus so'rovlar..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#124C3A]"
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-slate-100">
            <span className="text-slate-500 font-medium">
              {guestsCount} {t('booking_total_for') || "kishi uchun jami:"}
            </span>
            <span className="font-heading font-black text-lg text-[#124C3A]">
              {formatPrice(totalPrice)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={closeBookingModal}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              {t('booking_cancel') || 'Bekor qilish'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#124C3A] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#165743] transition disabled:opacity-50"
            >
              {submitting ? (
                <span>{t('booking_submitting') || 'Yuklanmoqda...'}</span>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-[#C8A66A]" />
                  <span>{t('booking_submit') || "So'rov yuborish"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

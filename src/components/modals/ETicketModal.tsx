import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingRequest } from '../../types';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Calendar, 
  User, 
  MapPin, 
  CreditCard, 
  Download, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ETicketModalProps {
  booking: BookingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onPaid?: (bookingId: string) => void;
}

export const ETicketModal: React.FC<ETicketModalProps> = ({
  booking,
  isOpen,
  onClose,
  onPaid
}) => {
  const { formatPrice, showToast, t } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<boolean>(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'payme' | 'click' | 'visa'>('click');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  useEffect(() => {
    if (booking) {
      const payload = JSON.stringify({
        ref: booking.id,
        item: booking.item_title,
        passenger: booking.customer_name,
        date: booking.start_date,
        total: booking.total_price_usd,
        verifier: 'https://susambil.travel/verify/' + booking.id
      });

      QRCode.toDataURL(payload, {
        width: 180,
        margin: 1,
        color: {
          dark: '#124C3A',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handlePayment = () => {
    setIsProcessingPay(true);
    setTimeout(() => {
      setIsProcessingPay(false);
      setPaymentMode(false);
      if (onPaid) {
        onPaid(booking.id);
      }
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#124C3A', '#C8A66A', '#E9DCC5'],
      });
      showToast('To‘lov muvaffaqiyatli amalga oshirildi! E-chipta tasdiqlandi.');
    }, 1200);
  };

  const pnrCode = `SSB-${booking.id.slice(-6).toUpperCase()}-UZB`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Hidden on Print */}
        <div className="bg-[#124C3A] text-white p-4 sm:p-5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C8A66A] text-[#124C3A] flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base leading-tight">
                Rasmiy E-Chipta & Sayohat Vaucheri
              </h3>
              <p className="text-[11px] text-[#E9DCC5]/80">
                PNR: <strong className="font-mono text-white">{pnrCode}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Boarding Pass Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Ticket Header & Brand Stamp */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-dashed border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-2xl tracking-wider text-[#124C3A]">
                  SUSAMBIL
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#124C3A]">
                  Verified Pass
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                O‘zbekiston Respublikasi Raqamli Turizm Ekotizimi
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Elektron Vaucher</span>
              <span className="font-mono font-bold text-sm text-[#124C3A]">{pnrCode}</span>
            </div>
          </div>

          {/* Ticket Body Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Left 2 Cols: Details */}
            <div className="sm:col-span-2 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Xizmat / Marshrut
                </span>
                <h4 className="font-heading font-black text-lg text-slate-900 mt-0.5 leading-snug">
                  {booking.item_title}
                </h4>
                <span className="text-xs text-[#C8A66A] font-semibold capitalize">
                  {booking.item_type} toifasi
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Yo‘lovchi / Mehmon</span>
                  <strong className="text-slate-800 text-sm truncate block mt-0.5">{booking.customer_name}</strong>
                  <span className="text-[11px] text-slate-500">{booking.guests_count} kishi</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Sana</span>
                  <strong className="text-slate-800 text-sm block mt-0.5">{booking.start_date}</strong>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {booking.status === 'confirmed' ? '✓ Tasdiqlangan' : '● Kutilmoqda'}
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="p-3 rounded-2xl bg-[#124C3A]/5 border border-[#124C3A]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Jami Qiymat</span>
                  <span className="font-heading font-black text-xl text-[#124C3A]">
                    {formatPrice(booking.total_price_usd)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Holati</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'To‘langan' : 'To‘lov kutilmoqda'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 1 Col: QR Code & Verification */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  className="w-32 h-32 rounded-xl border border-slate-200 p-1 bg-white shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-slate-200 animate-pulse" />
              )}
              <span className="text-[10px] font-mono text-slate-500 block leading-tight">
                Nazoratchi tekshiruvi uchun QR-kod
              </span>
            </div>
          </div>

          {/* Barcode Strip Graphic */}
          <div className="pt-4 border-t-2 border-dashed border-slate-200 flex flex-col items-center space-y-1">
            <div className="h-10 w-full max-w-sm flex items-center justify-between opacity-80 overflow-hidden">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="h-full bg-slate-900"
                  style={{ width: `${(i % 3) + 1.5}px`, marginRight: `${(i % 2) + 1}px` }}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] tracking-widest text-slate-400">
              * {pnrCode} *
            </span>
          </div>

          {/* Payment Section (If not yet paid / confirmed) */}
          {booking.status !== 'confirmed' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-3 print:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Onlayn To‘lov va Chiptani darhol Tasdiqlash</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">0% komissiya</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'click', label: 'Click Evolution', color: 'border-blue-300 hover:border-blue-500' },
                  { id: 'payme', label: 'Payme', color: 'border-teal-300 hover:border-teal-500' },
                  { id: 'visa', label: 'Visa / Mastercard', color: 'border-indigo-300 hover:border-indigo-500' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedPayMethod(m.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition text-center ${
                      selectedPayMethod === m.id
                        ? 'bg-[#124C3A] text-white border-[#124C3A] shadow-sm'
                        : `bg-white text-slate-700 ${m.color}`
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessingPay}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-60"
              >
                {isProcessingPay ? (
                  <span>To‘lov tekshirilmoqda...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>To‘lovni amalga oshirish ({formatPrice(booking.total_price_usd)})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Modal Actions Footer - Hidden on Print */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-white transition"
          >
            Yopish
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-[#124C3A] hover:bg-[#0e3d2d] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5 text-[#C8A66A]" />
            <span>Chop etish / PDF Saqlash</span>
          </button>
        </div>
      </div>
    </div>
  );
};

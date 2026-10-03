import React, { useState, useEffect } from 'react';
import { X, Clock, ShieldCheck, Ticket, UserCheck, AlertTriangle } from 'lucide-react';
import { Currency, CabinClass } from '../types';
import { formatPrice, getStoredUser, saveStoredUser } from '../utils/helpers';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  route: string;
  fromCode: string;
  toCode: string;
  date: string;
  time: string;
  seatNumber: string;
  cabinClass: CabinClass | 'vip' | 'kupe' | 'platskart';
  totalPriceUZS: number;
  type: 'flight' | 'train' | 'hotel';
  currency: Currency;
  originalPriceUZS?: number;
  discountPercent?: number;
  savedAmountUZS?: number;
  discountLabel?: string;
  isRoundTrip?: boolean;
  returnDate?: string;
  passengersCount?: number;
  onConfirmReservation: (passenger: {
    fullName: string;
    passportId: string;
    phone: string;
    email: string;
    customSeat?: string;
    isRoundTrip?: boolean;
    passengersCount?: number;
    originalPriceUZS?: number;
    discountPercent?: number;
    savedAmountUZS?: number;
    discountLabel?: string;
  }) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  title,
  route,
  fromCode,
  toCode,
  date,
  time,
  seatNumber,
  cabinClass,
  totalPriceUZS,
  type,
  currency,
  originalPriceUZS,
  discountPercent,
  savedAmountUZS,
  discountLabel,
  isRoundTrip,
  returnDate,
  passengersCount = 1,
  onConfirmReservation,
}) => {
  const [fullName, setFullName] = useState('');
  const [passportId, setPassportId] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(seatNumber);
  const [isEditingSeat, setIsEditingSeat] = useState(false);

  useEffect(() => {
    setSelectedSeat(seatNumber);
  }, [seatNumber, isOpen]);

  useEffect(() => {
    const saved = getStoredUser();
    if (saved) {
      setFullName(saved.fullName || '');
      setPassportId(saved.passportId || '');
      setPhone(saved.phone || '+998 ');
      setEmail(saved.email || '');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setFormError("Iltimos, ism-sharifingiz va telefon raqamingizni to'liq kiriting!");
      return;
    }
    setFormError('');

    const cleanPassport = passportId.trim().toUpperCase() || 'FA' + Math.floor(1000000 + Math.random() * 9000000);

    saveStoredUser({
      fullName: fullName.toUpperCase(),
      passportId: cleanPassport,
      phone,
      email,
    });

    onConfirmReservation({
      fullName: fullName.toUpperCase(),
      passportId: cleanPassport,
      phone,
      email,
      customSeat: selectedSeat,
      isRoundTrip,
      passengersCount,
      originalPriceUZS,
      discountPercent,
      savedAmountUZS,
      discountLabel,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white dark:bg-[#101b33] p-5 sm:p-7 text-left align-middle shadow-2xl transition-all border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white my-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎫 48-Soatlik Bronni Tasdiqlash</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                Karta kiritish shart emas • O'rindiq zaxirasi bepul ushlab turiladi
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 48-Hour Guarantee Alert Notice */}
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
              <strong className="font-black text-amber-950 dark:text-amber-100 block mb-0.5">
                2 Kunlik (48 Soat) Bepul Bron Kafolati!
              </strong>
              Ushbu chipta siz uchun 48 soat davomida saqlanadi. Bron muddati o'tgach to'lov qilinmasa, chipta avtomatik tarzda sotuvga qaytadi.
            </div>
          </div>

          {/* Route Summary Box */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-500 dark:text-slate-400">Yo'nalish:</span>
              <span className="text-slate-900 dark:text-white font-black">{route} ({fromCode} ➔ {toCode})</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-500 dark:text-slate-400">Reys / Xizmat:</span>
              <span className="text-slate-900 dark:text-white">{title}</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-500 dark:text-slate-400">Vaqt va Sana:</span>
              <span className="text-slate-900 dark:text-white">{date} • {time}</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-500 dark:text-slate-400">O'rindiq & Klass:</span>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-black">{selectedSeat} ({cabinClass.toUpperCase()})</span>
                <button
                  type="button"
                  onClick={() => setIsEditingSeat(!isEditingSeat)}
                  className="text-[10px] font-black text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  {isEditingSeat ? 'Yopish' : "O'rindiqni o'zgartirish 💺"}
                </button>
              </div>
            </div>

            {/* Discount Savings Breakdown & Next Trip Progression */}
            {discountPercent && discountPercent > 0 ? (
              <div className="pt-2.5 mt-2 border-t border-slate-200 dark:border-slate-700 bg-emerald-50/70 dark:bg-emerald-950/40 p-2.5 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 font-bold">
                  <span>Asl narx ({passengersCount} kishi):</span>
                  <span className="line-through">{formatPrice(originalPriceUZS || totalPriceUZS, currency)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-300 font-black">
                  <span>{discountLabel || `Chegirma: -${discountPercent}%`}:</span>
                  <span>-{discountPercent}% (-{formatPrice(savedAmountUZS || 0, currency)})</span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1">
                  <span>💡</span>
                  <span><b>Keyingi safar imtiyozi:</b> Ushbu xaridingizdan so'ng chegirmangiz 15% - 20% gacha oshadi!</span>
                </div>
              </div>
            ) : null}

            {/* Quick Seat Selector Drawer */}
            {isEditingSeat && (
              <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Qulay o'rindiqni tanlang:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(type === 'train'
                    ? [
                        "Vagon 01 • O'rindiq 06 (Deraza 🪟)",
                        "Vagon 02 • O'rindiq 14 (Deraza 🪟)",
                        "Vagon 02 • O'rindiq 18 (Stol 🍽️)",
                        "Vagon 04 • O'rindiq 22 (Yo'lak 🚶)",
                        "Vagon 05 • O'rindiq 12 (Pastki divan)",
                        "Vagon 06 • O'rindiq 35 (Kupe)",
                      ]
                    : [
                        "4A (Deraza yonida 🪟)",
                        "5B (Keng o'rindiq)",
                        "6C (Yo'lak yonida 🚶)",
                        "7F (Deraza yonida 🪟)",
                        "11A (Oldingi qator)",
                        "14F (Deraza yonida 🪟)",
                      ]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setSelectedSeat(st);
                        setIsEditingSeat(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                        selectedSeat === st
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                Yo'lovchi Ismi va Familiyasi (Lotin tilida) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="MASALAN: ANVAR KARIMOV"
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-xs uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Pasport / ID Raqami
                </label>
                <input
                  type="text"
                  value={passportId}
                  onChange={(e) => setPassportId(e.target.value)}
                  placeholder="FA1234567"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-xs uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Telefon Raqam *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 93 039 92 91"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                Email Pochta (Elektron chipta yuboriladi)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="murodjon@uzfly.uz"
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bottom Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Savollaringiz bormi?</span>
                <a href="tel:+998930399291" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
                  📞 Call Center: +998 93 039 92 91 (24/7)
                </a>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Bron Summasi</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {formatPrice(totalPriceUZS, currency)}
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#ff6d00] hover:bg-[#e06000] text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Chiptani 48 Soatga Bron Qilish 🎫</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

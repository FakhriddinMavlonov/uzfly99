import React, { useState } from 'react';
import {
  X,
  Hotel as HotelIcon,
  Calendar,
  Users,
  Moon,
  Bed,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Hotel, HotelRoom, Currency } from '../types';
import { formatPrice, UserProfile } from '../utils/helpers';

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  room?: HotelRoom | null;
  currency: Currency;
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  guestsCount: number;
  userProfile?: UserProfile | null;
  onConfirmReservation: (data: {
    fullName: string;
    passportId: string;
    phone: string;
    email: string;
    specialRequests?: string[];
    roomName: string;
    checkInDate: string;
    checkOutDate: string;
    nightsCount: number;
    guestsCount: number;
    totalPriceUZS: number;
  }) => void;
}

export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
  isOpen,
  onClose,
  hotel,
  room,
  currency,
  checkInDate,
  checkOutDate,
  nightsCount,
  guestsCount,
  userProfile,
  onConfirmReservation,
}) => {
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [passportId, setPassportId] = useState(userProfile?.passportId || '');
  const [phone, setPhone] = useState(userProfile?.phone || '+998 ');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isOpen || !hotel) return null;

  const roomName = room?.name || 'Deluxe King Room Panoramik Manzara';
  const pricePerNight = room?.priceUZS || hotel.pricePerNightUZS;
  const totalPriceUZS = pricePerNight * Math.max(1, nightsCount);

  const toggleSpecialRequest = (req: string) => {
    setSpecialRequests((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !passportId || !phone) return;

    onConfirmReservation({
      fullName,
      passportId,
      phone,
      email,
      specialRequests,
      roomName,
      checkInDate,
      checkOutDate,
      nightsCount: Math.max(1, nightsCount),
      guestsCount,
      totalPriceUZS,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <HotelIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Mehmonxona Xonasini Band Qilish
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Rasmiy elektron vaucher darhol rasmiylashtiriladi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Hotel & Stay Summary Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={hotel.image}
              alt={hotel.name}
              referrerPolicy="no-referrer"
              className="w-full sm:w-28 h-24 rounded-2xl object-cover shrink-0"
            />
            <div className="space-y-1 flex-1">
              <div className="text-amber-400 text-xs font-bold">
                {'★'.repeat(hotel.stars)}
              </div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{hotel.city}, {hotel.country}</span>
              </div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-1">
                <Bed className="w-3.5 h-3.5" />
                <span>{roomName}</span>
              </div>
            </div>
          </div>

          {/* Dates & Nights Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Kirish kuni</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">{checkInDate}</span>
              <span className="text-[10px] text-slate-500 block">14:00 dan</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Chiqish kuni</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">{checkOutDate}</span>
              <span className="text-[10px] text-slate-500 block">12:00 gacha</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Muddati</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">{nightsCount} kecha</span>
              <span className="text-[10px] text-slate-500 block">Davomiyligi</span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Mehmonlar</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">{guestsCount} kishi</span>
              <span className="text-[10px] text-slate-500 block">Xona sig'imi</span>
            </div>
          </div>

          {/* Guest Personal Information Inputs */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Asosiy Mehmon Ma'lumotlari:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Familiya, Ism va Sharifingiz *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Karimov Farrux O'ktamovich"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pasport / ID seriya va raqami *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: AA 1234567"
                  value={passportId}
                  onChange={(e) => setPassportId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telefon raqami *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Elektron pochta (Vaucher yuboriladi)
                </label>
                <input
                  type="email"
                  placeholder="masalan: travel@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Special Requests (Qo'shimcha istaklar) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Qo'shimcha istaklar (bepul):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Erta kelish (Early check-in)',
                'Yuqori qavatdagi xona',
                'Tinch va osoyishta xona',
                'Katta bir kishilik karavot (King)',
                'Chekmaydiganlar xonasi',
                'Bolalar karavoti qo\'shish',
              ].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => toggleSpecialRequest(opt)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                    specialRequests.includes(opt)
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      specialRequests.includes(opt)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {specialRequests.includes(opt) && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span>
              Mehmonxonada yashash qoidalari va bekor qilish shartlariga roziman
            </span>
          </label>

          {/* Price Breakdown Footer */}
          <div className="p-4 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                1 kecha: {formatPrice(pricePerNight, currency)} × {nightsCount} kecha
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                {formatPrice(totalPriceUZS, currency)}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Nonushta kiritilgan • QQS va shahar solig'i hisoblangan
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={!agreeTerms}
                className="flex-1 sm:flex-none px-6 py-3.5 bg-[#ff6d00] hover:bg-[#e06000] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/30 transition cursor-pointer active:scale-95"
              >
                Vaucherni Tasdiqlash ➔
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

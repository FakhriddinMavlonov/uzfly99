import React, { useEffect } from 'react';
import { X, Ticket, Trash2, ExternalLink, Calendar, AlertCircle, Sparkles, Gift } from 'lucide-react';
import { Booking, Currency } from '../types';
import { formatPrice, UserProfile, getUserPastTicketsCount } from '../utils/helpers';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  currency: Currency;
  onViewTicket: (b: Booking) => void;
  onCancelBooking: (id: string) => void;
  userProfile?: UserProfile | null;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  currency,
  onViewTicket,
  onCancelBooking,
  userProfile,
}) => {
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

  const totalTicketsBought = userProfile ? getUserPastTicketsCount(userProfile) : bookings.length;
  const currentDiscount = totalTicketsBought >= 5 ? 20 : totalTicketsBought >= 3 ? 15 : totalTicketsBought >= 1 ? 10 : 10;
  const nextDiscount = currentDiscount === 10 ? 15 : 20;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#101b33] p-5 sm:p-7 text-left align-middle shadow-2xl transition-all border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white my-6 max-h-[88vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
            <div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-500" />
                <span>Mening Bronlarim</span>
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                48 soatlik zaxiralar va rasmiy elektron chiptalaringiz
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Customer Loyalty & Discount Progression Card */}
          {userProfile && (
            <div className="mt-3 p-3.5 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl flex-shrink-0 text-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                  <span className="text-xs font-black uppercase text-emerald-300">
                    {userProfile.fullName}: Sodiqlik Imtiyozlari
                  </span>
                </div>
                <span className="bg-emerald-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  -{currentDiscount}% CHEGIRMA
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/5 p-1.5 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-slate-400">Jami biletlar</span>
                  <span className="font-black text-white">{totalTicketsBought} ta</span>
                </div>
                <div className="bg-white/5 p-1.5 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-slate-400">Joriy chegirma</span>
                  <span className="font-black text-emerald-400">{currentDiscount}%</span>
                </div>
                <div className="bg-white/5 p-1.5 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-slate-400">Keyingi safar</span>
                  <span className="font-black text-amber-300">{nextDiscount}%</span>
                </div>
              </div>
              <p className="text-[10px] text-emerald-200/90 font-medium">
                ✓ Borish-kelishga 15% - 20%, xalqaro reyslarda 20% gacha kombinatsion chegirmalar hisobingizga avtomatik qo'llaniladi.
              </p>
            </div>
          )}

          {/* Bookings List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 space-y-3">
                <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="font-bold text-sm">Hozircha faol bronlaringiz mavjud emas.</p>
                <p className="text-xs max-w-xs mx-auto">
                  Istalgan reys, poyezd yoki mehmonxonani tanlab "48 Soatlik Bron" tugmasini bosing!
                </p>
              </div>
            ) : (
              bookings.map((booking) => {
                const isCancelled = booking.status === 'cancelled';
                return (
                  <div
                    key={booking.id}
                    className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isCancelled
                        ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 shadow-sm hover:border-blue-400'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                          {booking.pnr}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            isCancelled
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {isCancelled ? 'Bekor qilingan' : '48-Soatlik Bron Faol'}
                        </span>
                        {booking.discountPercent && booking.discountPercent > 0 && (
                          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-[10px] px-1.5 py-0.5 rounded">
                            -{booking.discountPercent}%
                          </span>
                        )}
                        {booking.isRoundTrip && (
                          <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black text-[10px] px-1.5 py-0.5 rounded">
                            Borish-Kelish
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-slate-900 dark:text-white text-sm">
                        {booking.route}
                      </h4>

                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                        <span>{booking.passengerName}</span>
                        <span>•</span>
                        <span>O'rindiq: {booking.seatNumber}</span>
                        <span>•</span>
                        <span>{booking.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-xs font-black text-blue-600 dark:text-blue-400">
                          {formatPrice(booking.totalPriceUZS, currency)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {!isCancelled && (
                        <>
                          <button
                            onClick={() => onViewTicket(booking)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Chiptani Ko'rish</span>
                          </button>

                          <button
                            onClick={() => onCancelBooking(booking.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition cursor-pointer"
                            title="Bronni bekor qilish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import {
  X,
  Printer,
  Plane,
  Train as TrainIcon,
  CheckCircle2,
  QrCode,
  Shield,
  Download,
  Calendar,
  User,
  Ticket,
  Maximize2,
  Minimize2,
  Clock,
  Luggage,
  MapPin,
  Share2,
  AlertCircle,
  Copy,
  Check,
  Building,
  Sparkles,
} from 'lucide-react';
import { Booking, Currency } from '../types';
import { formatPrice } from '../utils/helpers';

interface TicketModalProps {
  booking: Booking | null;
  currency: Currency;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  booking,
  currency,
  onClose,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedPNR, setCopiedPNR] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (booking) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [booking, onClose]);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPNR = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.pnr);
    setCopiedPNR(true);
    setTimeout(() => setCopiedPNR(false), 2000);
  };

  const isTrain = booking.type === 'train';
  const isHotel = booking.type === 'hotel';

  // Parse route cleanly whether separated by '➔' or '-'
  const routeParts = booking.route.includes('➔')
    ? booking.route.split('➔').map((s) => s.trim())
    : booking.route.split('-').map((s) => s.trim());
  const originStation = routeParts[0] || booking.fromCode;
  const destinationStation = routeParts[1] || booking.toCode;

  // Calculate simulated arrival time if train
  const departureHour = parseInt(booking.time.split(':')[0] || '8', 10);
  const departureMinute = booking.time.split(':')[1] || '00';
  const arrivalHour = (departureHour + (isTrain ? 3 : 2)) % 24;
  const formattedArrival = `${String(arrivalHour).padStart(2, '0')}:${departureMinute}`;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md print:p-0 print:bg-white transition-all duration-300 ${
        isFullscreen ? 'p-0' : 'p-3 sm:p-6'
      }`}
      onClick={onClose}
    >
      <div
        className={`flex min-h-full items-center justify-center text-center ${
          isFullscreen ? 'p-0' : 'p-2 sm:p-4'
        }`}
      >
        <div
          className={`relative w-full transform overflow-hidden text-left align-middle shadow-2xl transition-all duration-300 print:my-0 ${
            isFullscreen
              ? 'min-h-screen rounded-none bg-slate-900 border-none m-0'
              : 'max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-6'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Floating Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 print:hidden">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Elektron Chipta & Qo'nish Taloni</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <span className="text-slate-400 text-xs hidden sm:inline font-mono">
                PNR: {booking.pnr}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Fullscreen Toggle Button */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
                title={isFullscreen ? "Kichik oyna (Restore)" : "To'liq ekran (Fullscreen)"}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Standart Ko'rinish</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">To'liq Ekran</span>
                  </>
                )}
              </button>

              {/* Copy PNR */}
              <button
                type="button"
                onClick={handleCopyPNR}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
                title="Bron kodini nusxalash"
              >
                {copiedPNR ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PNR</span>
                  </>
                )}
              </button>

              {/* Print / PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                title="Chop etish yoki PDF sifatida saqlash"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Chop etish / PDF</span>
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 bg-slate-800 hover:bg-rose-600 rounded-xl text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                title="Yopish (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* The Physical Boarding Pass Card */}
          <div
            id="ticket-view-content"
            className={`${
              isFullscreen ? 'max-w-4xl mx-auto my-6 p-4 sm:p-8' : 'p-0'
            }`}
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 print:shadow-none print:border-none text-slate-900">
              {/* Ticket Header Ribbon */}
              <div
                className={`p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4 text-white ${
                  isHotel
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600'
                    : isTrain
                    ? 'bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600'
                    : 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white shadow-inner">
                    {isHotel ? (
                      <Building className="w-6 h-6" />
                    ) : isTrain ? (
                      <TrainIcon className="w-6 h-6" />
                    ) : (
                      <Plane className="w-6 h-6 -rotate-45" />
                    )}
                  </div>
                  <div>
                    <div className="font-black text-xl sm:text-2xl tracking-tight leading-none flex items-center gap-2">
                      <span>
                        {isHotel
                          ? "WORLD LUXURY HOTELS"
                          : isTrain
                          ? "WORLD RAIL & TEMIR YO'L"
                          : "AVIASALES UZ FLY"}
                      </span>
                      <span className="bg-white/25 text-white text-[11px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {isHotel ? "HOTEL VOUCHER" : isTrain ? "EXPRESS" : "VERIFIED"}
                      </span>
                    </div>
                    <span className="text-xs text-white/90 font-medium block mt-1">
                      {isHotel
                        ? "Rasmiy Elektron Mehmonxona Voucheri (Hotel Confirmation Voucher)"
                        : isTrain
                        ? "Rasmiy Xalqaro & Ichki Temir Yo'l Elektron Chiptasi"
                        : "Rasmiy Xalqaro Elektron Aviachipta & Qo'nish Taloni"}
                    </span>
                  </div>
                </div>

                <div className="text-right bg-black/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                  <div className="text-[10px] font-black uppercase text-white/80 tracking-wider">
                    {isHotel ? "VAUCHER KODI" : "BRON KODI (PNR)"}
                  </div>
                  <div className="font-mono font-black text-2xl tracking-widest text-amber-300">
                    {booking.pnr}
                  </div>
                </div>
              </div>

              {/* Notice Bar */}
              <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>48 Soatlik Kafolatlangan Zaxira:</strong> Ushbu chipta tizimda tasdiqlangan va o'rindiq siz uchun band qilingan.
                  </span>
                </div>
                <span className="font-mono font-bold text-[11px] text-amber-700 hidden sm:inline">
                  CHIPTA № {booking.ticketNumber}
                </span>
              </div>

              {/* Ticket Body Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Route & Times Graphic */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-dashed border-slate-300 pb-6">
                  {/* Origin */}
                  <div className="text-center sm:text-left flex-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
                      {booking.fromCode}
                    </span>
                    <div className="text-sm font-bold text-slate-700 mt-1 max-w-[220px]" title={originStation}>
                      {originStation}
                    </div>
                    <div className="text-base font-black text-rose-600 mt-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time || '08:00'}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                      {booking.date}
                    </span>
                  </div>

                  {/* Route Timeline Graphic */}
                  <div className="flex-1 w-full max-w-xs flex flex-col items-center px-4">
                    <span className="text-xs font-black uppercase text-slate-500 mb-1.5 truncate max-w-[240px] text-center">
                      {booking.title}
                    </span>
                    <div className="w-full flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-rose-600 bg-white"></div>
                      <div className="h-[3px] flex-1 bg-gradient-to-r from-rose-500 to-blue-500 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-600 shadow-sm flex items-center gap-1">
                          {isTrain ? (
                            <TrainIcon className="w-3.5 h-3.5 text-rose-600" />
                          ) : (
                            <Plane className="w-3.5 h-3.5 text-blue-600 rotate-90" />
                          )}
                          <span>To'g'ridan-to'g'ri</span>
                        </div>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Elektron Ro'yxatdan O'tildi</span>
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="text-center sm:text-right flex-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
                      {booking.toCode}
                    </span>
                    <div className="text-sm font-bold text-slate-700 mt-1 max-w-[220px] sm:ml-auto" title={destinationStation}>
                      {destinationStation}
                    </div>
                    <div className="text-base font-black text-blue-600 mt-1.5 flex items-center justify-center sm:justify-end gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{formattedArrival}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                      {booking.date}
                    </span>
                  </div>
                </div>

                {/* Passenger & Booking Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Yo'lovchi Ism-Familiyasi
                    </span>
                    <p className="font-black text-slate-900 uppercase text-sm truncate">
                      {booking.passengerName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Pasport / ID Raqami
                    </span>
                    <p className="font-mono font-bold text-slate-800 text-sm">
                      {booking.passportId}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      O'rindiq (Seat)
                    </span>
                    <p className={`font-black text-base font-mono ${isTrain ? 'text-rose-600' : 'text-blue-600'}`}>
                      {booking.seatNumber}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Klass (Toifasi)
                    </span>
                    <p className="font-black text-slate-800 uppercase text-sm">
                      {booking.cabinClass}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Telefon Raqam
                    </span>
                    <p className="font-mono font-bold text-slate-700">
                      {booking.phone || '+998 93 039 92 91'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Elektron Pochta
                    </span>
                    <p className="font-medium text-slate-700 truncate">
                      {booking.email || 'yo‘lovchi@sayohat.uz'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Bron Holati
                    </span>
                    <p className="font-black text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>FAOL (KAFOLATLANGAN)</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Umumiy To'lov Summasi
                    </span>
                    <p className="font-black text-blue-600 text-base">
                      {formatPrice(booking.totalPriceUZS, currency)}
                    </p>
                  </div>
                </div>

                {/* Additional Amenities & Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-800 font-black">
                      <Luggage className="w-4 h-4 text-blue-600" />
                      <span>Yuk va Bagaj Me'yori</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {isTrain
                        ? "Har bir yo'lovchiga 36 kg gacha bepul bagaj va o'rindiq tagida qo'l yuki joyi."
                        : "23 kg ro'yxatdan o'tgan bagaj + 8 kg samolyot saloni qo'l yuki."}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-800 font-black">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Xalqaro Sug'urta & Himoya</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Sayohat davomida tibbiy va favqulodda yordam xalqaro litsenziyasi bilan to'liq sug'urtalangan.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-800 font-black">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Bortdagi Qulayliklar</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {isTrain
                        ? "Bepul Wi-Fi, 220V/USB quvvatlagich, issiq choy va toza yotoq to'plami."
                        : "Bort taomlari, audio-video ekranlar va ichimliklar servisi."}
                    </p>
                  </div>
                </div>

                {/* Barcode & Simulated QR Code */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1 w-full space-y-2">
                    <div className="h-12 flex items-center gap-1 overflow-hidden bg-slate-50 p-2 rounded-xl border border-slate-200">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 1, 2, 4, 2, 3, 1, 4].map(
                        (w, i) => (
                          <div
                            key={i}
                            className="h-full bg-slate-900"
                            style={{ width: `${w * 2.5}px` }}
                          ></div>
                        )
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 tracking-widest text-center sm:text-left">
                      * PNR:{booking.pnr} * TICKET:{booking.ticketNumber} * UZFLY-OFFICIAL *
                    </div>
                  </div>

                  {/* QR Code Graphic */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex-shrink-0">
                    <div className="w-20 h-20 bg-slate-900 rounded-xl p-2 flex flex-wrap gap-1 items-center justify-center relative shadow-sm">
                      <div className="w-5 h-5 border-2 border-white rounded-sm absolute top-2 left-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white"></div>
                      </div>
                      <div className="w-5 h-5 border-2 border-white rounded-sm absolute top-2 right-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white"></div>
                      </div>
                      <div className="w-5 h-5 border-2 border-white rounded-sm absolute bottom-2 left-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white"></div>
                      </div>
                      <div className="w-3.5 h-3.5 bg-amber-400 rounded-full absolute shadow-sm"></div>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">
                        Turniket Skanneri
                      </span>
                      <strong className="text-xs font-mono font-bold text-slate-800 block">
                        PNR: {booking.pnr}
                      </strong>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                        ✓ Elektron ruxsat
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions Note & Hotline */}
                <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <strong className="text-slate-800">Muhim eslatma:</strong>{' '}
                    {isTrain
                      ? "Poyezd jo'nashidan kamida 30 daqiqa oldin vokzalga yetib keling. Pasport yoki ID karta asl nusxasini taqdim etish majburiydir."
                      : "Xalqaro reyslarda parvozdan kamida 2-3 soat oldin aeroportga yetib keling. Pasport muddati kamida 6 oy bo'lishi lozim."}
                  </div>
                  <a
                    href="tel:+998930399291"
                    className="inline-flex items-center gap-1.5 text-emerald-700 font-black bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs whitespace-nowrap self-start sm:self-auto hover:bg-emerald-100 transition shadow-sm"
                  >
                    <span>📞 24/7 Call Center: +998 93 039 92 91</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

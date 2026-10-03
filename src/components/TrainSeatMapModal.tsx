import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Train as TrainIcon,
  Zap,
  Coffee,
  Wifi,
  Sparkles,
  Info,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Volume2,
  Compass,
} from 'lucide-react';
import { Train, Currency } from '../types';
import { formatPrice } from '../utils/helpers';

interface TrainSeatMapModalProps {
  train: Train | null;
  initialClass?: 'vip' | 'biz' | 'kupe' | 'platskart';
  travelDate?: string;
  currency: Currency;
  onClose: () => void;
  onConfirmSeat: (
    train: Train,
    classType: 'vip' | 'biz' | 'kupe' | 'platskart',
    finalPriceUZS: number,
    seatLabel: string,
    travelDate: string
  ) => void;
}

interface CoachConfig {
  number: number;
  classType: 'vip' | 'biz' | 'kupe' | 'platskart';
  title: string;
  badge: string;
  badgeColor: string;
  layout: '1+2' | '2+2' | 'coupe' | 'platskart';
  totalSeats: number;
  features: string[];
}

const COACHES: CoachConfig[] = [
  {
    number: 1,
    classType: 'vip',
    title: 'Vagon 01 • VIP Klass',
    badge: 'VIP Salon',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800',
    layout: '1+2',
    totalSeats: 16,
    features: ['1+2 Keng charm o\'rindiqlar', 'Issiq taom va ichimliklar kiritilgan', '220V Rozetka har bir o\'rindiqda', 'Shaxsiy media ekran', 'Sokin vagon'],
  },
  {
    number: 2,
    classType: 'biz',
    title: 'Vagon 02 • Biznes Klass',
    badge: 'Biznes Salon',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
    layout: '1+2',
    totalSeats: 26,
    features: ['1+2 Qulay charm o\'rindiq', 'Kofe va choy bepul', 'Wi-Fi va Rozetka', 'Katta buklanuvchi stol'],
  },
  {
    number: 3,
    classType: 'biz',
    title: 'Vagon 03 • Biznes Klass',
    badge: 'Biznes Salon',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
    layout: '1+2',
    totalSeats: 26,
    features: ['1+2 Qulay charm o\'rindiq', 'Kofe va choy bepul', 'Wi-Fi va Rozetka', 'Stol yonidagi o\'rindiqlar'],
  },
  {
    number: 4,
    classType: 'kupe',
    title: 'Vagon 04 • Ekonom / Kupe',
    badge: 'Ekonom Plus',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800',
    layout: '2+2',
    totalSeats: 36,
    features: ['2+2 Zamonaviy qulay o\'rindiqlar', 'Konditsioner & Shamollatish', 'Oyoq qo\'yish tayanchi', 'USB zaryadlash porti'],
  },
  {
    number: 5,
    classType: 'kupe',
    title: 'Vagon 05 • Kupe (Yopiq xonalar)',
    badge: 'Kupe 4-kishilik',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800',
    layout: 'coupe',
    totalSeats: 36,
    features: ['4 kishilik alohida shinam bo\'lma', 'Yumshoq divan va ko\'rpa-yostiq', 'Eshikli yopiq xona', 'Choynak va shaxsiy chiroq'],
  },
  {
    number: 6,
    classType: 'platskart',
    title: 'Vagon 06 • Platskart',
    badge: 'Platskart',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800',
    layout: 'platskart',
    totalSeats: 54,
    features: ['Ochiq yotoqli qulay joylar', 'Yumshoq to\'shak kiritilgan', 'Arzon va qulay narx', 'Yuk uchun keng joy'],
  },
];

// Occupied seats set generator for deterministic realism
const OCCUPIED_SET = new Set([
  '1-3', '1-7', '1-11', '1-14',
  '2-2', '2-5', '2-9', '2-15', '2-21', '2-24',
  '3-4', '3-8', '3-12', '3-19', '3-25',
  '4-1', '4-6', '4-7', '4-12', '4-18', '4-23', '4-28', '4-33',
  '5-3', '5-4', '5-9', '5-15', '5-16', '5-27',
  '6-5', '6-11', '6-18', '6-22', '6-31', '6-45',
]);

export const TrainSeatMapModal: React.FC<TrainSeatMapModalProps> = ({
  train,
  initialClass = 'biz',
  travelDate = '2026-09-24',
  currency,
  onClose,
  onConfirmSeat,
}) => {
  // Find coach matching initialClass or default to Coach 2 (Biznes)
  const defaultCoach = COACHES.find((c) => c.classType === initialClass) || COACHES[1];
  const [selectedCoachNum, setSelectedCoachNum] = useState<number>(defaultCoach.number);
  const [selectedSeatNum, setSelectedSeatNum] = useState<number>(14);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!train) return null;

  const currentCoach = COACHES.find((c) => c.number === selectedCoachNum) || COACHES[1];

  // Calculate price for selected coach
  const getCoachPrice = (coach: CoachConfig) => {
    switch (coach.classType) {
      case 'vip':
        return train.priceVipUZS;
      case 'biz':
        return train.priceBizUZS;
      case 'kupe':
        return train.priceKupeUZS;
      case 'platskart':
        return train.pricePlatskartUZS;
      default:
        return train.priceBizUZS;
    }
  };

  const currentPrice = getCoachPrice(currentCoach);

  // Seat metadata helper
  const getSeatInfo = (coachNum: number, seatNum: number, layout: string) => {
    const isWindow =
      layout === '1+2'
        ? seatNum % 3 === 1 || seatNum % 3 === 0
        : layout === '2+2'
        ? seatNum % 4 === 1 || seatNum % 4 === 0
        : seatNum % 2 !== 0;

    const hasTable = [3, 4, 7, 8, 11, 12, 15, 16, 19, 20].includes(seatNum);
    const hasPower = true;
    const isForward = seatNum % 2 === 0;

    let position = isWindow ? "Deraza yonida 🪟" : "Yo'lak yonida 🚶";
    if (layout === 'coupe') {
      position = seatNum % 2 === 0 ? "Yuqori o'rin (Tepadagi divan)" : "Pastki o'rin (Qulay divan)";
    } else if (layout === 'platskart') {
      if (seatNum > 36) {
        position = seatNum % 2 === 0 ? "Yon tomondagi yuqori o'rin" : "Yon tomondagi pastki o'rin";
      } else {
        position = seatNum % 2 === 0 ? "Kupe ichidagi yuqori o'rin" : "Kupe ichidagi pastki o'rin";
      }
    }

    return {
      isWindow,
      hasTable,
      hasPower,
      isForward,
      position,
    };
  };

  const activeSeatMeta = getSeatInfo(selectedCoachNum, selectedSeatNum, currentCoach.layout);
  const selectedSeatKey = `${selectedCoachNum}-${selectedSeatNum}`;
  const isSelectedOccupied = OCCUPIED_SET.has(selectedSeatKey);

  const fullSeatLabel = `Vagon ${String(selectedCoachNum).padStart(2, '0')} • O'rindiq ${String(
    selectedSeatNum
  ).padStart(2, '0')} (${activeSeatMeta.position})`;

  const handleConfirm = () => {
    if (isSelectedOccupied) return;
    onConfirmSeat(
      train,
      currentCoach.classType,
      currentPrice,
      fullSeatLabel,
      travelDate
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md transition-opacity flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#0c1427] text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex-shrink-0 flex items-center justify-between border-b border-rose-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-300 shadow-inner">
              <TrainIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                  <span>💺 Poyezd O'rindiqlarini Tanlash</span>
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Interaktiv Vagon Xaritasi
                </span>
              </div>
              <p className="text-xs text-rose-200/80 font-medium mt-0.5">
                {train.name} • {train.fromCity} ➔ {train.toCity} • Jo'nash: {train.departureTime} ({travelDate})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
            title="Yopish (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wagon Tabs Selector */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <span>Poyezd Tarkibi (Vagonni tanlang):</span>
            </span>
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
              Tanlangan: Vagon 0{selectedCoachNum} ({currentCoach.badge})
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {COACHES.map((coach) => {
              const isSelected = coach.number === selectedCoachNum;
              const coachPrice = getCoachPrice(coach);
              return (
                <button
                  key={coach.number}
                  type="button"
                  onClick={() => {
                    setSelectedCoachNum(coach.number);
                    // auto pick an unoccupied seat in the new coach
                    for (let s = 1; s <= coach.totalSeats; s++) {
                      if (!OCCUPIED_SET.has(`${coach.number}-${s}`)) {
                        setSelectedSeatNum(s);
                        break;
                      }
                    }
                  }}
                  className={`flex-shrink-0 px-3.5 py-2.5 rounded-2xl text-left border transition cursor-pointer min-w-[140px] flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 dark:border-rose-500 shadow-md ring-2 ring-rose-500/20'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      0{coach.number}-Vagon
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                        isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                      }`}
                    >
                      {coach.classType}
                    </span>
                  </div>
                  <div className="text-[11px] font-black text-rose-600 dark:text-rose-400">
                    {formatPrice(coachPrice, currency)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend & Seat Info Bar */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500 text-white flex items-center justify-center text-[9px] shadow-sm">✓</span>
              <span>Tanlangan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600"></span>
              <span>Bo'sh o'rindiq</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-300 dark:bg-slate-700 opacity-60"></span>
              <span>Band (Sotilgan)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 text-xs">⚡</span>
              <span>220V Rozetka</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sky-500 text-xs">🪟</span>
              <span>Deraza</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
            <span>Harakat yo'nalishi:</span>
            <span className="text-rose-600 dark:text-rose-400 font-black flex items-center">
              Oldinga ➔
            </span>
          </div>
        </div>

        {/* Wagon Floor Plan (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/70 dark:bg-[#070d1e] space-y-6">
          {/* Coach Front Nose / Locomotive indicator */}
          <div className="max-w-2xl mx-auto flex items-center justify-between px-6 py-2 bg-gradient-to-r from-slate-200 via-rose-100 to-slate-200 dark:from-slate-800 dark:via-rose-950/60 dark:to-slate-800 rounded-t-3xl border-t border-x border-slate-300 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest shadow-inner">
            <div className="flex items-center gap-2">
              <TrainIcon className="w-4 h-4 text-rose-600" />
              <span>Lokomotiv Tomon (Bosh Vagon)</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-bold normal-case">
              <span>Harakat ➔</span>
            </div>
          </div>

          {/* Fuselage / Coach Body with Windows */}
          <div className="max-w-2xl mx-auto bg-white dark:bg-[#0e172e] rounded-b-3xl border-2 border-slate-300 dark:border-slate-700 shadow-xl overflow-hidden p-4 sm:p-6 relative">
            {/* Left Windows Row */}
            <div className="flex justify-between items-center mb-4 px-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`win-l-${i}`}
                  className="w-10 h-2 bg-sky-200 dark:bg-sky-900/60 rounded-full border border-sky-300 dark:border-sky-700"
                  title="Katta panoramik deraza"
                ></div>
              ))}
            </div>

            {/* Coach Amenities Quick Bar */}
            <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-around gap-2 text-xs">
              {currentCoach.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* SEAT GRID LAYOUT */}
            {/* VIP & BIZNES (1+2 Layout) */}
            {(currentCoach.layout === '1+2') && (
              <div className="space-y-3.5">
                {Array.from({ length: Math.ceil(currentCoach.totalSeats / 3) }).map((_, rowIdx) => {
                  const s1 = rowIdx * 3 + 1;
                  const s2 = rowIdx * 3 + 2;
                  const s3 = rowIdx * 3 + 3;

                  const isOcc1 = OCCUPIED_SET.has(`${selectedCoachNum}-${s1}`);
                  const isOcc2 = OCCUPIED_SET.has(`${selectedCoachNum}-${s2}`);
                  const isOcc3 = OCCUPIED_SET.has(`${selectedCoachNum}-${s3}`);

                  const isSel1 = selectedSeatNum === s1;
                  const isSel2 = selectedSeatNum === s2;
                  const isSel3 = selectedSeatNum === s3;

                  return (
                    <div
                      key={`row-${rowIdx}`}
                      className="flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30 p-2 rounded-2xl border border-slate-100 dark:border-slate-800/60"
                    >
                      {/* Left Single Seat (Window) */}
                      {s1 <= currentCoach.totalSeats ? (
                        <button
                          type="button"
                          disabled={isOcc1}
                          onClick={() => setSelectedSeatNum(s1)}
                          className={`relative w-16 sm:w-20 h-14 rounded-2xl font-black text-xs transition cursor-pointer flex flex-col items-center justify-center border-2 ${
                            isOcc1
                              ? 'bg-slate-200 dark:bg-slate-800/60 text-slate-400 border-dashed border-slate-300 dark:border-slate-700 cursor-not-allowed'
                              : isSel1
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-rose-500 dark:hover:border-rose-400 hover:shadow-md'
                          }`}
                        >
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400">
                            {isSel1 ? 'TANLANDI' : '🪟 Deraza'}
                          </span>
                          <span className="text-base font-black">
                            {String(s1).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] font-bold text-amber-500">⚡ 220V</span>
                        </button>
                      ) : (
                        <div className="w-16 sm:w-20 h-14"></div>
                      )}

                      {/* Aisle (Yo'lak) */}
                      <div className="flex-1 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-x border-dashed border-slate-200 dark:border-slate-800 py-2">
                        Yo'lak (Aisle)
                      </div>

                      {/* Right Double Seats */}
                      <div className="flex items-center gap-2">
                        {s2 <= currentCoach.totalSeats && (
                          <button
                            type="button"
                            disabled={isOcc2}
                            onClick={() => setSelectedSeatNum(s2)}
                            className={`relative w-16 sm:w-20 h-14 rounded-2xl font-black text-xs transition cursor-pointer flex flex-col items-center justify-center border-2 ${
                              isOcc2
                                ? 'bg-slate-200 dark:bg-slate-800/60 text-slate-400 border-dashed border-slate-300 dark:border-slate-700 cursor-not-allowed'
                                : isSel2
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-rose-500 dark:hover:border-rose-400 hover:shadow-md'
                            }`}
                          >
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400">
                              {isSel2 ? 'TANLANDI' : '🚶 Yo\'lak'}
                            </span>
                            <span className="text-base font-black">
                              {String(s2).padStart(2, '0')}
                            </span>
                            <span className="text-[9px] font-bold text-amber-500">⚡ 220V</span>
                          </button>
                        )}

                        {s3 <= currentCoach.totalSeats && (
                          <button
                            type="button"
                            disabled={isOcc3}
                            onClick={() => setSelectedSeatNum(s3)}
                            className={`relative w-16 sm:w-20 h-14 rounded-2xl font-black text-xs transition cursor-pointer flex flex-col items-center justify-center border-2 ${
                              isOcc3
                                ? 'bg-slate-200 dark:bg-slate-800/60 text-slate-400 border-dashed border-slate-300 dark:border-slate-700 cursor-not-allowed'
                                : isSel3
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-rose-500 dark:hover:border-rose-400 hover:shadow-md'
                            }`}
                          >
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400">
                              {isSel3 ? 'TANLANDI' : '🪟 Deraza'}
                            </span>
                            <span className="text-base font-black">
                              {String(s3).padStart(2, '0')}
                            </span>
                            <span className="text-[9px] font-bold text-amber-500">⚡ 220V</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* EKONOM (2+2 Layout) */}
            {(currentCoach.layout === '2+2') && (
              <div className="space-y-3.5">
                {Array.from({ length: Math.ceil(currentCoach.totalSeats / 4) }).map((_, rowIdx) => {
                  const s1 = rowIdx * 4 + 1;
                  const s2 = rowIdx * 4 + 2;
                  const s3 = rowIdx * 4 + 3;
                  const s4 = rowIdx * 4 + 4;

                  const seats = [
                    { num: s1, tag: '🪟 Deraza' },
                    { num: s2, tag: '🚶 Yo\'lak' },
                    { num: s3, tag: '🚶 Yo\'lak' },
                    { num: s4, tag: '🪟 Deraza' },
                  ];

                  return (
                    <div
                      key={`row-eco-${rowIdx}`}
                      className="flex items-center justify-between gap-2 sm:gap-3 bg-slate-50/50 dark:bg-slate-900/30 p-2 rounded-2xl border border-slate-100 dark:border-slate-800/60"
                    >
                      {/* Left 2 Seats */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {seats.slice(0, 2).map((st) => {
                          const isOcc = OCCUPIED_SET.has(`${selectedCoachNum}-${st.num}`);
                          const isSel = selectedSeatNum === st.num;
                          return (
                            <button
                              key={st.num}
                              type="button"
                              disabled={isOcc}
                              onClick={() => setSelectedSeatNum(st.num)}
                              className={`w-14 sm:w-16 h-13 rounded-2xl font-black text-xs transition cursor-pointer flex flex-col items-center justify-center border-2 ${
                                isOcc
                                  ? 'bg-slate-200 dark:bg-slate-800/60 text-slate-400 border-dashed border-slate-300 dark:border-slate-700 cursor-not-allowed'
                                  : isSel
                                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/30 scale-105'
                                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-rose-500 hover:shadow-sm'
                              }`}
                            >
                              <span className="text-[9px] font-mono text-slate-400">
                                {isSel ? 'TANLANDI' : st.tag}
                              </span>
                              <span className="text-sm font-black">{String(st.num).padStart(2, '0')}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Aisle */}
                      <div className="flex-1 text-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1">
                        Yo'lak
                      </div>

                      {/* Right 2 Seats */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {seats.slice(2, 4).map((st) => {
                          const isOcc = OCCUPIED_SET.has(`${selectedCoachNum}-${st.num}`);
                          const isSel = selectedSeatNum === st.num;
                          return (
                            <button
                              key={st.num}
                              type="button"
                              disabled={isOcc}
                              onClick={() => setSelectedSeatNum(st.num)}
                              className={`w-14 sm:w-16 h-13 rounded-2xl font-black text-xs transition cursor-pointer flex flex-col items-center justify-center border-2 ${
                                isOcc
                                  ? 'bg-slate-200 dark:bg-slate-800/60 text-slate-400 border-dashed border-slate-300 dark:border-slate-700 cursor-not-allowed'
                                  : isSel
                                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/30 scale-105'
                                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 hover:border-rose-500 hover:shadow-sm'
                              }`}
                            >
                              <span className="text-[9px] font-mono text-slate-400">
                                {isSel ? 'TANLANDI' : st.tag}
                              </span>
                              <span className="text-sm font-black">{String(st.num).padStart(2, '0')}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* KUPE / PLATSKART (Compartment Cabin Layout) */}
            {(currentCoach.layout === 'coupe' || currentCoach.layout === 'platskart') && (
              <div className="space-y-4">
                {Array.from({ length: Math.ceil(currentCoach.totalSeats / 4) }).map((_, compIdx) => {
                  const s1 = compIdx * 4 + 1; // Pastki chap
                  const s2 = compIdx * 4 + 2; // Tepadagi chap
                  const s3 = compIdx * 4 + 3; // Pastki o'ng
                  const s4 = compIdx * 4 + 4; // Tepadagi o'ng

                  return (
                    <div
                      key={`comp-${compIdx}`}
                      className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-slate-500 mb-2 border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
                        <span>🚪 Kupe Xonasi #{compIdx + 1}</span>
                        <span className="text-rose-600">4 ta yumshoq karavot</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Chap tomon karavotlar */}
                        <div className="space-y-2">
                          <button
                            type="button"
                            disabled={OCCUPIED_SET.has(`${selectedCoachNum}-${s2}`)}
                            onClick={() => setSelectedSeatNum(s2)}
                            className={`w-full py-2 px-3 rounded-xl border-2 text-xs font-black transition flex items-center justify-between ${
                              OCCUPIED_SET.has(`${selectedCoachNum}-${s2}`)
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-dashed border-slate-300 dark:border-slate-700'
                                : selectedSeatNum === s2
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <span>#{String(s2).padStart(2, '0')} Tepadagi o'rin</span>
                            <span className="text-[10px] text-amber-500">Yuqori</span>
                          </button>

                          <button
                            type="button"
                            disabled={OCCUPIED_SET.has(`${selectedCoachNum}-${s1}`)}
                            onClick={() => setSelectedSeatNum(s1)}
                            className={`w-full py-2 px-3 rounded-xl border-2 text-xs font-black transition flex items-center justify-between ${
                              OCCUPIED_SET.has(`${selectedCoachNum}-${s1}`)
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-dashed border-slate-300 dark:border-slate-700'
                                : selectedSeatNum === s1
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <span>#{String(s1).padStart(2, '0')} Pastki o'rin</span>
                            <span className="text-[10px] text-emerald-600 font-bold">Qulay Pastki</span>
                          </button>
                        </div>

                        {/* O'ng tomon karavotlar */}
                        <div className="space-y-2">
                          <button
                            type="button"
                            disabled={OCCUPIED_SET.has(`${selectedCoachNum}-${s4}`)}
                            onClick={() => setSelectedSeatNum(s4)}
                            className={`w-full py-2 px-3 rounded-xl border-2 text-xs font-black transition flex items-center justify-between ${
                              OCCUPIED_SET.has(`${selectedCoachNum}-${s4}`)
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-dashed border-slate-300 dark:border-slate-700'
                                : selectedSeatNum === s4
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <span>#{String(s4).padStart(2, '0')} Tepadagi o'rin</span>
                            <span className="text-[10px] text-amber-500">Yuqori</span>
                          </button>

                          <button
                            type="button"
                            disabled={OCCUPIED_SET.has(`${selectedCoachNum}-${s3}`)}
                            onClick={() => setSelectedSeatNum(s3)}
                            className={`w-full py-2 px-3 rounded-xl border-2 text-xs font-black transition flex items-center justify-between ${
                              OCCUPIED_SET.has(`${selectedCoachNum}-${s3}`)
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-dashed border-slate-300 dark:border-slate-700'
                                : selectedSeatNum === s3
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <span>#{String(s3).padStart(2, '0')} Pastki o'rin</span>
                            <span className="text-[10px] text-emerald-600 font-bold">Qulay Pastki</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Right Windows Row */}
            <div className="flex justify-between items-center mt-6 px-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`win-r-${i}`}
                  className="w-10 h-2 bg-sky-200 dark:bg-sky-900/60 rounded-full border border-sky-300 dark:border-sky-700"
                  title="Panoramik deraza"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Seat Summary & Action Footer */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-400 dark:border-emerald-600 flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-300 font-black shadow-sm flex-shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">O'rin</span>
              <span className="text-base leading-none">
                {String(selectedSeatNum).padStart(2, '0')}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  Vagon 0{selectedCoachNum} • O'rindiq {String(selectedSeatNum).padStart(2, '0')}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {currentCoach.classType}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {activeSeatMeta.position} • Harakat yo'nalishida • 220V Rozetka
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-black text-slate-400 block">Jami To'lov</span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 block">
                {formatPrice(currentPrice, currency)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Bekor qilish
              </button>

              <button
                type="button"
                disabled={isSelectedOccupied}
                onClick={handleConfirm}
                className="px-5 sm:px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/30 transition cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>O'rindiqni Tanlash & Bron Qilish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

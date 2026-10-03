import React from 'react';
import { Calendar, TrendingDown, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/helpers';

interface LowFareCalendarProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
  currency: Currency;
  basePriceUZS?: number;
}

export const LowFareCalendar: React.FC<LowFareCalendarProps> = ({
  currentDate,
  onSelectDate,
  currency,
  basePriceUZS = 2190000,
}) => {
  // Generate 7 consecutive days centered on current date
  const parseDate = (dStr: string) => {
    const parts = dStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date();
  };

  const baseDate = parseDate(currentDate);

  const days = [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + offset);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateString = `${yyyy}-${mm}-${dd}`;

    // Deterministic realistic price variation based on day offset
    const variations = [-120000, 45000, -250000, 0, -80000, 160000, -190000];
    const price = Math.max(180000, basePriceUZS + variations[offset + 3]);

    const dayNamesUz = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'];
    const monthNamesUz = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

    return {
      dateString,
      dayName: dayNamesUz[d.getDay()],
      dayNum: d.getDate(),
      monthName: monthNamesUz[d.getMonth()],
      price,
      isCurrent: offset === 0,
    };
  });

  // Find lowest price
  const lowestPrice = Math.min(...days.map((d) => d.price));

  return (
    <div
      id="low-fare-calendar-bar"
      className="bg-white dark:bg-[#111c35] p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5 transition-colors mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
            Past narxlar taqvimi
          </span>
          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-black px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/60 hidden sm:inline-block">
            Kunlar bo'yicha solishtirish
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-black">
          <TrendingDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Eng past narx:</span>
          <span>{formatPrice(lowestPrice, currency)}</span>
        </div>
      </div>

      {/* 7 Days Strip */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day) => {
          const isCheapest = day.price === lowestPrice;
          const isSelected = day.isCurrent;

          return (
            <button
              key={day.dateString}
              type="button"
              onClick={() => onSelectDate(day.dateString)}
              className={`p-2 sm:p-2.5 rounded-2xl text-center border transition cursor-pointer flex flex-col justify-between items-center relative ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/70 ring-2 ring-blue-500/30 shadow-sm'
                  : isCheapest
                  ? 'border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/30 hover:border-emerald-500'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40'
              }`}
            >
              {isCheapest && (
                <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-white px-1.5 py-0.2 rounded-full absolute -top-2">
                  Arzon
                </span>
              )}

              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">
                {day.dayName}
              </div>

              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white my-0.5">
                {day.dayNum} {day.monthName}
              </div>

              <div
                className={`text-[10px] sm:text-xs font-black truncate w-full ${
                  isCheapest
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isSelected
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {formatPrice(day.price, currency)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

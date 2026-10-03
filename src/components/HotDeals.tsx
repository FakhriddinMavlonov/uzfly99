import React from 'react';
import { Flame, Clock, Sparkles } from 'lucide-react';
import { Currency, Language } from '../types';
import { formatPrice, DICTIONARY } from '../utils/helpers';

interface HotDealsProps {
  onSelectRoute: (from: string, to: string) => void;
  currency: Currency;
  language: Language;
}

export const HotDeals: React.FC<HotDealsProps> = ({
  onSelectRoute,
  currency,
  language,
}) => {
  const t = DICTIONARY[language];

  const deals = [
    {
      from: 'Samarqand',
      fromCode: 'SKD',
      to: 'Istanbul',
      toCode: 'IST',
      airline: 'Turkish Airlines',
      date: 'Ertaga',
      discount: '-32%',
      oldPrice: 3200000,
      newPrice: 2190000,
      seatsLeft: 3,
      tag: 'Super Taklif',
    },
    {
      from: 'Toshkent',
      fromCode: 'TAS',
      to: 'Dubay',
      toCode: 'DXB',
      airline: 'Flydubai',
      date: '25-Sentabr',
      discount: '-25%',
      oldPrice: 3100000,
      newPrice: 2350000,
      seatsLeft: 5,
      tag: 'Issiq Reys',
    },
    {
      from: 'Toshkent',
      fromCode: 'TAS',
      to: 'Samarqand',
      toCode: 'SKD',
      airline: 'Silk Avia',
      date: 'Bugun kechqurun',
      discount: '-40%',
      oldPrice: 380000,
      newPrice: 240000,
      seatsLeft: 2,
      tag: 'Mahalliy Parvoz',
    },
    {
      from: 'Toshkent',
      fromCode: 'TAS',
      to: 'Jidda (Umra)',
      toCode: 'JED',
      airline: 'Uzbekistan Airways',
      date: '28-Sentabr',
      discount: '-18%',
      oldPrice: 4200000,
      newPrice: 3600000,
      seatsLeft: 7,
      tag: 'Ziyorat',
    },
    {
      from: 'Toshkent',
      fromCode: 'TAS',
      to: 'Moskva',
      toCode: 'SVO',
      airline: 'Uzbekistan Airways',
      date: '24-Sentabr',
      discount: '-22%',
      oldPrice: 2750000,
      newPrice: 2150000,
      seatsLeft: 4,
      tag: 'Cheklangan',
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.hotDealsTitle}</span>
            <span className="text-amber-500 text-2xl">🔥</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
            {t.hotDealsSubtitle}
          </p>
        </div>
      </div>

      <div
        id="hot-deals-container"
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-none"
      >
        {deals.map((deal, idx) => (
          <div
            key={idx}
            onClick={() => onSelectRoute(deal.fromCode, deal.toCode)}
            className="flex-shrink-0 w-72 bg-gradient-to-br from-white to-amber-50/40 dark:from-[#111c35] dark:to-[#172545] p-4 rounded-2xl border border-amber-200/70 dark:border-amber-900/40 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white" />
                  {deal.discount}
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {deal.date}
                </span>
              </div>

              <div className="my-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{deal.airline}</div>
                <div className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex items-center gap-2">
                  <span>{deal.from}</span>
                  <span className="text-slate-400">➔</span>
                  <span>{deal.to}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {deal.fromCode} — {deal.toCode}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-100 dark:border-amber-900/30 flex items-end justify-between">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through block">
                  {formatPrice(deal.oldPrice, currency)}
                </span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400">
                  {formatPrice(deal.newPrice, currency)}
                </span>
              </div>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/50 px-2 py-1 rounded-lg">
                Faqat {deal.seatsLeft} ta joy!
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

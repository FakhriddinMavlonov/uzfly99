import React, { useState } from 'react';
import { Coins, X, ArrowRightLeft, TrendingUp, RefreshCw } from 'lucide-react';
import { Currency } from '../types';

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: Currency;
  onSelectCurrency: (c: Currency) => void;
}

const RATES: Record<string, { rateToUZS: number; name: string; symbol: string; flag: string }> = {
  USD: { rateToUZS: 12850, name: 'AQSH Dollari', symbol: '$', flag: '🇺🇸' },
  EUR: { rateToUZS: 13950, name: 'Yevro', symbol: '€', flag: '🇪🇺' },
  RUB: { rateToUZS: 138, name: 'Rossiya Rubli', symbol: '₽', flag: '🇷🇺' },
  AED: { rateToUZS: 3498, name: 'BAA Dirhami', symbol: 'د.إ', flag: '🇦🇪' },
  TRY: { rateToUZS: 378, name: 'Turkiya Lirasi', symbol: '₺', flag: '🇹🇷' },
  KZT: { rateToUZS: 26.5, name: 'Qozog\'iston Tengesi', symbol: '₸', flag: '🇰🇿' },
};

export const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
  onSelectCurrency,
}) => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('UZS');

  if (!isOpen) return null;

  // Convert amount from fromCurr to UZS, then from UZS to toCurr
  const convert = (val: number, from: string, to: string) => {
    let inUZS = 0;
    if (from === 'UZS') inUZS = val;
    else inUZS = val * (RATES[from]?.rateToUZS || 1);

    if (to === 'UZS') return inUZS;
    return inUZS / (RATES[to]?.rateToUZS || 1);
  };

  const result = convert(amount, fromCurr, toCurr);

  const swap = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      id="currency-converter-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          id="currency-converter-modal"
          className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white dark:bg-[#111c35] text-slate-800 dark:text-slate-100 text-left align-middle shadow-2xl border border-slate-200 dark:border-slate-800 my-6"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Valyuta Kurslari & Konvertor
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                O'zbekiston Markaziy Banki rasmiy kursi asosida
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Live Rates Grid */}
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
              Joriy Valyuta Kurslari (so'mda)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(RATES).slice(0, 6).map(([code, data]) => (
                <div
                  key={code}
                  className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40"
                >
                  <div className="flex items-center gap-1 text-xs">
                    <span>{data.flag}</span>
                    <span className="font-black text-slate-900 dark:text-white">{code}</span>
                  </div>
                  <div className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {data.rateToUZS.toLocaleString()} UZS
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
              Tezkor Hisoblagich
            </span>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Summa"
                />
              </div>

              <select
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="RUB">RUB (₽)</option>
                <option value="AED">AED (Dirham)</option>
                <option value="TRY">TRY (Lira)</option>
                <option value="UZS">UZS (So'm)</option>
              </select>

              <button
                type="button"
                onClick={swap}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer transition active:scale-95"
                title="Almashtirish"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              <select
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-black text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="UZS">UZS (So'm)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="RUB">RUB (₽)</option>
                <option value="AED">AED (Dirham)</option>
                <option value="TRY">TRY (Lira)</option>
              </select>
            </div>

            {/* Calculated Result Card */}
            <div className="p-3 bg-white dark:bg-[#111c35] rounded-xl border border-slate-200/90 dark:border-slate-700/80 text-center">
              <span className="text-[10px] text-slate-400 font-black uppercase block">
                Natija:
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurr}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <span className="text-[10px] text-slate-400 font-bold">
            ✓ Kurslar har kuni yangilanadi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer transition shadow-sm"
          >
            Yopish
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

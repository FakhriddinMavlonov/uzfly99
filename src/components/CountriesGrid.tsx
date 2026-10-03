import React from 'react';
import { ArrowUpRight, Zap } from 'lucide-react';
import { COUNTRIES_LIST } from '../data/mockData';
import { Currency, Language } from '../types';
import { formatPrice, DICTIONARY } from '../utils/helpers';

interface CountriesGridProps {
  onSelectCountry: (cityCode: string) => void;
  currency: Currency;
  language: Language;
}

export const CountriesGrid: React.FC<CountriesGridProps> = ({
  onSelectCountry,
  currency,
  language,
}) => {
  const t = DICTIONARY[language];

  return (
    <section id="countries-section" className="scroll-mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.countriesTitle}</span>
            <span className="text-emerald-500 text-2xl">🌍</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
            {t.countriesSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-xl text-xs font-black border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            <span>{t.instantEngine}</span>
          </span>
        </div>
      </div>

      {/* Grid of Countries */}
      <div
        id="countries-grid-container"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
      >
        {COUNTRIES_LIST.map((country) => (
          <button
            key={country.code}
            onClick={() => onSelectCountry(country.cityCode)}
            className="group bg-white dark:bg-[#111c35] hover:bg-blue-50/50 dark:hover:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition text-left cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition transform">
                  {country.flag}
                </span>
                <span className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <h4 className="font-black text-slate-900 dark:text-white text-sm mt-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {country.name}
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                {country.mainCity} ({country.cityCode})
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                {country.flightsCount} reys
              </span>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                {formatPrice(country.minPriceUZS, currency)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

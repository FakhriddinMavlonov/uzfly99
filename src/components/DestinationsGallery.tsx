import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';
import { DESTINATION_CARDS } from '../data/mockData';
import { Currency, Language } from '../types';
import { formatPrice, DICTIONARY } from '../utils/helpers';

interface DestinationsGalleryProps {
  onSelectCity: (code: string) => void;
  currency: Currency;
  language: Language;
}

export const DestinationsGallery: React.FC<DestinationsGalleryProps> = ({
  onSelectCity,
  currency,
  language,
}) => {
  const t = DICTIONARY[language];

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.destinationsTitle}</span>
            <span className="text-blue-600">🌍</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
            {t.destinationsSubtitle}
          </p>
        </div>
      </div>

      <div
        id="destination-photo-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {DESTINATION_CARDS.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectCity(item.code)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 h-64 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.city}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-90"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            {/* Badge */}
            {item.badge && (
              <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20">
                {item.badge}
              </span>
            )}

            {/* Bottom Content */}
            <div className="absolute bottom-3 inset-x-3 text-white">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-0.5">
                <span>{item.flag}</span>
                <span>{item.country}</span>
              </div>
              <h3 className="text-lg font-black tracking-tight">{item.city}</h3>
              <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-300 uppercase block">boshlanadi</span>
                  <span className="text-sm font-black text-amber-300">
                    {formatPrice(item.lowestPriceUZS, currency)}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-blue-600 flex items-center justify-center transition">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

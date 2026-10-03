import React, { useState } from 'react';
import { Compass, Sparkles, Star, ArrowRight, ShieldCheck, Globe2, Plane, Check } from 'lucide-react';
import { Currency, Language } from '../types';
import { formatPrice, DICTIONARY } from '../utils/helpers';

interface TravelGuideProps {
  currency: Currency;
  language: Language;
  onSelectRoute: (from: string, to: string) => void;
}

export const BakuGuide: React.FC<TravelGuideProps> = ({
  currency,
  language,
  onSelectRoute,
}) => {
  const t = DICTIONARY[language];
  const [filterTag, setFilterTag] = useState<'all' | 'visa-free' | 'popular'>('all');

  const visaFreeCountries = [
    {
      country: 'Turkiya',
      city: 'Istanbul',
      cityCode: 'IST',
      flag: '🇹🇷',
      stayLimit: '90 kun vizasiz',
      desc: 'Bosfor bo\'g\'ozi, Moviy masjid va qadimiy bozorlar. O\'zbekistonliklar uchun eng sevimli yo\'nalish.',
      tag: '90 kun',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=80',
      price: 2190000,
    },
    {
      country: 'BAA',
      city: 'Dubay',
      cityCode: 'DXB',
      flag: '🇦🇪',
      stayLimit: '30 kun vizasiz / soddalashtirilgan',
      desc: 'Burj Xalifa, Dubay Mall va zamonaviy osmono\'par binolar. Qishki va kuzgi eng qulay sayohat.',
      tag: '30 kun',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
      price: 2350000,
    },
    {
      country: 'Gruziya',
      city: 'Tbilisi',
      cityCode: 'TBS',
      flag: '🇬🇪',
      stayLimit: '360 kun vizasiz',
      desc: 'Kavkaz tog\'lari, Narikala qal\'asi va betakror mehmondo\'stlik madaniyati.',
      tag: '1 yil vizasiz',
      image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&auto=format&fit=crop&q=80',
      price: 2280000,
    },
    {
      country: 'Malayziya',
      city: 'Kuala Lumpur',
      cityCode: 'KUL',
      flag: '🇲🇾',
      stayLimit: '30 kun vizasiz',
      desc: 'Petronas egizak minoralari, Batu g\'orlari va ekzotik yashil tabiat.',
      tag: '30 kun',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80',
      price: 3850000,
    },
    {
      country: 'Qozog\'iston',
      city: 'Olmaota',
      cityCode: 'ALA',
      flag: '🇰🇿',
      stayLimit: '30 kun vizasiz',
      desc: 'Shimbuloq tog\' kurorti, Katta Olmaota ko\'li va yaqin qardosh madaniyat.',
      tag: '30 kun',
      image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&auto=format&fit=crop&q=80',
      price: 1100000,
    },
    {
      country: 'Tailand',
      city: 'Bangkok',
      cityCode: 'BKK',
      flag: '🇹🇭',
      stayLimit: 'Elektron viza / VOA',
      desc: 'Ekzotik orollar, Pxuket plyajlari va rang-barang madaniy maskanlar.',
      tag: 'Tezkor viza',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80',
      price: 4200000,
    },
  ];

  const popularRoutes = [
    { from: 'Toshkent', fromCode: 'TAS', to: 'Istanbul', toCode: 'IST', price: 2190000, flag: '🇹🇷' },
    { from: 'Toshkent', fromCode: 'TAS', to: 'Dubay', toCode: 'DXB', price: 2350000, flag: '🇦🇪' },
    { from: 'Samarqand', fromCode: 'SKD', to: 'Istanbul', toCode: 'IST', price: 2190000, flag: '🇹🇷' },
    { from: 'Toshkent', fromCode: 'TAS', to: 'Moskva', toCode: 'SVO', price: 2150000, flag: '🇷🇺' },
    { from: 'Toshkent', fromCode: 'TAS', to: 'Samarqand', toCode: 'SKD', price: 240000, flag: '🇺🇿' },
    { from: 'Toshkent', fromCode: 'TAS', to: 'Buxoro', toCode: 'BHK', price: 260000, flag: '🇺🇿' },
  ];

  return (
    <div className="space-y-10">
      {/* Media Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="max-w-xl relative z-10">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 inline-block">
            Yo'lovchi qo'llanmasi • aviasales.uz
          </span>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight mt-3 mb-2">
            Vizasiz yoki yengil kirish mumkin bo'lgan davlatlar
          </h3>
          <p className="text-xs sm:text-sm text-white/90 font-medium mb-5 leading-relaxed">
            O'zbekiston fuqarolik pasporti bilan qayerlarga qulay va tez yetib borish mumkin? Turkiya, BAA, Gruziya, Malayziya va boshqa ajoyib mamlakatlarga eng arzon to'g'ridan-to'g'ri reyslar.
          </p>
          <button
            onClick={() => onSelectRoute('TAS', 'IST')}
            className="px-6 py-3 bg-white text-slate-900 font-black text-xs rounded-xl hover:bg-slate-100 transition shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>Eng arzon yo'nalishlarni ko'rish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden sm:block">
          <div className="text-9xl font-black rotate-12 select-none">✈️</div>
        </div>
      </section>

      {/* Visa-Free Destinations Section */}
      <section className="bg-white dark:bg-[#111c35] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Vizasiz Sayohat Yo'nalishlari</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
              O'zbekiston fuqarolari uchun ruxsat etilgan muddatlar va arzon chiptalar
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              ✓ Qulay reyslar
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visaFreeCountries.map((dest) => (
            <div
              key={dest.country}
              className="rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 group bg-slate-50/80 dark:bg-slate-900/60 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={dest.image}
                  alt={dest.country}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20">
                  {dest.tag}
                </span>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <div className="text-base font-black flex items-center gap-1.5">
                    <span>{dest.flag}</span>
                    <span>{dest.country}, {dest.city}</span>
                  </div>
                  <div className="text-[10px] font-medium text-white/80">
                    {dest.stayLimit}
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {dest.desc}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Narxi</span>
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                      {formatPrice(dest.price, currency)} dan
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectRoute('TAS', dest.cityCode)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer transition shadow-sm flex items-center gap-1 active:scale-95"
                  >
                    <span>Reyslar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="bg-white dark:bg-[#111c35] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>{t.popularTitle}</span>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
            To'g'ridan-to'g'ri reyslar
          </span>
        </h3>

        <div
          id="popular-grid-container"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {popularRoutes.map((r, idx) => (
            <div
              key={idx}
              onClick={() => onSelectRoute(r.fromCode, r.toCode)}
              className="bg-slate-50/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.flag}</span>
                <div>
                  <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {r.from} ➔ {r.to}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    {r.fromCode} — {r.toCode}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block uppercase">dan</span>
                <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400">
                  {formatPrice(r.price, currency)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const TravelGuide = BakuGuide;

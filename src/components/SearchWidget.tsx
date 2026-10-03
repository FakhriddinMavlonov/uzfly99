import React from 'react';
import { Plane, Earth, Hotel, Train, MapPin, Heart, ArrowRightLeft, Route, Sparkles, Gift, Repeat, CheckCircle2 } from 'lucide-react';
import { Airport, CabinClass, Language, ServiceTab } from '../types';
import { DICTIONARY, DiscountDetails, UserProfile } from '../utils/helpers';
import { CityPickerDropdown } from './CityPickerDropdown';
import { PassengerClassPicker } from './PassengerClassPicker';
import { TimeSlotPicker } from './TimeSlotPicker';

interface SearchWidgetProps {
  activeTab: ServiceTab;
  setActiveTab: (tab: ServiceTab) => void;
  airports: Airport[];
  fromCode: string;
  setFromCode: (code: string) => void;
  toCode: string;
  setToCode: (code: string) => void;
  departDate: string;
  setDepartDate: (d: string) => void;
  returnDate: string;
  setReturnDate: (d: string) => void;
  passengers: number;
  setPassengers: (p: number) => void;
  cabinClass: CabinClass;
  setCabinClass: (c: CabinClass) => void;
  timeSlot: string;
  setTimeSlot: (s: string) => void;
  onSearch: () => void;
  onSwap: () => void;
  language: Language;
  familyBundleSet?: number | null;
  setFamilyBundleSet?: (count: number | null) => void;
  userProfile?: UserProfile | null;
  discountInfo?: DiscountDetails;
  onOpenAuth?: () => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  activeTab,
  setActiveTab,
  airports,
  fromCode,
  setFromCode,
  toCode,
  setToCode,
  departDate,
  setDepartDate,
  returnDate,
  setReturnDate,
  passengers,
  setPassengers,
  cabinClass,
  setCabinClass,
  timeSlot,
  setTimeSlot,
  onSearch,
  onSwap,
  language,
  familyBundleSet,
  setFamilyBundleSet,
  userProfile,
  discountInfo,
  onOpenAuth,
}) => {
  const t = DICTIONARY[language];

  return (
    <section className="bg-gradient-to-b from-[#0c73fe] to-[#0b63db] dark:from-[#0b162f] dark:to-[#070e1e] text-white pt-6 pb-20 px-4 sm:px-8 relative shadow-inner transition-colors duration-300">
      <div className="max-w-5xl mx-auto text-center mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 leading-tight">
          {t.heroTitle}
        </h1>
        <p className="text-sky-100 dark:text-slate-300 text-xs sm:text-sm font-medium">
          O'zbekistonning barcha viloyatlaridan dunyo bo'ylab to'g'ridan-to'g'ri va eng arzon tariflar
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Service Navigation Tabs */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          <div className="bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1 border border-white/15 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('avia')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition ${
                activeTab === 'avia'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>{t.flightsTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('countries')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition ${
                activeTab === 'countries'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Earth className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.countriesTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('hotel')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition ${
                activeTab === 'hotel'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Hotel className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.hotelsTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('train')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition ${
                activeTab === 'train'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Train className="w-3.5 h-3.5 text-rose-300" />
              <span>{t.trainsTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('impressions')}
              className={`hidden md:flex px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black items-center gap-2 cursor-pointer transition ${
                activeTab === 'impressions'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t.impressionsTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition ${
                activeTab === 'favorites'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{t.favoritesTab}</span>
            </button>
          </div>
        </div>

        {/* Unified Aviasales Search Bar */}
        <div
          id="search-section"
          className="bg-white dark:bg-[#111c35] rounded-3xl p-2.5 sm:p-3 text-slate-800 dark:text-slate-100 shadow-2xl border border-white/20 dark:border-slate-800/80 flex flex-col lg:flex-row items-stretch gap-2 transition-colors"
        >
          {/* Field 1: Qayerdan */}
          <CityPickerDropdown
            id="avia-from"
            label={t.from}
            selectedCode={fromCode}
            onSelect={setFromCode}
            airports={airports}
            iconType="departure"
          />

          {/* Swap Cities Button */}
          <div className="flex items-center justify-center -my-1 lg:my-0 self-center">
            <button
              id="swap-cities-btn"
              type="button"
              onClick={onSwap}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 text-slate-500 dark:text-slate-300 transition font-bold border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm active:scale-95"
              title="Shaharlarni almashtirish"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Field 2: Qayerga */}
          <div id="avia-destination-box" className="flex-1 flex">
            <CityPickerDropdown
              id="avia-to"
              label={t.to}
              selectedCode={toCode}
              onSelect={setToCode}
              airports={airports}
              iconType="arrival"
            />
          </div>

          {/* Field 3: Departure Date */}
          <div className="bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white dark:focus-within:bg-slate-800 min-w-[125px]">
            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
              {t.when}
            </label>
            <input
              type="date"
              id="avia-date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full bg-transparent font-black text-slate-900 dark:text-white text-xs focus:outline-none py-1 cursor-pointer"
            />
          </div>

          {/* Field 4: Return Date */}
          <div className="bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white dark:focus-within:bg-slate-800 min-w-[135px] relative group">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
                {t.back}
              </label>
              {returnDate ? (
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Qaytish faol
                </span>
              ) : (
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
                  +Borish-kelish
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <input
                type="date"
                id="avia-return"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent font-black text-slate-900 dark:text-white text-xs focus:outline-none py-1 cursor-pointer"
              />
              {returnDate && (
                <button
                  type="button"
                  onClick={() => setReturnDate('')}
                  className="text-slate-400 hover:text-rose-500 text-xs font-bold p-0.5"
                  title="Orqaga qaytish sanasini tozalash (Faqat bir tomonga)"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Field 5: Passengers & Class */}
          <PassengerClassPicker
            id="avia-passengers"
            passengers={passengers}
            cabinClass={cabinClass}
            onChangePassengers={setPassengers}
            onChangeClass={setCabinClass}
            familyBundleSet={familyBundleSet}
            onSelectFamilyBundle={setFamilyBundleSet}
          />

          {/* Field 6: Jo'nash Soati */}
          <TimeSlotPicker
            id="avia-time"
            value={timeSlot}
            onChange={setTimeSlot}
          />

          {/* Action Button: Chiptalarni toping */}
          <button
            type="button"
            id="search-avia-btn"
            onClick={onSearch}
            className="px-6 py-4 bg-[#ff6d00] hover:bg-[#e65c00] active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/30 transition flex items-center justify-center cursor-pointer whitespace-nowrap"
          >
            {t.searchBtn}
          </button>
        </div>

        {/* Quick Family & Group Sets Bar with 50% discount (USER REQ: 2, 4, 6, 8, 16 kishilik set, butun dunyoga amal qilsin) */}
        <div className="mt-3 bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 sm:p-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
              <span>🌍 BUTUN DUNYO SETLARI:</span>
            </span>
            <span className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full animate-pulse shadow-sm">
              -50% CHEGIRMA
            </span>
            <span className="text-[11px] text-sky-100 font-semibold hidden sm:inline">
              (Xohlagan davlatingizga amal qiladi)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { count: 2, label: '👫 2 kishilik' },
              { count: 4, label: '👨‍👩‍👧‍👦 4 kishilik' },
              { count: 6, label: '👨‍👩‍👧‍👦 6 kishilik' },
              { count: 8, label: '👨‍👩‍👧‍👦 8 kishilik' },
              { count: 16, label: '🏢 16 kishilik' },
            ].map((item) => {
              const isActive = passengers === item.count;
              return (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => {
                    setPassengers(item.count);
                    if (setFamilyBundleSet) setFamilyBundleSet(item.count);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 border ${
                    isActive
                      ? 'bg-rose-600 border-white text-white shadow-md ring-2 ring-rose-300 scale-105'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[9px] bg-rose-500/90 px-1 rounded text-white font-black">-50%</span>
                </button>
              );
            })}

            {passengers > 1 && (
              <button
                type="button"
                onClick={() => {
                  setPassengers(1);
                  if (setFamilyBundleSet) setFamilyBundleSet(null);
                }}
                className="px-2 py-1 text-[11px] text-white/80 hover:text-white underline cursor-pointer font-bold"
              >
                Oddiy (1)
              </button>
            )}
          </div>
        </div>

        {/* Search Bottom Controls */}
        <div className="flex flex-wrap items-center justify-between text-xs font-bold text-white/90 mt-3 px-2">
          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <Route className="w-3.5 h-3.5 text-sky-200" />
            <span>{t.complexRoute}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="booking-sync"
              defaultChecked
              className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="booking-sync" className="cursor-pointer select-none">
              {t.bookingSyncText}
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

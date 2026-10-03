import React from 'react';
import { Plane, Luggage, Clock, CheckCircle2, Heart, Sparkles, AlertCircle, Bell, Scale } from 'lucide-react';
import { Flight, Currency, Language, SortMode } from '../types';
import { formatPrice, DICTIONARY, DiscountDetails, UserProfile } from '../utils/helpers';
import { CustomSelect, SelectOption } from './ui/CustomSelect';
import { Gift } from 'lucide-react';

interface FlightResultsProps {
  flights: Flight[];
  currency: Currency;
  language: Language;
  sortMode: SortMode;
  setSortMode: (s: SortMode) => void;
  selectedAirline: string;
  setSelectedAirline: (a: string) => void;
  selectedDirect: string;
  setSelectedDirect: (d: string) => void;
  onSelectSeat: (flight: Flight) => void;
  onFastBook: (flight: Flight) => void;
  favorites: string[];
  onToggleFavorite: (flightId: string) => void;
  departDate: string;
  onSelectDate: (date: string) => void;
  onOpenPriceAlert?: () => void;
  compareFlightIds?: string[];
  onToggleCompare?: (flightId: string) => void;
  onOpenCompare?: () => void;
  passengers?: number;
  familyBundleSet?: number | null;
  onSelectFamilyBundle?: (count: number | null) => void;
  userProfile?: UserProfile | null;
  discountInfo?: DiscountDetails;
  onOpenAuth?: () => void;
}

export const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  currency,
  language,
  sortMode,
  setSortMode,
  selectedAirline,
  setSelectedAirline,
  selectedDirect,
  setSelectedDirect,
  onSelectSeat,
  onFastBook,
  favorites,
  onToggleFavorite,
  departDate,
  onSelectDate,
  onOpenPriceAlert,
  compareFlightIds = [],
  onToggleCompare,
  onOpenCompare,
  passengers = 1,
  familyBundleSet,
  onSelectFamilyBundle,
  userProfile,
  discountInfo,
  onOpenAuth,
}) => {
  const t = DICTIONARY[language];

  // Calendar dates around selected date
  const calendarDays = React.useMemo(() => {
    const base = new Date(departDate || Date.now());
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('uz-UZ', { weekday: 'short' });
      const dayMonth = `${d.getDate()} ${d.toLocaleDateString('uz-UZ', { month: 'short' })}`;
      // Sample varying price for calendar
      const samplePrice = 2100000 + Math.abs(i * 140000) + (i === 0 ? -120000 : 0);
      days.push({
        iso,
        dayName,
        dayMonth,
        isCurrent: i === 0,
        priceUZS: samplePrice,
      });
    }
    return days;
  }, [departDate]);

  return (
    <div id="results-section" className="space-y-4">
      {/* Results Header Card with Registered Discount Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111c35] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h3 id="results-count" className="font-black text-slate-900 dark:text-white text-lg sm:text-xl">
              {flights.length} ta reys topildi
            </h3>
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-black px-2 py-0.5 rounded-full">
              Jonli qidiruv
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.officialGuarantee}
            </span>
            {onOpenPriceAlert && (
              <button
                type="button"
                onClick={onOpenPriceAlert}
                className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-black text-[11px] flex items-center gap-1 transition cursor-pointer"
              >
                <Bell className="w-3 h-3 text-amber-500" />
                <span>Narx tushishini kuzatish</span>
              </button>
            )}
          </div>
        </div>

        {/* Sort Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-1 text-xs font-bold self-start sm:self-auto">
          <button
            id="sort-cheapest"
            onClick={() => setSortMode('cheapest')}
            className={`sort-tab px-3 py-1.5 rounded-lg transition cursor-pointer ${
              sortMode === 'cheapest'
                ? 'bg-white dark:bg-[#1e2a4a] text-slate-900 dark:text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.cheapest}
          </button>
          <button
            id="sort-fastest"
            onClick={() => setSortMode('fastest')}
            className={`sort-tab px-3 py-1.5 rounded-lg transition cursor-pointer ${
              sortMode === 'fastest'
                ? 'bg-white dark:bg-[#1e2a4a] text-slate-900 dark:text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.fastest}
          </button>
          <button
            id="sort-recommended"
            onClick={() => setSortMode('recommended')}
            className={`sort-tab px-3 py-1.5 rounded-lg transition cursor-pointer ${
              sortMode === 'recommended'
                ? 'bg-white dark:bg-[#1e2a4a] text-slate-900 dark:text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.recommended}
          </button>
        </div>
      </div>

      {/* Low Fare Price Calendar Bar */}
      <div className="bg-white dark:bg-[#111c35] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span>{t.calendarTitle}</span>
        </p>
        <div id="price-calendar-bar" className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {calendarDays.map((cd) => (
            <button
              key={cd.iso}
              onClick={() => onSelectDate(cd.iso)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-center transition border cursor-pointer ${
                cd.isCurrent
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-300 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">
                {cd.dayName}, {cd.dayMonth}
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                {formatPrice(cd.priceUZS, currency)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Family & Group Sets Bar (USER REQ: 2, 4, 6, 8, 16 kishilik oilaviy to'plamlarga 50% chegirma, butun dunyoga amal qilsin) */}
      <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-blue-500/10 dark:from-rose-950/40 dark:via-amber-950/40 dark:to-blue-950/40 p-4 sm:p-5 rounded-3xl border-2 border-rose-300 dark:border-rose-800/60 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                Butun Dunyo Bo'yicha 50% Chegirma: 2, 4, 6, 8, 16 Kishilik Setlar
              </h4>
              <span className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-sm">
                -50% Chegirma
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
              Butun dunyoning xohlagan davlatiga <strong>2, 4, 6, 8 yoki 16 ta chipta</strong> xarid qilib, to'liq <strong>50% chegirmaga</strong> ega bo'ling! Yonma-yon o'rindiqlar avtomatik kafolatlanadi.
            </p>
          </div>

          {[2, 4, 6, 8, 12, 16].includes(passengers) && (
            <div className="flex items-center gap-2 bg-rose-600 text-white px-3.5 py-1.5 rounded-xl font-black text-xs shadow-md shadow-rose-600/30">
              <span>✓ 50% Chegirma Faol</span>
              <span>•</span>
              <span>{passengers} kishilik Butun Dunyo To'plami</span>
            </div>
          )}
        </div>

        {/* Set selector buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[
            { count: 1, label: '👤 Yakkaxon (1)', sub: 'Standart narx' },
            { count: 2, label: '👫 2 kishilik set', sub: 'Er-xotin / Juftlik' },
            { count: 4, label: '👨‍👩‍👧‍👦 4 kishilik set', sub: 'Oila to\'plami' },
            { count: 6, label: '👨‍👩‍👧‍👦 6 kishilik set', sub: 'Katta oila to\'plami' },
            { count: 8, label: '👨‍👩‍👦‍👦 8 kishilik set', sub: 'Qarindoshlar' },
            { count: 12, label: '👥 12 kishilik set', sub: 'Guruh paketi' },
            { count: 16, label: '🏢 16 kishilik set', sub: 'Katta jamoa' },
          ].map((item) => {
            const isSelected = item.count === 1 ? (!passengers || passengers === 1) : passengers === item.count;
            return (
              <button
                key={item.count}
                type="button"
                onClick={() => {
                  if (onSelectFamilyBundle) {
                    onSelectFamilyBundle(item.count === 1 ? null : item.count);
                  }
                }}
                className={`px-3 py-2 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? item.count === 1
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400 scale-[1.02]'
                    : 'bg-white dark:bg-[#111c35] border-slate-200 dark:border-slate-700 hover:border-rose-400 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black">{item.label}</span>
                  {item.count > 1 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${isSelected ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
                      -50%
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#111c35] p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            {t.filters}
          </span>
          
          <CustomSelect
            id="filter-airline"
            value={selectedAirline}
            onChange={setSelectedAirline}
            options={[
              { value: 'all', label: t.allAirlines, icon: '🌐' },
              { value: 'HY', label: 'Uzbekistan Airways', icon: '🇺🇿', badge: 'HY' },
              { value: 'TK', label: 'Turkish Airlines', icon: '🇹🇷', badge: 'TK' },
              { value: 'EK', label: 'Emirates', icon: '🇦🇪', badge: 'EK' },
              { value: 'FZ', label: 'Flydubai', icon: '✈️', badge: 'FZ' },
              { value: 'US', label: 'Silk Avia', icon: '🕊️', badge: 'US' },
              { value: 'HH', label: 'Qanot Sharq', icon: '🦅', badge: 'HH' },
            ]}
            className="w-48 sm:w-52"
          />

          <CustomSelect
            id="filter-direct"
            value={selectedDirect}
            onChange={setSelectedDirect}
            options={[
              { value: 'all', label: t.allFlights, icon: '✈️' },
              { value: 'direct', label: t.directOnly, icon: '⚡' },
            ]}
            className="w-40 sm:w-44"
          />
        </div>

        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t.includedTaxes}</span>
        </div>
      </div>

      {/* Flight Cards List */}
      <div id="results-list" className="space-y-3.5">
        {flights.length === 0 ? (
          <div className="bg-white dark:bg-[#111c35] p-10 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="text-lg font-black text-slate-800 dark:text-white">
              Ushbu filtrlar bo'yicha reyslar topilmadi
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Barcha aviakompaniyalar yoki boshqa jo'nash sanasini tanlab ko'ring.
            </p>
          </div>
        ) : (
          flights.map((flight) => {
            const isFav = favorites.includes(flight.id);
            return (
              <div
                key={flight.id}
                className="bg-white dark:bg-[#111c35] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 relative group"
              >
                {/* Flight Main Info */}
                <div className="flex-1 space-y-3">
                  {/* Airline & Tag Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{flight.airlineLogo}</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {flight.airline}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                      {flight.flightNumber}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      • {flight.aircraft}
                    </span>

                    {flight.featuredTag && (
                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        {flight.featuredTag}
                      </span>
                    )}
                  </div>

                  {/* Flight Times & Route Timeline */}
                  <div className="flex items-center gap-4 sm:gap-8">
                    {/* Departure */}
                    <div className="min-w-[80px]">
                      <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                        {flight.departureTime}
                      </div>
                      <div className="text-xs font-black text-slate-500 dark:text-slate-400 mt-1">
                        {flight.fromCity}{' '}
                        <span className="text-blue-600 dark:text-blue-400 font-mono">({flight.fromCode})</span>
                      </div>
                    </div>

                    {/* Timeline bar */}
                    <div className="flex-1 max-w-[200px] flex flex-col items-center">
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{flight.duration}</span>
                      </div>
                      <div className="w-full flex items-center relative">
                        <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700"></div>
                        <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute left-1/2 -translate-x-1/2 bg-white dark:bg-[#111c35] px-0.5" />
                      </div>
                      <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        {flight.direct ? "To'g'ridan-to'g'ri (Direct)" : `Tranzit: ${flight.transitCity}`}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="min-w-[80px]">
                      <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                        {flight.arrivalTime}
                      </div>
                      <div className="text-xs font-black text-slate-500 dark:text-slate-400 mt-1">
                        {flight.toCity}{' '}
                        <span className="text-blue-600 dark:text-blue-400 font-mono">({flight.toCode})</span>
                      </div>
                    </div>
                  </div>

                  {/* Baggage info & Family seats tag */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Luggage className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{flight.baggage}</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Qolgan o'rindiqlar: {flight.seatsRemaining} ta
                    </span>
                    {flight.isFamilyBundle && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          ✓ Oila uchun {flight.familyBundleCount} ta yonma-yon o'rindiq
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Price & Booking Actions */}
                <div className="lg:border-l lg:border-slate-100 dark:lg:border-slate-800 lg:pl-6 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t border-slate-100 dark:border-slate-800 lg:border-t-0">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {passengers > 1 ? `${passengers} Yo'lovchi uchun` : "1 Yo'lovchi uchun"}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                      {formatPrice(flight.basePriceUZS, currency)}
                    </div>
                    {passengers > 1 && (
                      <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">
                        1 kishi: {formatPrice(Math.round(flight.basePriceUZS / passengers), currency)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onToggleCompare && (
                      <button
                        type="button"
                        onClick={() => onToggleCompare(flight.id)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                          compareFlightIds.includes(flight.id)
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 font-black shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                        }`}
                        title={
                          compareFlightIds.includes(flight.id)
                            ? "Taqqoslashdan chiqarish"
                            : "Boshqa reyslar bilan taqqoslash"
                        }
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onToggleFavorite(flight.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        isFav
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-500'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                      }`}
                      title={isFav ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => onSelectSeat(flight)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <span>{flight.isFamilyBundle ? "💺 O'rindiqlar" : t.seatAndBook}</span>
                    </button>

                    <button
                      onClick={() => onFastBook(flight)}
                      className={`px-4 py-2.5 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        flight.isFamilyBundle
                          ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-rose-600/30'
                          : 'bg-[#ff6d00] hover:bg-[#e06000]'
                      }`}
                    >
                      <span>{flight.isFamilyBundle ? `👨‍👩‍👧‍👦 Setni 48s Bron Qilish` : t.fast48hBook}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Compare Action Bar */}
      {compareFlightIds.length > 0 && onOpenCompare && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 dark:bg-slate-800/95 text-white px-5 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3.5 border border-slate-700/80 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2 text-xs font-black">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>{compareFlightIds.length} ta reys tanlandi</span>
          </div>
          <button
            type="button"
            onClick={onOpenCompare}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-full cursor-pointer transition shadow-md flex items-center gap-1"
          >
            <span>Solishtirish</span>
            <span className="text-[10px] bg-indigo-800 px-1.5 py-0.2 rounded-full">
              {compareFlightIds.length}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

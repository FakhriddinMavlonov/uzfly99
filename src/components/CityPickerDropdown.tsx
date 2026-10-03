import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Check, PlaneTakeoff, PlaneLanding, ChevronDown, Sparkles } from 'lucide-react';
import { Airport } from '../types';

interface CityPickerDropdownProps {
  id: string;
  label: string;
  selectedCode: string;
  onSelect: (code: string) => void;
  airports: Airport[];
  iconType: 'departure' | 'arrival';
}

const POPULAR_CODES = ['SKD', 'TAS', 'IST', 'DXB', 'JED', 'SVO', 'FRA', 'BHK'];

export const CityPickerDropdown: React.FC<CityPickerDropdownProps> = ({
  id,
  label,
  selectedCode,
  onSelect,
  airports,
  iconType,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'uz' | 'intl' | 'popular'>('all');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Selected airport object
  const currentAirport = useMemo(() => {
    return airports.find((a) => a.code.toUpperCase() === selectedCode.toUpperCase()) || {
      city: selectedCode,
      code: selectedCode,
      country: '',
      flag: '✈️',
      name: `${selectedCode} Aeroporti`,
    };
  }, [airports, selectedCode]);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      // Auto focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filtered airports based on search query & category
  const filteredAirports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return airports.filter((airport) => {
      // Category filter
      if (categoryFilter === 'uz' && airport.country !== "O'zbekiston") return false;
      if (categoryFilter === 'intl' && airport.country === "O'zbekiston") return false;
      if (categoryFilter === 'popular' && !POPULAR_CODES.includes(airport.code)) return false;

      // Text query filter
      if (!q) return true;

      const matchCity = airport.city.toLowerCase().includes(q);
      const matchCode = airport.code.toLowerCase().includes(q);
      const matchCountry = airport.country.toLowerCase().includes(q);
      const matchName = airport.name.toLowerCase().includes(q);

      return matchCity || matchCode || matchCountry || matchName;
    });
  }, [airports, searchQuery, categoryFilter]);

  const handleSelect = (code: string) => {
    onSelect(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1"
    >
      {/* Trigger Box */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full text-left bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/90 dark:hover:bg-slate-800 transition p-2.5 rounded-2xl border ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-800'
            : 'border-slate-200/80 dark:border-slate-700'
        } cursor-pointer group flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            {iconType === 'departure' ? (
              <PlaneTakeoff className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            ) : (
              <PlaneLanding className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            )}
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
              {label}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'
            }`}
          />
        </div>

        {/* Selected City & IATA Badge */}
        <div className="flex items-center justify-between gap-1.5 mt-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-base select-none leading-none">{currentAirport.flag}</span>
            <span className="font-black text-slate-900 dark:text-white text-sm sm:text-[15px] truncate">
              {currentAirport.city}
            </span>
          </div>

          <span className="flex-shrink-0 font-mono text-[11px] font-black px-1.5 py-0.5 rounded-md bg-blue-100/80 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-700/60 shadow-2xs">
            {currentAirport.code}
          </span>
        </div>

        {/* Airport Subtitle */}
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate block mt-0.5">
          {currentAirport.name}
        </span>
      </button>

      {/* Floating Custom Popover (Aviasales-style modern card) */}
      {isOpen && (
        <div
          id={`${id}-popover`}
          className={`absolute top-full mt-2 w-[320px] sm:w-[380px] max-w-[94vw] bg-white dark:bg-[#111c35] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-700/90 z-50 text-slate-800 dark:text-slate-100 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 ${
            iconType === 'arrival' ? 'left-0 lg:left-auto lg:right-0' : 'left-0'
          }`}
        >
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Shahar yoki aeroport kodini yozing..."
                className="w-full bg-white dark:bg-slate-800 pl-9 pr-8 py-2 rounded-xl text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition whitespace-nowrap ${
                  categoryFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Barchasi
              </button>

              <button
                type="button"
                onClick={() => setCategoryFilter('uz')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition whitespace-nowrap flex items-center gap-1 ${
                  categoryFilter === 'uz'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>🇺🇿</span>
                <span>O'zbekiston</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoryFilter('intl')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition whitespace-nowrap flex items-center gap-1 ${
                  categoryFilter === 'intl'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>🌍</span>
                <span>Xalqaro</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoryFilter('popular')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition whitespace-nowrap flex items-center gap-1 ${
                  categoryFilter === 'popular'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Mashhur</span>
              </button>
            </div>
          </div>

          {/* Airports List */}
          <div className="max-h-64 sm:max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredAirports.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs font-bold text-slate-400">
                  "{searchQuery}" bo'yicha shahar yoki aeroport topilmadi.
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Iltimos, nomini yoki 3 harfli IATA kodini tekshiring (masalan: Samarqand, TAS, IST, JED).
                </p>
              </div>
            ) : (
              filteredAirports.map((airport) => {
                const isSelected = airport.code.toUpperCase() === selectedCode.toUpperCase();
                return (
                  <button
                    key={`${id}-${airport.code}`}
                    type="button"
                    onClick={() => handleSelect(airport.code)}
                    className={`w-full p-2.5 px-3.5 flex items-center justify-between text-left transition cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/70 border-l-4 border-blue-600 dark:border-blue-400'
                        : 'hover:bg-blue-50/40 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-xl flex-shrink-0 select-none">{airport.flag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-black truncate ${
                              isSelected
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}
                          >
                            {airport.city}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold truncate">
                            • {airport.country}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                          {airport.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`font-mono text-[11px] font-black px-2 py-0.5 rounded-lg border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 group-hover:border-blue-400'
                        }`}
                      >
                        {airport.code}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Footer */}
          <div className="p-2 px-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>O'zbekiston va 150+ xalqaro yo'nalishlar</span>
            <span className="font-mono">ESC - yopish</span>
          </div>
        </div>
      )}
    </div>
  );
};

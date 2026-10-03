import React, { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown, Plus, Minus, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { CabinClass } from '../types';

interface PassengerClassPickerProps {
  id?: string;
  passengers: number;
  cabinClass: CabinClass;
  onChangePassengers: (count: number) => void;
  onChangeClass: (c: CabinClass) => void;
  familyBundleSet?: number | null;
  onSelectFamilyBundle?: (count: number | null) => void;
}

export const PassengerClassPicker: React.FC<PassengerClassPickerProps> = ({
  id = 'avia-passengers-picker',
  passengers,
  cabinClass,
  onChangePassengers,
  onChangeClass,
  familyBundleSet,
  onSelectFamilyBundle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape
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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const FAMILY_BUNDLE_COUNTS = [2, 4, 6, 8, 12, 16];

  const increment = () => {
    if (passengers < 16) {
      const next = passengers + 1;
      onChangePassengers(next);
      if (FAMILY_BUNDLE_COUNTS.includes(next) && onSelectFamilyBundle) {
        onSelectFamilyBundle(next);
      }
    }
  };

  const decrement = () => {
    if (passengers > 1) {
      const next = passengers - 1;
      onChangePassengers(next);
      if (FAMILY_BUNDLE_COUNTS.includes(next) && onSelectFamilyBundle) {
        onSelectFamilyBundle(next);
      } else if (onSelectFamilyBundle && !FAMILY_BUNDLE_COUNTS.includes(next)) {
        onSelectFamilyBundle(null);
      }
    }
  };

  const isFamilyBundleActive = FAMILY_BUNDLE_COUNTS.includes(passengers);
  const classLabel = cabinClass === 'biz' ? 'Biznes klass' : 'Ekonom';

  return (
    <div ref={containerRef} className="relative min-w-[170px] flex-1">
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-full text-left bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/90 dark:hover:bg-slate-800 transition p-2.5 rounded-2xl border ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-800'
            : isFamilyBundleActive
            ? 'border-rose-400/80 bg-rose-50/40 dark:bg-rose-950/20'
            : 'border-slate-200/80 dark:border-slate-700'
        } cursor-pointer group flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <Users className={`w-3 h-3 ${isFamilyBundleActive ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`} />
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
              {isFamilyBundleActive ? "🌍 Butun Dunyo Seti (50% Chegirma)" : "Yo'lovchilar va Klass"}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-black text-slate-900 dark:text-white text-sm truncate flex items-center gap-1.5">
            {isFamilyBundleActive && <span>👨‍👩‍👧‍👦</span>}
            <span>{passengers} {passengers === 1 ? "yo'lovchi" : "kishilik set"}</span>
          </span>
          {isFamilyBundleActive ? (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-rose-600 text-white animate-pulse">
              -50% CHEGIRMA
            </span>
          ) : (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200">
              {classLabel}
            </span>
          )}
        </div>

        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate block mt-0.5">
          {isFamilyBundleActive
            ? "🌍 Butun dunyo bo'ylab barcha davlatlarga 50% chegirma!"
            : cabinClass === 'biz' ? 'Qulay oʼrindiqlar & ovqat' : 'Arzon va qulay narxlar'}
        </span>
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-2 w-[310px] sm:w-[360px] bg-white dark:bg-[#111c35] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-700/90 p-4 z-50 text-slate-800 dark:text-slate-100 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Yo'lovchilar soni & Setlar
            </span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
              2, 4, 6, 8, 16 ta = 50% Chegirma
            </span>
          </div>

          {/* Stepper for Passengers */}
          <div className="flex items-center justify-between py-1 mb-3">
            <div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                Yo'lovchilar (Kattalar & Bolalar)
              </div>
              <div className="text-[10px] text-slate-400">
                12 yosh va undan katta
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decrement}
                disabled={passengers <= 1}
                className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer active:scale-95 transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="w-6 text-center font-black text-sm text-slate-900 dark:text-white">
                {passengers}
              </span>

              <button
                type="button"
                onClick={increment}
                disabled={passengers >= 16}
                className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer active:scale-95 transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Family & Group Bundles with 50% discount */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <span>👨‍👩‍👧‍👦 Oilaviy & Guruh To'plamlari:</span>
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                50% CHEGIRMA!
              </span>
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-2 flex items-center gap-1">
              <span>🌍 Butun dunyo bo'ylab barcha davlatlarga amal qiladi</span>
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { count: 2, label: '2 kishilik set', desc: 'Juftlik / Er-xotin' },
                { count: 4, label: '4 kishilik set', desc: 'Oila to\'plami' },
                { count: 6, label: '6 kishilik set', desc: 'Katta oila to\'plami' },
                { count: 8, label: '8 kishilik set', desc: 'Qarindoshlar to\'plami' },
                { count: 12, label: '12 kishilik set', desc: 'Guruh paketi' },
                { count: 16, label: '16 kishilik set', desc: 'Katta jamoa' },
              ].map((bundle) => {
                const isSelected = passengers === bundle.count;
                return (
                  <button
                    key={bundle.count}
                    type="button"
                    onClick={() => {
                      onChangePassengers(bundle.count);
                      if (onSelectFamilyBundle) onSelectFamilyBundle(bundle.count);
                    }}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-100 ring-1 ring-rose-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">{bundle.label}</span>
                      <span className="text-[9px] font-black text-rose-600 dark:text-rose-400">-50%</span>
                    </div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {bundle.desc}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  onChangePassengers(1);
                  if (onSelectFamilyBundle) onSelectFamilyBundle(null);
                }}
                className={`p-2 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between col-span-2 ${
                  passengers === 1
                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-900 dark:text-blue-100 ring-1 ring-blue-500'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">Oddiy Yakkaxon (1 kishi)</span>
                  <span className="text-[10px] text-slate-400 font-bold">Standart tarif</span>
                </div>
              </button>
            </div>
          </div>

          {/* Cabin Class Options */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Xizmat ko'rsatish klassi
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeClass('econ')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                  cabinClass === 'econ'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white">Ekonom</span>
                  {cabinClass === 'econ' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Standart xizmat</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeClass('biz')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                  cabinClass === 'biz'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">Biznes</span>
                  </div>
                  {cabinClass === 'biz' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Premium qulaylik</span>
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl cursor-pointer transition shadow-sm"
          >
            Tayyor
          </button>
        </div>
      )}
    </div>
  );
};

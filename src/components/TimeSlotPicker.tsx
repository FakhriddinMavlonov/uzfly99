import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown, Check, Sun, Sunrise, Sunset, Moon } from 'lucide-react';

interface TimeSlotPickerProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
}

interface SlotOption {
  id: string;
  label: string;
  hours: string;
  icon: React.ReactNode;
}

const SLOTS: SlotOption[] = [
  {
    id: 'all',
    label: 'Barcha vaqtlar',
    hours: '00:00 - 23:59',
    icon: <Clock className="w-3.5 h-3.5 text-blue-500" />,
  },
  {
    id: 'morning',
    label: 'Ertalab',
    hours: '06:00 - 12:00',
    icon: <Sunrise className="w-3.5 h-3.5 text-amber-500" />,
  },
  {
    id: 'afternoon',
    label: 'Kunduzi',
    hours: '12:00 - 18:00',
    icon: <Sun className="w-3.5 h-3.5 text-orange-500" />,
  },
  {
    id: 'evening',
    label: 'Kechqurun',
    hours: '18:00 - 00:00',
    icon: <Sunset className="w-3.5 h-3.5 text-indigo-500" />,
  },
  {
    id: 'night',
    label: 'Tungi',
    hours: '00:00 - 06:00',
    icon: <Moon className="w-3.5 h-3.5 text-sky-400" />,
  },
];

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  id = 'avia-time-picker',
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedSlot = SLOTS.find((s) => s.id === value) || SLOTS[0];

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

  const handleSelect = (slotId: string) => {
    onChange(slotId);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative min-w-[145px] flex-1">
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-full text-left bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/90 dark:hover:bg-slate-800 transition p-2.5 rounded-2xl border ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-800'
            : 'border-slate-200/80 dark:border-slate-700'
        } cursor-pointer group flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
              Jo'nash Soati
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 mt-1">
          {selectedSlot.icon}
          <span className="font-black text-slate-900 dark:text-white text-sm truncate">
            {selectedSlot.label}
          </span>
        </div>

        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
          {selectedSlot.hours}
        </span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[220px] bg-white dark:bg-[#111c35] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-700/90 py-1.5 z-50 text-slate-800 dark:text-slate-100 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
            Parvoz vaqt oralig'i
          </div>

          <div className="py-1">
            {SLOTS.map((slot) => {
              const isSelected = slot.id === value;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleSelect(slot.id)}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-black'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {slot.icon}
                    <div>
                      <div className="text-xs">{slot.label}</div>
                      <div className="text-[10px] font-mono opacity-70">{slot.hours}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

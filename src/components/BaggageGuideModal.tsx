import React, { useState } from 'react';
import {
  Luggage,
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  Info,
  Briefcase,
  BatteryCharging,
  Droplet,
  Scissors,
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/helpers';

interface BaggageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
}

interface AirlineBaggage {
  id: string;
  name: string;
  code: string;
  flag: string;
  cabinKg: number;
  cabinSize: string;
  checkedKgEcon: number;
  checkedKgBiz: number;
  extraPerKgUZS: number;
  notes: string;
}

const AIRLINES_BAGGAGE: AirlineBaggage[] = [
  {
    id: 'HY',
    name: 'Uzbekistan Airways',
    code: 'HY',
    flag: '🇺🇿',
    cabinKg: 8,
    cabinSize: '56 x 45 x 25 sm',
    checkedKgEcon: 23,
    checkedKgBiz: 32,
    extraPerKgUZS: 120000,
    notes: 'Qo\'shimcha kichik noutbuk yoki ayollar sumkasi bepul olib o\'tiladi.',
  },
  {
    id: 'TK',
    name: 'Turkish Airlines',
    code: 'TK',
    flag: '🇹🇷',
    cabinKg: 8,
    cabinSize: '55 x 40 x 23 sm',
    checkedKgEcon: 30,
    checkedKgBiz: 40,
    extraPerKgUZS: 180000,
    notes: 'Biznes klassda 2 dona 8 kg dan jami 16 kg qo\'l yuki ruxsat etiladi.',
  },
  {
    id: 'EK',
    name: 'Emirates',
    code: 'EK',
    flag: '🇦🇪',
    cabinKg: 7,
    cabinSize: '55 x 38 x 20 sm',
    checkedKgEcon: 25,
    checkedKgBiz: 40,
    extraPerKgUZS: 220000,
    notes: 'Qat\'iy o\'lcham nazorati mavjud. Dubay xalqaro standartlari amal qiladi.',
  },
  {
    id: 'FZ',
    name: 'Flydubai',
    code: 'FZ',
    flag: '🇦🇪',
    cabinKg: 7,
    cabinSize: '55 x 38 x 20 sm',
    checkedKgEcon: 20,
    checkedKgBiz: 30,
    extraPerKgUZS: 150000,
    notes: 'Lite tariflarida faqat qo\'l yuki kiritilgan bo\'lishi mumkin.',
  },
  {
    id: 'US',
    name: 'Silk Avia',
    code: 'US',
    flag: '🇺🇿',
    cabinKg: 5,
    cabinSize: '55 x 35 x 20 sm',
    checkedKgEcon: 10,
    checkedKgBiz: 20,
    extraPerKgUZS: 65000,
    notes: 'ATR-72 samolyotlari uchun moslashtirilgan ixcham bagaj qoidalari.',
  },
  {
    id: 'HH',
    name: 'Qanot Sharq',
    code: 'HH',
    flag: '🦅',
    cabinKg: 8,
    cabinSize: '55 x 40 x 20 sm',
    checkedKgEcon: 20,
    checkedKgBiz: 30,
    extraPerKgUZS: 110000,
    notes: 'Ziyorat va xalqaro charter reyslarida alohida zamzam suvi qoidasi amal qiladi.',
  },
];

export const BaggageGuideModal: React.FC<BaggageGuideModalProps> = ({
  isOpen,
  onClose,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'calculator' | 'prohibited'>('rules');
  const [calcAirline, setCalcAirline] = useState<string>('HY');
  const [extraKg, setExtraKg] = useState<number>(5);

  if (!isOpen) return null;

  const selectedAirline = AIRLINES_BAGGAGE.find((a) => a.id === calcAirline) || AIRLINES_BAGGAGE[0];
  const calculatedFeeUZS = extraKg * selectedAirline.extraPerKgUZS;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      id="baggage-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          id="baggage-modal"
          className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#111c35] text-slate-800 dark:text-slate-100 text-left align-middle max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 my-6"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Bagaj va Yuk Qoidalari
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                O'zbekiston va xalqaro aviakompaniyalar me'yorlari
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 pt-2 gap-2 bg-slate-50/40 dark:bg-slate-900/30">
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-2.5 px-3 text-xs font-black border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Aviakompaniyalar Me'yorlari</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`pb-2.5 px-3 text-xs font-black border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Ortiqcha Yuk Hisoblagichi</span>
          </button>

          <button
            onClick={() => setActiveTab('prohibited')}
            className={`pb-2.5 px-3 text-xs font-black border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'prohibited'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Taqiqlangan Buyumlar</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AIRLINES_BAGGAGE.map((airline) => (
                  <div
                    key={airline.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{airline.flag}</span>
                          <div>
                            <span className="font-black text-xs text-slate-900 dark:text-white">
                              {airline.name}
                            </span>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono ml-1.5 font-bold">
                              ({airline.code})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs py-1">
                        <div className="bg-white dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/70 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 uppercase font-black block">
                            Qo'l yuki (Salon)
                          </span>
                          <span className="font-black text-slate-900 dark:text-white">
                            {airline.cabinKg} kg gacha
                          </span>
                          <span className="text-[9px] text-slate-400 block font-mono">
                            {airline.cabinSize}
                          </span>
                        </div>

                        <div className="bg-white dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/70 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 uppercase font-black block">
                            Ro'yxatdan o'tgan
                          </span>
                          <span className="font-black text-slate-900 dark:text-white">
                            {airline.checkedKgEcon} kg (Ekonom)
                          </span>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">
                            {airline.checkedKgBiz} kg (Biznes)
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      💡 {airline.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                  Aeroportda ortiqcha vazn uchun to'lov rasmiy sayt yoki oldindan sotib olinganidan 20-30% qimmatroq bo'lishi mumkin. Chipta sotib olayotganda ortiqcha yukni rejalashtirish tavsiya etiladi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">
                    Aviakompaniyani tanlang
                  </label>
                  <div className="space-y-1.5">
                    {AIRLINES_BAGGAGE.map((airline) => (
                      <button
                        key={airline.id}
                        type="button"
                        onClick={() => setCalcAirline(airline.id)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-black flex items-center justify-between transition cursor-pointer ${
                          calcAirline === airline.id
                            ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{airline.flag}</span>
                          <span>{airline.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ~{formatPrice(airline.extraPerKgUZS, currency)}/kg
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-wider">
                      Ortiqcha vazn (kg): {extraKg} kg
                    </label>

                    <input
                      type="range"
                      min={1}
                      max={30}
                      step={1}
                      value={extraKg}
                      onChange={(e) => setExtraKg(parseInt(e.target.value) || 1)}
                      className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3"
                    />

                    <div className="flex gap-2">
                      {[3, 5, 10, 15, 20].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setExtraKg(preset)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition ${
                            extraKg === preset
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          +{preset}kg
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 p-3.5 rounded-xl bg-white dark:bg-[#111c35] border border-blue-200/80 dark:border-blue-900/60 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase block">
                      Taxminiy qo'shimcha to'lov
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                      ~{formatPrice(calculatedFeeUZS, currency)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {selectedAirline.name} reyslarida ({extraKg} kg uchun)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROHIBITED ITEMS */}
          {activeTab === 'prohibited' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-black block mb-0.5">Xavfsizlik talablari:</span>
                  Ushbu qoidalar O'zbekiston aeroportlari (Toshkent, Samarqand va b.) va xalqaro ICAO me'yorlari bo'yicha majburiydir.
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white">
                      Suyuqliklar (Qo'l yukida)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Faqat har biri 100 ml dan oshmaydigan idishlarda, jami 1 litrlik shaffof yopiladigan paketda ruxsat etiladi. Kattaroq hajmdagi suyuqliklar ro'yxatdan o'tgan yukka (bagajga) topshirilishi kerak.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <BatteryCharging className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white">
                      Powerbank va Litiy Batareyalar
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Powerbank va zaxira batareyalar <strong className="text-rose-600 dark:text-rose-400">BAGAJGA TOPSHIRILISHI QAT'IYAN TAQIQLANADI</strong>. Ularni faqat qo'l yukida olib o'tish lozim (quvvati 100-160 Vt/soat gacha).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white">
                      O'tkir va Kesuvchi Buyumlar
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Pichoqlar, manikyur qaychilari, ignalar va har qanday metall qurollar qo'l yukida taqiqlanadi. Ularni faqat oldindan samolyot bagajiga topshirish shart.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <span className="text-[10px] text-slate-400 font-bold">
            ✓ Yangilangan ICAO va O'zaviatsiya standartlari
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer transition shadow-sm"
          >
            Tushundim
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

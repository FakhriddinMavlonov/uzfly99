import React from 'react';
import {
  Scale,
  X,
  Plane,
  Clock,
  Luggage,
  Utensils,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { Flight, Currency } from '../types';
import { formatPrice } from '../utils/helpers';

interface FlightCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  flights: Flight[];
  currency: Currency;
  onSelectFlight: (flight: Flight) => void;
  onRemoveFromCompare?: (flightId: string) => void;
}

export const FlightCompareModal: React.FC<FlightCompareModalProps> = ({
  isOpen,
  onClose,
  flights,
  currency,
  onSelectFlight,
  onRemoveFromCompare,
}) => {
  if (!isOpen) return null;

  // Extra metadata for realistic comparison
  const getFlightSpecs = (f: Flight) => {
    let meal = "Issiq taom va ichimliklar kiritilgan";
    let refund = "Jarima bilan qaytarish mumkin";
    let legroom = "79 sm (Keng oraliq)";
    let power = "USB va 220V rozetka mavjud";

    if (f.airlineCode === 'HY') {
      meal = "Milliy issiq taomlar va choy/qahva";
      refund = "Parvozdan 24 soat oldin bepul qaytarish";
      legroom = "81 sm (Dreamliner qulayligi)";
    } else if (f.airlineCode === 'TK') {
      meal = "Mashhur 'Do & Co' turk oshxonasi taomlari";
      refund = "Moslashuvchan almashtirish (Flex)";
      legroom = "80 sm (Airbus ergonomikasi)";
    } else if (f.airlineCode === 'FZ') {
      meal = "Buyurtma bo'yicha yoki yengil tamaddi";
      refund = "Qaytarilmaydigan arzon tarif";
      legroom = "76 sm (Standart oraliq)";
    } else if (f.airlineCode === 'US') {
      meal = "Salqin ichimliklar va shirinlik";
      refund = "Jarima bilan qaytarish mumkin";
      legroom = "76 sm (Mintaqaviy qulaylik)";
    }

    return { meal, refund, legroom, power };
  };

  const minPrice = Math.min(...flights.map((f) => f.basePriceUZS));
  const minDuration = Math.min(...flights.map((f) => f.durationMinutes));

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      id="compare-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          id="compare-modal"
          className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#111c35] text-slate-800 dark:text-slate-100 text-left align-middle max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 my-6"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Reyslarni Taqqoslash
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                {flights.length} ta reysning narxi, bagaji, taomlari va shartlari yonma-yon solishtirildi
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

        {/* Content Area with scrollable comparison table */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {flights.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Scale className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-500">
                Taqqoslash uchun hech qanday reys tanlanmagan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 w-1/4 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                      Parametr
                    </th>
                    {flights.map((f) => (
                      <th key={f.id} className="p-3 w-1/3 align-top">
                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
                          {onRemoveFromCompare && (
                            <button
                              type="button"
                              onClick={() => onRemoveFromCompare(f.id)}
                              className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                              title="O'chirish"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{f.airlineLogo}</span>
                            <div>
                              <div className="font-black text-slate-900 dark:text-white text-xs">
                                {f.airline}
                              </div>
                              <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                                {f.flightNumber}
                              </div>
                            </div>
                          </div>

                          <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                            {formatPrice(f.basePriceUZS, currency)}
                            {f.basePriceUZS === minPrice && (
                              <span className="ml-1.5 text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-bold align-middle">
                                Eng arzon
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onSelectFlight(f);
                              onClose();
                            }}
                            className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs cursor-pointer transition shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <span>Tanlash</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {/* Parvoz vaqtlari */}
                  <tr>
                    <td className="p-3 font-black text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                      Vaqti va Marshrut
                    </td>
                    {flights.map((f) => (
                      <td key={f.id} className="p-3">
                        <div className="font-black text-slate-900 dark:text-white text-xs">
                          {f.departureTime} ➔ {f.arrivalTime}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {f.fromCity} ({f.fromCode}) - {f.toCity} ({f.toCode})
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Davomiyligi & Tranzit */}
                  <tr>
                    <td className="p-3 font-black text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                      Davomiyligi
                    </td>
                    {flights.map((f) => (
                      <td key={f.id} className="p-3">
                        <span className="font-black text-slate-900 dark:text-white">
                          {f.duration}
                        </span>
                        {f.durationMinutes === minDuration && (
                          <span className="ml-1.5 text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-black">
                            ⚡ Tezkor
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {f.direct ? '✓ To\'g\'ridan-to\'g\'ri reys' : `Tranzit: ${f.transitCity || 'Kutilmoqda'}`}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Samolyot modeli */}
                  <tr>
                    <td className="p-3 font-black text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                      Samolyot Modeli
                    </td>
                    {flights.map((f) => (
                      <td key={f.id} className="p-3 font-bold text-slate-800 dark:text-slate-200">
                        ✈️ {f.aircraft}
                      </td>
                    ))}
                  </tr>

                  {/* Bagaj me'yori */}
                  <tr>
                    <td className="p-3 font-black text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                      Bagaj & Qo'l yuki
                    </td>
                    {flights.map((f) => (
                      <td key={f.id} className="p-3">
                        <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Luggage className="w-3.5 h-3.5 text-blue-600" />
                          <span>{f.baggage}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          + 8 kg salon qo'l yuki bepul
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Taomlar & Ichimliklar */}
                  <tr>
                    <td className="p-3 font-black text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                      Bort Taomlari
                    </td>
                    {flights.map((f) => {
                      const spec = getFlightSpecs(f);
                      return (
                        <td key={f.id} className="p-3 text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-1 font-bold">
                            <Utensils className="w-3.5 h-3.5 text-amber-500" />
                            <span>{spec.meal}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* O'rindiq kengligi */}
                  <tr>
                    <td className="p-3 font-black text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                      O'rindiq Oralig'i
                    </td>
                    {flights.map((f) => {
                      const spec = getFlightSpecs(f);
                      return (
                        <td key={f.id} className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                          {spec.legroom}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Qaytarish siyosati */}
                  <tr>
                    <td className="p-3 font-black text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                      Qaytarish & Almashtirish
                    </td>
                    {flights.map((f) => {
                      const spec = getFlightSpecs(f);
                      return (
                        <td key={f.id} className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                          {spec.refund}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <span className="text-[10px] text-slate-400 font-bold">
            ✓ Qulaylik va xarajatni to'g'ri baholang
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs cursor-pointer transition"
          >
            Yopish
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

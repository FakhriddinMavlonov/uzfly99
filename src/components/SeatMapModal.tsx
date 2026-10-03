import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { Flight, Currency } from '../types';
import { formatPrice } from '../utils/helpers';

interface SeatMapModalProps {
  flight: Flight | null;
  currency: Currency;
  onClose: () => void;
  onConfirmSeat: (seatId: string, extraPriceUZS: number) => void;
}

export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  flight,
  currency,
  onClose,
  onConfirmSeat,
}) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (flight) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flight, onClose]);

  if (!flight) return null;

  // Occupied seats list for realism
  const occupiedSeats = new Set(['1B', '2A', '2D', '4A', '5B', '6C', '7F', '8A', '9D', '11C', '12B', '14F']);

  // Business class rows 1-3 (A, C - D, F)
  const businessRows = [1, 2, 3];
  const businessCols = ['A', 'C', '', 'D', 'F'];

  // Economy class rows 4-14 (A, B, C - D, E, F)
  const economyRows = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const economyCols = ['A', 'B', 'C', '', 'D', 'E', 'F'];

  const getSeatExtraPrice = (seatId: string) => {
    const row = parseInt(seatId);
    if (row <= 3) return 650000; // Business class upgrade
    if (seatId.endsWith('A') || seatId.endsWith('F')) return 40000; // Window seat
    return 0; // Standard seat
  };

  const selectedExtraPrice = selectedSeat ? getSeatExtraPrice(selectedSeat) : 0;
  const isSelectedBusiness = selectedSeat ? parseInt(selectedSeat) <= 3 : false;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white dark:bg-[#101b33] p-5 sm:p-6 text-left align-middle shadow-2xl transition-all border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white my-6 max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>💺 O'rindiqni Tanlang</span>
                {flight.isFamilyBundle && (
                  <span className="text-[10px] font-black uppercase bg-rose-600 text-white px-2 py-0.5 rounded-full">
                    -50% Chegirma
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                {flight.airline} • {flight.flightNumber} • {flight.fromCode} ➔ {flight.toCode}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Family Bundle Notice Bar */}
          {flight.isFamilyBundle && (
            <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 p-2.5 rounded-xl text-xs text-rose-900 dark:text-rose-200 font-bold flex items-center justify-between mt-3 flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <span>👨‍👩‍👧‍👦</span>
                <span>{flight.familyBundleCount} kishilik Oila To'plami (50% Chegirma faol)</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Yonma-yon o'rindiqlar kafolatlangan
              </span>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-around text-[11px] font-bold text-slate-600 dark:text-slate-300 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 rounded-xl my-3 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-amber-100 dark:bg-amber-900/60 border border-amber-400 rounded"></span>
              <span>Biznes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-sky-100 dark:bg-sky-900/60 border border-sky-400 rounded"></span>
              <span>Ekonom</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#ff6d00] rounded"></span>
              <span>Tanlangan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-slate-300 dark:bg-slate-700 rounded"></span>
              <span>Band</span>
            </div>
          </div>

          {/* Fuselage Container */}
          <div className="flex-1 overflow-y-auto py-4 bg-slate-100/70 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 px-4">
            {/* Plane Cockpit Curve */}
            <div className="w-32 h-14 bg-gradient-to-b from-slate-300 to-white dark:from-slate-700 dark:to-slate-800 mx-auto rounded-t-full border-t-2 border-x-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 shadow-sm">
              Pilotlar Kabinasi
            </div>

            {/* Business Class Section */}
            <div className="mb-6 space-y-2">
              <div className="text-center text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 py-1 rounded-md mb-2">
                Biznes Klass (Keng o'rindiqlar)
              </div>
              {businessRows.map((row) => (
                <div key={`biz-${row}`} className="flex items-center justify-center gap-2">
                  <span className="w-5 text-center text-xs font-bold text-slate-400">{row}</span>
                  {businessCols.map((col, idx) => {
                    if (col === '') {
                      return <div key={idx} className="w-8 text-center text-[10px] text-slate-400 font-mono">Yo'lak</div>;
                    }
                    const seatId = `${row}${col}`;
                    const isOcc = occupiedSeats.has(seatId);
                    const isSel = selectedSeat === seatId;
                    return (
                      <button
                        key={seatId}
                        disabled={isOcc}
                        onClick={() => setSelectedSeat(seatId)}
                        className={`w-9 h-10 rounded-lg font-mono text-xs font-black transition flex flex-col items-center justify-center ${
                          isOcc
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-dashed border-slate-300 dark:border-slate-700'
                            : isSel
                            ? 'bg-[#ff6d00] text-white shadow-lg shadow-orange-500/30 scale-105'
                            : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-100 cursor-pointer'
                        }`}
                      >
                        <span>{seatId}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Economy Class Section */}
            <div className="space-y-2">
              <div className="text-center text-[10px] font-black uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950/60 py-1 rounded-md mb-2">
                Ekonom Klass
              </div>
              {economyRows.map((row) => (
                <div key={`eco-${row}`} className="flex items-center justify-center gap-2">
                  <span className="w-5 text-center text-xs font-bold text-slate-400">{row}</span>
                  {economyCols.map((col, idx) => {
                    if (col === '') {
                      return <div key={idx} className="w-8 text-center text-[10px] text-slate-400 font-mono">Yo'lak</div>;
                    }
                    const seatId = `${row}${col}`;
                    const isOcc = occupiedSeats.has(seatId);
                    const isSel = selectedSeat === seatId;
                    return (
                      <button
                        key={seatId}
                        disabled={isOcc}
                        onClick={() => setSelectedSeat(seatId)}
                        className={`w-8 h-9 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center ${
                          isOcc
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : isSel
                            ? 'bg-[#ff6d00] text-white shadow-lg shadow-orange-500/30 scale-105 font-black'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 cursor-pointer'
                        }`}
                      >
                        {seatId}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Seat Info Banner & Action Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  {flight.isFamilyBundle ? `👨‍👩‍👧‍👦 ${flight.familyBundleCount} kishilik Oila O'rindiqlari` : "Tanlangan O'rindiq"}
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  {selectedSeat ? (
                    <>
                      <span className={`${flight.isFamilyBundle ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'} font-mono`}>{selectedSeat}</span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {flight.isFamilyBundle ? `+ ${flight.familyBundleCount! - 1} ta yonma-yon o'rindiq (Oila)` : (isSelectedBusiness ? 'Biznes klass' : selectedSeat.endsWith('A') || selectedSeat.endsWith('F') ? 'Oyna yonida' : 'Standart o\'rindiq')}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">O'rindiq tanlanmagan</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  {flight.isFamilyBundle ? "50% Chegirmali Narx" : "Jami Narx"}
                </div>
                <div className={`text-base font-black ${flight.isFamilyBundle ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {formatPrice(flight.basePriceUZS + selectedExtraPrice, currency)}
                </div>
              </div>
            </div>

            <button
              disabled={!selectedSeat}
              onClick={() => selectedSeat && onConfirmSeat(selectedSeat, selectedExtraPrice)}
              className={`w-full py-3.5 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                flight.isFamilyBundle
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'
                  : 'bg-[#ff6d00] hover:bg-[#e06000] shadow-orange-500/25'
              }`}
            >
              <span>{flight.isFamilyBundle ? `👨‍👩‍👧‍👦 ${flight.familyBundleCount} kishilik Setni Bron Qilish (-50%) ➔` : "Bron Bosqichiga O'tish ➔"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

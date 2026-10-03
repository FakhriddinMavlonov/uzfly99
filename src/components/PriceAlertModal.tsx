import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  TrendingDown,
  Mail,
  Send,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plane,
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/helpers';
import { AIRPORTS } from '../data/mockData';

interface PriceAlert {
  id: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  targetPriceUZS: number;
  currentPriceUZS: number;
  contactMethod: 'telegram' | 'email';
  contactValue: string;
  createdAt: string;
  dropped?: boolean;
}

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  initialFrom?: string;
  initialTo?: string;
  onSelectRoute?: (from: string, to: string) => void;
}

const STORAGE_KEY = 'uzfly_price_alerts';

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  currency,
  initialFrom = 'TAS',
  initialTo = 'IST',
  onSelectRoute,
}) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [fromCode, setFromCode] = useState(initialFrom);
  const [toCode, setToCode] = useState(initialTo);
  const [targetBudget, setTargetBudget] = useState<number>(2000000);
  const [contactMethod, setContactMethod] = useState<'telegram' | 'email'>('telegram');
  const [contactValue, setContactValue] = useState('');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setAlerts(JSON.parse(data));
      } else {
        // Pre-fill a sample alert so user immediately sees how it works
        const sample: PriceAlert[] = [
          {
            id: 'alert-sample-1',
            fromCode: 'TAS',
            fromCity: 'Toshkent',
            toCode: 'IST',
            toCity: 'Istanbul',
            targetPriceUZS: 2000000,
            currentPriceUZS: 1850000,
            contactMethod: 'telegram',
            contactValue: '@sayohatchi_uz',
            createdAt: new Date().toLocaleDateString('uz-UZ'),
            dropped: true,
          },
        ];
        setAlerts(sample);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
      }
    } catch {}
  }, []);

  const saveAlerts = (newAlerts: PriceAlert[]) => {
    setAlerts(newAlerts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAlerts));
    } catch {}
  };

  if (!isOpen) return null;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    const fromAp = AIRPORTS.find((a) => a.code === fromCode);
    const toAp = AIRPORTS.find((a) => a.code === toCode);

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      fromCode,
      fromCity: fromAp ? fromAp.city : fromCode,
      toCode,
      toCity: toAp ? toAp.city : toCode,
      targetPriceUZS: targetBudget,
      currentPriceUZS: targetBudget + 180000,
      contactMethod,
      contactValue: contactValue.trim(),
      createdAt: new Date().toLocaleDateString('uz-UZ'),
    };

    const updated = [newAlert, ...alerts];
    saveAlerts(updated);
    setContactValue('');

    setNotificationToast(
      `✓ Muvaffaqiyatli obuna bo'ldingiz! ${newAlert.fromCode} ➔ ${newAlert.toCode} narxi ${formatPrice(targetBudget, currency)} dan tushsa xabar yuboriladi.`
    );
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const handleDeleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    saveAlerts(updated);
  };

  const handleSimulateDrop = (alert: PriceAlert) => {
    const discountedPrice = Math.round(alert.targetPriceUZS * 0.82);
    setNotificationToast(
      `🔔 NARX PASAYDI! ${alert.fromCity} ➔ ${alert.toCity} reysi hozir ${formatPrice(discountedPrice, currency)} (${formatPrice(alert.targetPriceUZS, currency)} dan -18% arzon!)`
    );
    setTimeout(() => setNotificationToast(null), 5000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      id="price-alert-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          id="price-alert-modal"
          className="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#111c35] text-slate-800 dark:text-slate-100 text-left align-middle max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 my-6"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Narx Tushishini Kuzatish
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                Chipta arzonlashganda Telegram yoki pochtangizga bir zumda xabar beramiz
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

        {/* Dynamic Toast */}
        {notificationToast && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-black text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
            <Sparkles className="w-4 h-4" />
            <span>{notificationToast}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Create Alert Form */}
          <form
            onSubmit={handleCreateAlert}
            className="bg-slate-50/80 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Yangi marshrut qo'shish
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Mutlaqo bepul
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Qayerdan
                </label>
                <select
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                >
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.flag} {a.city} ({a.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Qayerga
                </label>
                <select
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                >
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.flag} {a.city} ({a.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Maksimal budjetingiz
                </span>
                <span className="font-black text-blue-600 dark:text-blue-400">
                  {formatPrice(targetBudget, currency)}
                </span>
              </div>
              <input
                type="range"
                min={300000}
                max={6000000}
                step={100000}
                value={targetBudget}
                onChange={(e) => setTargetBudget(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
                <button
                  type="button"
                  onClick={() => setContactMethod('telegram')}
                  className={`flex-1 py-1.5 rounded-lg font-black text-center cursor-pointer transition text-[11px] ${
                    contactMethod === 'telegram'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Telegram
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`flex-1 py-1.5 rounded-lg font-black text-center cursor-pointer transition text-[11px] ${
                    contactMethod === 'email'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Email
                </button>
              </div>

              <div className="sm:col-span-2 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={contactMethod === 'telegram' ? '@username yoki +99890...' : 'pochta@gmail.com'}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  className="flex-1 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>Kuzatish</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>

          {/* Active Alerts List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                Faol obunalaringiz ({alerts.length})
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                Avtomatik tekshiruv: Har 15 daqiqada
              </span>
            </div>

            {alerts.length === 0 ? (
              <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold">
                Hozircha hech qanday marshrutga obuna bo'lmagansiz. Yuqoridagi shakldan qiziqtirgan parvozingizni kiriting!
              </div>
            ) : (
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                          {alert.fromCity} ({alert.fromCode}) ➔ {alert.toCity} ({alert.toCode})
                        </span>
                        {alert.dropped && (
                          <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                            <TrendingDown className="w-3 h-3" />
                            Arzonlashdi!
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span>
                          Mo'ljal: <strong className="text-slate-900 dark:text-white">{formatPrice(alert.targetPriceUZS, currency)}</strong>
                        </span>
                        <span>•</span>
                        <span>Aloqa: {alert.contactValue}</span>
                        <span>•</span>
                        <span className="text-slate-400">{alert.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleSimulateDrop(alert)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-[10px] hover:bg-amber-100 transition cursor-pointer"
                        title="Simulyatsiya xabarnomasi"
                      >
                        🔔 Sinash
                      </button>

                      {onSelectRoute && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectRoute(alert.fromCode, alert.toCode);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-[10px] hover:bg-blue-100 transition cursor-pointer"
                        >
                          Reyslar
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Spam yo'q, ma'lumotlaringiz xavfsiz saqlanadi
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

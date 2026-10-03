import React, { useState } from 'react';
import { Plane, Ticket, User, Globe, HelpCircle, BookOpen, ChevronDown, Sun, Moon, Shield, LogOut, PhoneCall } from 'lucide-react';
import { Currency, Language, ThemeMode } from '../types';
import { DICTIONARY, DiscountDetails, UserProfile } from '../utils/helpers';

interface HeaderProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  bookingsCount: number;
  onOpenBookings: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  userInitial?: string;
  userName?: string;
  onLogout?: () => void;
  userProfile?: UserProfile | null;
  discountInfo?: DiscountDetails;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  setCurrency,
  language,
  setLanguage,
  themeMode,
  onToggleTheme,
  bookingsCount,
  onOpenBookings,
  onOpenAuth,
  onOpenAdmin,
  userInitial,
  userName,
  onLogout,
  userProfile,
  discountInfo,
}) => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const t = DICTIONARY[language];

  return (
    <header className="bg-[#0c73fe] dark:bg-[#0b162f] text-white pt-4 pb-4 px-4 sm:px-8 border-b border-blue-600/30 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-white/20 dark:bg-blue-500/30 flex items-center justify-center font-black text-xl text-white group-hover:scale-105 transition shadow-sm">
            <Plane className="w-4 h-4 text-white -rotate-45" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tight text-white leading-none">aviasales</span>
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider">UZ FLY</span>
            </div>
            <span className="text-[9px] font-semibold text-sky-100 dark:text-slate-300 opacity-90">O'zbekiston & Dunyo</span>
          </div>
        </a>

        {/* Right Nav Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-bold">
          
          {/* 24/7 Call Center */}
          <a
            id="header-call-center-btn"
            href="tel:+998930399291"
            className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-400/30 transition shadow-sm font-black text-xs cursor-pointer"
            title="Call Center 24/7 aloqada: +998 93 039 92 91"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span className="hidden xl:inline text-emerald-200">Call Center:</span>
            <span className="font-mono text-white text-xs">93 039 92 91</span>
            <span className="text-[9px] bg-emerald-400 text-slate-900 px-1 py-0.2 rounded font-black hidden sm:inline">
              24/7
            </span>
          </a>

          {/* Day / Night (Kun / Tun) Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-slate-800/80 dark:hover:bg-slate-700 transition border border-white/20 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm text-white"
            title={themeMode === 'dark' ? "Kunduzgi rejimga o'tish (Day Mode)" : "Tungi rejimga o'tish (Night Mode)"}
          >
            {themeMode === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
                <span className="hidden md:inline text-amber-200">Kun</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-100" />
                <span className="hidden md:inline text-sky-100">Tun</span>
              </>
            )}
          </button>

          {/* My Bookings */}
          <button
            id="my-bookings-btn"
            onClick={onOpenBookings}
            className="hover:text-amber-300 transition flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/20 shadow-sm cursor-pointer relative"
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{t.myBookingsBtn}</span>
            <span className="md:hidden">Bron</span>
            {bookingsCount > 0 && (
              <span id="bookings-badge" className="bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full text-[10px] ml-0.5">
                {bookingsCount}
              </span>
            )}
          </button>

          {/* Admin Panel Button - To'g'ridan-to'g'ri Kirish oldida joylashgan */}
          <button
            id="header-admin-panel-btn"
            onClick={onOpenAdmin}
            className="hover:bg-amber-500 hover:text-slate-950 transition flex items-center gap-1.5 bg-amber-500/20 text-amber-300 hover:text-slate-950 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-400/40 shadow-sm cursor-pointer font-black text-xs"
            title="Admin Boshqaruv Markaziga o'tish (Alohida Tizim)"
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>

          {/* User Profile / Auth */}
          <button
            id="user-profile-btn"
            onClick={onOpenAuth}
            className="hover:bg-white/20 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 transition border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Mening Profilim"
          >
            <div className="w-5 h-5 rounded-full bg-[#ff6d00] text-white font-black text-[10px] flex items-center justify-center">
              {userInitial || 'U'}
            </div>
            <span className="hidden sm:inline max-w-[120px] truncate font-bold text-xs">
              {userName || t.profileBtn}
            </span>
          </button>

          {/* Chiqish (Logout) Button */}
          {onLogout && (
            <button
              id="header-logout-btn"
              onClick={onLogout}
              className="hover:bg-rose-500/25 hover:text-white text-white/90 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/10 transition border border-white/20 flex items-center gap-1 text-xs font-black cursor-pointer shadow-sm"
              title="Tizimdan chiqish (Logout)"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden md:inline">Chiqish</span>
            </button>
          )}

          {/* Currency & Language Popover Toggle */}
          <div className="relative">
            <button
              id="currency-lang-btn"
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="hover:bg-white/20 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 transition border border-white/20 flex items-center gap-1.5 text-xs font-black cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-white/80" />
              <span id="curr-lang-text">{currency} · {language.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showSettingsDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#15223e] text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1.5">Valyuta (Currency)</div>
                  <div className="grid grid-cols-2 gap-1">
                    {(['UZS', 'USD', 'EUR', 'RUB'] as Currency[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-black flex items-center justify-between cursor-pointer transition ${
                          currency === c ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{c}</span>
                        <span className="text-[10px] opacity-70">
                          {c === 'UZS' ? "so'm" : c === 'USD' ? '$' : c === 'EUR' ? '€' : '₽'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1.5">Til (Language)</div>
                  <div className="space-y-1">
                    {[
                      { code: 'uz' as Language, label: "O'zbekcha 🇺🇿" },
                      { code: 'ru' as Language, label: 'Русский 🇷🇺' },
                      { code: 'en' as Language, label: 'English 🇬🇧' },
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setShowSettingsDropdown(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between cursor-pointer transition ${
                          language === item.code ? 'bg-blue-600 text-white font-black' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{item.label}</span>
                        {language === item.code && <span className="text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};


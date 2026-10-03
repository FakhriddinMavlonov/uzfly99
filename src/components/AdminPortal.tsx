import React, { useState } from 'react';
import {
  Shield,
  Plane,
  Ticket,
  Train as TrainIcon,
  Building2,
  Settings,
  TrendingUp,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Edit2,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  FileSpreadsheet,
  KeyRound,
  Lock,
  LogOut,
  ShieldCheck,
  Check,
  ExternalLink,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import {
  AdminTab,
  Booking,
  Currency,
  Flight,
  Train,
  Hotel,
} from '../types';
import {
  formatPrice,
  getStoredCurrencyRates,
  saveStoredCurrencyRates,
  DEFAULT_CURRENCY_RATES,
  getStoredAdminCreds,
  saveStoredAdminCreds,
  verifyAdminCredentials,
  UserProfile,
} from '../utils/helpers';
import { AIRPORTS } from '../data/mockData';
import { CustomSelect } from './ui/CustomSelect';

interface AdminPortalProps {
  onBackToMainSite: () => void;
  currency: Currency;
  flights: Flight[];
  onSaveFlights: (flights: Flight[]) => void;
  onResetFlights: () => void;
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, status: 'active' | 'confirmed' | 'cancelled') => void;
  onDeleteBooking: (id: string) => void;
  trains: Train[];
  onSaveTrains: (trains: Train[]) => void;
  hotels: Hotel[];
  onSaveHotels: (hotels: Hotel[]) => void;
  onRatesUpdated: () => void;
  currentUser?: UserProfile | null;
  onAdminLoginSuccess?: (adminUser: UserProfile) => void;
  onAdminLogout?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToMainSite,
  currency,
  flights,
  onSaveFlights,
  onResetFlights,
  bookings,
  onUpdateBookingStatus,
  onDeleteBooking,
  trains,
  hotels,
  onRatesUpdated,
  currentUser,
  onAdminLoginSuccess,
  onAdminLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filter States
  const [flightSearch, setFlightSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');

  // New Flight Form State
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [newFlight, setNewFlight] = useState<Partial<Flight>>({
    flightNumber: 'HY-450',
    airline: 'Uzbekistan Airways',
    airlineCode: 'HY',
    fromCity: 'Samarqand',
    fromCode: 'SKD',
    toCity: 'Istanbul',
    toCode: 'IST',
    departureTime: '09:00',
    arrivalTime: '13:00',
    duration: '5s 00daq',
    durationMinutes: 300,
    direct: true,
    basePriceUZS: 3200000,
    aircraft: 'Airbus A321neo',
    seatsRemaining: 85,
    baggage: "23 kg bagaj + 8 kg qo'l yuki",
  });

  // Edit Flight Price State
  const [editingFlightId, setEditingFlightId] = useState<string | null>(null);
  const [editPriceUZS, setEditPriceUZS] = useState<number>(0);

  // Edit Flight Seats State
  const [editSeatsId, setEditSeatsId] = useState<string | null>(null);
  const [editSeatsVal, setEditSeatsVal] = useState<number>(0);

  // Currency Rates State
  const [usdRate, setUsdRate] = useState<number>(() => getStoredCurrencyRates().USD.rate);
  const [eurRate, setEurRate] = useState<number>(() => getStoredCurrencyRates().EUR.rate);
  const [rubRate, setRubRate] = useState<number>(() => getStoredCurrencyRates().RUB.rate);
  const [ratesSavedAlert, setRatesSavedAlert] = useState(false);

  // Admin Auth Gate State
  const isDirectAdmin = Boolean(currentUser?.isAdmin || currentUser?.role === 'admin');
  const [authOverride, setAuthOverride] = useState(false);
  const effectiveAuthorized = isDirectAdmin || authOverride;

  const [gateLogin, setGateLogin] = useState('');
  const [gatePassword, setGatePassword] = useState('');
  const [showGatePass, setShowGatePass] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  // Admin Creds State for Settings Tab
  const [newAdminLogin, setNewAdminLogin] = useState(() => getStoredAdminCreds().login);
  const [newAdminPassword, setNewAdminPassword] = useState(() => getStoredAdminCreds().password);
  const [newSecretCode, setNewSecretCode] = useState(() => getStoredAdminCreds().secretCode);
  const [showAdminPassSettings, setShowAdminPassSettings] = useState(false);
  const [credsSavedAlert, setCredsSavedAlert] = useState(false);

  // Handle Gate Login
  const handleGateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);
    if (verifyAdminCredentials(gateLogin, gatePassword)) {
      setAuthOverride(true);
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess({
          fullName: 'BOSHQARUVCHI (ADMIN)',
          passportId: 'ADM-001',
          phone: '+998 93 039 92 91',
          email: 'admin@uzfly.uz',
          role: 'admin',
          isAdmin: true,
        });
      }
    } else {
      setGateError("Admin logini yoki paroli noto'g'ri kiritildi! Standart: login: admin, parol: admin777");
    }
  };

  // Handle Save Admin Credentials
  const handleSaveAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      login: newAdminLogin.trim() || 'admin',
      password: newAdminPassword.trim() || 'admin777',
      secretCode: newSecretCode.trim() || 'ADMIN2026',
    };
    saveStoredAdminCreds(updated);
    setCredsSavedAlert(true);
    setTimeout(() => setCredsSavedAlert(false), 3000);
  };

  // Analytics Calculations
  const totalBookingsCount = bookings.length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;
  const totalRevenueUZS = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, b) => acc + b.totalPriceUZS, 0);

  // Filtered flights
  const filteredFlights = flights.filter(
    (f) =>
      f.flightNumber.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.airline.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.fromCity.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.toCity.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.fromCode.toLowerCase().includes(flightSearch.toLowerCase()) ||
      f.toCode.toLowerCase().includes(flightSearch.toLowerCase())
  );

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.pnr.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.passengerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.passportId.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.phone.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.route.toLowerCase().includes(bookingSearch.toLowerCase());

    const matchesStatus =
      bookingFilterStatus === 'all' || b.status === bookingFilterStatus;

    return matchesSearch && matchesStatus;
  });

  // Add flight submit handler
  const handleAddFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromAirport = AIRPORTS.find((a) => a.code === newFlight.fromCode);
    const toAirport = AIRPORTS.find((a) => a.code === newFlight.toCode);

    const fullFlight: Flight = {
      id: `fl-admin-${Date.now()}`,
      airline: newFlight.airline || 'Uzbekistan Airways',
      airlineCode: newFlight.airlineCode || 'HY',
      airlineLogo: newFlight.airlineCode === 'TK' ? '🇹🇷' : newFlight.airlineCode === 'EK' ? '🇦🇪' : '✈️',
      flightNumber: (newFlight.flightNumber || 'HY-999').toUpperCase(),
      fromCity: fromAirport ? fromAirport.city : newFlight.fromCity || 'Samarqand',
      fromCode: newFlight.fromCode || 'SKD',
      toCity: toAirport ? toAirport.city : newFlight.toCity || 'Istanbul',
      toCode: newFlight.toCode || 'IST',
      departureTime: newFlight.departureTime || '10:00',
      arrivalTime: newFlight.arrivalTime || '14:00',
      duration: newFlight.duration || '4s 00daq',
      durationMinutes: newFlight.durationMinutes || 240,
      direct: Boolean(newFlight.direct),
      basePriceUZS: Number(newFlight.basePriceUZS) || 2500000,
      aircraft: newFlight.aircraft || 'Airbus A320',
      baggage: newFlight.baggage || "23 kg bagaj + 8 kg qo'l yuki",
      seatsRemaining: Number(newFlight.seatsRemaining) || 50,
      featuredTag: newFlight.featuredTag,
    };

    onSaveFlights([fullFlight, ...flights]);
    setShowAddFlight(false);
  };

  // Delete flight handler
  const handleDeleteFlight = (id: string) => {
    if (confirm("Haqiqatan ham ushbu reysni tizimdan o'chirmoqchimisiz?")) {
      onSaveFlights(flights.filter((f) => f.id !== id));
    }
  };

  // Save edited price
  const handleSavePrice = (flightId: string) => {
    if (editPriceUZS <= 0) return;
    const updated = flights.map((f) =>
      f.id === flightId ? { ...f, basePriceUZS: editPriceUZS } : f
    );
    onSaveFlights(updated);
    setEditingFlightId(null);
  };

  // Save edited seats
  const handleSaveSeats = (flightId: string) => {
    if (editSeatsVal < 0) return;
    const updated = flights.map((f) =>
      f.id === flightId ? { ...f, seatsRemaining: editSeatsVal } : f
    );
    onSaveFlights(updated);
    setEditSeatsId(null);
  };

  // Export Bookings to CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      alert("Hozircha buyurtmalar ro'yxati bo'sh!");
      return;
    }

    const headers = [
      'PNR',
      'Chipta Raqami',
      'Yolovchi FIO',
      'Pasport',
      'Telefon',
      'Yonalish',
      'Reys/Nomi',
      'Sana',
      'Status',
      'Jami Summa (UZS)',
    ];

    const rows = bookings.map((b) => [
      b.pnr,
      b.ticketNumber,
      `"${b.passengerName}"`,
      b.passportId,
      b.phone,
      `"${b.route}"`,
      b.title,
      b.date,
      b.status,
      b.totalPriceUZS,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `uzfly_bronlar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Currency Rates
  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRates = {
      UZS: { rate: 1, symbol: "so'm", suffix: true },
      USD: { rate: Number(usdRate) || DEFAULT_CURRENCY_RATES.USD.rate, symbol: '$', suffix: false },
      EUR: { rate: Number(eurRate) || DEFAULT_CURRENCY_RATES.EUR.rate, symbol: '€', suffix: false },
      RUB: { rate: Number(rubRate) || DEFAULT_CURRENCY_RATES.RUB.rate, symbol: '₽', suffix: true },
    };
    saveStoredCurrencyRates(updatedRates);
    onRatesUpdated();
    setRatesSavedAlert(true);
    setTimeout(() => setRatesSavedAlert(false), 2500);
  };

  // =========================================================================
  // 1. MUSTAQIL ADMIN LOGIN GATE (STANDALONE SCREEN - BIR-BIRINING ICHIDA EMAS)
  // =========================================================================
  if (!effectiveAuthorized) {
    return (
      <div className="min-h-screen w-full bg-[#0a0f1d] text-white flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
        {/* Top bar */}
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent">
                UZFLY ADMIN PORTAL
              </span>
              <span className="block text-[10px] text-amber-400/80 font-mono font-bold tracking-widest uppercase">
                Enterprise Central Management
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToMainSite}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Asosiy Saytga Qaytish (Mijoz Portali)</span>
          </button>
        </header>

        {/* Central Dedicated Login Box */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-6 relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
                <Lock className="w-8 h-8 text-slate-950" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Admin Tizimiga Kirish
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Bu alohida boshqaruv tizimi bo'lib, faqat mas'ul administratorlar uchun mo'ljallangan.
              </p>
            </div>

            <div className="p-3 mb-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] font-bold text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Standart kirish: Login: <b>admin</b> | Parol: <b>admin777</b></span>
            </div>

            {gateError && (
              <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{gateError}</span>
              </div>
            )}

            <form onSubmit={handleGateLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 mb-1.5">
                  Admin Logini:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={gateLogin}
                    onChange={(e) => setGateLogin(e.target.value)}
                    placeholder="admin"
                    className="w-full p-3.5 bg-slate-950/70 border border-slate-700 rounded-xl font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                  <Users className="w-4 h-4 text-slate-500 absolute right-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 mb-1.5">
                  Admin Maxfiy Paroli:
                </label>
                <div className="relative">
                  <input
                    type={showGatePass ? 'text' : 'password'}
                    required
                    value={gatePassword}
                    onChange={(e) => setGatePassword(e.target.value)}
                    placeholder="admin777"
                    className="w-full p-3.5 pr-11 bg-slate-950/70 border border-slate-700 rounded-xl font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGatePass(!showGatePass)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                  >
                    {showGatePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center gap-2 mt-3"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>Boshqaruv Tizimini Ochish</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={onBackToMainSite}
                className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Asosiy chipta qidirish saytiga qaytish</span>
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/90 py-3 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 UzFly Aviasayohat Tizimlari Boshqaruvi. Barcha huquqlar himoyalangan.</span>
          <span className="font-mono text-[11px] text-emerald-400 font-bold">Xavfsiz 256-bit SSL Aloqa</span>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 2. STANDALONE ENTERPRISE ADMIN SUITE (TO'LIQ MUSTAQIL EKRAN)
  // =========================================================================
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Standalone Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-slate-950 shadow-md shadow-amber-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                UZFLY ADMIN ERP
              </h1>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                ALOHIDA TIZIM
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Markaziy Boshqaruv & Aviachiptalar Monitoring Stoli
            </p>
          </div>
        </div>

        {/* Top Bar Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Link back to Main Site */}
          <button
            type="button"
            onClick={onBackToMainSite}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-black transition cursor-pointer shadow-sm"
            title="Asosiy mijoz saytiga o'tish"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mijoz Saytiga O'tish</span>
          </button>

          {/* Admin Logout */}
          <button
            type="button"
            onClick={() => {
              if (onAdminLogout) onAdminLogout();
              setAuthOverride(false);
              onBackToMainSite();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition cursor-pointer"
            title="Admin sessiyasini tugatish"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Chiqish</span>
          </button>
        </div>
      </header>

      {/* Main Layout Body: Sidebar + Dynamic Content Screen */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Standalone Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-3 mb-2">
              Boshqaruv Bo'limlari
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-black transition cursor-pointer text-left ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Umumiy Ko'rsatkichlar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('flights')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition cursor-pointer text-left ${
                activeTab === 'flights'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Plane className="w-4 h-4" />
                <span>Reyslar Boshqaruvi</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'flights' ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {flights.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition cursor-pointer text-left ${
                activeTab === 'bookings'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-4 h-4" />
                <span>Bronlar va Chiptalar</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'bookings' ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {bookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('trains_hotels')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition cursor-pointer text-left ${
                activeTab === 'trains_hotels'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrainIcon className="w-4 h-4" />
                <span>Poezd va Mehmonxonalar</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'trains_hotels' ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {trains.length + hotels.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-black transition cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Valyuta & Xavfsizlik</span>
            </button>
          </div>

          {/* Sidebar Footer info */}
          <div className="pt-4 border-t border-slate-800 mt-4 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Admin:</span>
              <span className="font-bold text-amber-400">FAXRIDDIN (ADMIN)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tizim holati:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Faol / Onlayn
              </span>
            </div>
          </div>
        </aside>

        {/* Standalone Content Area */}
        <main className="flex-1 bg-slate-950 p-4 sm:p-8 overflow-y-auto">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & STATS                                   */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Tizim Boshqaruv Paneli
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real vaqt rejimidagi bronlar, reyslar va tushumlar ko'rsatkichi
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>CSV Hisobot Yuklash</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Jami Buyurtmalar</span>
                    <Ticket className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {totalBookingsCount} ta
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">
                    Sayohatchilar tomonidan rasmiylashtirilgan
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Tasdiqlangan</span>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {confirmedBookingsCount} ta
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">
                    To'lovi to'liq qilingan va faol
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Mavjud Reyslar</span>
                    <Plane className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    {flights.length} ta
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">
                    Tizimda faol sotuvdagi reyslar
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Jami Tushum</span>
                    <DollarSign className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {formatPrice(totalRevenueUZS, currency)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">
                    Chipta savdosidan umumiy aylanma
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Tezkor Boshqaruv Amallari</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('flights');
                      setShowAddFlight(true);
                    }}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Yangi Reys Qo'shish</div>
                      <div className="text-[11px] text-slate-400">Parvoz yo'nalishi yaratish</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Bronlarni Ko'rish</div>
                      <div className="text-[11px] text-slate-400">Statuslarni o'zgartirish</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Valyuta & Parollar</div>
                      <div className="text-[11px] text-slate-400">Dollar/Yevro va admin sozlamalari</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: FLIGHTS MANAGEMENT                                 */}
          {/* ========================================================= */}
          {activeTab === 'flights' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Aviaparvozlar Boshqaruvi
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Yangi reyslar kiritish, narxlar va bo'sh joylarni to'g'ridan-to'g'ri o'zgartirish
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddFlight(!showAddFlight)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddFlight ? 'Formani Yopish' : 'Yangi Reys Qo\'shish'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Barcha reyslarni standart holatga qaytarishni xohlaysizmi?")) {
                        onResetFlights();
                      }
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                    title="Standart holatga qaytarish"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add Flight Form */}
              {showAddFlight && (
                <div className="p-6 bg-slate-900 border border-amber-500/40 rounded-3xl shadow-xl animate-in fade-in">
                  <h3 className="text-base font-black text-amber-400 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Yangi Aviaparvoz Qo'shish</span>
                  </h3>

                  <form onSubmit={handleAddFlightSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                          Aviakompaniya
                        </label>
                        <input
                          type="text"
                          required
                          value={newFlight.airline}
                          onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                          Reys Raqami
                        </label>
                        <input
                          type="text"
                          required
                          value={newFlight.flightNumber}
                          onChange={(e) => setNewFlight({ ...newFlight, flightNumber: e.target.value })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                          Samolyot Turi
                        </label>
                        <input
                          type="text"
                          value={newFlight.aircraft}
                          onChange={(e) => setNewFlight({ ...newFlight, aircraft: e.target.value })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                          Qayerdan (Aeroport Koding)
                        </label>
                        <CustomSelect
                          value={newFlight.fromCode || 'SKD'}
                          onChange={(val) => setNewFlight({ ...newFlight, fromCode: val })}
                          options={AIRPORTS.map((a) => ({
                            value: a.code,
                            label: `${a.city} (${a.code}) - ${a.name}`,
                          }))}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                          Qayerga (Aeroport Koding)
                        </label>
                        <CustomSelect
                          value={newFlight.toCode || 'IST'}
                          onChange={(val) => setNewFlight({ ...newFlight, toCode: val })}
                          options={AIRPORTS.map((a) => ({
                            value: a.code,
                            label: `${a.city} (${a.code}) - ${a.name}`,
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                          Uchish Vaqti
                        </label>
                        <input
                          type="time"
                          required
                          value={newFlight.departureTime}
                          onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                          Qo'nish Vaqti
                        </label>
                        <input
                          type="time"
                          required
                          value={newFlight.arrivalTime}
                          onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                          Narx (UZS)
                        </label>
                        <input
                          type="number"
                          required
                          value={newFlight.basePriceUZS}
                          onChange={(e) => setNewFlight({ ...newFlight, basePriceUZS: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1">
                          Bo'sh Joylar
                        </label>
                        <input
                          type="number"
                          required
                          value={newFlight.seatsRemaining}
                          onChange={(e) => setNewFlight({ ...newFlight, seatsRemaining: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddFlight(false)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Bekor Qilish
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer"
                      >
                        Reysni Saqlash va E'lon Qilish
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Flight Search filter */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Reys raqami, shahar yoki aviakompaniya bo'yicha qidirish..."
                  value={flightSearch}
                  onChange={(e) => setFlightSearch(e.target.value)}
                  className="w-full p-3 pl-10 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>

              {/* Flights Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-black border-b border-slate-800">
                      <tr>
                        <th className="p-4">Reys</th>
                        <th className="p-4">Kompaniya</th>
                        <th className="p-4">Yo'nalish</th>
                        <th className="p-4">Vaqt</th>
                        <th className="p-4">Bo'sh Joy</th>
                        <th className="p-4">Narxi (UZS)</th>
                        <th className="p-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredFlights.map((flight) => (
                        <tr key={flight.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-4 font-black text-white font-mono">
                            {flight.flightNumber}
                          </td>
                          <td className="p-4">
                            <span className="font-bold">{flight.airline}</span>
                          </td>
                          <td className="p-4 font-bold text-slate-200">
                            {flight.fromCity} ({flight.fromCode}) ➔ {flight.toCity} ({flight.toCode})
                          </td>
                          <td className="p-4 font-mono text-slate-400">
                            {flight.departureTime} - {flight.arrivalTime}
                          </td>
                          <td className="p-4">
                            {editSeatsId === flight.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editSeatsVal}
                                  onChange={(e) => setEditSeatsVal(Number(e.target.value))}
                                  className="w-16 p-1 bg-slate-950 border border-amber-500 rounded text-xs font-bold text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveSeats(flight.id)}
                                  className="p-1 bg-amber-500 text-slate-950 rounded text-[10px] font-bold"
                                >
                                  OK
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditSeatsId(flight.id);
                                  setEditSeatsVal(flight.seatsRemaining);
                                }}
                                className="hover:text-amber-400 font-bold underline cursor-pointer"
                                title="O'zgartirish uchun bosing"
                              >
                                {flight.seatsRemaining} ta
                              </button>
                            )}
                          </td>
                          <td className="p-4 font-black text-amber-400">
                            {editingFlightId === flight.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editPriceUZS}
                                  onChange={(e) => setEditPriceUZS(Number(e.target.value))}
                                  className="w-24 p-1 bg-slate-950 border border-amber-500 rounded text-xs font-bold text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSavePrice(flight.id)}
                                  className="p-1 bg-amber-500 text-slate-950 rounded text-[10px] font-bold"
                                >
                                  OK
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingFlightId(flight.id);
                                  setEditPriceUZS(flight.basePriceUZS);
                                }}
                                className="hover:underline cursor-pointer flex items-center gap-1"
                                title="Narxni o'zgartirish uchun bosing"
                              >
                                <span>{formatPrice(flight.basePriceUZS, currency)}</span>
                                <Edit2 className="w-3 h-3 text-slate-500" />
                              </button>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteFlight(flight.id)}
                              className="p-2 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                              title="Reysni o'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: BOOKINGS MANAGEMENT                                */}
          {/* ========================================================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Bronlar va Chiptalar Ro'yxati
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sayohatchilar tomonidan rasmiylashtirilgan buyurtmalarni nazorat qilish
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Eksport (CSV)</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="PNR, yo'lovchi ismi, pasport yoki telefon bo'yicha..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full p-3 pl-10 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>

                <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 gap-1">
                  {['all', 'active', 'confirmed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setBookingFilterStatus(st)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer capitalize ${
                        bookingFilterStatus === st
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st === 'all'
                        ? 'Barchasi'
                        : st === 'active'
                        ? 'Kutilmoqda'
                        : st === 'confirmed'
                        ? 'Tasdiqlangan'
                        : 'Bekor qilingan'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-black border-b border-slate-800">
                      <tr>
                        <th className="p-4">PNR</th>
                        <th className="p-4">Yo'lovchi</th>
                        <th className="p-4">Yo'nalish & Reys</th>
                        <th className="p-4">Telefon</th>
                        <th className="p-4">Summa</th>
                        <th className="p-4">Holat</th>
                        <th className="p-4 text-right">Boshqaruv</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">
                            Hech qanday buyurtma topilmadi.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-800/40 transition">
                            <td className="p-4 font-mono font-black text-amber-400">
                              {b.pnr}
                            </td>
                            <td className="p-4">
                              <div className="font-black text-white">{b.passengerName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{b.passportId}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-slate-200">{b.route}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{b.title} • {b.date}</div>
                            </td>
                            <td className="p-4 font-mono text-slate-300">
                              {b.phone}
                            </td>
                            <td className="p-4 font-black text-white">
                              {formatPrice(b.totalPriceUZS, currency)}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : b.status === 'cancelled'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {b.status === 'confirmed'
                                  ? 'Tasdiqlangan'
                                  : b.status === 'cancelled'
                                  ? 'Bekor qilingan'
                                  : 'Faol (Kutilmoqda)'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {b.status !== 'confirmed' && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                                    className="p-1.5 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition cursor-pointer"
                                    title="Tasdiqlash"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}

                                {b.status !== 'cancelled' && (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                                    className="p-1.5 hover:bg-amber-500/20 text-amber-400 rounded-lg transition cursor-pointer"
                                    title="Bekor qilish"
                                  >
                                    <Clock className="w-4 h-4" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm("Ushbu buyurtmani butunlay o'chirmoqchimisiz?")) {
                                      onDeleteBooking(b.id);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition cursor-pointer"
                                  title="O'chirish"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: TRAINS & HOTELS MANAGEMENT                         */}
          {/* ========================================================= */}
          {activeTab === 'trains_hotels' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Trains */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <TrainIcon className="w-6 h-6 text-amber-400" />
                    <span>Temiryo'l (Afrosiyob) Reyslari</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toshkent - Samarqand - Buxoro tezyurar poezdlari ro'yxati va narxlari
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trains.map((t) => (
                    <div key={t.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-amber-400 text-sm">{t.name}</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded">
                          {t.type}
                        </span>
                      </div>

                      <div className="font-bold text-white text-sm">
                        {t.fromCity} ➔ {t.toCity}
                      </div>

                      <div className="text-xs text-slate-400 flex items-center justify-between font-mono">
                        <span>Vaqt: {t.departureTime} - {t.arrivalTime}</span>
                        <span>{t.duration}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Kupe Narxi:</span>
                          <span className="font-black text-white text-sm">
                            {formatPrice(t.priceKupeUZS, currency)}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-bold">
                          {t.availableSeats} joy qoldi
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-amber-400" />
                    <span>Mehmonxonalar Boshqaruvi</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tizimda tavsiya etiladigan mehmonxonalar va narxlari
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hotels.map((h) => (
                    <div key={h.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-sm">{h.name}</span>
                        <span className="text-xs text-amber-400 font-bold">⭐ {h.rating}</span>
                      </div>

                      <div className="text-xs text-slate-400">
                        📍 {h.city}, {h.country} ({h.distanceToCenter})
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Kechalik narxi:</span>
                          <span className="font-black text-amber-400 text-sm">
                            {formatPrice(h.pricePerNightUZS, currency)}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-300 font-bold">
                          {h.stars} yulduzli
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: SETTINGS & SECURITY                                */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Valyuta Kurslari & Xavfsizlik Sozlamalari
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tizim konvertatsiya kurslari va Admin boshqaruv parollari
                </p>
              </div>

              {/* 1. Currency Exchange Rates */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <span>Real Valyuta Kurslari (Markaziy Bank / Bozor)</span>
                  </h3>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-black px-2 py-0.5 rounded">
                    AVTO-HISOB
                  </span>
                </div>

                {ratesSavedAlert && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-black flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Valyuta kurslari muvaffaqiyatli yangilandi!</span>
                  </div>
                )}

                <form onSubmit={handleSaveRates} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-black text-slate-300 mb-1">
                        1 USD kursi (so'mda):
                      </label>
                      <input
                        type="number"
                        required
                        value={usdRate}
                        onChange={(e) => setUsdRate(Number(e.target.value))}
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl font-bold text-sm text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-300 mb-1">
                        1 EUR kursi (so'mda):
                      </label>
                      <input
                        type="number"
                        required
                        value={eurRate}
                        onChange={(e) => setEurRate(Number(e.target.value))}
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl font-bold text-sm text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-300 mb-1">
                        1 RUB kursi (so'mda):
                      </label>
                      <input
                        type="number"
                        required
                        value={rubRate}
                        onChange={(e) => setRubRate(Number(e.target.value))}
                        className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl font-bold text-sm text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    Valyuta Kurslarini Saqlash 💾
                  </button>
                </form>
              </div>

              {/* 2. Admin Security: Login & Password */}
              <div className="p-6 bg-slate-900 border border-amber-500/40 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                    <span>Admin Login & Parollarini Boshqarish (Xavfsizlik)</span>
                  </h3>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded">
                    XAVFSIZLIK
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-medium">
                  Ushbu bo'limda siz alohida Admin tizimiga kirish logini, paroli va maxfiy xavfsizlik kodini o'zgartirishingiz mumkin.
                </p>

                {credsSavedAlert && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-black flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Yangi admin kirish ma'lumotlari muvaffaqiyatli saqlandi!</span>
                  </div>
                )}

                <form onSubmit={handleSaveAdminCreds} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1">
                      Admin Logini:
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdminLogin}
                      onChange={(e) => setNewAdminLogin(e.target.value)}
                      placeholder="admin"
                      className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl font-bold text-sm text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1">
                      Admin Maxfiy Paroli:
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassSettings ? 'text' : 'password'}
                        required
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="admin777"
                        className="w-full p-3 pr-10 bg-slate-950 border border-slate-700 rounded-xl font-bold text-sm text-white focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassSettings(!showAdminPassSettings)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                      >
                        {showAdminPassSettings ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1">
                      Admin Maxfiy Xavfsizlik Kodi:
                    </label>
                    <input
                      type="text"
                      required
                      value={newSecretCode}
                      onChange={(e) => setNewSecretCode(e.target.value)}
                      placeholder="ADMIN2026"
                      className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl font-bold text-sm text-white focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Ushbu kod orqali admin darhol avtorizatsiyadan o'tishi mumkin.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                    >
                      Yangi Admin Login & Parolini Saqlash 💾
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

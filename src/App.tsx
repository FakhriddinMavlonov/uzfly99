import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchWidget } from './components/SearchWidget';
import { FlightResults } from './components/FlightResults';
import { CountriesGrid } from './components/CountriesGrid';
import { DestinationsGallery } from './components/DestinationsGallery';
import { HotDeals } from './components/HotDeals';
import { BakuGuide } from './components/BakuGuide';
import { TrainSection } from './components/TrainSection';
import { HotelSection } from './components/HotelSection';
import { SeatMapModal } from './components/SeatMapModal';
import { ReservationModal } from './components/ReservationModal';
import { TicketModal } from './components/TicketModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { BaggageGuideModal } from './components/BaggageGuideModal';
import { CurrencyConverterModal } from './components/CurrencyConverterModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { FlightCompareModal } from './components/FlightCompareModal';
import { TravelChecklistModal } from './components/TravelChecklistModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';

import {
  Currency,
  Language,
  ServiceTab,
  SortMode,
  CabinClass,
  Flight,
  Booking,
  Train,
  Hotel,
  HotelRoom,
  ThemeMode,
} from './types';
import {
  AIRPORTS,
} from './data/mockData';
import {
  getStoredBookings,
  saveStoredBooking,
  cancelStoredBooking,
  getStoredUser,
  saveStoredUser,
  clearStoredUser,
  generatePNR,
  generateTicketNumber,
  DICTIONARY,
  UserProfile,
  calculateTripDiscount,
  DiscountDetails,
  getStoredTheme,
  saveStoredTheme,
  getStoredFlights,
  saveStoredFlights,
  resetStoredFlights,
  updateStoredBookingStatus,
  deleteStoredBooking,
  getStoredTrains,
  saveStoredTrains,
  getStoredHotels,
  saveStoredHotels,
} from './utils/helpers';

export default function App() {
  // Global App States
  const [currency, setCurrency] = useState<Currency>('UZS');
  const [language, setLanguage] = useState<Language>('uz');
  const [activeTab, setActiveTab] = useState<ServiceTab>('avia');
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredTheme());
  const [currencyRevision, setCurrencyRevision] = useState(0);

  // Alohida tizimlar rejimi: 'client' (Asosiy sayohat tizimi) yoki 'admin' (Alohida Admin Tizimi)
  const [systemMode, setSystemMode] = useState<'client' | 'admin'>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#admin' ? 'admin' : 'client';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setSystemMode('admin');
      } else {
        setSystemMode('client');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setSystemMode('admin');
  };

  const navigateToClient = () => {
    window.location.hash = '';
    setSystemMode('client');
  };

  // Dynamic Flights, Trains and Hotels Lists from persistent storage
  const [flightsList, setFlightsList] = useState<Flight[]>(() => getStoredFlights());
  const [trainsList, setTrainsList] = useState<Train[]>(() => getStoredTrains());
  const [hotelsList, setHotelsList] = useState<Hotel[]>(() => getStoredHotels());

  // Search States
  const [fromCode, setFromCode] = useState<string>('SKD'); // Default Samarqand matching user exam prompt
  const [toCode, setToCode] = useState<string>('IST'); // Default Istanbul matching user exam prompt
  const [departDate, setDepartDate] = useState<string>('2026-09-24');
  const [returnDate, setReturnDate] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>('econ');
  const [timeSlot, setTimeSlot] = useState<string>('all');
  const [familyBundleSet, setFamilyBundleSet] = useState<number | null>(null);

  // Filter & Sort States
  const [sortMode, setSortMode] = useState<SortMode>('cheapest');
  const [selectedAirline, setSelectedAirline] = useState<string>('all');
  const [selectedDirect, setSelectedDirect] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Bookings & Profile State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => getStoredUser());
  const isAdmin = Boolean(userProfile?.isAdmin || userProfile?.role === 'admin');

  // Cookie Notice
  const [cookieAccepted, setCookieAccepted] = useState(false);

  // Modals
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [activeFlightForSeat, setActiveFlightForSeat] = useState<Flight | null>(null);

  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<{
    title: string;
    route: string;
    fromCode: string;
    toCode: string;
    date: string;
    time: string;
    seatNumber: string;
    cabinClass: CabinClass | 'vip' | 'kupe' | 'platskart';
    totalPriceUZS: number;
    type: 'flight' | 'train' | 'hotel';
    originalPriceUZS?: number;
    discountPercent?: number;
    savedAmountUZS?: number;
    discountLabel?: string;
    isRoundTrip?: boolean;
    returnDate?: string;
    passengersCount?: number;
  } | null>(null);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [activeTicketBooking, setActiveTicketBooking] = useState<Booking | null>(null);

  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isBaggageOpen, setIsBaggageOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareFlightIds, setCompareFlightIds] = useState<string[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(() => !getStoredUser());

  // Handle User Logout (Chiqish bosilgandagina ro'yxatdan o'tish qayta so'raladi)
  const handleLogout = () => {
    clearStoredUser();
    setUserProfile(null);
    setIsAuthOpen(true);
  };

  // Toggle flight comparison
  const handleToggleCompare = (flightId: string) => {
    setCompareFlightIds((prev) => {
      if (prev.includes(flightId)) {
        return prev.filter((id) => id !== flightId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), flightId];
      }
      return [...prev, flightId];
    });
  };

  // Load bookings, user profile and sync theme on mount
  useEffect(() => {
    setBookings(getStoredBookings());
    const stored = getStoredUser();
    setUserProfile(stored);
    if (!stored) {
      setIsAuthOpen(true);
    }
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Toggle Day / Night (Kun / Tun) theme
  const handleToggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    saveStoredTheme(next);
  };

  // Swap From and To
  const handleSwapCities = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  // Toggle favorite
  const handleToggleFavorite = (flightId: string) => {
    setFavorites((prev) =>
      prev.includes(flightId) ? prev.filter((id) => id !== flightId) : [...prev, flightId]
    );
  };

  // Select Country from Grid
  const handleSelectCountry = (targetCityCode: string) => {
    setToCode(targetCityCode);
    setActiveTab('avia');
    // Smooth scroll to search results
    const el = document.getElementById('search-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Select Route (From Dest Cards / Hot Deals / Baku Guide)
  const handleSelectRoute = (from: string, to: string) => {
    setFromCode(from);
    setToCode(to);
    setActiveTab('avia');
    const el = document.getElementById('search-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Determine if current route is international and/or round trip
  const isTripInternational = useMemo(() => {
    const fromA = AIRPORTS.find((a) => a.code === fromCode);
    const toA = AIRPORTS.find((a) => a.code === toCode);
    if (!fromA || !toA) return true;
    return fromA.country !== "O'zbekiston" || toA.country !== "O'zbekiston";
  }, [fromCode, toCode]);

  const isRoundTripFlight = Boolean(returnDate && returnDate.trim() !== '');

  // Calculate dynamic combination discount based on user account, tickets count, round trip and international route
  const currentTripDiscount: DiscountDetails = useMemo(() => {
    return calculateTripDiscount({
      user: userProfile,
      passengersCount: passengers,
      isRoundTrip: isRoundTripFlight,
      isInternational: isTripInternational,
      isFamilyBundle: familyBundleSet !== null || [2, 4, 8, 12, 16].includes(passengers),
      familyBundleCount: familyBundleSet || undefined,
    });
  }, [userProfile, passengers, isRoundTripFlight, isTripInternational, familyBundleSet]);

  // Filtered and Sorted Flights
  const filteredFlights = useMemo(() => {
    let result = flightsList.filter((f) => {
      // If user selected specific route, match or return realistic flights
      const matchesRoute =
        (f.fromCode === fromCode && f.toCode === toCode) ||
        (f.fromCode === fromCode) ||
        (f.toCode === toCode);

      // Airline filter
      const matchesAirline = selectedAirline === 'all' || f.airlineCode === selectedAirline;

      // Direct filter
      const matchesDirect = selectedDirect === 'all' || (selectedDirect === 'direct' && f.direct);

      // Time slot filter
      let matchesTime = true;
      if (timeSlot !== 'all') {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        if (timeSlot === 'morning') matchesTime = hour >= 6 && hour < 12;
        else if (timeSlot === 'afternoon') matchesTime = hour >= 12 && hour < 18;
        else if (timeSlot === 'evening') matchesTime = hour >= 18 && hour <= 23;
        else if (timeSlot === 'night') matchesTime = hour >= 0 && hour < 6;
      }

      return matchesRoute && matchesAirline && matchesDirect && matchesTime;
    });

    // If exact route filter had 0 results, fallback to matching by fromCity or return all flights with adjusted route
    if (result.length === 0) {
      const fromAirport = AIRPORTS.find((a) => a.code === fromCode);
      const toAirport = AIRPORTS.find((a) => a.code === toCode);
      result = flightsList.map((f, idx) => ({
        ...f,
        id: `gen-${f.id}-${idx}`,
        fromCity: fromAirport ? fromAirport.city : f.fromCity,
        fromCode: fromCode,
        toCity: toAirport ? toAirport.city : f.toCity,
        toCode: toCode,
      })).filter((f) => {
        const matchesAirline = selectedAirline === 'all' || f.airlineCode === selectedAirline;
        const matchesDirect = selectedDirect === 'all' || (selectedDirect === 'direct' && f.direct);
        return matchesAirline && matchesDirect;
      });
    }

    // Multiply base price by passenger count & class (Standard calculation, no discount)
    const count = passengers;
    const classMultiplier = cabinClass === 'biz' ? 1.6 : 1;

    result = result.map((f) => {
      const originalPrice = Math.round(f.basePriceUZS * count * classMultiplier);

      return {
        ...f,
        basePriceUZS: originalPrice,
        originalPriceUZS: undefined,
        discountPercent: undefined,
        savedAmountUZS: undefined,
        discountLabel: undefined,
        isFamilyBundle: false,
        familyBundleCount: count,
      };
    });

    // Sorting
    if (sortMode === 'cheapest') {
      result.sort((a, b) => a.basePriceUZS - b.basePriceUZS);
    } else if (sortMode === 'fastest') {
      result.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortMode === 'recommended') {
      result.sort((a, b) => (b.featuredTag ? 1 : 0) - (a.featuredTag ? 1 : 0));
    }

    return result;
  }, [flightsList, fromCode, toCode, selectedAirline, selectedDirect, timeSlot, sortMode, passengers, cabinClass]);

  // Open Seat Map
  const handleOpenSeatMap = (flight: Flight) => {
    setActiveFlightForSeat(flight);
    setIsSeatModalOpen(true);
  };

  // Confirm Seat and proceed to Reservation
  const handleConfirmSeat = (seatId: string, extraPriceUZS: number) => {
    if (!activeFlightForSeat) return;
    setIsSeatModalOpen(false);

    const seatsLabel = seatId;
    const totalPrice = activeFlightForSeat.basePriceUZS + extraPriceUZS;

    setReservationDetails({
      title: `${activeFlightForSeat.airline} (${activeFlightForSeat.flightNumber})`,
      route: `${activeFlightForSeat.fromCity} ➔ ${activeFlightForSeat.toCity}`,
      fromCode: activeFlightForSeat.fromCode,
      toCode: activeFlightForSeat.toCode,
      date: departDate,
      time: activeFlightForSeat.departureTime,
      seatNumber: seatsLabel,
      cabinClass: parseInt(seatId) <= 3 ? 'biz' : 'econ',
      totalPriceUZS: totalPrice,
      type: 'flight',
      isRoundTrip: isRoundTripFlight,
      returnDate: returnDate || undefined,
      passengersCount: passengers,
    });
    setIsReservationOpen(true);
  };

  // Fast 48h Booking (auto assigns a nice seat like 7A)
  const handleFastBook = (flight: Flight) => {
    const seatsLabel = '7A (Oyna yonida)';

    setReservationDetails({
      title: `${flight.airline} (${flight.flightNumber})`,
      route: `${flight.fromCity} ➔ ${flight.toCity}`,
      fromCode: flight.fromCode,
      toCode: flight.toCode,
      date: departDate,
      time: flight.departureTime,
      seatNumber: seatsLabel,
      cabinClass: cabinClass,
      totalPriceUZS: flight.basePriceUZS,
      type: 'flight',
      isRoundTrip: isRoundTripFlight,
      returnDate: returnDate || undefined,
      passengersCount: passengers,
    });
    setIsReservationOpen(true);
  };

  // Book Train
  const handleBookTrain = (
    train: Train,
    classType: 'vip' | 'biz' | 'kupe' | 'platskart',
    priceUZS: number,
    chosenDate?: string,
    chosenSeat?: string,
    isRoundTrip?: boolean,
    passengersCount?: number
  ) => {
    const getCode = (city: string) => {
      const c = city.toLowerCase();
      if (c.includes('toshkent')) return 'TAS';
      if (c.includes('samarqand')) return 'SKD';
      if (c.includes('buxoro')) return 'BHK';
      if (c.includes('qarshi')) return 'KSQ';
      if (c.includes('navoiy')) return 'NVI';
      if (c.includes('urganch') || c.includes('xiva')) return 'UGC';
      if (c.includes('andijon')) return 'AZN';
      if (c.includes('termiz')) return 'TMZ';
      if (c.includes('olmaota') || c.includes('almaty')) return 'ALA';
      if (c.includes('moskva') || c.includes('moscow')) return 'MOW';
      if (c.includes('dushanbe')) return 'DYU';
      if (c.includes('bishkek')) return 'FRU';
      if (c.includes('london')) return 'LON';
      if (c.includes('parij') || c.includes('paris')) return 'PAR';
      if (c.includes('tokio') || c.includes('tokyo')) return 'TYO';
      if (c.includes('kioto') || c.includes('kyoto')) return 'UKY';
      if (c.includes('berlin')) return 'BER';
      if (c.includes('myunxen') || c.includes('munich')) return 'MUC';
      if (c.includes('rim') || c.includes('rome')) return 'ROM';
      if (c.includes('milan')) return 'MIL';
      if (c.includes('makka') || c.includes('makkah')) return 'QMK';
      if (c.includes('madina') || c.includes('madinah')) return 'MED';
      return 'VOK';
    };

    const wagonLabel =
      classType === 'vip'
        ? "Vagon 01 (VIP), O'rindiq 06"
        : classType === 'biz'
        ? "Vagon 02 (Biznes), O'rindiq 14"
        : classType === 'kupe'
        ? "Vagon 05 (Kupe), O'rindiq 22"
        : "Vagon 08 (Platskart), O'rindiq 35";

    setReservationDetails({
      title: train.name,
      route: `${train.fromCity} ➔ ${train.toCity}`,
      fromCode: getCode(train.fromCity),
      toCode: getCode(train.toCity),
      date: chosenDate || '2026-09-24',
      time: train.departureTime,
      seatNumber: chosenSeat || wagonLabel,
      cabinClass: classType,
      totalPriceUZS: priceUZS,
      type: 'train',
      isRoundTrip: Boolean(isRoundTrip),
      passengersCount: passengersCount || 1,
    });
    setIsReservationOpen(true);
  };

  // Book Hotel
  const handleBookHotel = (hotel: Hotel, room?: HotelRoom) => {
    const roomTitle = room?.name || 'Deluxe King Room Panoramik Manzara';
    const roomPrice = room?.priceUZS || hotel.pricePerNightUZS;
    setReservationDetails({
      title: `${hotel.name} (${'★'.repeat(hotel.stars)})`,
      route: `${hotel.city}, ${hotel.country} • ${hotel.address || hotel.distanceToCenter}`,
      fromCode: 'HOTEL',
      toCode: hotel.city.substring(0, 3).toUpperCase(),
      date: '2026-09-24 ~ 2026-09-27 (3 kecha)',
      time: `Check-in: ${hotel.checkInTime || '14:00'} / Check-out: ${hotel.checkOutTime || '12:00'}`,
      seatNumber: roomTitle,
      cabinClass: 'biz',
      totalPriceUZS: roomPrice * 3,
      type: 'hotel',
    });
    setIsReservationOpen(true);
  };

  // Final Reservation Confirmation -> Generates official E-Ticket / Boarding Pass
  const handleCompleteReservation = (passenger: {
    fullName: string;
    passportId: string;
    phone: string;
    email: string;
    customSeat?: string;
    isRoundTrip?: boolean;
    passengersCount?: number;
    originalPriceUZS?: number;
    discountPercent?: number;
    savedAmountUZS?: number;
    discountLabel?: string;
  }) => {
    if (!reservationDetails) return;

    const expires = new Date();
    expires.setHours(expires.getHours() + 48);

    const isRoundTripBooking = passenger.isRoundTrip ?? reservationDetails.isRoundTrip ?? false;
    const boughtPassengersCount = passenger.passengersCount ?? reservationDetails.passengersCount ?? 1;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      pnr: generatePNR(),
      ticketNumber: generateTicketNumber(),
      passengerName: passenger.fullName,
      passportId: passenger.passportId,
      phone: passenger.phone,
      email: passenger.email,
      type: reservationDetails.type,
      title: reservationDetails.title,
      route: reservationDetails.route,
      fromCode: reservationDetails.fromCode,
      toCode: reservationDetails.toCode,
      date: reservationDetails.date,
      time: reservationDetails.time,
      seatNumber: passenger.customSeat || reservationDetails.seatNumber,
      cabinClass: reservationDetails.cabinClass,
      totalPriceUZS: reservationDetails.totalPriceUZS,
      createdAt: new Date().toISOString(),
      expiresAt: expires.toISOString(),
      status: 'active',
      isRoundTrip: isRoundTripBooking,
      returnDate: reservationDetails.returnDate,
      passengersCount: boughtPassengersCount,
    };

    const updated = saveStoredBooking(newBooking);
    setBookings(updated);

    // Update user profile totalTicketsBought in storage
    if (userProfile) {
      const prevTotal = userProfile.totalTicketsBought || 0;
      const newTotal = prevTotal + boughtPassengersCount;
      const updatedUser: UserProfile = {
        ...userProfile,
        totalTicketsBought: newTotal,
      };
      setUserProfile(updatedUser);
      saveStoredUser(updatedUser);
    }

    setIsReservationOpen(false);

    // Open Printable Ticket immediately
    setActiveTicketBooking(newBooking);
    setIsTicketModalOpen(true);
  };

  // Cancel Booking
  const handleCancelBooking = (id: string) => {
    const updated = cancelStoredBooking(id);
    setBookings(updated);
  };

  const t = DICTIONARY[language];

  // 1. MUSTAQIL ALOHIDA ADMIN TIZIMI (STANDALONE ADMIN SYSTEM - BIR-BIRINING ICHIDA EMAS!)
  if (systemMode === 'admin') {
    return (
      <AdminPortal
        onBackToMainSite={navigateToClient}
        currency={currency}
        flights={flightsList}
        onSaveFlights={(updated) => {
          setFlightsList(updated);
          saveStoredFlights(updated);
        }}
        onResetFlights={() => {
          const res = resetStoredFlights();
          setFlightsList(res);
        }}
        bookings={bookings}
        onUpdateBookingStatus={(id, status) => {
          const updated = updateStoredBookingStatus(id, status);
          setBookings(updated);
        }}
        onDeleteBooking={(id) => {
          const updated = deleteStoredBooking(id);
          setBookings(updated);
        }}
        trains={trainsList}
        onSaveTrains={(updated) => {
          setTrainsList(updated);
          saveStoredTrains(updated);
        }}
        hotels={hotelsList}
        onSaveHotels={(updated) => {
          setHotelsList(updated);
          saveStoredHotels(updated);
        }}
        onRatesUpdated={() => setCurrencyRevision((r) => r + 1)}
        currentUser={userProfile}
        onAdminLoginSuccess={(adminUser) => {
          setUserProfile(adminUser);
          saveStoredUser(adminUser);
        }}
        onAdminLogout={() => {
          const regularUser: UserProfile = {
            fullName: userProfile?.fullName || 'SAYOHATCHI',
            passportId: userProfile?.passportId || 'FA1234567',
            phone: userProfile?.phone || '+998 93 039 92 91',
            email: userProfile?.email || '',
            role: 'user',
            isAdmin: false,
          };
          setUserProfile(regularUser);
          saveStoredUser(regularUser);
        }}
      />
    );
  }

  // 2. ASOSIY SAYOHAT TIZIMI (MIJOZ PORTALI - ADMIN PANEL BU YERDA ASLO MODAL BO'LIB OCHILMAYDI)
  return (
    <div className="min-h-screen bg-[#f2f6fa] dark:bg-[#090f1d] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Header */}
      <Header
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        bookingsCount={bookings.filter((b) => b.status === 'active').length}
        onOpenBookings={() => setIsMyBookingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={navigateToAdmin}
        userInitial={userProfile?.fullName ? userProfile.fullName.charAt(0) : 'U'}
        userName={userProfile?.fullName ? userProfile.fullName.split(' ')[0] : undefined}
        userProfile={userProfile}
        discountInfo={currentTripDiscount}
        onLogout={userProfile ? handleLogout : undefined}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Hero Section & Main Unified Search Widget */}
      <SearchWidget
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        airports={AIRPORTS}
        fromCode={fromCode}
        setFromCode={setFromCode}
        toCode={toCode}
        setToCode={setToCode}
        departDate={departDate}
        setDepartDate={setDepartDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        passengers={passengers}
        setPassengers={setPassengers}
        cabinClass={cabinClass}
        setCabinClass={setCabinClass}
        timeSlot={timeSlot}
        setTimeSlot={setTimeSlot}
        onSearch={() => {
          setActiveTab('avia');
          const res = document.getElementById('results-section');
          if (res) res.scrollIntoView({ behavior: 'smooth' });
        }}
        onSwap={handleSwapCities}
        language={language}
        userProfile={userProfile}
        discountInfo={currentTripDiscount}
        onOpenAuth={() => setIsAuthOpen(true)}
        familyBundleSet={familyBundleSet}
        setFamilyBundleSet={(count) => {
          setFamilyBundleSet(count);
          if (count) setPassengers(count);
        }}
      />

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 flex-1 w-full">
        {/* TAB 1: AVIA FLIGHTS (DEFAULT & RESULTS) */}
        {activeTab === 'avia' && (
          <>
            {/* Search Results List with Filters & Low-fare calendar */}
            <FlightResults
              flights={filteredFlights}
              currency={currency}
              language={language}
              sortMode={sortMode}
              setSortMode={setSortMode}
              selectedAirline={selectedAirline}
              setSelectedAirline={setSelectedAirline}
              selectedDirect={selectedDirect}
              setSelectedDirect={setSelectedDirect}
              onSelectSeat={handleOpenSeatMap}
              onFastBook={handleFastBook}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              departDate={departDate}
              onSelectDate={(newDate) => setDepartDate(newDate)}
              onOpenPriceAlert={() => setIsPriceAlertOpen(true)}
              compareFlightIds={compareFlightIds}
              onToggleCompare={handleToggleCompare}
              onOpenCompare={() => setIsCompareOpen(true)}
              passengers={passengers}
              userProfile={userProfile}
              discountInfo={currentTripDiscount}
              onOpenAuth={() => setIsAuthOpen(true)}
              familyBundleSet={familyBundleSet}
              onSelectFamilyBundle={(count) => {
                setFamilyBundleSet(count);
                if (count) setPassengers(count);
                else setPassengers(1);
              }}
            />

            {/* 0. Borish Mumkin Bo'lgan Davlatlar (Flags Grid) */}
            <CountriesGrid
              onSelectCountry={handleSelectCountry}
              currency={currency}
              language={language}
            />

            {/* 1. Shaharlar Fotogalereyasi */}
            <DestinationsGallery
              onSelectCity={(code) => handleSelectCountry(code)}
              currency={currency}
              language={language}
            />

            {/* 2. Issiq Chiptalar (Hot Deals) */}
            <HotDeals
              onSelectRoute={handleSelectRoute}
              currency={currency}
              language={language}
            />

            {/* 3 & 4. Sayohat Qo'llanmasi & Boku */}
            <BakuGuide
              currency={currency}
              language={language}
              onSelectRoute={handleSelectRoute}
            />
          </>
        )}

        {/* TAB 2: DAVLATLAR VA BAYROQLAR */}
        {activeTab === 'countries' && (
          <div className="space-y-8">
            <CountriesGrid
              onSelectCountry={handleSelectCountry}
              currency={currency}
              language={language}
            />
            <DestinationsGallery
              onSelectCity={(code) => handleSelectCountry(code)}
              currency={currency}
              language={language}
            />
          </div>
        )}

        {/* TAB 3: MEHMONXONALAR */}
        {activeTab === 'hotel' && (
          <HotelSection
            currency={currency}
            language={language}
            hotels={hotelsList}
            onBookHotel={handleBookHotel}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* TAB 4: POYEZDLAR */}
        {activeTab === 'train' && (
          <TrainSection
            currency={currency}
            language={language}
            trains={trainsList}
            userProfile={userProfile}
            onOpenAuth={() => setIsAuthOpen(true)}
            onBookTrain={handleBookTrain}
          />
        )}

        {/* TAB 5: TAASSUROT VA QO'LLANMA */}
        {activeTab === 'impressions' && (
          <BakuGuide
            currency={currency}
            language={language}
            onSelectRoute={handleSelectRoute}
          />
        )}

        {/* TAB 6: SEVIMLILAR (FAVORITES) */}
        {activeTab === 'favorites' && (
          <div className="bg-white dark:bg-[#111c35] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Sevimlilar Ro'yxati ({favorites.length})
            </h2>
            {favorites.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold py-8 text-center">
                Hozircha hech qaysi reys sevimlilarga qo'shilmagan. Reys kartasidagi ❤️ tugmasini bosing!
              </p>
            ) : (
              <FlightResults
                flights={flightsList.filter((f) => favorites.includes(f.id))}
                currency={currency}
                language={language}
                sortMode={sortMode}
                setSortMode={setSortMode}
                selectedAirline="all"
                setSelectedAirline={() => {}}
                selectedDirect="all"
                setSelectedDirect={() => {}}
                onSelectSeat={handleOpenSeatMap}
                onFastBook={handleFastBook}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                departDate={departDate}
                onSelectDate={setDepartDate}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0c1427] border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-8 mt-12 text-slate-500 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
                ✈
              </div>
              <div>
                <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">aviasales.uz • UZ FLY</span>
                <p className="text-[11px] text-slate-400">O'zbekistonning eng qulay aviachiptalar agregatori</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
            <div>
              © 2026 Aviasales Uzbekistan Clone • Barcha huquqlar himoyalangan.
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                id="footer-call-center-btn"
                href="tel:+998930399291"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full font-black text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-sm"
                title="Call Center bilan bog'lanish"
              >
                <span>📞 Call Center: +998 93 039 92 91</span>
                <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">24/7 aloqada</span>
              </a>
              <span className="hidden sm:inline">•</span>
              <span className="text-blue-500 font-bold">Rasmiy ICAO / IATA kafolati</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {!cookieAccepted && (
        <div
          id="cookie-banner"
          className="fixed bottom-0 inset-x-0 p-4 bg-white/95 dark:bg-[#0c1427]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-colors"
        >
          <p className="text-slate-600 dark:text-slate-300 font-medium max-w-3xl">
            {t.cookieText}
          </p>
          <button
            id="cookie-accept-btn"
            onClick={() => setCookieAccepted(true)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition cursor-pointer whitespace-nowrap shadow-sm"
          >
            {t.cookieAccept}
          </button>
        </div>
      )}

      {/* MODAL 1: Interactive Seat Map */}
      {isSeatModalOpen && activeFlightForSeat && (
        <SeatMapModal
          flight={activeFlightForSeat}
          currency={currency}
          onClose={() => setIsSeatModalOpen(false)}
          onConfirmSeat={handleConfirmSeat}
        />
      )}

      {/* MODAL 2: 48-Hour Direct Reservation */}
      {isReservationOpen && reservationDetails && (
        <ReservationModal
          isOpen={isReservationOpen}
          onClose={() => setIsReservationOpen(false)}
          title={reservationDetails.title}
          route={reservationDetails.route}
          fromCode={reservationDetails.fromCode}
          toCode={reservationDetails.toCode}
          date={reservationDetails.date}
          time={reservationDetails.time}
          seatNumber={reservationDetails.seatNumber}
          cabinClass={reservationDetails.cabinClass}
          totalPriceUZS={reservationDetails.totalPriceUZS}
          type={reservationDetails.type}
          currency={currency}
          originalPriceUZS={reservationDetails.originalPriceUZS}
          discountPercent={reservationDetails.discountPercent}
          savedAmountUZS={reservationDetails.savedAmountUZS}
          discountLabel={reservationDetails.discountLabel}
          isRoundTrip={reservationDetails.isRoundTrip}
          returnDate={reservationDetails.returnDate}
          passengersCount={reservationDetails.passengersCount}
          onConfirmReservation={handleCompleteReservation}
        />
      )}

      {/* MODAL 3: Printable E-Ticket / Boarding Pass */}
      {isTicketModalOpen && activeTicketBooking && (
        <TicketModal
          booking={activeTicketBooking}
          currency={currency}
          onClose={() => setIsTicketModalOpen(false)}
        />
      )}

      {/* MODAL 4: My Bookings Modal */}
      {isMyBookingsOpen && (
        <MyBookingsModal
          isOpen={isMyBookingsOpen}
          onClose={() => setIsMyBookingsOpen(false)}
          bookings={bookings}
          currency={currency}
          onViewTicket={(b) => {
            setActiveTicketBooking(b);
            setIsMyBookingsOpen(false);
            setIsTicketModalOpen(true);
          }}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* MODAL 5: Baggage & Luggage Rules */}
      {isBaggageOpen && (
        <BaggageGuideModal
          isOpen={isBaggageOpen}
          onClose={() => setIsBaggageOpen(false)}
          currency={currency}
        />
      )}

      {/* MODAL 6: Currency Exchange Rates & Converter */}
      {isConverterOpen && (
        <CurrencyConverterModal
          isOpen={isConverterOpen}
          onClose={() => setIsConverterOpen(false)}
          selectedCurrency={currency}
          onSelectCurrency={(c) => setCurrency(c)}
        />
      )}

      {/* MODAL 7: Price Alert Notifications */}
      {isPriceAlertOpen && (
        <PriceAlertModal
          isOpen={isPriceAlertOpen}
          onClose={() => setIsPriceAlertOpen(false)}
          currency={currency}
          initialFrom={fromCode}
          initialTo={toCode}
          onSelectRoute={(f, t) => {
            setFromCode(f);
            setToCode(t);
            setActiveTab('avia');
          }}
        />
      )}

      {/* MODAL 8: Flight Comparison Drawer */}
      {isCompareOpen && (
        <FlightCompareModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          flights={flightsList.filter((f) => compareFlightIds.includes(f.id))}
          currency={currency}
          onSelectFlight={(flight) => {
            handleOpenSeatMap(flight);
          }}
          onRemoveFromCompare={handleToggleCompare}
        />
      )}

      {/* MODAL 9: Travel Packing & Documents Checklist */}
      {isChecklistOpen && (
        <TravelChecklistModal
          isOpen={isChecklistOpen}
          onClose={() => setIsChecklistOpen(false)}
        />
      )}

      {/* MODAL 10: User Profile / Auth (Ro'yxatdan o'tish va alohida Admin kirish) */}
      <AuthModal
        isOpen={isAuthOpen}
        isMandatory={!userProfile}
        currentUser={userProfile}
        onClose={() => {
          if (userProfile) {
            setIsAuthOpen(false);
          }
        }}
        onSaveProfile={(prof) => {
          setUserProfile(prof);
          saveStoredUser(prof);
          setIsAuthOpen(false);
        }}
        onLogout={handleLogout}
      />
    </div>
  );
}

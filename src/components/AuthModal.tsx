import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  ShieldCheck,
  Check,
  LogOut,
  Lock,
  UserPlus,
  LogIn,
  AlertCircle,
  Sparkles,
  Plane,
  Phone,
  Zap,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  User,
  ChevronDown,
  ChevronUp,
  Gift,
  Repeat,
} from 'lucide-react';
import {
  UserProfile,
  saveStoredUser,
  clearStoredUser,
  verifyAdminCredentials,
  verifyAdminSecretCode,
  getStoredAdminCreds,
  getUserPastTicketsCount,
} from '../utils/helpers';

interface AuthModalProps {
  isOpen: boolean;
  isMandatory: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSaveProfile: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenAdmin?: () => void;
  initialMode?: 'register' | 'login' | 'admin_login' | 'profile';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  isMandatory,
  currentUser,
  onClose,
  onSaveProfile,
  onLogout,
  onOpenAdmin,
  initialMode,
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'admin_login' | 'profile'>(
    initialMode || (currentUser ? 'profile' : 'register')
  );

  // Form states for Regular User
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [passportId, setPassportId] = useState('');
  const [email, setEmail] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setPhone(currentUser.phone || '');
      setPassportId(currentUser.passportId || '');
      setEmail(currentUser.email || '');
      setAuthMode(initialMode || 'profile');
    } else {
      setAuthMode(initialMode || 'register');
      setFullName('');
      setPhone('');
      setPassportId('');
      setEmail('');
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [isOpen, currentUser, initialMode]);

  // Handle ESC key to close if not strictly mandatory or if user has profile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (!isMandatory || currentUser)) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMandatory, currentUser, onClose]);

  if (!isOpen) return null;

  // Phone input formatter
  const handlePhoneInputChange = (rawVal: string) => {
    let val = rawVal.replace(/[^\d+]/g, '');
    if (!val.startsWith('+') && val.startsWith('998')) {
      val = '+' + val;
    }
    setPhone(val);
  };

  // 1. Regular User Registration / Profile Update
  const handleRegisterOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanName = fullName.trim();
    let cleanPhone = phone.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMsg("Iltimos, ismingizni kiriting!");
      return;
    }

    if (!cleanPhone || cleanPhone.length < 7) {
      setErrorMsg("Iltimos, telefon raqamingizni kiriting (masalan: 93 039 92 91)!");
      return;
    }

    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.startsWith('998')) {
        cleanPhone = '+' + cleanPhone;
      } else {
        cleanPhone = '+998 ' + cleanPhone;
      }
    }

    const cleanPassport = passportId.trim().toUpperCase() || 'FA' + Math.floor(1000000 + Math.random() * 9000000);

    const newUser: UserProfile = {
      fullName: cleanName.toUpperCase(),
      passportId: cleanPassport,
      phone: cleanPhone,
      email: email.trim(),
      role: 'user',
      isAdmin: false,
    };

    saveStoredUser(newUser);
    onSaveProfile(newUser);
    setSavedSuccess(true);
    setSuccessMsg("Sayohatchi hisobingiz muvaffaqiyatli saqlandi!");

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  // 2. Regular User Fast Login
  const handleRegularLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = fullName.trim();
    let cleanPhone = phone.trim();

    if (!cleanName && !cleanPhone) {
      setErrorMsg("Iltimos, ismingiz yoki telefon raqamingizni kiriting!");
      return;
    }

    const loggedUser: UserProfile = {
      fullName: (cleanName || 'SAYOHATCHI').toUpperCase(),
      passportId: passportId.trim().toUpperCase() || 'FA' + Math.floor(1000000 + Math.random() * 9000000),
      phone: cleanPhone || '+998 93 039 92 91',
      email: email.trim(),
      role: 'user',
      isAdmin: false,
    };

    saveStoredUser(loggedUser);
    onSaveProfile(loggedUser);
    setSavedSuccess(true);
    setSuccessMsg("Tizimga sayohatchi sifatida muvaffaqiyatli kirdingiz!");

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  // Quick 1-click guest login for normal travelers
  const handleQuickEnter = () => {
    const defaultUser: UserProfile = {
      fullName: 'SAYOHATCHI (MEHMON)',
      passportId: 'UZ' + Math.floor(1000000 + Math.random() * 9000000),
      phone: '+998 93 039 92 91',
      email: '',
      role: 'user',
      isAdmin: false,
    };
    saveStoredUser(defaultUser);
    onSaveProfile(defaultUser);
    onClose();
  };

  const handleLogoutClick = () => {
    clearStoredUser();
    onLogout();
  };

  // Demote Admin to Regular User
  const handleRevokeAdmin = () => {
    if (currentUser) {
      const regularUser: UserProfile = {
        ...currentUser,
        role: 'user',
        isAdmin: false,
      };
      saveStoredUser(regularUser);
      onSaveProfile(regularUser);
      setSuccessMsg("Admin vakolati olib tashlandi. Endi siz oddiy foydalanuvchisiz.");
      setTimeout(() => setSuccessMsg(null), 2500);
    }
  };

  const currentIsAdmin = Boolean(currentUser?.isAdmin || currentUser?.role === 'admin');

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md transition-opacity"
      onClick={() => {
        if (!isMandatory || currentUser) onClose();
      }}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          id="auth-modal-container"
          className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white dark:bg-[#101b33] p-5 sm:p-7 text-left align-middle shadow-2xl transition-all border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white my-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button if not mandatory or user exists */}
          {(!isMandatory || currentUser) && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              title="Yopish (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Header Banner */}
          <div className="text-center mb-5">
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-lg mb-3 ${
                authMode === 'admin_login'
                  ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/30'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30'
              }`}
            >
              {authMode === 'admin_login' ? (
                <Shield className="w-7 h-7 text-slate-950" />
              ) : (
                <Plane className="w-7 h-7 -rotate-45" />
              )}
            </div>

            <h3 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
              {authMode === 'admin_login'
                ? "Admin Boshqaruviga Kirish"
                : authMode === 'profile'
                ? "Mening Profilim"
                : isMandatory
                ? "Tizimga Kirish / Ro'yxatdan O'tish"
                : "Xush kelibsiz!"}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {authMode === 'admin_login'
                ? "Maxsus alohida login va parol talab qilinadi"
                : authMode === 'profile'
                ? "Shaxsiy ma'lumotlaringiz va hisob holati"
                : "Oddiy sayt foydalanuvchilari uchun xavfsiz tizim"}
            </p>

            {authMode === 'admin_login' && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 rounded-full text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Standart: login: <b>admin</b> | parol: <b>admin777</b></span>
              </div>
            )}
          </div>

          {/* Navigation Tabs (when not profile) */}
          {authMode !== 'profile' && (
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl gap-1 mb-5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ro'yxatdan o'tish</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Kirish</span>
              </button>
            </div>
          )}

          {/* Error notification */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success notification */}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* REGULAR USER REGISTRATION FORM                            */}
          {/* ========================================================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterOrUpdate} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Ismingiz (yoki To'liq F.I.O) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masalan: Fahriddin yoki Anvar Karimov"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Telefon Raqamingiz *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => handlePhoneInputChange(e.target.value)}
                  placeholder="+998 93 039 92 91"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Pasport / ID (Ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={passportId}
                    onChange={(e) => setPassportId(e.target.value)}
                    placeholder="FA1234567"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-xs uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Email (Ixtiyoriy)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pochta@uzfly.uz"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Muvaffaqiyatli saqlandi!</span>
                  </>
                ) : (
                  <>
                    <span>Ro'yxatdan o'tish va Boshlash</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>

              {/* 1-Click Fast Pass / Guest Mode */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickEnter}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tezkor 1-bosishda kirish (Oddiy Mehmon)</span>
                </button>
              </div>

              {/* 24/7 Call Center support line */}
              <div className="pt-2 text-center">
                <a
                  href="tel:+998930399291"
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Center: 93 039 92 91 (24/7)</span>
                </a>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 3. REGULAR USER LOGIN FORM                                */}
          {/* ========================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleRegularLogin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Ismingiz
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ismingiz"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Telefon Raqamingiz
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => handlePhoneInputChange(e.target.value)}
                  placeholder="+998 93 039 92 91"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {savedSuccess ? "Muvaffaqiyatli kirdingiz!" : "Tizimga Kirish"}
              </button>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('admin_login')}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Administrator misiz? Alohida admin login va paroli bilan kirish ➔</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 4. PROFILE MANAGEMENT FORM                                */}
          {/* ========================================================= */}
          {authMode === 'profile' && (
            <form onSubmit={handleRegisterOrUpdate} className="space-y-4">
              {/* Account Status Badge */}
              <div
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                  currentIsAdmin
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                    : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {currentIsAdmin ? (
                    <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                  <div>
                    <span className="block font-black">
                      {currentIsAdmin ? "Bosh Administrator (Admin Panel Faol)" : "Oddiy Foydalanuvchi (Sayohatchi)"}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      {currentIsAdmin
                        ? "Sizga Admin Panel ochiq va yuqoridagi menyuda ko'rinadi."
                        : "Admin panel sizga ko'rinmaydi va kirish huquqi yo'q."}
                    </span>
                  </div>
                </div>

                {currentIsAdmin ? (
                  <button
                    type="button"
                    onClick={handleRevokeAdmin}
                    className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-amber-300 text-amber-800 dark:text-amber-300 rounded-lg text-[10px] font-bold hover:bg-amber-100 cursor-pointer"
                  >
                    Oddiyga o'tish
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthMode('admin_login')}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[10px] font-black cursor-pointer shadow-sm"
                  >
                    Admin Kirish
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Ism va Familiya
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => handlePhoneInputChange(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Pasport
                  </label>
                  <input
                    type="text"
                    value={passportId}
                    onChange={(e) => setPassportId(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-xs uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  {savedSuccess ? "Yangilandi ✓" : "Saqlash"}
                </button>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="px-4 py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  title="Tizimdan to'liq chiqish"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Chiqish</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  X,
  ShieldCheck,
  Plane,
  FileText,
  CreditCard,
  Luggage,
  Clock,
  Sparkles,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

interface TravelChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChecklistItem {
  id: string;
  category: 'docs' | 'money' | 'luggage' | 'airport';
  title: string;
  description: string;
  essential: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'doc-passport',
    category: 'docs',
    title: 'Xorijga chiqish pasporti (Qizil pasport)',
    description: 'Amal qilish muddati mamlakatga kirish sanasidan boshlab kamida 6 oy bo\'lishi shart.',
    essential: true,
  },
  {
    id: 'doc-ticket',
    category: 'docs',
    title: 'Elektron aviachipta va bron tasdig\'i',
    description: 'Chiptaning PDF nusxasini telefoningizga saqlab oling va imkon bo\'lsa qog\'ozga chop eting.',
    essential: true,
  },
  {
    id: 'doc-hotel',
    category: 'docs',
    title: 'Mehmonxona vaucheri yoki taklifnoma',
    description: 'Chegara nazorati xodimlari yashash manzilingizni so\'rashi mumkin.',
    essential: true,
  },
  {
    id: 'doc-insurance',
    category: 'docs',
    title: 'Xalqaro sayohat sug\'urtasi',
    description: 'Favqulodda tibbiy yordam va kutilmagan vaziyatlar uchun muhim kafolat.',
    essential: false,
  },
  {
    id: 'money-cards',
    category: 'money',
    title: 'Xalqaro bank kartalari (Visa / Mastercard)',
    description: 'Bank ilovangiz orqali xorijda to\'lov va internet operatsiyalari ochiqligini tekshiring.',
    essential: true,
  },
  {
    id: 'money-cash',
    category: 'money',
    title: 'Naqd xorijiy valyuta (USD / EUR / Valyuta)',
    description: 'O\'zbekiston qonunchiligiga ko\'ra 100 mln so\'mgacha ekvivalentni deklaratsiyasiz olib chiqish mumkin.',
    essential: true,
  },
  {
    id: 'luggage-powerbank',
    category: 'luggage',
    title: 'Powerbank faqat qo\'l yukida!',
    description: 'Zaxira batareyalar va powerbanklarni bagajga topshirish xalqaro aviaqoidalar bo\'yicha taqiqlanadi.',
    essential: true,
  },
  {
    id: 'luggage-liquids',
    category: 'luggage',
    title: 'Qo\'l yukidagi suyuqliklar (100 ml gacha)',
    description: 'Parfyumeriya, krem va ichimliklar faqat 100 ml dan oshmaydigan idishlarda ruxsat etiladi.',
    essential: true,
  },
  {
    id: 'airport-time',
    category: 'airport',
    title: 'Parvozdan 3 soat oldin yetib kelish',
    description: 'Xalqaro reyslarda ro\'yxatdan o\'tish va bojxona nazorati parvozdan 40 daqiqa oldin to\'xtatiladi.',
    essential: true,
  },
  {
    id: 'airport-checkin',
    category: 'airport',
    title: 'Onlayn ro\'yxatdan o\'tish (Online check-in)',
    description: 'Aviakompaniya saytida 24 soat oldin bepul qulay o\'rindiqni band qilish imkoniyati.',
    essential: false,
  },
];

const STORAGE_KEY = 'uzfly_travel_checklist_state';

export const TravelChecklistModal: React.FC<TravelChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'docs' | 'luggage' | 'customs'>('all');

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setCheckedIds(JSON.parse(data));
      }
    } catch {}
  }, []);

  const toggleItem = (id: string) => {
    const updated = checkedIds.includes(id)
      ? checkedIds.filter((item) => item !== id)
      : [...checkedIds, id];
    setCheckedIds(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const resetChecklist = () => {
    setCheckedIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  if (!isOpen) return null;

  const total = CHECKLIST_ITEMS.length;
  const completed = checkedIds.length;
  const percent = Math.round((completed / total) * 100);

  const filteredItems = activeTab === 'all'
    ? CHECKLIST_ITEMS
    : activeTab === 'docs'
    ? CHECKLIST_ITEMS.filter((i) => i.category === 'docs' || i.category === 'money')
    : activeTab === 'luggage'
    ? CHECKLIST_ITEMS.filter((i) => i.category === 'luggage' || i.category === 'airport')
    : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      id="checklist-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          id="checklist-modal"
          className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#111c35] text-slate-800 dark:text-slate-100 text-left align-middle max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 my-6"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Sayohatga Tayyorgarlik Cheklisti
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                Aeroportga yo'l olishdan oldin hech narsani unutmang
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

        {/* Progress Bar Header */}
        <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Tayyorgarlik darajasi: {completed} / {total} ta punkt bajarildi
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
              {percent}%
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 pt-2 gap-2 bg-slate-50/40 dark:bg-slate-900/30 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              activeTab === 'all'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Barchasi ({total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              activeTab === 'docs'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Hujjatlar & Moliya
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('luggage')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              activeTab === 'luggage'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Bagaj & Aeroport
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customs')}
            className={`pb-2.5 px-3 font-black border-b-2 transition cursor-pointer ${
              activeTab === 'customs'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Bojxona Me'yorlari
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {activeTab !== 'customs' ? (
            filteredItems.map((item) => {
              const isChecked = checkedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-black transition ${
                          isChecked
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {item.essential && (
                        <span className="text-[9px] bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold px-1.5 py-0.2 rounded">
                          Muhim
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            /* Customs Regulations Guide */
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                <h4 className="font-black text-xs text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Naqd Pul Olib Chiqish Me'yori
                </h4>
                <p className="text-[11px] text-blue-950 dark:text-blue-300 leading-relaxed">
                  O'zbekiston Respublikasi fuqarolari va chet elliklar 100 000 000 so'm (taxminan $7,800) ekvivalentigacha bo'lgan naqd valyutani yozma deklaratsiyasiz erkin olib chiqishlari mumkin. Undan yuqori summalarda deklaratsiya to'ldiriladi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <h4 className="font-black text-xs text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Dori-Darmonlar Qoidasi
                </h4>
                <p className="text-[11px] text-amber-950 dark:text-amber-300 leading-relaxed">
                  Shaxsiy foydalanish uchun 10 nomdagi dori vositalaridan har biridan 5 o'ramgacha bo'lgan miqdorda olib chiqish ruxsat etiladi. Kuchli ta'sir qiluvchi yoki retseptli dorilar uchun shifokor xulosasi va resept talab qilinishi mumkin.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="font-black text-xs text-slate-900 dark:text-white mb-1">
                  💡 Bojxonada Yashil Yo'lak (Green Channel)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Agar sizda yozma deklaratsiya qilinishi shart bo'lgan tovarlar yoki ortiqcha naqd valyuta bo'lmasa, aeroportda to'g'ridan-to'g'ri "Yashil yo'lak" orqali tez o'tishingiz mumkin.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={resetChecklist}
            className="text-[11px] text-slate-400 hover:text-rose-500 font-bold flex items-center gap-1 cursor-pointer transition"
          >
            <RotateCcw className="w-3 h-3" />
            Tozalash
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer transition shadow-sm"
          >
            Tayyorman
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

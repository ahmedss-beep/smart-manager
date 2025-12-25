
import React from 'react';
import { Bot, ShieldCheck, Key, UserCheck, ExternalLink, Coins, CheckCircle2, Languages } from 'lucide-react';
import { Currency, CURRENCIES, Language } from '../types';

interface SettingsProps {
  token: string;
  setToken: (token: string) => void;
  chatId: string;
  setChatId: (id: string) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  token, setToken, chatId, setChatId, currency, setCurrency, language, setLanguage 
}) => {
  const translations = {
    ar: {
      langHeader: 'إعدادات اللغة', langDesc: 'اختر لغة واجهة التطبيق.',
      currHeader: 'إعدادات العملة', currDesc: 'اختر العملة الافتراضية لعرض كافة حساباتك.',
      botHeader: 'إعدادات بوت تيليجرام', botDesc: 'اربط التطبيق بحسابك الشخصي للتسجيل عن بعد.',
      botToken: 'توكن البوت (Bot Token)', botChatId: 'معرف تيليجرام الخاص بك (Allowed ID)',
      botShield: 'سيتم قبول الرسائل فقط من معرف الحساب المذكور. يمكنك تسجيل الديون بصيغة حرة مثل "سجل 100 دولار لمحمد".',
      botLink: 'رابط البوت المباشر'
    },
    en: {
      langHeader: 'Language Settings', langDesc: 'Choose the application language.',
      currHeader: 'Currency Settings', currDesc: 'Choose the default currency for all accounts.',
      botHeader: 'Telegram Bot Settings', botDesc: 'Link the app to your personal account for remote entry.',
      botToken: 'Bot Token', botChatId: 'Allowed Telegram ID',
      botShield: 'Messages will only be accepted from the specified ID. You can record debts freely like "record 100 dollars for John".',
      botLink: 'Direct Bot Link'
    }
  };

  const t = translations[language];

  const currencyOptions: {id: Currency; label: {ar: string, en: string}; flag: string}[] = [
    { id: 'SAR', label: { ar: 'ريال سعودي', en: 'Saudi Riyal' }, flag: '🇸🇦' },
    { id: 'USD', label: { ar: 'دولار أمريكي', en: 'US Dollar' }, flag: '🇺🇸' },
    { id: 'SYP', label: { ar: 'ليرة سورية', en: 'Syrian Pound' }, flag: '🇸🇾' },
  ];

  const languageOptions: {id: Language; label: string; flag: string}[] = [
    { id: 'ar', label: 'العربية', flag: '🇸🇦' },
    { id: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Language Selection */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Languages size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t.langHeader}</h2>
            <p className="text-sm text-slate-500">{t.langDesc}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {languageOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setLanguage(opt.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                ${language === opt.id 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
            >
              <span className="text-4xl">{opt.flag}</span>
              <span className={`font-bold ${language === opt.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                {opt.label}
              </span>
              {language === opt.id && (
                <div className="absolute top-2 left-2 text-indigo-600">
                  <CheckCircle2 size={18} />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Currency Selection */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Coins size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t.currHeader}</h2>
            <p className="text-sm text-slate-500">{t.currDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currencyOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setCurrency(opt.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                ${currency === opt.id 
                  ? 'border-amber-500 bg-amber-50 shadow-md' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
            >
              <span className="text-4xl">{opt.flag}</span>
              <span className={`font-bold ${currency === opt.id ? 'text-amber-700' : 'text-slate-600'}`}>
                {opt.label[language]}
              </span>
              <span className="text-xs text-slate-400">{CURRENCIES[opt.id].symbol}</span>
              {currency === opt.id && (
                <div className="absolute top-2 left-2 text-amber-600">
                  <CheckCircle2 size={18} />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Bot Settings */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t.botHeader}</h2>
            <p className="text-sm text-slate-500">{t.botDesc}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Key size={16} className="text-blue-500" />
              {t.botToken}
            </label>
            <input 
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-left font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <UserCheck size={16} className="text-blue-500" />
              {t.botChatId}
            </label>
            <input 
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-left font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              dir="ltr"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
          <ShieldCheck size={20} className="text-blue-600 shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            {t.botShield}
          </p>
        </div>
      </section>

      <a 
        href="https://t.me/d_f_78bot" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 bg-[#0088cc]/5 rounded-3xl border border-[#0088cc]/20 hover:bg-[#0088cc]/10 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0088cc] text-white rounded-full flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <span className="block font-bold text-slate-800">{t.botLink}</span>
            <span className="text-xs text-slate-400">@d_f_78bot</span>
          </div>
        </div>
        <ExternalLink size={20} className="text-[#0088cc]" />
      </a>
    </div>
  );
};

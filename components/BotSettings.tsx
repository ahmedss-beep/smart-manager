
import React from 'react';
import { Bot, ShieldCheck, Key, UserCheck, ExternalLink } from 'lucide-react';

interface BotSettingsProps {
  token: string;
  setToken: (token: string) => void;
  chatId: string;
  setChatId: (id: string) => void;
}

export const BotSettings: React.FC<BotSettingsProps> = ({ token, setToken, chatId, setChatId }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">إعدادات بوت تيليجرام</h2>
            <p className="text-sm text-slate-500">اربط التطبيق بحسابك الشخصي للتسجيل عن بعد.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Key size={16} className="text-blue-500" />
              توكن البوت (Bot Token)
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
              معرف تيليجرام الخاص بك (Allowed ID)
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

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
            <ShieldCheck size={18} /> كيف يعمل الربط؟
          </h3>
          <ul className="text-xs text-blue-700 space-y-2 list-disc pr-4">
            <li>التطبيق يقوم بمراقبة الرسائل القادمة لهذا البوت.</li>
            <li>سيتم معالجة الرسائل التي تأتي من معرف الحساب المذكور أعلاه فقط.</li>
            <li>يمكنك إرسال رسالة مثل: "سجل 50 ريال لمحمد" وسيقوم الذكاء الاصطناعي بتنفيذها فوراً.</li>
          </ul>
        </div>
      </div>

      <a 
        href="https://t.me/d_f_78bot" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0088cc] text-white rounded-full flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <span className="block font-bold text-slate-800">رابط البوت المباشر</span>
            <span className="text-xs text-slate-400">@d_f_78bot</span>
          </div>
        </div>
        <ExternalLink size={20} className="text-slate-300 group-hover:text-blue-500" />
      </a>
    </div>
  );
};

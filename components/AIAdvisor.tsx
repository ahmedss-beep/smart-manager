
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Person, Transaction, Currency, CURRENCIES, Language } from '../types';
import { Send, Sparkles, User, Bot, Loader2, Info } from 'lucide-react';

interface AIAdvisorProps {
  people: Person[];
  transactions: Transaction[];
  currency: Currency;
  language: Language;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ people, transactions, currency, language }) => {
  const currentCurrency = CURRENCIES[currency];
  
  const translations = {
    ar: {
      header: 'المستشار المالي الذكي', 
      sub: `تحليل بـ ${currentCurrency.label.ar}`,
      welcome: `مرحباً بك! أنا مساعدك المالي. جميع التحليلات الحالية ستكون بـ (${currentCurrency.label.ar}). كيف يمكنني مساعدتك؟`,
      note: 'ملاحظة: المساعد يحلل بياناتك بالعملة المختارة حالياً.',
      placeholder: 'اسأل عن وضعك المالي...',
      error: 'حدث خطأ. يرجى المحاولة لاحقاً.',
      emptyResp: 'عذراً، لم أستطع معالجة طلبك.'
    },
    en: {
      header: 'Smart AI Advisor',
      sub: `Analysis in ${currentCurrency.label.en}`,
      welcome: `Hello! I am your financial assistant. All current analyses will be in (${currentCurrency.label.en}). How can I help you today?`,
      note: 'Note: The advisor analyzes data in the currently selected currency.',
      placeholder: 'Ask about your financial status...',
      error: 'An error occurred. Please try again later.',
      emptyResp: 'Sorry, I could not process your request.'
    }
  };

  const t = translations[language];

  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: t.welcome }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const summary = transactions.filter(tr => tr.currency === currency).reduce((acc, tr) => {
        if (tr.type === 'give') acc.toMe += tr.amount;
        else acc.onMe += tr.amount;
        return acc;
      }, { toMe: 0, onMe: 0 });

      const prompt = `
        You are an expert financial advisor. 
        Current language: ${language === 'ar' ? 'Arabic' : 'English'}.
        Current currency: ${currentCurrency.label[language]} (${currentCurrency.symbol}).
        User Data (in current currency):
        - Total Owed to User: ${summary.toMe} ${currentCurrency.symbol}
        - Total Owed by User: ${summary.onMe} ${currentCurrency.symbol}
        - Number of people: ${people.length}

        User Question: "${userMessage}"

        Instructions:
        1. Answer in the current language (${language}).
        2. Be professional and supportive.
        3. Use the currency symbol (${currentCurrency.symbol}) in your response.
        4. Provide financial advice based on the numbers provided.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || t.emptyResp }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: t.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      <header className="p-5 bg-blue-600 text-white flex items-center gap-3">
        <Sparkles size={24} className="animate-pulse" />
        <div>
          <h3 className="font-black text-lg">{t.header}</h3>
          <p className="text-xs text-blue-100 font-bold">{t.sub}</p>
        </div>
      </header>
      <div className="bg-blue-50/50 p-3 text-[10px] md:text-xs text-blue-700 font-bold flex items-center gap-2">
        <Info size={14} /> {t.note}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-ee-none' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-ss-none'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={18} />
              <span className="text-xs font-bold text-slate-400">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-slate-50/50 flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder={t.placeholder} 
          className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" 
        />
        <button type="submit" className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 hover:bg-blue-700">
          <Send size={24} className={language === 'ar' ? 'rtl-flip' : ''} />
        </button>
      </form>
    </div>
  );
};


import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Person, Transaction, Currency, CURRENCIES, Language } from '../types';
import { TrendingUp, TrendingDown, Users, Wallet, ChevronLeft } from 'lucide-react';

interface DashboardProps {
  people: Person[];
  transactions: Transaction[];
  currency: Currency;
  language: Language;
  onNavigateToPeople: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ people, transactions, currency, language, onNavigateToPeople }) => {
  const currentCurrency = CURRENCIES[currency];
  
  const translations = {
    ar: { 
      header: 'نظرة عامة', desc: 'مرحباً بك، إليك ملخص سريع لوضعك المالي اليوم.', date: 'التاريخ:',
      toMe: 'لي عند الآخرين', onMe: 'علي للآخرين', balance: 'صافي الرصيد', 
      distHeader: 'توزيع الديون', distDesc: 'للحسابات المسجلة بهذه العملة',
      recentHeader: 'آخر العمليات', viewAll: 'عرض الكل', empty: 'لا توجد سجلات حالياً'
    },
    en: { 
      header: 'Overview', desc: 'Welcome, here is a quick summary of your financial status.', date: 'Date:',
      toMe: 'Owed to Me', onMe: 'Owed by Me', balance: 'Net Balance', 
      distHeader: 'Debt Distribution', distDesc: 'For accounts in this currency',
      recentHeader: 'Recent Transactions', viewAll: 'View All', empty: 'No records found'
    }
  };

  const t = translations[language];

  const summary = useMemo(() => {
    let toMe = 0;
    let onMe = 0;
    transactions.filter(tr => tr.currency === currency).forEach(tr => {
      if (tr.type === 'give') toMe += tr.amount;
      else onMe += tr.amount;
    });
    return { toMe, onMe, balance: toMe - onMe };
  }, [transactions, currency]);

  const chartData = [
    { name: language === 'ar' ? 'لي (دائن)' : 'To Me', value: summary.toMe, color: '#10b981' },
    { name: language === 'ar' ? 'علي (مدين)' : 'On Me', value: summary.onMe, color: '#ef4444' },
  ];

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getPersonName = (id: string) => people.find(p => p.id === id)?.name || (language === 'ar' ? 'غير معروف' : 'Unknown');

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">{t.header} ({currentCurrency.label[language]})</h2>
          <p className="text-slate-500">{t.desc}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600">
          {t.date} {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t.toMe}</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">
              {summary.toMe.toLocaleString()} <span className="text-sm font-normal">{currentCurrency.symbol}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-4">
              <TrendingDown size={24} />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t.onMe}</p>
            <p className="text-3xl font-black text-rose-600 mt-1">
              {summary.onMe.toLocaleString()} <span className="text-sm font-normal">{currentCurrency.symbol}</span>
            </p>
          </div>
        </div>

        <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
              <Wallet size={24} />
            </div>
            <p className="text-sm font-bold text-blue-100 uppercase tracking-wide">{t.balance}</p>
            <p className="text-3xl font-black text-white mt-1">
              {summary.balance.toLocaleString()} <span className="text-sm font-normal">{currentCurrency.symbol}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">{t.distHeader} ({currentCurrency.symbol})</h3>
            <span className="text-xs text-slate-400">{t.distDesc}</span>
          </div>
          <div className="h-[300px]">
            {summary.toMe === 0 && summary.onMe === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">{t.empty}</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} ${currentCurrency.symbol}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">{t.recentHeader}</h3>
            <button onClick={onNavigateToPeople} className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
              {t.viewAll} <ChevronLeft size={16} className={language === 'en' ? 'rotate-180' : ''} />
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map(tr => {
              const transCurrency = CURRENCIES[tr.currency || currency];
              return (
                <div key={tr.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tr.type === 'give' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tr.type === 'give' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{getPersonName(tr.personId)}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{new Date(tr.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${tr.type === 'give' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tr.type === 'give' ? '+' : '-'}{tr.amount.toLocaleString()} {transCurrency.symbol}
                    </p>
                  </div>
                </div>
              );
            })}
            {recentTransactions.length === 0 && <div className="text-center py-10 text-slate-300 font-bold">{t.empty}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useMemo } from 'react';
import { Person, Transaction, TransactionType, Currency, CURRENCIES, Language } from '../types';
import { 
  UserPlus, Plus, Trash2, Search, Phone, History, ArrowRight, X, Users, ArrowUpRight, ArrowDownLeft, Calendar, Calculator, Wallet, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown
} from 'lucide-react';

interface PeopleListProps {
  people: Person[];
  transactions: Transaction[];
  currency: Currency;
  language: Language;
  onAddPerson: (name: string, phone: string) => void;
  onDeletePerson: (id: string) => void;
  onAddTransaction: (personId: string, amount: number, type: TransactionType, note: string, transCurrency?: Currency) => void;
  onDeleteTransaction: (id: string) => void;
}

export const PeopleList: React.FC<PeopleListProps> = ({ 
  people, transactions, currency, language, onAddPerson, onDeletePerson, onAddTransaction, onDeleteTransaction
}) => {
  const currentCurrency = CURRENCIES[currency];
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonPhone, setNewPersonPhone] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [transAmount, setTransAmount] = useState('');
  const [transType, setTransType] = useState<TransactionType>('give');
  const [transNote, setTransNote] = useState('');
  const [transCurrency, setTransCurrency] = useState<Currency>(currency);

  const [confirmDelete, setConfirmDelete] = useState<{ id: string; type: 'person' | 'transaction'; title: string } | null>(null);

  const translations = {
    ar: {
      header: 'قائمة الحسابات', count: 'إجمالي الأشخاص المسجلين:', addPerson: 'إضافة شخص جديد', search: 'ابحث عن شخص بالاسم أو الهاتف...',
      statusMe: 'دائن (مُطالب)', statusHim: 'مدين (مُطالب)', balance: 'إجمالي الرصيد', 
      back: 'العودة', phoneEmpty: 'لا يوجد رقم هاتف', addOp: 'إضافة عملية',
      summaryHeader: 'الملخص المالي حسب العملة', giveLabel: 'لك عنده (طلب):', takeLabel: 'له عندك (سداد):',
      netLabel: 'الرصيد المتبقي', netMe: 'لك بذمته', netHim: 'له بذمتك',
      historyHeader: 'سجل العمليات التفصيلي', historyCount: 'عملية', empty: 'لا توجد معاملات مسجلة',
      typeGive: 'عملية سداد (لك)', typeTake: 'عملية شراء (عليك)', confirmHeader: 'هل أنت متأكد؟',
      confirmP: 'سيؤدي هذا الإجراء إلى مسح كافة البيانات المسجلة نهائياً ولا يمكن استعادتها.',
      confirmBtn: 'تأكيد الحذف النهائي', cancel: 'تراجع',
      newOpHeader: 'عملية جديدة', chooseCurr: 'اختر العملة', typeGiveBtn: 'لي عنده (+)', typeTakeBtn: 'له عندي (-)',
      save: 'حفظ العملية', notePlaceholder: 'أضف ملاحظة أو سبباً للعملية (اختياري)...',
      newPersonHeader: 'إضافة حساب جديد', nameLabel: 'الاسم الكامل', phoneLabel: 'رقم الهاتف',
      namePlaceholder: 'أدخل اسم الشخص...', create: 'إنشاء الحساب'
    },
    en: {
      header: 'Account List', count: 'Total registered people:', addPerson: 'Add New Person', search: 'Search by name or phone...',
      statusMe: 'Creditor', statusHim: 'Debtor', balance: 'Total Balance', 
      back: 'Back', phoneEmpty: 'No phone number', addOp: 'Add Transaction',
      summaryHeader: 'Financial Summary by Currency', giveLabel: 'You owe him:', takeLabel: 'He owes you:',
      netLabel: 'Net Balance', netMe: 'Your due', netHim: 'His due',
      historyHeader: 'Detailed Transaction History', historyCount: 'transactions', empty: 'No transactions recorded',
      typeGive: 'Payment (Credit)', typeTake: 'Purchase (Debt)', confirmHeader: 'Are you sure?',
      confirmP: 'This action will permanently erase all recorded data and cannot be recovered.',
      confirmBtn: 'Confirm Final Deletion', cancel: 'Cancel',
      newOpHeader: 'New Transaction', chooseCurr: 'Choose Currency', typeGiveBtn: 'Owed to Me (+)', typeTakeBtn: 'Owed by Me (-)',
      save: 'Save Transaction', notePlaceholder: 'Add a note or reason (optional)...',
      newPersonHeader: 'Add New Account', nameLabel: 'Full Name', phoneLabel: 'Phone Number',
      namePlaceholder: 'Enter person name...', create: 'Create Account'
    }
  };

  const t = translations[language];

  const filteredPeople = useMemo(() => {
    return people
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(p => {
        const pTrans = transactions.filter(tr => tr.personId === p.id && (tr.currency === currency || (!tr.currency && currency === 'SAR')));
        let balance = 0;
        pTrans.forEach(tr => { if (tr.type === 'give') balance += tr.amount; else balance -= tr.amount; });
        return { ...p, balance };
      });
  }, [people, transactions, searchTerm, currency]);

  const selectedPerson = people.find(p => p.id === selectedPersonId);
  const personTransactions = transactions
    .filter(tr => tr.personId === selectedPersonId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currencySummaries = useMemo(() => {
    if (!selectedPersonId) return [];
    const summaryMap: Record<string, { give: number; take: number; balance: number }> = {};
    transactions.filter(tr => tr.personId === selectedPersonId).forEach(tr => {
      const curr = tr.currency || 'SAR';
      if (!summaryMap[curr]) summaryMap[curr] = { give: 0, take: 0, balance: 0 };
      if (tr.type === 'give') {
        summaryMap[curr].give += tr.amount;
        summaryMap[curr].balance += tr.amount;
      } else {
        summaryMap[curr].take += tr.amount;
        summaryMap[curr].balance -= tr.amount;
      }
    });
    return Object.entries(summaryMap).map(([code, totals]) => ({
      currency: CURRENCIES[code as Currency],
      ...totals
    }));
  }, [selectedPersonId, transactions]);

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      onAddPerson(newPersonName, newPersonPhone);
      setNewPersonName(''); setNewPersonPhone(''); setIsAddingPerson(false);
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPersonId && transAmount) {
      onAddTransaction(selectedPersonId, parseFloat(transAmount), transType, transNote, transCurrency);
      setTransAmount(''); setTransNote(''); setIsAddingTransaction(false);
    }
  };

  const executeDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'person') {
      onDeletePerson(confirmDelete.id);
      if (selectedPersonId === confirmDelete.id) setSelectedPersonId(null);
    } else {
      onDeleteTransaction(confirmDelete.id);
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      {selectedPersonId ? (
        <div className="space-y-6 animate-in slide-in-from-left duration-300 pb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedPersonId(null)} className="p-3 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all"><ArrowRight size={24} className={language === 'en' ? 'rotate-180' : ''} /></button>
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-100">{selectedPerson?.name.charAt(0)}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-800 leading-tight">{selectedPerson?.name}</h2>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                  <Phone size={14} className="text-blue-500" />
                  <span dir="ltr">{selectedPerson?.phone || t.phoneEmpty}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mr-auto">
              <button onClick={() => { setTransCurrency(currency); setIsAddingTransaction(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
                <Plus size={20} /> {t.addOp}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Calculator size={18} className="text-blue-500" />
              <h3 className="font-bold text-slate-700">{t.summaryHeader}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currencySummaries.map((s, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                  <div className={`absolute top-0 right-0 w-2 h-full ${s.balance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl filter drop-shadow-sm">{s.currency.flag}</span>
                      <div>
                        <span className="font-black text-slate-800 block leading-none">{s.currency.label[language]}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.currency.code}</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-xl ${s.balance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {s.balance >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">{t.giveLabel}</span>
                      <span className="text-emerald-600 font-bold">+{s.give.toLocaleString()} {s.currency.symbol}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">{t.takeLabel}</span>
                      <span className="text-rose-600 font-bold">-{s.take.toLocaleString()} {s.currency.symbol}</span>
                    </div>
                    <div className={`mt-4 pt-4 border-t-2 border-dashed border-slate-50 flex flex-col items-center p-3 rounded-2xl ${s.balance >= 0 ? 'bg-emerald-50/50' : 'bg-rose-50/50'}`}>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.netLabel}</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-black ${s.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {s.balance > 0 ? '+' : ''}{s.balance.toLocaleString()}
                        </span>
                        <span className={`text-xs font-bold ${s.balance >= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>{s.currency.symbol}</span>
                      </div>
                      <span className={`text-[11px] font-bold mt-1 px-3 py-0.5 rounded-full ${s.balance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {s.balance >= 0 ? t.netMe : t.netHim}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {currencySummaries.length === 0 && (
                <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Wallet size={32} className="text-slate-200" />
                  <span className="font-bold text-sm">{t.empty}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-800">{t.historyHeader}</h3>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                {personTransactions.length} {t.historyCount}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {personTransactions.map(tr => {
                const trCurr = CURRENCIES[tr.currency || 'SAR'];
                return (
                  <div key={tr.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${tr.type === 'give' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {tr.type === 'give' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{tr.type === 'give' ? t.typeGive : t.typeTake}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                            <Calendar size={12} /> {new Date(tr.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className={`text-xl font-black ${tr.type === 'give' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tr.type === 'give' ? '+' : '-'}{tr.amount.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-slate-400">{trCurr.symbol}</span>
                        </div>
                        {tr.note && <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[150px]">{tr.note}</div>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ id: tr.id, type: 'transaction', title: `${tr.amount} ${trCurr.symbol}` }); }} className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <header className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl font-black text-slate-800">{t.header}</h2>
              <p className="text-slate-500 text-sm">{t.count} {people.length}</p>
            </div>
            <button onClick={() => setIsAddingPerson(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
              <UserPlus size={20} /> {t.addPerson}
            </button>
          </header>
          <div className="relative group">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={22} />
            <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-200 rounded-3xl py-4 pr-14 pl-5 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeople.map(p => (
              <div key={p.id} onClick={() => setSelectedPersonId(p.id)} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-xl transition-all group relative">
                <div className="flex justify-between mb-5">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">{p.name.charAt(0)}</div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${p.balance >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                      {p.balance >= 0 ? t.statusMe : t.statusHim}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ id: p.id, type: 'person', title: p.name }); }} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3 className="font-black text-xl text-slate-800 leading-tight mb-1">{p.name}</h3>
                <p className="text-slate-400 text-xs font-medium flex items-center gap-1" dir="ltr"><Phone size={12} className="text-slate-300" /> {p.phone || '---'}</p>
                <div className="mt-6 pt-5 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.balance}</span>
                    <span className={`font-black text-xl leading-none mt-1 ${p.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{Math.abs(p.balance).toLocaleString()} <span className="text-xs font-bold text-slate-400">{currentCurrency.symbol}</span></span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all"><ArrowRight className={language === 'ar' ? 'rtl-flip' : ''} size={20} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm"><AlertTriangle size={40} /></div>
            <h3 className="text-2xl font-black text-center text-slate-800 mb-3">{t.confirmHeader}</h3>
            <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed px-4"><span className="font-bold text-slate-700 block mb-1">{confirmDelete.title}</span>{t.confirmP}</p>
            <div className="flex flex-col gap-3">
              <button onClick={executeDelete} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-700 shadow-xl shadow-rose-100 active:scale-95">{t.confirmBtn}</button>
              <button onClick={() => setConfirmDelete(null)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {isAddingTransaction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">{t.newOpHeader}</h3>
              <button onClick={() => setIsAddingTransaction(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t.chooseCurr}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CURRENCIES) as Currency[]).map(c => (
                    <button key={c} onClick={() => setTransCurrency(c)} className={`py-3 px-1 border-2 rounded-2xl text-[10px] md:text-xs transition-all flex flex-col items-center gap-1 ${transCurrency === c ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-slate-50 text-slate-400 hover:border-slate-200'}`}>
                      <span className="text-xl">{CURRENCIES[c].flag}</span>{CURRENCIES[c].label[language]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button onClick={() => setTransType('give')} className={`flex-1 py-3 rounded-xl font-black transition-all ${transType === 'give' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>{t.typeGiveBtn}</button>
                <button onClick={() => setTransType('take')} className={`flex-1 py-3 rounded-xl font-black transition-all ${transType === 'take' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}>{t.typeTakeBtn}</button>
              </div>
              <div className="relative">
                <input type="number" step="0.01" value={transAmount} onChange={(e) => setTransAmount(e.target.value)} className="w-full border-2 border-slate-100 focus:border-blue-500 p-5 rounded-3xl text-center text-4xl font-black outline-none transition-all" placeholder="0.00" autoFocus />
                <span className={`absolute ${language === 'ar' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl`}>{CURRENCIES[transCurrency].symbol}</span>
              </div>
              <textarea value={transNote} onChange={(e) => setTransNote(e.target.value)} className="w-full border-2 border-slate-100 focus:border-blue-500 p-4 rounded-3xl text-sm outline-none transition-all" placeholder={t.notePlaceholder} rows={2} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsAddingTransaction(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200">{t.cancel}</button>
              <button onClick={handleAddTransaction} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95">{t.save}</button>
            </div>
          </div>
        </div>
      )}

      {isAddingPerson && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">{t.newPersonHeader}</h3>
              <button onClick={() => setIsAddingPerson(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t.nameLabel}</label>
                <input type="text" value={newPersonName} onChange={(e) => setNewPersonName(e.target.value)} className="w-full border-2 border-slate-100 focus:border-blue-500 p-4 rounded-2xl outline-none transition-all font-bold" placeholder={t.namePlaceholder} autoFocus />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t.phoneLabel}</label>
                <input type="tel" value={newPersonPhone} onChange={(e) => setNewPersonPhone(e.target.value)} className="w-full border-2 border-slate-100 focus:border-blue-500 p-4 rounded-2xl outline-none transition-all text-left font-bold" placeholder="000-000-0000" dir="ltr" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setIsAddingPerson(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200">{t.cancel}</button>
              <button onClick={handleAddPerson} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95">{t.create}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

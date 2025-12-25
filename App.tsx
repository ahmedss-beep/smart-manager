
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PeopleList } from './components/PeopleList';
import { AIAdvisor } from './components/AIAdvisor';
import { Settings } from './components/Settings';
import { Person, Transaction, Currency, CURRENCIES, Language } from './types';
import { GoogleGenAI, Type } from '@google/genai';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'people' | 'advisor' | 'settings'>('dashboard');
  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [language, setLanguage] = useState<Language>('ar');
  const [botToken, setBotToken] = useState('8310156064:AAFSJCIwsNKNkNuLrkTQIc0jRNRhJ8LjF-k');
  const [allowedChatId, setAllowedChatId] = useState('7233475535');
  
  const lastUpdateIdRef = useRef<number>(0);
  const isPollingRef = useRef<boolean>(false);

  // Load initial data
  useEffect(() => {
    const savedPeople = localStorage.getItem('debt_people');
    const savedTransactions = localStorage.getItem('debt_transactions');
    const savedToken = localStorage.getItem('tg_bot_token');
    const savedCurrency = localStorage.getItem('debt_currency');
    const savedLanguage = localStorage.getItem('debt_language');
    const savedLastId = localStorage.getItem('tg_last_id');
    
    if (savedPeople) setPeople(JSON.parse(savedPeople));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedToken) setBotToken(savedToken);
    if (savedCurrency) setCurrency(savedCurrency as Currency);
    if (savedLanguage) setLanguage(savedLanguage as Language);
    if (savedLastId) lastUpdateIdRef.current = parseInt(savedLastId);
  }, []);

  // Save changes & update document direction
  useEffect(() => {
    localStorage.setItem('debt_people', JSON.stringify(people));
    localStorage.setItem('debt_transactions', JSON.stringify(transactions));
    localStorage.setItem('tg_bot_token', botToken);
    localStorage.setItem('debt_currency', currency);
    localStorage.setItem('debt_language', language);
    localStorage.setItem('tg_last_id', lastUpdateIdRef.current.toString());

    // Update HTML attributes
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [people, transactions, botToken, currency, language]);

  const addPerson = (name: string, phone: string) => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name,
      phone,
      createdAt: new Date().toISOString()
    };
    setPeople(prev => [...prev, newPerson]);
    return newPerson;
  };

  const addTransaction = (personId: string, amount: number, type: 'give' | 'take', note: string, transCurrency?: Currency) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      personId,
      amount,
      type,
      currency: transCurrency || currency,
      note,
      date: new Date().toISOString()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deletePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
    setTransactions(prev => prev.filter(t => t.personId !== id));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 mb-16 md:mb-0">
        {activeTab === 'dashboard' && (
          <Dashboard 
            people={people} 
            transactions={transactions} 
            currency={currency}
            language={language}
            onNavigateToPeople={() => setActiveTab('people')} 
          />
        )}
        
        {activeTab === 'people' && (
          <PeopleList 
            people={people} 
            transactions={transactions} 
            currency={currency}
            language={language}
            onAddPerson={addPerson}
            onDeletePerson={deletePerson}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        )}
        
        {activeTab === 'advisor' && (
          <AIAdvisor 
            people={people} 
            transactions={transactions} 
            currency={currency}
            language={language}
          />
        )}

        {activeTab === 'settings' && (
          <Settings 
            token={botToken} 
            setToken={setBotToken} 
            chatId={allowedChatId}
            setChatId={setAllowedChatId}
            currency={currency}
            setCurrency={setCurrency}
            language={language}
            setLanguage={setLanguage}
          />
        )}
      </main>
    </div>
  );
};

export default App;

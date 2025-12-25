
import React from 'react';
import { LayoutDashboard, Users, MessageSquareCode, Wallet, Settings } from 'lucide-react';
import { Language } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'people' | 'advisor' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'people' | 'advisor' | 'settings') => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language }) => {
  const translations = {
    ar: { dashboard: 'الرئيسية', people: 'الديون', advisor: 'المستشار', settings: 'الإعدادات', appName: 'حساباتي', appDesc: 'إدارة مالية ذكية' },
    en: { dashboard: 'Dashboard', people: 'Debts', advisor: 'AI Advisor', settings: 'Settings', appName: 'MyDebts', appDesc: 'Smart Finance Management' }
  };

  const t = translations[language];

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'people', label: t.people, icon: Users },
    { id: 'advisor', label: t.advisor, icon: MessageSquareCode },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Wallet size={20} />
          </div>
          <span className="font-bold text-lg text-slate-800">{t.appName}</span>
        </div>
      </div>

      <aside className="fixed bottom-0 md:relative md:w-64 w-full bg-white md:min-h-screen border-t md:border-t-0 md:border-l border-slate-200 z-50">
        <div className="hidden md:flex items-center gap-3 p-6 mb-4 border-b border-slate-100">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800">{t.appName}</h1>
            <p className="text-xs text-slate-400">{t.appDesc}</p>
          </div>
        </div>

        <nav className="flex md:flex-col justify-around md:justify-start p-1 md:p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all duration-200 w-full
                  ${isActive 
                    ? 'bg-blue-600 text-white md:shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                <Icon size={20} />
                <span className="text-[10px] md:text-base font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};


export type TransactionType = 'give' | 'take';
export type Currency = 'SAR' | 'USD' | 'SYP';
export type Language = 'ar' | 'en';

export interface CurrencyConfig {
  code: Currency;
  label: { ar: string, en: string };
  symbol: string;
  flag: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  SAR: { code: 'SAR', label: { ar: 'ريال سعودي', en: 'Saudi Riyal' }, symbol: 'SAR', flag: '🇸🇦' },
  USD: { code: 'USD', label: { ar: 'دولار أمريكي', en: 'US Dollar' }, symbol: '$', flag: '🇺🇸' },
  SYP: { code: 'SYP', label: { ar: 'ليرة سورية', en: 'Syrian Pound' }, symbol: 'SYP', flag: '🇸🇾' },
};

export interface Transaction {
  id: string;
  personId: string;
  amount: number;
  type: TransactionType;
  currency: Currency;
  date: string;
  note: string;
}

export interface Person {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface DebtSummary {
  totalToMe: number; 
  totalOnMe: number; 
  balance: number;
}

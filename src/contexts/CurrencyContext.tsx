
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

const CURRENCY_STORAGE_KEY = "app-currency";
const DEFAULT_CURRENCY = "USD";

interface CurrencyContextType {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>(DEFAULT_CURRENCY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (storedCurrency) {
      setSelectedCurrencyState(storedCurrency);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CURRENCY_STORAGE_KEY, selectedCurrency);
    }
  }, [selectedCurrency, mounted]);

  const formatCurrency = (amount: number) => {
    if (!mounted) return `${selectedCurrency} ${amount.toFixed(2)}`; // Basic fallback before hydration or if Intl fails
    try {
      return new Intl.NumberFormat(undefined, { // Uses browser's default locale for number part
        style: 'currency',
        currency: selectedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      console.warn(`Currency formatting error for ${selectedCurrency}:`, error);
      // Fallback for unrecognized currency codes by Intl.NumberFormat
      return `${selectedCurrency} ${amount.toFixed(2)}`;
    }
  };

  const value = {
    selectedCurrency,
    setSelectedCurrency: setSelectedCurrencyState,
    formatCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

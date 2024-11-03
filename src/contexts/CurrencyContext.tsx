import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../utils/logger';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  exchangeRate: number;
  updateExchangeRate: () => Promise<void>;
  autoUpdateEnabled: boolean;
  setAutoUpdateEnabled: (enabled: boolean) => void;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState(() => 
    localStorage.getItem('preferredCurrency') || 'USD'
  );
  const [exchangeRate, setExchangeRate] = useState(() => 
    parseFloat(localStorage.getItem('exchangeRate') || '12300')
  );
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(() =>
    localStorage.getItem('autoUpdateExchangeRate') === 'true'
  );
  const [lastUpdate, setLastUpdate] = useState<string | null>(
    localStorage.getItem('lastExchangeRateUpdate')
  );

  const fetchExchangeRate = async () => {
    try {
      // Replace with actual API endpoint
      const response = await fetch('https://cbu.uz/en/arkhiv-kursov-valyut/json/USD/');
      const data = await response.json();
      const rate = parseFloat(data[0].Rate);
      
      setExchangeRate(rate);
      setLastUpdate(new Date().toISOString());
      
      localStorage.setItem('exchangeRate', rate.toString());
      localStorage.setItem('lastExchangeRateUpdate', new Date().toISOString());
      
      logger.info('Exchange rate updated successfully', { rate });
    } catch (error) {
      logger.error('Failed to fetch exchange rate:', error);
      throw new Error('Failed to update exchange rate');
    }
  };

  const updateExchangeRate = async () => {
    await fetchExchangeRate();
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    if (fromCurrency === 'USD' && toCurrency === 'UZS') {
      return amount * exchangeRate;
    }
    
    if (fromCurrency === 'UZS' && toCurrency === 'USD') {
      return amount / exchangeRate;
    }
    
    return amount;
  };

  // Handle currency preference changes
  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency);
  }, [currency]);

  // Handle auto-update preference changes
  useEffect(() => {
    localStorage.setItem('autoUpdateExchangeRate', autoUpdateEnabled.toString());
  }, [autoUpdateEnabled]);

  // Auto-update exchange rate
  useEffect(() => {
    if (!autoUpdateEnabled) return;

    const shouldUpdate = () => {
      if (!lastUpdate) return true;
      
      const lastUpdateDate = new Date(lastUpdate);
      const now = new Date();
      
      // Update if last update was more than 24 hours ago
      return (now.getTime() - lastUpdateDate.getTime()) > 24 * 60 * 60 * 1000;
    };

    if (shouldUpdate()) {
      fetchExchangeRate();
    }

    // Schedule daily updates
    const interval = setInterval(() => {
      if (shouldUpdate()) {
        fetchExchangeRate();
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [autoUpdateEnabled, lastUpdate]);

  const value = {
    currency,
    setCurrency,
    exchangeRate,
    updateExchangeRate,
    autoUpdateEnabled,
    setAutoUpdateEnabled,
    convertAmount
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
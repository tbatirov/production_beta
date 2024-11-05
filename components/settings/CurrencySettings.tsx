import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, RefreshCw, AlertCircle } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function CurrencySettings() {
  const { t } = useTranslation();
  const { 
    currency, 
    setCurrency, 
    exchangeRate, 
    updateExchangeRate,
    autoUpdateEnabled,
    setAutoUpdateEnabled
  } = useCurrency();
  
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
  };

  const handleManualUpdate = async () => {
    setLoading(true);
    try {
      await updateExchangeRate();
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Currency Settings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure your preferred currency and exchange rate settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Currency Selection */}
        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Display Currency</h4>
          </div>
          <div className="card-content">
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="UZS">Uzbek Som (UZS)</option>
            </select>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Exchange Rate</h4>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Current Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  1 USD = {exchangeRate.toLocaleString()} UZS
                </p>
                {lastUpdate && (
                  <p className="text-xs text-gray-500">
                    Last updated: {lastUpdate.toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={handleManualUpdate}
                disabled={loading}
                className="btn-secondary inline-flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Update Rate
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoUpdate"
                checked={autoUpdateEnabled}
                onChange={(e) => setAutoUpdateEnabled(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="autoUpdate" className="text-sm text-gray-700">
                Automatically update exchange rate daily
              </label>
            </div>
          </div>
        </div>

        {/* Rate Provider */}
        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Rate Provider</h4>
          </div>
          <div className="card-content">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p>Exchange rates are provided by the Central Bank of Uzbekistan API.</p>
                <p className="mt-1">Updates are available daily at 9:00 AM UZT.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
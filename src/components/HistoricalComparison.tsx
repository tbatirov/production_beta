import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { HistoricalData, GeneratedStatements } from '../utils/types';
import { calculatePeriodComparison } from '../utils/periodComparison';

interface HistoricalComparisonProps {
  currentPeriod: GeneratedStatements;
  historicalData: HistoricalData[];
}

export default function HistoricalComparison({ 
  currentPeriod, 
  historicalData 
}: HistoricalComparisonProps) {
  const { t } = useTranslation();
  const [comparisonPeriod, setComparisonPeriod] = useState<string>(
    historicalData[0]?.period || ''
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const selectedPeriodData = historicalData.find(d => d.period === comparisonPeriod);
  const comparison = selectedPeriodData 
    ? calculatePeriodComparison(currentPeriod, selectedPeriodData.statements)
    : null;

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Compare with Previous Period
          </h3>
          <select
            value={comparisonPeriod}
            onChange={(e) => setComparisonPeriod(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {historicalData.map((period) => (
              <option key={period.period} value={period.period}>
                {new Date(period.period).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </option>
            ))}
          </select>
        </div>

        {comparison && (
          <div className="space-y-6">
            {/* Balance Sheet Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(comparison.changes.balanceSheet).map(([key, change]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    {change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className={`text-lg font-semibold ${
                    change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(change)}
                  </p>
                </div>
              ))}
            </div>

            {/* Income Statement Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(comparison.changes.incomeStatement).map(([key, change]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    {change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className={`text-lg font-semibold ${
                    change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(change)}
                  </p>
                </div>
              ))}
            </div>

            {/* Key Ratios Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(comparison.changes.ratios).map(([key, change]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    {change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className={`text-lg font-semibold ${
                    change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(change)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
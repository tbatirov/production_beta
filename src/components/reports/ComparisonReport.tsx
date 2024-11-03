import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { HistoricalData, PeriodComparison } from '../../utils/types';
import { calculatePeriodComparison } from '../../utils/periodComparison';

interface ComparisonReportProps {
  historicalData: HistoricalData[];
  onPeriodSelect?: (period: HistoricalData) => void;
}

export default function ComparisonReport({ historicalData, onPeriodSelect }: ComparisonReportProps) {
  const { t } = useTranslation();
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'previous' | 'custom'>('previous');

  const sortedData = [...historicalData].sort((a, b) => 
    new Date(b.period).getTime() - new Date(a.period).getTime()
  );

  const getComparison = (): PeriodComparison | null => {
    if (comparisonType === 'previous') {
      if (sortedData.length < 2) return null;
      return calculatePeriodComparison(
        sortedData[0].statements,
        sortedData[1].statements
      );
    } else {
      const periods = selectedPeriods.map(period => 
        sortedData.find(data => data.period === period)
      );
      if (periods.length !== 2 || !periods[0] || !periods[1]) return null;
      return calculatePeriodComparison(
        periods[0].statements,
        periods[1].statements
      );
    }
  };

  const comparison = getComparison();

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const renderChangeIndicator = (change: number) => {
    return change > 0 ? (
      <div className="flex items-center text-green-500">
        <TrendingUp className="h-4 w-4 mr-1" />
        <span>{formatPercentage(change)}</span>
      </div>
    ) : (
      <div className="flex items-center text-red-500">
        <TrendingDown className="h-4 w-4 mr-1" />
        <span>{formatPercentage(change)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">Period Comparison</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setComparisonType('previous')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                comparisonType === 'previous'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Previous Period
            </button>
            <button
              onClick={() => setComparisonType('custom')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                comparisonType === 'custom'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Custom Comparison
            </button>
          </div>
        </div>

        {comparisonType === 'custom' && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[0, 1].map((index) => (
              <select
                key={index}
                value={selectedPeriods[index] || ''}
                onChange={(e) => {
                  const newPeriods = [...selectedPeriods];
                  newPeriods[index] = e.target.value;
                  setSelectedPeriods(newPeriods);
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Period {index + 1}</option>
                {sortedData.map((data) => (
                  <option key={data.period} value={data.period}>
                    {new Date(data.period).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}

        {comparison && (
          <div className="space-y-6">
            {/* Balance Sheet Changes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Balance Sheet Changes</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(comparison.changes.balanceSheet).map(([key, change]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {renderChangeIndicator(change)}
                  </div>
                ))}
              </div>
            </div>

            {/* Income Statement Changes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Income Statement Changes</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(comparison.changes.incomeStatement).map(([key, change]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {renderChangeIndicator(change)}
                  </div>
                ))}
              </div>
            </div>

            {/* Ratio Changes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Ratios Changes</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(comparison.changes.ratios).map(([key, change]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {renderChangeIndicator(change)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
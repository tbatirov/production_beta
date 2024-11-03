import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { HistoricalData } from '../../utils/types';

interface AnalysisHistoryProps {
  history: HistoricalData[];
  onSelect: (analysis: HistoricalData) => void;
}

export default function AnalysisHistory({ history, onSelect }: AnalysisHistoryProps) {
  const { t } = useTranslation();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const calculateChange = (current: number, previous: number | null) => {
    if (!previous) return null;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Analysis History</h2>
        </div>
      </div>

      <div className="space-y-4">
        {history.map((item, index) => {
          const previousItem = history[index + 1];
          const netIncome = item.statements.incomeStatement?.total || 0;
          const previousNetIncome = previousItem?.statements.incomeStatement?.total;
          const change = calculateChange(netIncome, previousNetIncome);

          return (
            <button
              key={item.period}
              onClick={() => onSelect(item)}
              className="w-full text-left p-4 rounded-lg border hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {formatDate(item.period)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Net Income: {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(netIncome)}
                  </p>
                </div>
                {change !== null && (
                  <div className={`flex items-center ${
                    change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {change >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{Math.abs(change).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {history.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No analysis history available
          </div>
        )}
      </div>
    </div>
  );
}
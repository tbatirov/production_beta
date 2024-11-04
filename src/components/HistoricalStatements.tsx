import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { HistoricalData, GeneratedStatements } from '../utils/types';
import StatementSection from './StatementSection';

interface HistoricalStatementsProps {
  data: HistoricalData[];
  onPeriodSelect: (statements: GeneratedStatements) => void;
}

export default function HistoricalStatements({ data, onPeriodSelect }: HistoricalStatementsProps) {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState<'month' | 'year'>('month');

  const sortedData = [...data].sort((a, b) => 
    new Date(b.period).getTime() - new Date(a.period).getTime()
  );

  const formatPeriod = (period: string) => {
    const date = new Date(period);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }).format(date);
  };

  const calculateChange = (current: number, previous: number) => {
    if (!previous) return null;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const renderChangeIndicator = (change: number | null) => {
    if (change === null) return null;
    
    return change > 0 ? (
      <div className="flex items-center text-green-500">
        <TrendingUp className="h-4 w-4 mr-1" />
        <span>+{change.toFixed(1)}%</span>
      </div>
    ) : (
      <div className="flex items-center text-red-500">
        <TrendingDown className="h-4 w-4 mr-1" />
        <span>{change.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Historical Statements</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setComparisonMode('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                comparisonMode === 'month'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setComparisonMode('year')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                comparisonMode === 'year'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {sortedData.map((period, index) => {
            const previousPeriod = sortedData[index + 1];
            const netIncome = period.statements.incomeStatement?.total || 0;
            const previousNetIncome = previousPeriod?.statements.incomeStatement?.total || 0;
            const change = calculateChange(netIncome, previousNetIncome);

            return (
              <div
                key={period.period}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPeriod === period.period
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => {
                  setSelectedPeriod(period.period);
                  onPeriodSelect(period.statements);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {formatPeriod(period.period)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Net Income: {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'UZS'
                        }).format(netIncome)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {renderChangeIndicator(change)}
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';

interface PeriodSelectorProps {
  periods: string[];
  selectedPeriods: string[];
  onChange: (periods: string[]) => void;
  maxSelections: number;
}

export default function PeriodSelector({
  periods,
  selectedPeriods,
  onChange,
  maxSelections
}: PeriodSelectorProps) {
  const { t } = useTranslation();

  const formatPeriod = (period: string) => {
    const date = new Date(period + '-01'); // Add day for valid date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  const handlePeriodChange = (index: number, period: string) => {
    const newPeriods = [...selectedPeriods];
    newPeriods[index] = period;
    onChange(newPeriods);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Period Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('analysis.selectPeriod1')}
          </label>
          <div className="relative">
            <select
              value={selectedPeriods[0] || ''}
              onChange={(e) => handlePeriodChange(0, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 pr-4 py-2"
            >
              <option value="">{t('analysis.selectPeriod')}</option>
              {periods.map((period) => (
                <option 
                  key={period} 
                  value={period}
                  disabled={selectedPeriods[1] === period}
                >
                  {formatPeriod(period)}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Second Period Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('analysis.selectPeriod2')}
          </label>
          <div className="relative">
            <select
              value={selectedPeriods[1] || ''}
              onChange={(e) => handlePeriodChange(1, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 pr-4 py-2"
            >
              <option value="">{t('analysis.selectPeriod')}</option>
              {periods.map((period) => (
                <option 
                  key={period} 
                  value={period}
                  disabled={selectedPeriods[0] === period}
                >
                  {formatPeriod(period)}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {t('analysis.periodSelectorHint', { max: maxSelections })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
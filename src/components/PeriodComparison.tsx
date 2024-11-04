import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GeneratedStatements, HistoricalData } from '../utils/types';

interface AnalysisPeriodComparisonProps {
  currentPeriod: GeneratedStatements | null;
  historicalData: HistoricalData[];
  periodType: 'month' | 'year';
}

export default function AnalysisPeriodComparison({ 
  currentPeriod, 
  historicalData,
  periodType 
}: AnalysisPeriodComparisonProps) {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = React.useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const calculateChange = (current: number, previous: number): number => {
    if (!previous) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const renderChangeIndicator = (change: number) => {
    if (Math.abs(change) < 0.1) {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
    return change > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const sortedData = [...historicalData].sort((a, b) => 
    new Date(b.period).getTime() - new Date(a.period).getTime()
  );

  const selectedData = selectedPeriod 
    ? sortedData.find(d => d.period === selectedPeriod)?.statements 
    : null;

  if (!currentPeriod || sortedData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {t('analysis.noComparisonAvailable')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {periodType === 'month' ? t('analysis.monthToMonth') : t('analysis.yearToYear')}
          </h3>
          <select
            value={selectedPeriod || ''}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">{t('analysis.selectPeriod')}</option>
            {sortedData.map((data) => (
              <option key={data.period} value={data.period}>
                {new Date(data.period).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </option>
            ))}
          </select>
        </div>

        {selectedData && (
          <div className="space-y-8">
            {/* Balance Sheet Comparison */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {t('statements.balanceSheet')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['assets', 'liabilities', 'equity'].map((section) => {
                  const currentTotal = currentPeriod.balanceSheet?.sections[section]?.total || 0;
                  const previousTotal = selectedData.balanceSheet?.sections[section]?.total || 0;
                  const change = calculateChange(currentTotal, previousTotal);

                  return (
                    <div key={section} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 capitalize">
                          {t(`statements.sections.${section}`)}
                        </span>
                        {renderChangeIndicator(change)}
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(currentTotal)}
                      </p>
                      <p className={`text-sm ${
                        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {formatPercentage(change)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Income Statement Comparison */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {t('statements.incomeStatement')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['revenue', 'expenses'].map((section) => {
                  const currentTotal = currentPeriod.incomeStatement?.sections[section]?.total || 0;
                  const previousTotal = selectedData.incomeStatement?.sections[section]?.total || 0;
                  const change = calculateChange(currentTotal, previousTotal);

                  return (
                    <div key={section} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 capitalize">
                          {t(`statements.sections.${section}`)}
                        </span>
                        {renderChangeIndicator(change)}
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(currentTotal)}
                      </p>
                      <p className={`text-sm ${
                        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {formatPercentage(change)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cash Flow Comparison */}
            {currentPeriod.cashFlow && selectedData.cashFlow && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  {t('statements.cashFlow')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['operating', 'investing', 'financing'].map((section) => {
                    const currentTotal = currentPeriod.cashFlow?.sections[section]?.total || 0;
                    const previousTotal = selectedData.cashFlow?.sections[section]?.total || 0;
                    const change = calculateChange(currentTotal, previousTotal);

                    return (
                      <div key={section} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500 capitalize">
                            {t(`statements.sections.${section}`)}
                          </span>
                          {renderChangeIndicator(change)}
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(currentTotal)}
                        </p>
                        <p className={`text-sm ${
                          change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {formatPercentage(change)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
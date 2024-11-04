import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { FinancialAnalysis } from '../../utils/types';

interface MonthToMonthComparisonProps {
  analysisHistory: FinancialAnalysis[];
}

export default function MonthToMonthComparison({ analysisHistory }: MonthToMonthComparisonProps) {
  const { t } = useTranslation();
  const [period1, setPeriod1] = useState<string>('');
  const [period2, setPeriod2] = useState<string>('');

  const sortedHistory = [...analysisHistory].sort((a, b) => 
    new Date(b.period).getTime() - new Date(a.period).getTime()
  );

  const selectedPeriod1 = analysisHistory.find(a => a.period === period1);
  const selectedPeriod2 = analysisHistory.find(a => a.period === period2);

  const formatDate = (period: string) => {
    return new Date(period + '-01').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (!selectedPeriod1 || !selectedPeriod2) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">
              {t('analysis.monthToMonth')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('analysis.selectPeriod1')}
            </label>
            <select
              value={period1}
              onChange={(e) => setPeriod1(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">{t('analysis.selectPeriod')}</option>
              {sortedHistory.map((analysis) => (
                <option 
                  key={analysis.period} 
                  value={analysis.period}
                  disabled={analysis.period === period2}
                >
                  {formatDate(analysis.period)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('analysis.selectPeriod2')}
            </label>
            <select
              value={period2}
              onChange={(e) => setPeriod2(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">{t('analysis.selectPeriod')}</option>
              {sortedHistory.map((analysis) => (
                <option 
                  key={analysis.period} 
                  value={analysis.period}
                  disabled={analysis.period === period1}
                >
                  {formatDate(analysis.period)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('analysis.selectPeriodsToCompare')}
          </h3>
          <p className="text-sm text-gray-500">
            {t('analysis.selectTwoPeriodsDescription')}
          </p>
        </div>
      </div>
    );
  }

  // Rest of the component remains the same...
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateChange = (current: number, previous: number) => {
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

  const sections = [
    {
      title: t('statements.balanceSheet'),
      metrics: [
        {
          label: t('sections.assets'),
          value1: selectedPeriod1.statements.balanceSheet?.sections.assets.total || 0,
          value2: selectedPeriod2.statements.balanceSheet?.sections.assets.total || 0,
          isCurrency: true
        },
        {
          label: t('sections.liabilities'),
          value1: selectedPeriod1.statements.balanceSheet?.sections.liabilities.total || 0,
          value2: selectedPeriod2.statements.balanceSheet?.sections.liabilities.total || 0,
          isCurrency: true
        },
        {
          label: t('sections.equity'),
          value1: selectedPeriod1.statements.balanceSheet?.sections.equity.total || 0,
          value2: selectedPeriod2.statements.balanceSheet?.sections.equity.total || 0,
          isCurrency: true
        }
      ]
    },
    {
      title: t('statements.incomeStatement'),
      metrics: [
        {
          label: t('sections.revenue'),
          value1: selectedPeriod1.statements.incomeStatement?.sections.revenue.total || 0,
          value2: selectedPeriod2.statements.incomeStatement?.sections.revenue.total || 0,
          isCurrency: true
        },
        {
          label: t('sections.expenses'),
          value1: selectedPeriod1.statements.incomeStatement?.sections.expenses.total || 0,
          value2: selectedPeriod2.statements.incomeStatement?.sections.expenses.total || 0,
          isCurrency: true
        },
        {
          label: t('sections.netIncome'),
          value1: selectedPeriod1.statements.incomeStatement?.total || 0,
          value2: selectedPeriod2.statements.incomeStatement?.total || 0,
          isCurrency: true
        }
      ]
    },
    {
      title: t('metrics.profitability'),
      metrics: [
        {
          label: t('analysis.ratios.netProfitMargin'),
          value1: selectedPeriod1.ratios.profitability.netProfitMargin,
          value2: selectedPeriod2.ratios.profitability.netProfitMargin,
          isPercentage: true
        },
        {
          label: t('analysis.ratios.returnOnEquity'),
          value1: selectedPeriod1.ratios.profitability.returnOnEquity,
          value2: selectedPeriod2.ratios.profitability.returnOnEquity,
          isPercentage: true
        },
        {
          label: t('analysis.ratios.returnOnAssets'),
          value1: selectedPeriod1.ratios.profitability.returnOnAssets,
          value2: selectedPeriod2.ratios.profitability.returnOnAssets,
          isPercentage: true
        }
      ]
    },
    {
      title: t('metrics.liquidity'),
      metrics: [
        {
          label: t('analysis.ratios.currentRatio'),
          value1: selectedPeriod1.ratios.liquidity.currentRatio,
          value2: selectedPeriod2.ratios.liquidity.currentRatio,
          isRatio: true
        },
        {
          label: t('analysis.ratios.quickRatio'),
          value1: selectedPeriod1.ratios.liquidity.quickRatio,
          value2: selectedPeriod2.ratios.liquidity.quickRatio,
          isRatio: true
        },
        {
          label: t('analysis.ratios.cashRatio'),
          value1: selectedPeriod1.ratios.liquidity.cashRatio,
          value2: selectedPeriod2.ratios.liquidity.cashRatio,
          isRatio: true
        }
      ]
    }
  ];

  const formatValue = (value: number, { isCurrency, isPercentage, isRatio }: any) => {
    if (isCurrency) return formatCurrency(value);
    if (isPercentage) return `${value.toFixed(2)}%`;
    if (isRatio) return value.toFixed(2);
    return value.toString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">
              {t('analysis.monthToMonth')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('analysis.selectPeriod1')}
            </label>
            <select
              value={period1}
              onChange={(e) => setPeriod1(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">{t('analysis.selectPeriod')}</option>
              {sortedHistory.map((analysis) => (
                <option 
                  key={analysis.period} 
                  value={analysis.period}
                  disabled={analysis.period === period2}
                >
                  {formatDate(analysis.period)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('analysis.selectPeriod2')}
            </label>
            <select
              value={period2}
              onChange={(e) => setPeriod2(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">{t('analysis.selectPeriod')}</option>
              {sortedHistory.map((analysis) => (
                <option 
                  key={analysis.period} 
                  value={analysis.period}
                  disabled={analysis.period === period1}
                >
                  {formatDate(analysis.period)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.metrics.map((metric) => {
                const change = calculateChange(metric.value1, metric.value2);
                return (
                  <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      {renderChangeIndicator(change)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Period 1</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatValue(metric.value1, metric)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Period 2</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatValue(metric.value2, metric)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className={`text-sm font-medium ${
                        change > 0 ? 'text-green-600' : 
                        change < 0 ? 'text-red-600' : 
                        'text-gray-500'
                      }`}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
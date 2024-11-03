import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart2, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { HistoricalData } from '../utils/types';
import TrendVisualization from './TrendVisualization';
import { calculateFinancialRatios } from '../utils/ratioCalculator';

interface FinancialAnalysisViewProps {
  historicalData: HistoricalData[];
}

export default function FinancialAnalysisView({ historicalData }: FinancialAnalysisViewProps) {
  const { t } = useTranslation();

  const latestData = historicalData[0];
  const previousData = historicalData[1];

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const latestRatios = calculateFinancialRatios(latestData.statements);
  const previousRatios = previousData ? calculateFinancialRatios(previousData.statements) : null;

  const renderMetricCard = (title: string, value: number, previousValue: number | null) => {
    const change = previousValue !== null ? getPercentageChange(value, previousValue) : null;
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {change !== null && (
            <div className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{formatPercentage(Math.abs(change))}</span>
            </div>
          )}
        </div>
        <p className="text-2xl font-semibold text-gray-900">{formatPercentage(value)}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard(
          t('analysis.ratios.currentRatio'),
          latestRatios.currentRatio,
          previousRatios?.currentRatio || null
        )}
        {renderMetricCard(
          t('analysis.ratios.profitMargin'),
          latestRatios.profitMargin,
          previousRatios?.profitMargin || null
        )}
        {renderMetricCard(
          t('analysis.ratios.returnOnEquity'),
          latestRatios.returnOnEquity,
          previousRatios?.returnOnEquity || null
        )}
        {renderMetricCard(
          t('analysis.ratios.debtRatio'),
          latestRatios.debtRatio,
          previousRatios?.debtRatio || null
        )}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendVisualization data={historicalData} metric="revenue" />
        <TrendVisualization data={historicalData} metric="netIncome" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendVisualization data={historicalData} metric="assets" />
        <TrendVisualization data={historicalData} metric="cashFlow" />
      </div>
    </div>
  );
}
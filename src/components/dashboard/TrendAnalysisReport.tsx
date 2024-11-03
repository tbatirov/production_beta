import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { analyzeTrends } from '../../utils/ai/trendAnalysis';
import { FinancialAnalysis } from '../../utils/types';

interface TrendAnalysisReportProps {
  currentPeriod: FinancialAnalysis;
  previousPeriod: FinancialAnalysis;
  metric: string;
}

export default function TrendAnalysisReport({
  currentPeriod,
  previousPeriod,
  metric
}: TrendAnalysisReportProps) {
  const { t } = useTranslation();
  const analysis = analyzeTrends(currentPeriod, previousPeriod, metric);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t(`metrics.${metric}`)} {t('analysis.trendAnalysis')}
        </h3>
        {analysis.direction === 'up' ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : analysis.direction === 'down' ? (
          <TrendingDown className="h-5 w-5 text-red-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-500" />
        )}
      </div>

      <div className="space-y-4">
        {/* Main Analysis */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">{analysis.analysis}</p>
        </div>

        {/* Contributing Factors */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            {t('analysis.contributingFactors')}
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.factors.map((factor, index) => (
              <li key={index} className="text-sm text-gray-600">
                {factor}
              </li>
            ))}
          </ul>
        </div>

        {/* Percentage Change */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {t('analysis.percentageChange')}
            </span>
            <span className={`text-sm font-medium ${
              analysis.direction === 'up' ? 'text-green-600' :
              analysis.direction === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {analysis.direction === 'up' ? '+' : ''}
              {analysis.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
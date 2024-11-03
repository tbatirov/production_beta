import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, FileText, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { FinancialAnalysis } from '../../utils/types';
import TabularStatements from '../TabularStatements';
import { logger } from '../../utils/logger';

interface HistoricalAnalysisProps {
  analysisHistory: FinancialAnalysis[];
}

export default function HistoricalAnalysis({ analysisHistory }: HistoricalAnalysisProps) {
  const { t } = useTranslation();
  const [expandedPeriods, setExpandedPeriods] = React.useState<string[]>([]);

  const sortedHistory = [...analysisHistory].sort((a, b) => 
    new Date(b.period).getTime() - new Date(a.period).getTime()
  );

  const formatDate = (period: string) => {
    return new Date(period + '-01').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const calculateChange = (current: number, previous: number | null) => {
    if (!previous) return null;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const togglePeriod = (period: string) => {
    setExpandedPeriods(prev => 
      prev.includes(period) 
        ? prev.filter(p => p !== period)
        : [...prev, period]
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">
              {t('dashboard.historicalAnalysis')}
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {sortedHistory.map((analysis, index) => {
            const previousAnalysis = sortedHistory[index + 1];
            const netIncome = analysis.statements.incomeStatement?.total || 0;
            const previousNetIncome = previousAnalysis?.statements.incomeStatement?.total;
            const change = calculateChange(netIncome, previousNetIncome);
            const isExpanded = expandedPeriods.includes(analysis.period);

            return (
              <div key={analysis.period} className="border rounded-lg">
                <button
                  onClick={() => togglePeriod(analysis.period)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div className="text-left">
                      <h3 className="text-sm font-medium text-gray-900">
                        {formatDate(analysis.period)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Net Income: {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(netIncome)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
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
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-6 border-t">
                    <div className="space-y-6">
                      {/* Financial Metrics Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            {t('metrics.profitability')}
                          </h4>
                          <p className="text-lg font-semibold text-gray-900">
                            {analysis.ratios.profitability.netProfitMargin.toFixed(2)}%
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            {t('metrics.liquidity')}
                          </h4>
                          <p className="text-lg font-semibold text-gray-900">
                            {analysis.ratios.liquidity.currentRatio.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            {t('metrics.efficiency')}
                          </h4>
                          <p className="text-lg font-semibold text-gray-900">
                            {analysis.ratios.efficiency.assetTurnover.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Analysis Summary */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {t('analysis.summary')}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {analysis.analysis.summary}
                        </p>
                      </div>

                      {/* Financial Statements */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">
                          {t('statements.financialStatements')}
                        </h4>
                        <TabularStatements statements={analysis.statements} />
                      </div>

                      {/* Creation Info */}
                      <div className="text-sm text-gray-500">
                        <p>
                          Created: {new Date(analysis.metadata.createdAt).toLocaleString()}
                        </p>
                        <p>
                          Last Updated: {new Date(analysis.metadata.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {sortedHistory.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('dashboard.noAnalysis')}
              </h3>
              <p className="text-sm text-gray-500">
                {t('dashboard.noAnalysisDesc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { GeneratedStatements } from '../../utils/types';
import { calculateFinancialRatios } from '../../utils/ratioCalculator';
import RatioSection from './RatioSection';
import { ratioBenchmarks } from './RatioBenchmarks';
import { ratioDescriptions } from './RatioDescriptions';
import StrategicRecommendations from './StrategicRecommendations';
import { logger } from '../../utils/logger';
import { useCompany } from '../../contexts/CompanyContext';

interface ComprehensiveReportProps {
  statements: GeneratedStatements;
}

export default function ComprehensiveReport({ statements }: ComprehensiveReportProps) {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();

  // Debug log for incoming props
  logger.info('ComprehensiveReport received statements:', {
    hasStatements: !!statements,
    hasBalanceSheet: !!statements?.balanceSheet,
    hasIncomeStatement: !!statements?.incomeStatement,
    hasCashFlow: !!statements?.cashFlow
  });

  // Early return if no statements
  if (!statements || !statements.balanceSheet || !statements.incomeStatement) {
    logger.warn('ComprehensiveReport: Missing required statements');
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('analysis.missingStatements')}
        </h3>
        <p className="text-sm text-gray-500">
          {t('analysis.missingStatementsDesc')}
        </p>
      </div>
    );
  }

  const ratios = calculateFinancialRatios(statements);

  return (
    <div className="space-y-8 p-6">
      {/* Ratios Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {t('analysis.ratios.title')}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              {t('analysis.aboveBenchmark')}
            </span>
            <span className="flex items-center text-sm text-gray-500">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              {t('analysis.belowBenchmark')}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <RatioSection
            title={t('metrics.profitability')}
            ratios={ratios.profitability}
            benchmarks={ratioBenchmarks.profitability}
            descriptions={ratioDescriptions.profitability}
            isPercentage={true}
          />
          <RatioSection
            title={t('metrics.liquidity')}
            ratios={ratios.liquidity}
            benchmarks={ratioBenchmarks.liquidity}
            descriptions={ratioDescriptions.liquidity}
            isPercentage={false}
          />
          <RatioSection
            title={t('metrics.efficiency')}
            ratios={ratios.efficiency}
            benchmarks={ratioBenchmarks.efficiency}
            descriptions={ratioDescriptions.efficiency}
            isPercentage={false}
          />
          <RatioSection
            title={t('metrics.leverage')}
            ratios={ratios.leverage}
            benchmarks={ratioBenchmarks.leverage}
            descriptions={ratioDescriptions.leverage}
            isPercentage={false}
          />
        </div>
      </div>

      {/* Strategic Recommendations */}
      {selectedCompany && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">
              {t('analysis.strategicRecommendations')}
            </h2>
          </div>
          <StrategicRecommendations
            ratios={ratios}
            industry={selectedCompany.industry || 'Unknown'}
          />
        </div>
      )}
    </div>
  );
}
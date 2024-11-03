import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { GeneratedStatements } from '../utils/types';
import { calculateFinancialRatios } from '../utils/ratioCalculator';

interface FinancialHealthProps {
  statements: GeneratedStatements;
}

export default function FinancialHealth({ statements }: FinancialHealthProps) {
  const { t } = useTranslation();

  if (!statements || !statements.balanceSheet?.sections || !statements.incomeStatement?.sections) {
    return null;
  }

  const ratios = calculateFinancialRatios(statements);

  const getStatusColor = (value: number, benchmark: number) => {
    if (value >= benchmark) return 'text-green-500';
    if (value >= benchmark * 0.8) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (value: number, benchmark: number) => {
    if (value >= benchmark) {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    }
    if (value >= benchmark * 0.8) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
    return <TrendingDown className="h-5 w-5 text-red-500" />;
  };

  const getBenchmark = (ratio: string): number => {
    const benchmarks: Record<string, number> = {
      currentRatio: 2.0,
      quickRatio: 1.0,
      cashRatio: 0.5,
      debtRatio: 0.5,
      netProfitMargin: 15,
      returnOnAssets: 5,
      returnOnEquity: 15,
      assetTurnover: 1.0,
      inventoryTurnover: 6.0,
      receivablesTurnover: 4.0
    };
    return benchmarks[ratio] || 1.0;
  };

  const formatValue = (value: number, isPercentage: boolean = false) => {
    if (isPercentage) {
      return `${value.toFixed(2)}%`;
    }
    return value.toFixed(2);
  };

  const sections = [
    {
      title: t('metrics.profitability'),
      metrics: [
        {
          label: t('analysis.ratios.netProfitMargin'),
          value: ratios.profitability.netProfitMargin,
          isPercentage: true
        },
        {
          label: t('analysis.ratios.returnOnEquity'),
          value: ratios.profitability.returnOnEquity,
          isPercentage: true
        },
        {
          label: t('analysis.ratios.returnOnAssets'),
          value: ratios.profitability.returnOnAssets,
          isPercentage: true
        }
      ]
    },
    {
      title: t('metrics.liquidity'),
      metrics: [
        {
          label: t('analysis.ratios.currentRatio'),
          value: ratios.liquidity.currentRatio
        },
        {
          label: t('analysis.ratios.quickRatio'),
          value: ratios.liquidity.quickRatio
        },
        {
          label: t('analysis.ratios.cashRatio'),
          value: ratios.liquidity.cashRatio
        }
      ]
    },
    {
      title: t('metrics.efficiency'),
      metrics: [
        {
          label: t('analysis.ratios.assetTurnover'),
          value: ratios.efficiency.assetTurnover
        },
        {
          label: t('analysis.ratios.inventoryTurnover'),
          value: ratios.efficiency.inventoryTurnover
        },
        {
          label: t('analysis.ratios.receivablesTurnover'),
          value: ratios.efficiency.receivablesTurnover
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.metrics.map((metric) => {
              const benchmark = getBenchmark(metric.label.toLowerCase().replace(/\s+/g, ''));
              return (
                <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {metric.label}
                    </span>
                    {getStatusIcon(metric.value, benchmark)}
                  </div>
                  <p className={`text-lg font-semibold ${getStatusColor(metric.value, benchmark)}`}>
                    {formatValue(metric.value, metric.isPercentage)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('analysis.benchmark')}: {formatValue(benchmark, metric.isPercentage)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
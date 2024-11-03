import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FinancialAnalysis } from '../../utils/types';

interface ComparisonTableProps {
  currentPeriod: FinancialAnalysis;
  previousPeriod: FinancialAnalysis;
}

export default function ComparisonTable({
  currentPeriod,
  previousPeriod
}: ComparisonTableProps) {
  const { t } = useTranslation();

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
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
      title: t('metrics.profitability'),
      ratios: [
        {
          label: t('analysis.ratios.netProfitMargin'),
          current: currentPeriod.ratios.profitability.netProfitMargin,
          previous: previousPeriod.ratios.profitability.netProfitMargin
        },
        {
          label: t('analysis.ratios.returnOnEquity'),
          current: currentPeriod.ratios.profitability.returnOnEquity,
          previous: previousPeriod.ratios.profitability.returnOnEquity
        },
        {
          label: t('analysis.ratios.returnOnAssets'),
          current: currentPeriod.ratios.profitability.returnOnAssets,
          previous: previousPeriod.ratios.profitability.returnOnAssets
        }
      ]
    },
    {
      title: t('metrics.liquidity'),
      ratios: [
        {
          label: t('analysis.ratios.currentRatio'),
          current: currentPeriod.ratios.liquidity.currentRatio,
          previous: previousPeriod.ratios.liquidity.currentRatio
        },
        {
          label: t('analysis.ratios.quickRatio'),
          current: currentPeriod.ratios.liquidity.quickRatio,
          previous: previousPeriod.ratios.liquidity.quickRatio
        },
        {
          label: t('analysis.ratios.cashRatio'),
          current: currentPeriod.ratios.liquidity.cashRatio,
          previous: previousPeriod.ratios.liquidity.cashRatio
        }
      ]
    },
    {
      title: t('metrics.efficiency'),
      ratios: [
        {
          label: t('analysis.ratios.assetTurnover'),
          current: currentPeriod.ratios.efficiency.assetTurnover,
          previous: previousPeriod.ratios.efficiency.assetTurnover
        },
        {
          label: t('analysis.ratios.inventoryTurnover'),
          current: currentPeriod.ratios.efficiency.inventoryTurnover,
          previous: previousPeriod.ratios.efficiency.inventoryTurnover
        },
        {
          label: t('analysis.ratios.receivablesTurnover'),
          current: currentPeriod.ratios.efficiency.receivablesTurnover,
          previous: previousPeriod.ratios.efficiency.receivablesTurnover
        }
      ]
    },
    {
      title: t('metrics.leverage'),
      ratios: [
        {
          label: t('analysis.ratios.debtRatio'),
          current: currentPeriod.ratios.leverage.debtRatio,
          previous: previousPeriod.ratios.leverage.debtRatio
        },
        {
          label: t('analysis.ratios.debtToEquity'),
          current: currentPeriod.ratios.leverage.debtToEquity,
          previous: previousPeriod.ratios.leverage.debtToEquity
        },
        {
          label: t('analysis.ratios.interestCoverage'),
          current: currentPeriod.ratios.leverage.interestCoverage,
          previous: previousPeriod.ratios.leverage.interestCoverage
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.ratios.map((ratio) => {
              const change = calculateChange(ratio.current, ratio.previous);
              return (
                <div key={ratio.label} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      {ratio.label}
                    </span>
                    {renderChangeIndicator(change)}
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPercentage(ratio.current)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {t('analysis.previousPeriod')}: {formatPercentage(ratio.previous)}
                    </span>
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
  );
}
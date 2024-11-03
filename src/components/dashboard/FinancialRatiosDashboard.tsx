import React from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialRatios } from '../../utils/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FinancialRatiosDashboardProps {
  ratios: FinancialRatios;
}

export default function FinancialRatiosDashboard({
  ratios,
}: FinancialRatiosDashboardProps) {
  const { t } = useTranslation();

  const getBenchmark = (ratioName: string): number => {
    const benchmarks: Record<string, number> = {
      currentRatio: 2.0,
      quickRatio: 1.0,
      cashRatio: 0.5,
      debtRatio: 0.5,
      netProfitMargin: 0.15,
      returnOnAssets: 0.05,
      returnOnEquity: 0.15,
      assetTurnover: 1.0,
      inventoryTurnover: 6.0,
      receivablesTurnover: 4.0,
      debtToEquity: 1.0,
      interestCoverage: 3.0,
    };
    return benchmarks[ratioName] || 1.0;
  };

  const formatRatioValue = (value: number): string => {
    if (value === 0) return '0.00';
    return value.toFixed(2);
  };

  const getRatioStatus = (
    value: number,
    benchmark: number
  ): 'up' | 'down' | 'neutral' => {
    if (value === 0) return 'neutral';
    const difference = ((value - benchmark) / benchmark) * 100;
    if (Math.abs(difference) < 5) return 'neutral';
    return difference > 0 ? 'up' : 'down';
  };

  const ratioCategories = [
    {
      title: t('metrics.profitability'),
      category: 'profitability' as keyof FinancialRatios,
      ratios: [
        {
          name: 'netProfitMargin',
          value: ratios.profitability.netProfitMargin / 100,
        },
        {
          name: 'returnOnEquity',
          value: ratios.profitability.returnOnEquity / 100,
        },
        {
          name: 'returnOnAssets',
          value: ratios.profitability.returnOnAssets / 100,
        },
      ],
      color: 'bg-blue-500',
    },
    {
      title: t('metrics.liquidity'),
      category: 'liquidity' as keyof FinancialRatios,
      ratios: [
        { name: 'currentRatio', value: ratios.liquidity.currentRatio / 100 },
        { name: 'quickRatio', value: ratios.liquidity.quickRatio / 100 },
        { name: 'cashRatio', value: ratios.liquidity.cashRatio / 100 },
      ],
      color: 'bg-green-500',
    },
    {
      title: t('metrics.efficiency'),
      category: 'efficiency' as keyof FinancialRatios,
      ratios: [
        { name: 'assetTurnover', value: ratios.efficiency.assetTurnover / 100 },
        {
          name: 'inventoryTurnover',
          value: ratios.efficiency.inventoryTurnover / 100,
        },
        {
          name: 'receivablesTurnover',
          value: ratios.efficiency.receivablesTurnover / 100,
        },
      ],
      color: 'bg-purple-500',
    },
    {
      title: t('metrics.leverage'),
      category: 'leverage' as keyof FinancialRatios,
      ratios: [
        { name: 'debtRatio', value: ratios.leverage.debtRatio / 100 },
        { name: 'debtToEquity', value: ratios.leverage.debtToEquity / 100 },
        {
          name: 'interestCoverage',
          value: ratios.leverage.interestCoverage / 100,
        },
      ],
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {ratioCategories.map((category) => (
        <div key={category.title} className="bg-white rounded-lg shadow-lg p-6">
          <h3
            className={`text-lg font-semibold mb-4 ${category.color.replace(
              'bg-',
              'text-'
            )}`}
          >
            {category.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.ratios.map((ratio) => {
              const benchmark = getBenchmark(ratio.name);
              const status = getRatioStatus(ratio.value, benchmark);

              return (
                <div key={ratio.name} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      {t(`analysis.ratios.${ratio.name}`)}
                    </h4>
                    <div
                      className={`flex items-center ${
                        status === 'up'
                          ? 'text-green-500'
                          : status === 'down'
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {status === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : status === 'down' ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatRatioValue(ratio.value)}
                    </span>
                    {ratio.value !== 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        {t('analysis.benchmark')}: {formatRatioValue(benchmark)}
                      </span>
                    )}
                  </div>
                  {ratio.value !== 0 && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === 'up'
                              ? 'bg-green-500'
                              : status === 'down'
                              ? 'bg-red-500'
                              : 'bg-gray-400'
                          }`}
                          style={{
                            width: `${Math.min(
                              (ratio.value / benchmark) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {ratio.value === 0
                          ? t('analysis.noData')
                          : t('analysis.benchmarkComparison')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FinancialAnalysis } from '../../utils/types';
import { Line } from 'react-chartjs-2';

interface TrendAnalysisProps {
  analysisHistory: FinancialAnalysis[];
}

export default function TrendAnalysis({ analysisHistory }: TrendAnalysisProps) {
  const { t } = useTranslation();

  const sortedHistory = [...analysisHistory].sort((a, b) => 
    new Date(a.period).getTime() - new Date(b.period).getTime()
  );

  const formatDate = (period: string) => {
    return new Date(period + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const createChartData = (
    metric: string,
    accessor: (analysis: FinancialAnalysis) => number,
    color: string
  ) => ({
    labels: sortedHistory.map(a => formatDate(a.period)),
    datasets: [{
      label: t(`metrics.${metric}`),
      data: sortedHistory.map(accessor),
      borderColor: color,
      backgroundColor: `${color}20`,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: color,
      pointBorderColor: 'white',
      pointBorderWidth: 2
    }]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        titleFont: {
          size: 13,
          family: "'Inter', sans-serif",
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      }
    }
  };

  const trendSections = [
    {
      title: t('metrics.profitability'),
      charts: [
        {
          title: t('analysis.ratios.netProfitMargin'),
          data: createChartData(
            'netProfitMargin',
            a => a.ratios.profitability.netProfitMargin,
            'rgb(34, 197, 94)'
          )
        },
        {
          title: t('analysis.ratios.returnOnEquity'),
          data: createChartData(
            'returnOnEquity',
            a => a.ratios.profitability.returnOnEquity,
            'rgb(59, 130, 246)'
          )
        }
      ]
    },
    {
      title: t('metrics.liquidity'),
      charts: [
        {
          title: t('analysis.ratios.currentRatio'),
          data: createChartData(
            'currentRatio',
            a => a.ratios.liquidity.currentRatio,
            'rgb(168, 85, 247)'
          )
        },
        {
          title: t('analysis.ratios.quickRatio'),
          data: createChartData(
            'quickRatio',
            a => a.ratios.liquidity.quickRatio,
            'rgb(236, 72, 153)'
          )
        }
      ]
    },
    {
      title: t('metrics.efficiency'),
      charts: [
        {
          title: t('analysis.ratios.assetTurnover'),
          data: createChartData(
            'assetTurnover',
            a => a.ratios.efficiency.assetTurnover,
            'rgb(234, 179, 8)'
          )
        },
        {
          title: t('analysis.ratios.inventoryTurnover'),
          data: createChartData(
            'inventoryTurnover',
            a => a.ratios.efficiency.inventoryTurnover,
            'rgb(249, 115, 22)'
          )
        }
      ]
    },
    {
      title: t('metrics.leverage'),
      charts: [
        {
          title: t('analysis.ratios.debtRatio'),
          data: createChartData(
            'debtRatio',
            a => a.ratios.leverage.debtRatio,
            'rgb(239, 68, 68)'
          )
        },
        {
          title: t('analysis.ratios.debtToEquity'),
          data: createChartData(
            'debtToEquity',
            a => a.ratios.leverage.debtToEquity,
            'rgb(217, 70, 239)'
          )
        }
      ]
    }
  ];

  const getPerformanceIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / Math.abs(previous)) * 100;
    if (Math.abs(change) < 0.1) return <Minus className="h-4 w-4 text-gray-400" />;
    return change > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-8">
      {trendSections.map((section) => (
        <div key={section.title} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {section.charts.map((chart) => (
              <div key={chart.title} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-700">
                    {chart.title}
                  </h4>
                  {sortedHistory.length >= 2 && getPerformanceIndicator(
                    chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1],
                    chart.data.datasets[0].data[chart.data.datasets[0].data.length - 2]
                  )}
                </div>
                <div className="h-[300px]">
                  <Line data={chart.data} options={chartOptions} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
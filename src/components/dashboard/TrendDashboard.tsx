import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { HistoricalData, TrendData } from '../../utils/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendDashboardProps {
  historicalData: HistoricalData[];
}

export default function TrendDashboard({ historicalData }: TrendDashboardProps) {
  const { t } = useTranslation();

  const sortedData = [...historicalData].sort((a, b) => 
    new Date(a.period).getTime() - new Date(b.period).getTime()
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMetricData = (metric: keyof typeof metricAccessors): TrendData[] => {
    return sortedData.map((item, index) => {
      const value = metricAccessors[metric](item.statements);
      const previousValue = index > 0 ? metricAccessors[metric](sortedData[index - 1].statements) : null;
      const change = previousValue !== null ? ((value - previousValue) / Math.abs(previousValue)) * 100 : null;
      
      return {
        period: item.period,
        value,
        change
      };
    });
  };

  const metricAccessors = {
    revenue: (statements: any) => statements.incomeStatement?.sections.revenue.total || 0,
    netIncome: (statements: any) => statements.incomeStatement?.total || 0,
    totalAssets: (statements: any) => statements.balanceSheet?.sections.assets.total || 0,
    operatingCashFlow: (statements: any) => statements.cashFlow?.sections.operating.total || 0
  };

  const createChartData = (data: TrendData[], label: string) => ({
    labels: data.map(item => new Date(item.period).toLocaleDateString('en-US', { 
      month: 'short',
      year: 'numeric'
    })),
    datasets: [
      {
        label,
        data: data.map(item => item.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => formatCurrency(context.raw)
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value: number) => formatCurrency(value)
        }
      }
    }
  };

  const metrics = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'netIncome', label: 'Net Income' },
    { key: 'totalAssets', label: 'Total Assets' },
    { key: 'operatingCashFlow', label: 'Operating Cash Flow' }
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map(({ key, label }) => {
          const data = getMetricData(key);
          const latestData = data[data.length - 1];
          
          return (
            <div key={key} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{label}</h3>
                {latestData?.change !== null && (
                  <div className={`flex items-center ${
                    latestData.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {latestData.change >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(latestData.change).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(latestData?.value || 0)}
                </p>
              </div>

              <div className="h-48">
                <Line 
                  data={createChartData(data, label)} 
                  options={chartOptions} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HistoricalData } from '../utils/types';
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

// Register Chart.js components
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

interface TrendVisualizationProps {
  data: HistoricalData[];
  metric: 'assets' | 'revenue' | 'netIncome' | 'cashFlow';
}

export default function TrendVisualization({ data, metric }: TrendVisualizationProps) {
  const { t } = useTranslation();

  // Cleanup charts on unmount
  useEffect(() => {
    return () => {
      const charts = ChartJS.instances;
      Object.keys(charts).forEach(key => {
        charts[key].destroy();
      });
    };
  }, []);

  const sortedData = [...data].sort((a, b) => 
    new Date(a.period).getTime() - new Date(b.period).getTime()
  );

  const getMetricValue = (item: HistoricalData): number => {
    switch (metric) {
      case 'assets':
        return item.statements.balanceSheet?.sections.assets.total || 0;
      case 'revenue':
        return item.statements.incomeStatement?.sections.revenue.total || 0;
      case 'netIncome':
        return item.statements.incomeStatement?.total || 0;
      case 'cashFlow':
        return item.statements.cashFlow?.total || 0;
      default:
        return 0;
    }
  };

  const chartData = {
    labels: sortedData.map(item => {
      const date = new Date(item.period);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short' 
      }).format(date);
    }),
    datasets: [
      {
        label: t(`trends.${metric}`),
        data: sortedData.map(item => getMetricValue(item)),
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
  };

  const options = {
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
      title: {
        display: true,
        text: t(`trends.${metric}Trend`),
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 'bold'
        },
        padding: { bottom: 20 }
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
        },
        callbacks: {
          label: (context: any) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(context.raw);
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category' as const,
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
        type: 'linear' as const,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          callback: (value: number) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(value);
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-[300px]">
        <Line data={chartData} options={options} key={`${metric}-${data.length}`} />
      </div>
    </div>
  );
}
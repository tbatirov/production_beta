import React from 'react';
import { Line } from 'react-chartjs-2';
import { FinancialAnalysis } from '../../utils/types';

interface RatioTrendChartProps {
  data: FinancialAnalysis[];
  category: 'profitability' | 'liquidity' | 'efficiency' | 'leverage';
  title: string;
}

export default function RatioTrendChart({ data, category, title }: RatioTrendChartProps) {
  const sortedData = [...data].sort((a, b) => 
    new Date(a.period).getTime() - new Date(b.period).getTime()
  );

  const formatDate = (period: string) => {
    return new Date(period + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const getRatios = (analysis: FinancialAnalysis) => analysis.ratios[category];

  const datasets = Object.entries(getRatios(sortedData[0])).map(([key, _]) => ({
    label: key,
    data: sortedData.map(analysis => getRatios(analysis)[key]),
    borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    tension: 0.4,
    fill: false
  }));

  const chartData = {
    labels: sortedData.map(analysis => formatDate(analysis.period)),
    datasets
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
        text: title,
        font: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: 'bold'
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
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
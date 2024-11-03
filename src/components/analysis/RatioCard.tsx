import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RatioCardProps {
  label: string;
  value: number;
  benchmark: number;
  isPercentage?: boolean;
  description?: string;
}

export default function RatioCard({ 
  label, 
  value, 
  benchmark, 
  isPercentage = false,
  description 
}: RatioCardProps) {
  const formatValue = (num: number) => {
    if (isPercentage) {
      return `${num.toFixed(2)}%`;
    }
    return num.toFixed(2);
  };

  const getStatus = () => {
    if (Math.abs(value) < 0.01) return 'neutral';
    const difference = ((value - benchmark) / benchmark) * 100;
    if (Math.abs(difference) < 5) return 'neutral';
    return difference > 0 ? 'up' : 'down';
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        {status === 'up' ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : status === 'down' ? (
          <TrendingDown className="h-4 w-4 text-red-500" />
        ) : (
          <Minus className="h-4 w-4 text-gray-400" />
        )}
      </div>
      <div className="space-y-1">
        <p className={`text-lg font-semibold ${
          status === 'up' ? 'text-green-600' :
          status === 'down' ? 'text-red-600' :
          'text-gray-600'
        }`}>
          {formatValue(value)}
        </p>
        <p className="text-sm text-gray-500">
          Benchmark: {formatValue(benchmark)}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function RatioAnalysis({ data }) {
  const ratioCategories = [
    {
      title: 'Profitability Ratios',
      ratios: [
        { name: 'Gross Profit Margin', value: '35%', trend: 'up', benchmark: '30%' },
        { name: 'Operating Margin', value: '15%', trend: 'down', benchmark: '18%' },
        { name: 'Net Profit Margin', value: '10%', trend: 'up', benchmark: '8%' },
      ],
    },
    {
      title: 'Liquidity Ratios',
      ratios: [
        { name: 'Current Ratio', value: '2.5', trend: 'up', benchmark: '2.0' },
        { name: 'Quick Ratio', value: '1.8', trend: 'down', benchmark: '1.5' },
        { name: 'Cash Ratio', value: '0.8', trend: 'up', benchmark: '0.5' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {ratioCategories.map((category) => (
        <div key={category.title} className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.ratios.map((ratio) => (
                <div key={ratio.name} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-500">{ratio.name}</h4>
                    {ratio.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-semibold text-gray-900">{ratio.value}</p>
                    <span className="text-sm text-gray-500">vs {ratio.benchmark}</span>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          ratio.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: '70%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
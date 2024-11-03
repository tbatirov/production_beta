import React from 'react';
import { BarChart3, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

export default function Dashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Current Ratio',
            value: '2.5',
            change: '+0.3',
            icon: BarChart3,
            color: 'text-green-500',
          },
          {
            title: 'Quick Ratio',
            value: '1.8',
            change: '-0.2',
            icon: TrendingUp,
            color: 'text-yellow-500',
          },
          {
            title: 'ROE',
            value: '15.2%',
            change: '+2.1%',
            icon: DollarSign,
            color: 'text-blue-500',
          },
          {
            title: 'Debt Ratio',
            value: '0.4',
            change: '-0.1',
            icon: AlertCircle,
            color: 'text-purple-500',
          },
        ].map((metric) => (
          <div key={metric.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">{metric.title}</h3>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              <span className={`ml-2 text-sm ${
                metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Health Overview</h3>
          {/* Chart component would go here */}
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            Chart Placeholder
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics Trend</h3>
          {/* Chart component would go here */}
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
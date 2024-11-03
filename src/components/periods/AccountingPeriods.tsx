import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { AccountingPeriod } from '../../utils/types';

interface AccountingPeriodsProps {
  periods: AccountingPeriod[];
  onClosePeriod: (periodId: string) => Promise<void>;
  onLockPeriod: (periodId: string) => Promise<void>;
}

export default function AccountingPeriods({ 
  periods,
  onClosePeriod,
  onLockPeriod
}: AccountingPeriodsProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (periodId: string, action: 'close' | 'lock') => {
    setLoading(periodId);
    try {
      if (action === 'close') {
        await onClosePeriod(periodId);
      } else {
        await onLockPeriod(periodId);
      }
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: AccountingPeriod['status']) => {
    switch (status) {
      case 'open':
        return 'text-green-500';
      case 'closed':
        return 'text-yellow-500';
      case 'locked':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">Accounting Periods</h2>
          </div>
        </div>

        <div className="space-y-4">
          {periods.map((period) => (
            <div
              key={period.id}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {new Date(period.startDate).toLocaleDateString()} - {' '}
                    {new Date(period.endDate).toLocaleDateString()}
                  </h3>
                  <p className={`text-sm ${getStatusColor(period.status)}`}>
                    {period.status.charAt(0).toUpperCase() + period.status.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {period.status === 'open' && (
                  <button
                    onClick={() => handleAction(period.id, 'close')}
                    disabled={loading === period.id}
                    className="flex items-center px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Close Period
                  </button>
                )}
                {period.status === 'closed' && (
                  <button
                    onClick={() => handleAction(period.id, 'lock')}
                    disabled={loading === period.id}
                    className="flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    <Lock className="h-4 w-4 mr-1" />
                    Lock Period
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {periods.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Accounting Periods</h3>
            <p className="text-sm text-gray-500">
              Create your first accounting period to get started
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              About Period Management
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Open periods allow transactions and modifications</li>
                <li>Closed periods prevent new transactions but allow adjustments</li>
                <li>Locked periods are permanent and cannot be modified</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
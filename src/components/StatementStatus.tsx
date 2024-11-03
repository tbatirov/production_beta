import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface StatementStatusProps {
  status: 'draft' | 'finalized';
  date?: string;
  onFinalize?: () => void;
}

export default function StatementStatus({ status, date, onFinalize }: StatementStatusProps) {
  const { t } = useTranslation();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {status === 'finalized' ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Finalized</p>
                <p className="text-xs text-gray-500">
                  {formatDate(date)}
                </p>
              </div>
            </>
          ) : (
            <>
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Draft</p>
                <p className="text-xs text-gray-500">
                  Not yet finalized
                </p>
              </div>
            </>
          )}
        </div>

        {status === 'draft' && onFinalize && (
          <button
            onClick={onFinalize}
            className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
          >
            Finalize
          </button>
        )}
      </div>

      {status === 'draft' && (
        <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500 bg-yellow-50 p-3 rounded">
          <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p>
            Finalizing statements will lock them for editing and save them permanently.
            This action cannot be undone.
          </p>
        </div>
      )}
    </div>
  );
}
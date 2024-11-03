import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface FinalizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  period: string;
}

export default function FinalizationDialog({ 
  isOpen, 
  onClose, 
  onConfirm,
  period 
}: FinalizationDialogProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Finalize Financial Statements
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">
                You are about to finalize the financial statements for:
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {new Date(period).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              Please confirm that:
            </h4>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>All transactions have been properly recorded</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Account balances have been reconciled</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>All adjusting entries have been made</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Confirm & Finalize
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, AlertCircle, X } from 'lucide-react';
import { GeneratedStatements } from '../utils/types';
import { saveFinancialData } from '../utils/supabase/financialData';

interface SaveFinancialDataProps {
  statements: GeneratedStatements;
  companyId: string;
  onSaved?: () => void;
  onClose?: () => void;
}

export default function SaveFinancialData({ 
  statements, 
  companyId,
  onSaved,
  onClose
}: SaveFinancialDataProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const handleSave = async () => {
    if (!period) {
      setError('Please select a period');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await saveFinancialData(companyId, statements, period);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save financial data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Save Financial Data</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Important Note
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>This will save all financial statements for the selected period</li>
                  <li>Existing data for this period will be overwritten</li>
                  <li>The data will be marked as finalized</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Financial Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
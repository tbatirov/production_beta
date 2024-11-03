import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, AlertCircle, X } from 'lucide-react';
import { CompanyProfile, GeneratedStatements, FinancialAnalysis } from '../utils/types';
import { saveAnalysis } from '../utils/supabase/analysis';
import { calculateFinancialRatios } from '../utils/ratioCalculator';
import CompanySelector from './CompanySelector';
import { logger } from '../utils/logger';

interface SaveAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  statements: GeneratedStatements;
  companies: CompanyProfile[];
  onSaved?: () => void;
}

export default function SaveAnalysisDialog({ 
  isOpen,
  onClose,
  statements,
  companies,
  onSaved
}: SaveAnalysisDialogProps) {
  const { t } = useTranslation();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate max allowed date (current month)
  const maxDate = new Date().toISOString().slice(0, 7);

  const validatePeriod = (selectedPeriod: string): boolean => {
    return selectedPeriod <= maxDate;
  };

  const handleSave = async () => {
    if (!selectedCompanyId) {
      setError('Please select a company');
      return;
    }

    if (!validatePeriod(period)) {
      setError('Analysis cannot be saved for future dates');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const ratios = calculateFinancialRatios(statements);
      
      const analysis: FinancialAnalysis = {
        companyId: selectedCompanyId,
        period,
        statements,
        ratios,
        analysis: {
          summary: 'Financial analysis summary',
          strengths: ['Strong liquidity position', 'Good profit margins'],
          weaknesses: ['High debt ratio'],
          recommendations: ['Consider reducing debt', 'Improve working capital management'],
          trends: {
            revenue: { trend: 'up', percentage: 10 },
            profitability: { trend: 'up', percentage: 5 },
            cashFlow: { trend: 'stable', percentage: 0 }
          }
        },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'final',
          version: '1.0'
        }
      };
      await saveAnalysis(selectedCompanyId, period, analysis);
      onSaved?.();
      onClose();
    } catch (err) {
      logger.error('Error saving analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to save analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Save Financial Analysis
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
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
              Select Company
            </label>
            <CompanySelector
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              onSelect={setSelectedCompanyId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              max={maxDate}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Analysis can only be saved for current or past months
            </p>
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
                    <li>This will save the complete financial analysis</li>
                    <li>Previous analysis for the same period will be updated</li>
                    <li>The analysis will be marked as final</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedCompanyId || loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Save Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
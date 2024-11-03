import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { GeneratedStatements } from '../utils/types';
import { saveAnalysis } from '../services/analysisService';
import { logger } from '../utils/logger';

interface SaveAnalysisButtonProps {
  statements: GeneratedStatements;
  companyId: string;
  period: string;
  onSaved?: () => void;
}

export default function SaveAnalysisButton({ 
  statements, 
  companyId, 
  period,
  onSaved 
}: SaveAnalysisButtonProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePeriod = (selectedPeriod: string): boolean => {
    const currentPeriod = new Date().toISOString().slice(0, 7);
    return selectedPeriod <= currentPeriod;
  };

  const handleSave = async () => {
    try {
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      if (!period) {
        throw new Error('Period is required');
      }

      if (!validatePeriod(period)) {
        throw new Error('Analysis cannot be saved for future dates');
      }

      setLoading(true);
      setError(null);

      await saveAnalysis(companyId, period, statements);
      onSaved?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save analysis';
      logger.error('Error saving analysis:', { error: err });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-2 p-2 bg-red-50 rounded text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          {error}
        </div>
      )}
      <button
        onClick={handleSave}
        disabled={loading}
        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        <span>{loading ? 'Saving...' : 'Save Analysis'}</span>
      </button>
    </div>
  );
}
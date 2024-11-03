import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Save, CheckCircle } from 'lucide-react';
import { GeneratedStatements, StatementValidation } from '../utils/types';
import { validateStatementsForFinalization } from '../utils/statementValidation';
import { saveStatements } from '../utils/statementStorage';
import LoadingSpinner from './LoadingSpinner';

interface StatementFinalizationProps {
  statements: GeneratedStatements;
  onFinalized: () => void;
}

export default function StatementFinalization({ statements, onFinalized }: StatementFinalizationProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<StatementValidation | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleValidate = () => {
    const result = validateStatementsForFinalization(statements);
    setValidation(result);
    if (result.isValid) {
      setShowConfirmation(true);
    }
  };

  const handleFinalize = async () => {
    try {
      setLoading(true);
      await saveStatements(statements);
      onFinalized();
    } catch (error) {
      console.error('Failed to finalize statements:', error);
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      {validation && (
        <div className={`rounded-lg p-4 ${
          validation.isValid ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <div className="flex items-start">
            {validation.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
            )}
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                validation.isValid ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {validation.isValid ? 'Validation Passed' : 'Validation Issues Found'}
              </h3>
              {validation.errors.length > 0 && (
                <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
              {validation.warnings.length > 0 && (
                <ul className="mt-2 text-sm text-yellow-600 list-disc list-inside">
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleValidate}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Validate Statements
        </button>
        {validation?.isValid && (
          <button
            onClick={() => setShowConfirmation(true)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            Finalize & Save
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Statement Finalization
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to finalize these statements? This action cannot be undone,
              and the statements will be permanently saved.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalize}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 flex items-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>Confirm & Finalize</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
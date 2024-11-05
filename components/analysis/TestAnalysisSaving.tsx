import React, { useState } from 'react';
import { saveAnalysis } from '../../services/analysisService';
import { AlertCircle, Loader2 } from 'lucide-react';
import { mockAnalysis } from '../../utils/mockData';

export default function TestAnalysisSaving() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Using mock data for testing
      const testData = {
        companyId: '123', // Replace with a valid company ID from your database
        period: '2024-02',
        statements: {
          balanceSheet: mockAnalysis.statements.balanceSheet,
          incomeStatement: mockAnalysis.statements.incomeStatement,
          cashFlow: mockAnalysis.statements.cashFlow
        }
      };

      const savedAnalysis = await saveAnalysis(
        testData.companyId,
        testData.period,
        testData.statements
      );

      setResult(savedAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Test Analysis Saving</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {result && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">Save Successful!</h3>
          <pre className="text-sm text-green-700 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={handleTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Testing...
            </>
          ) : (
            'Test Save Analysis'
          )}
        </button>

        {result && (
          <button
            onClick={() => setResult(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear Result
          </button>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>This test will:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Validate the session</li>
          <li>Check company ownership</li>
          <li>Validate data format</li>
          <li>Calculate ratios</li>
          <li>Generate analysis</li>
          <li>Save to database</li>
        </ul>
      </div>
    </div>
  );
}
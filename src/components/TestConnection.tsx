import React, { useState } from 'react';
import { testSupabaseConnection } from '../utils/supabase/testConnection';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function TestConnection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={runTest}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="ml-2">Testing Connection...</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Test Database Connection
          </>
        )}
      </button>

      {result && (
        <div className={`p-4 rounded-md ${
          result.success ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-start">
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            )}
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </h3>
              {result.details && (
                <div className="mt-2 text-sm text-gray-600">
                  <pre className="whitespace-pre-wrap bg-white p-2 rounded border">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
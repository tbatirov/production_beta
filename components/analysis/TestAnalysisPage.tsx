import React from 'react';
import TestAnalysisSaving from './TestAnalysisSaving';

export default function TestAnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Analysis Testing
          </h1>
          <p className="mt-2 text-gray-600">
            Test the analysis saving functionality
          </p>
        </div>

        <TestAnalysisSaving />
      </div>
    </div>
  );
}
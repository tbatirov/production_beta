import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCompany } from '../../contexts/CompanyContext';
import { useToast } from '../../contexts/ToastContext';
import { useLoading } from '../../contexts/LoadingContext';
import FileUpload from '../FileUpload';
import TabularStatements from '../TabularStatements';
import SaveAnalysisDialog from '../SaveAnalysisDialog';
import ComprehensiveReport from '../analysis/ComprehensiveReport';
import { GeneratedStatements, ProcessedData } from '../../utils/types';
import { generateStatements } from '../../utils/statementGenerator';
import { logger } from '../../utils/logger';

export default function Analysis() {
  const { t } = useTranslation();
  const { companies } = useCompany();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [statements, setStatements] = useState<GeneratedStatements | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleUpload = async (data: ProcessedData) => {
    try {
      showLoading(t('analysis.generating'));
      logger.info('Processing uploaded financial data', { data });
      
      const generatedStatements = await generateStatements(data);
      logger.info('Statements generated successfully', { generatedStatements });
      
      setStatements(generatedStatements);
      showToast('success', 'Financial statements generated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process financial data';
      logger.error('Error generating statements:', { error: err });
      showToast('error', message);
    } finally {
      hideLoading();
    }
  };

  const handleSaveSuccess = () => {
    setShowSaveDialog(false);
    showToast('success', 'Analysis saved successfully');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('analysis.title')}
        </h1>
        {statements && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            {t('analysis.saveAnalysis')}
          </button>
        )}
      </div>

      {/* File Upload */}
      <section>
        <FileUpload onUpload={handleUpload} />
      </section>

      {/* Generated Statements */}
      {statements && (
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t('statements.financialStatements')}
              </h2>
              <TabularStatements statements={statements} />
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t('statements.financialAnalysis')}
              </h2>
              <ComprehensiveReport statements={statements} />
            </div>
          </section>
        </div>
      )}

      {/* Save Analysis Dialog */}
      {showSaveDialog && statements && (
        <SaveAnalysisDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          statements={statements}
          companies={companies}
          onSaved={handleSaveSuccess}
        />
      )}
    </div>
  );
}
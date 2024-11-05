import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Check, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { FinancialData, ProcessedData } from '../utils/types';
import DataTable from './DataTable';

interface FileUploadProps {
  onUpload: (data: ProcessedData) => void;
}

interface FileData {
  file: File;
  data: FinancialData | null;
}

interface FileState {
  trialBalance: FileData | null;
  transactions: FileData | null;
}

function FileUploadBox({ 
  type, 
  label, 
  fileData, 
  onFileSelect, 
  isExpanded, 
  onTogglePreview,
  loading 
}: {
  type: 'trialBalance' | 'transactions';
  label: string;
  fileData: FileData | null;
  onFileSelect: (file: File) => void;
  isExpanded: boolean;
  onTogglePreview: () => void;
  loading: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className={`border-2 border-dashed rounded-lg transition-colors overflow-hidden ${
      fileData ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
    }`}>
      <div className="p-6">
        <div className="flex flex-col items-center">
          {fileData ? (
            <Check className="h-12 w-12 text-green-500 mb-4" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
          )}
          <p className="text-sm font-medium mb-2">{label}</p>
          <p className="text-xs text-gray-500 mb-4">
            {fileData ? fileData.file.name : t('upload.dropzone')}
          </p>
          <input
            type="file"
            accept=".xls,.xlsx,.csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
            id={`file-upload-${type}`}
            disabled={loading}
          />
          <label
            htmlFor={`file-upload-${type}`}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {fileData ? t('upload.changeFile') : t('upload.selectFile')}
          </label>
        </div>
      </div>

      {fileData?.data && (
        <div className="border-t">
          <button
            onClick={onTogglePreview}
            className="w-full px-4 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
          >
            <span className="text-sm font-medium text-gray-700">{t('upload.previewData')}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {isExpanded && (
            <div className="border-t overflow-x-auto">
              <DataTable data={fileData.data} maxRows={5} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<FileState>({
    trialBalance: null,
    transactions: null
  });
  const [expandedPreviews, setExpandedPreviews] = useState<string[]>([]);

  const processFile = async (file: File, type: 'trialBalance' | 'transactions') => {
    try {
      const data = await parseExcelFile(file, type);
      setFiles(prev => ({
        ...prev,
        [type]: { file, data }
      }));
      setError('');
      setExpandedPreviews([type]);

      // Only automatically process if we have both files or just trial balance
      // if (type === 'trialBalance' || (type === 'transactions' && files.trialBalance?.data)) {
      //   handleProcessFiles();
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('upload.processingError'));
    }
  };

  const handleProcessFiles = async () => {
    setLoading(true);
    try {
      // Allow processing transactions alone for cash flow
      if (!files.trialBalance?.data && !files.transactions?.data) {
        setError(t('upload.noFilesSelected'));
        return;
      }

      const processedData: ProcessedData = {
        trialBalance: files.trialBalance?.data || null,
        transactions: files.transactions?.data || null
      };

      // Log the data being sent
      console.log('Processing files:', {
        hasTrialBalance: !!processedData.trialBalance,
        hasTransactions: !!processedData.transactions,
        transactionRows: processedData.transactions?.rows?.length
      });

      onUpload(processedData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('upload.processingError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('upload.title')}</h2>
        <p className="text-gray-600">{t('upload.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <FileUploadBox
            type="trialBalance"
            label={t('upload.trialBalance')}
            fileData={files.trialBalance}
            onFileSelect={(file) => processFile(file, 'trialBalance')}
            isExpanded={expandedPreviews.includes('trialBalance')}
            onTogglePreview={() => {
              setExpandedPreviews(prev =>
                prev.includes('trialBalance')
                  ? prev.filter(t => t !== 'trialBalance')
                  : [...prev, 'trialBalance']
              );
            }}
            loading={loading}
          />
          <p className="mt-2 text-xs text-gray-500">{t('upload.trialBalanceHint')}</p>
        </div>
        <div>
          <FileUploadBox
            type="transactions"
            label={t('upload.transactions')}
            fileData={files.transactions}
            onFileSelect={(file) => processFile(file, 'transactions')}
            isExpanded={expandedPreviews.includes('transactions')}
            onTogglePreview={() => {
              setExpandedPreviews(prev =>
                prev.includes('transactions')
                  ? prev.filter(t => t !== 'transactions')
                  : [...prev, 'transactions']
              );
            }}
            loading={loading}
          />
          <p className="mt-2 text-xs text-gray-500">{t('upload.transactionsHint')}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {(files.trialBalance || files.transactions) && (
        <div className="flex justify-end">
          <button
            onClick={handleProcessFiles}
            disabled={loading}
            className={`px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors flex items-center ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('upload.generateStatements')}
          </button>
        </div>
      )}
    </div>
  );
}
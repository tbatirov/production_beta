import * as XLSX from 'xlsx';
import { FinancialData, ProcessedData } from './types';
import { logger } from './logger';

function normalizeHeaders(headers: string[]): string[] {
  return headers.map(header => {
    const normalized = header?.toString().trim().toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || '';

    // Map common header variations
    // if (normalized.includes('dr') || normalized.includes('debit')) return normalized;
    // if (normalized.includes('cr') || normalized.includes('credit')) return normalized;
    if (normalized.includes('acc') && normalized.includes('code')) return 'account_code';
    if (normalized.includes('acc') && normalized.includes('name')) return 'account_name';
    
    return normalized;
  });
}

function processRow(row: any, headers: string[]): Record<string, any> {
  const processedRow: Record<string, any> = {};
  
  headers.forEach((header, index) => {
    let value = row[index];
    
    // Convert empty or undefined values to 0 for debit/credit columns
    if ((header.includes('debit') || header.includes('credit')) && 
        (value === undefined || value === '' || value === null)) {
      value = 0;
    }
    
    // Parse numerical values for debit/credit
    if (header.includes('debit') || header.includes('credit')) {
      // Handle string numbers with parentheses (negative values)
      if (typeof value === 'string') {
        value = value.trim();
        if (value.startsWith('(') && value.endsWith(')')) {
          value = -parseFloat(value.slice(1, -1));
        } else {
          value = parseFloat(value.replace(/[^0-9.-]/g, ''));
        }
      }
      value = !isNaN(value) ? value : 0;
    }
    
    processedRow[header] = value;
  });

  // Ensure required fields exist
  if (!processedRow.account_code && processedRow.account_number) {
    processedRow.account_code = processedRow.account_number;
  }
  
  if (!processedRow.account_name && processedRow.account) {
    processedRow.account_name = processedRow.account;
  }

  return processedRow;
}

export async function parseExcelFile(file: File, type: string): Promise<FinancialData> {
  logger.info('Starting Excel file parsing', { fileName: file.name });
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        logger.debug('Excel file read successfully', { 
          sheetNames: workbook.SheetNames,
          firstSheetName: workbook.SheetNames[0]
        });
        
        const rawData = XLSX.utils.sheet_to_json(firstSheet, { 
          header: 1,
          raw: false,
          defval: ''
        });
        
        if (!rawData.length) {
          throw new Error('No data found in the Excel file');
        }

        const headers = normalizeHeaders(rawData[0] as string[]);
        logger.debug('Normalized headers', { headers });

        if (!headers.length) {
          throw new Error('No valid headers found in the Excel file');
        }
        console.log(type)
        
        const requiredColumnsbyType = {
          'trialBalance' :['account_code', 'account_name', 'opening_balance_debit', 'opening_balance_credit', 'current_turnover_debit','current_turnover_credit','end_of_period_debit', 'end_of_period_credit'],
          'transactions':['date','transaction_id','description','account_code', 'account_name', 'debit', 'credit','document_type','reference_no','currency']
        }

        const requiredColumns = requiredColumnsbyType[type] || null;
        // Validate required columns
    

        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }

        const rows = rawData.slice(1)
          .map((row: any) => processRow(row, headers))
          .filter(row => Object.values(row).some(value => value !== '' || value !== undefined));

        logger.info('Excel parsing completed', {
          totalRows: rawData.length,
          validRows: rows.length,
          headerCount: headers.length
        });

        if (!rows.length) {
          throw new Error('No valid data rows found in the Excel file');
        }

        const result: FinancialData = {
          sheetName: workbook.SheetNames[0],
          headers,
          rows,
          period: new Date().toISOString().split('T')[0]
        };

        resolve(result);

        logger.debug('The result is',result);
      } catch (error) {
        logger.error('Excel parsing error', { error });
        reject(error instanceof Error ? error : new Error('Failed to parse file'));
      }
    };

    reader.onerror = () => {
      logger.error('File reading error');
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export function processFinancialData(data: ProcessedData): ProcessedData {
  logger.info('Processing financial data');

  try {
    // Process trial balance
    if (data.trialBalance) {
      data.trialBalance.rows = data.trialBalance.rows.map(row => ({
        ...row,
        debit: parseFloat(String(row.debit || '0')),
        credit: parseFloat(String(row.credit || '0')),
        account_code: String(row.account_code || row.account_number || ''),
        account_name: String(row.account_name || row.account || '')
      }));
    }

    // Process transactions
    if (data.transactions) {
      data.transactions.rows = data.transactions.rows.map(row => ({
        ...row,
        debit: parseFloat(String(row.debit || '0')),
        credit: parseFloat(String(row.credit || '0')),
        account_code: String(row.account_code || row.account_number || ''),
        account_name: String(row.account_name || row.account || ''),
        date: row.date || new Date().toISOString().split('T')[0]
      }));
    }

    return data;
  } catch (error) {
    logger.error('Error processing financial data', { error });
    throw error;
  }
}
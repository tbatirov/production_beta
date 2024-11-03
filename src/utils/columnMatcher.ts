import { logger } from './logger';

// Expanded column name variations for more flexible matching
const columnVariations: Record<string, string[]> = {
  account_code: [
    'account', 'code', 'accountcode', 'account_number', 'accountnumber', 
    'gl_code', 'glcode', 'no', 'number', 'acc', 'acct', 'счет', 'код'
  ],
  account_name: [
    'account', 'name', 'accountname', 'description', 'account_description',
    'title', 'acc_name', 'acct_name', 'наименование', 'описание'
  ],
  debit: [
    'dr', 'debitamount', 'debit_amount', 'debit_value', 'deb',
    'debet', 'дебет', 'db', 'debits', 'debit_sum'
  ],
  credit: [
    'cr', 'creditamount', 'credit_amount', 'credit_value', 'cred',
    'kredit', 'кредит', 'cr', 'credits', 'credit_sum'
  ],
  date: [
    'transaction_date', 'trans_date', 'transactiondate', 'posting_date',
    'entry_date', 'date', 'dt', 'дата', 'число', 'period'
  ],
  description: [
    'narrative', 'details', 'memo', 'notes', 'particulars',
    'transaction_description', 'desc', 'detail', 'примечание', 'описание'
  ],
  amount: [
    'transaction_amount', 'trans_amount', 'value', 'net_amount',
    'total_amount', 'sum', 'сумма', 'amount', 'amt'
  ]
};

export function findMatchingColumn(headers: string[], targetColumn: string): string | undefined {
  // Normalize headers for more flexible matching
  const normalizedHeaders = headers.map(h => 
    h.toLowerCase()
      .trim()
      .replace(/[^a-z0-9а-я]/g, '') // Allow Cyrillic characters
  );
  
  const variations = columnVariations[targetColumn] || [targetColumn];
  
  // Try exact match first
  let match = normalizedHeaders.find(header =>
    variations.some(variation => header === variation.toLowerCase().replace(/[^a-z0-9а-я]/g, ''))
  );

  // If no exact match, try partial match
  if (!match) {
    match = normalizedHeaders.find(header =>
      variations.some(variation => header.includes(variation.toLowerCase().replace(/[^a-z0-9а-я]/g, '')))
    );
  }

  if (!match) {
    logger.debug('No match found for column', { targetColumn, variations });
  }

  // Return the original header name
  return headers[normalizedHeaders.indexOf(match)];
}

export function validateRequiredColumns(headers: string[], required: string[]): string[] {
  const missingColumns = required.filter(column => !findMatchingColumn(headers, column));
  
  if (missingColumns.length > 0) {
    logger.debug('Missing columns in validation', { 
      missingColumns,
      availableHeaders: headers 
    });
  }
  
  return missingColumns;
}
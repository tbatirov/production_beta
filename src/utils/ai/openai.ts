import { FinancialData } from '../types';
import { logger } from '../logger';
import { getAISettings, getOpenAIKey } from '../settings/apiSettings';
import i18next from 'i18next';

async function makeOpenAIRequest(prompt: string, data: any) {
  const aiSettings = getAISettings();
  const OPENAI_API_KEY = getOpenAIKey();
  const currentLanguage = i18next.language || 'en';

  if (!aiSettings.enabled) {
    throw new Error('AI analysis is disabled. Please enable it in settings.');
  }

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: aiSettings.model || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a financial analysis AI. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'system',
          content: `Please provide the analysis in ${currentLanguage} language. ${prompt}`,
        },
        {
          role: 'user',
          content: `Analyze this data and return ONLY a JSON response in ${currentLanguage} language: ${JSON.stringify(
            data
          )}`,
        },
      ],
      temperature: 0,
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from OpenAI API');
  }

  return JSON.parse(content);
}

export async function analyzeTrialBalance(data: FinancialData) {
  logger.info('Starting trial balance analysis with OpenAI');

  try {
    const cleanedData = {
      headers: data.headers,
      rows: data.rows.map((row) => ({
        ...row,
        debit: parseFloat(String(row.debit || '0')) || 0,
        credit: parseFloat(String(row.credit || '0')) || 0,
      })),
    };

    const result = await makeOpenAIRequest(TRIAL_BALANCE_PROMPT, cleanedData);
    logger.info('Trial balance analysis completed successfully');
    return result;
  } catch (error) {
    logger.error('Error analyzing trial balance:', error);
    throw error;
  }
}

export async function analyzeCashFlow(data: FinancialData) {
  logger.info('Starting cash flow analysis with OpenAI');

  try {
    const cleanedData = {
      headers: data.headers,
      rows: data.rows.map((row) => ({
        ...row,
        debit: parseFloat(String(row.debit || '0')) || 0,
        credit: parseFloat(String(row.credit || '0')) || 0,
      })),
    };

    const result = await makeOpenAIRequest(CASH_FLOW_PROMPT, cleanedData);
    logger.info('Cash flow analysis completed successfully');
    return result;
  } catch (error) {
    logger.error('Error analyzing cash flow:', error);
    throw error;
  }
}

const TRIAL_BALANCE_PROMPT = `Analyze the trial balance data and return a JSON object with this exact structure:
{
  "balanceSheet": {
    "date": "ISO date string",
    "sections": {
      "assets": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "liabilities": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "equity": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      }
    }
  },
  "incomeStatement": {
    "date": "ISO date string",
    "sections": {
      "revenue": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "expenses": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      }
    },
    "total": number
  },
  "analysis": {
    "summary": string,
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[],
    "trends": {
      "revenue": { "trend": "up" | "down" | "stable", "percentage": number },
      "profitability": { "trend": "up" | "down" | "stable", "percentage": number },
      "cashFlow": { "trend": "up" | "down" | "stable", "percentage": number }
    }
  }
}

Follow these rules:
1. Balance Sheet accounts:
   - Assets (0000-4999)
   - Liabilities (6000-6999)
   - Equity (5000-5999)

2. Income Statement accounts:
   - Revenue (7000-7999)
   - Expenses (8000-8999)

3. Accounting rules:
   - Assets and Expenses are debit-normal
   - Liabilities, Equity, and Revenue are credit-normal
   - Assets = Liabilities + Equity
   - Net Income = Revenue - Expenses

4. Provide analysis in the user's selected language`;

const CASH_FLOW_PROMPT = `Analyze the transaction data and return a JSON object with this exact structure:
{
  "cashFlow": {
    "date": "ISO date string",
    "sections": {
      "operating": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "investing": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      },
      "financing": {
        "total": number,
        "items": [{ "account": string, "amount": number }]
      }
    },
    "total": number,
    "beginningCash": number,
    "endingCash": number
  },
  "analysis": {
    "summary": string,
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[]
  }
}

1. Primary categorization by account code:
   - Operating Activities (4000-4999, 6000-6799, 7000-8999)
   - Investing Activities (0000-1999)
   - Financing Activities (5000-5999, 6800-6899)

2. Cash Accounts:
   - Cash on hand (3010)
   - Cash in bank - UZS (3110)
   - Cash in bank - USD (3120)

3. Cash flow rules:
   - Cash account debits = Cash inflow (+)
   - Cash account credits = Cash outflow (-)
   - Categorize based on non-cash account codes
   - Calculate net cash flow for each category

4. Provide analysis in the user's selected language`;